import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore.js';
import { useCardStore } from '../../store/useCardStore.js';
import { useConfig } from '../../store/useConfig.js';
import { useProgressStore } from '../../store/useProgressStore.js';
import { generateTranslationSentences, generateReverseTranslationSentences, evaluateTranslation, evaluateSemanticTranslation, evaluateSemanticReverseTranslation } from '../../services/ai.js';
import { selectTranslationWords } from './translationSession.js';
import { Button } from '../ui/button.jsx';
import { WriteIcon, BookOpenIcon, CheckCircleIcon, SparkIcon } from '../shared/icons.jsx';

function buildOfflineSessions(flashcards = [], words = [], limit = 5) {
  const eligible = flashcards
    .filter((card) => card.front && card.back && card.back.trim().length > 5)
    .slice(0, limit * 4);
  if (eligible.length === 0) return [];
  return eligible.slice(0, limit).map((card) => ({
    id: card.id,
    portuguese: card.front,
    english: card.back,
    alternatives: [],
    targetWord: words.find((w) => w.id === card.wordId)?.word || '',
  }));
}

const XP_CORRECT = 12;
const XP_ATTEMPT = 4;

export default function Escrever() {
  const navigate = useNavigate();
  const { words } = useWordStore();
  const { flashcards } = useCardStore();
  const { config } = useConfig();
  const { awardXp } = useProgressStore();

  // 'pt-en' = user translates PT→EN, 'en-pt' = user translates EN→PT
  const [direction, setDirection] = useState('pt-en');

  // phase: 'idle' | 'loading' | 'session' | 'done'
  const [phase, setPhase] = useState('idle');
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleStart = useCallback(async () => {
    if (!config?.provider) {
      // Fallback offline: usar flashcards existentes como exercicios de traducao
      const offline = buildOfflineSessions(flashcards, words);
      if (offline.length >= 2) {
        setSentences(offline);
        setCurrentIndex(0);
        setResults([]);
        setXpEarned(0);
        setUserAnswer('');
        setFeedback(null);
        setError(null);
        setPhase('session');
      } else {
        setPhase('offline-empty');
      }
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase('loading');
    setError(null);

    try {
      const targetWords = selectTranslationWords(words, config.userLevel, 5);
      const generateFn = direction === 'en-pt' ? generateReverseTranslationSentences : generateTranslationSentences;
      const generated = await generateFn({
        words: targetWords,
        cefrLevel: config.userLevel,
        config,
        signal: controller.signal,
      });

      if (!generated || generated.length === 0) {
        setError('Nao foi possivel gerar as frases. Verifique sua chave de API e tente novamente.');
        setPhase('idle');
        return;
      }

      setSentences(generated);
      setCurrentIndex(0);
      setResults([]);
      setXpEarned(0);
      setUserAnswer('');
      setFeedback(null);
      setPhase('session');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Erro ao gerar frases. Verifique sua chave de API.');
      setPhase('idle');
    }
  }, [words, config, direction]);

  const handleVerify = useCallback(async () => {
    if (!userAnswer.trim()) return;
    const sentence = sentences[currentIndex];
    const isReverse = direction === 'en-pt';
    const expectedAnswer = isReverse ? sentence.portuguese : sentence.english;
    const promptSentence = isReverse ? sentence.english : sentence.portuguese;

    const { correct: exactCorrect } = evaluateTranslation(userAnswer, expectedAnswer, sentence.alternatives);

    // Se nao for exato, tentar avaliacao semantica
    if (!exactCorrect && config?.provider) {
        setPhase('verifying');
        try {
            const evaluateFn = isReverse ? evaluateSemanticReverseTranslation : evaluateSemanticTranslation;
            const aiResult = await evaluateFn({
                original: promptSentence,
                expected: expectedAnswer,
                userAnswer: userAnswer,
                userLevel: config.userLevel,
                config,
            });
            const score = aiResult.score ?? (aiResult.correct ? 10 : 0);
            const xp = Math.max(XP_ATTEMPT, Math.round((score / 10) * XP_CORRECT));
            awardXp(xp, score >= 7 ? 'translation:correct' : 'translation:attempt');
            setXpEarned(prev => prev + xp);
            setFeedback({
                correct: score >= 7,
                score,
                expected: expectedAnswer,
                alternatives: sentence.alternatives,
                note: aiResult.note
            });
        } catch (err) {
            console.error(err);
            const xp = XP_ATTEMPT;
            awardXp(xp, 'translation:attempt');
            setXpEarned(prev => prev + xp);
            setFeedback({ correct: false, score: 0, expected: expectedAnswer, alternatives: sentence.alternatives });
        } finally {
            setPhase('session');
        }
    } else {
        const score = exactCorrect ? 10 : 0;
        const xp = exactCorrect ? XP_CORRECT : XP_ATTEMPT;
        awardXp(xp, exactCorrect ? 'translation:correct' : 'translation:attempt');
        setXpEarned(prev => prev + xp);
        setFeedback({ correct: exactCorrect, score, expected: expectedAnswer, alternatives: sentence.alternatives });
    }
  }, [sentences, currentIndex, userAnswer, awardXp, config, direction]);

  const handleNext = useCallback(() => {
    const newResults = [...results, { correct: feedback.correct, score: feedback.score ?? (feedback.correct ? 10 : 0) }];
    if (currentIndex + 1 >= sentences.length) {
      setResults(newResults);
      setPhase('done');
    } else {
      setResults(newResults);
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
    }
  }, [results, feedback, currentIndex, sentences.length]);

  const handleRestart = useCallback(() => {
    setPhase('idle');
    setFeedback(null);
    setUserAnswer('');
    setResults([]);
    setSentences([]);
    setXpEarned(0);
    setError(null);
  }, []);

  // ── Offline sem flashcards suficientes ───────────────────────────────────
  if (phase === 'offline-empty') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#eef0ec] text-[#647568] border border-[#CED1C6]">
          <BookOpenIcon size={36} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">Sem material suficiente</h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
            Configure uma IA para gerar exercicios personalizados, ou salve pelo menos 2 flashcards durante a pratica para usar o Escrever offline.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/settings')} className="bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors">
            Configurar IA
          </Button>
          <Button variant="outline" onClick={() => navigate('/flashcards')} className="border border-neutral-300 rounded-full px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
            Ver flashcards
          </Button>
        </div>
        <button onClick={() => setPhase('idle')} className="text-sm text-neutral-400 underline underline-offset-2">
          Voltar
        </button>
      </div>
    );
  }

  // ── Estado vazio / carregando ─────────────────────────────────────────────
  if (phase === 'idle' || phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#dde2dc] text-[#35403A]">
          <WriteIcon size={36} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Pratique traducao
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
            Frases do cotidiano com suas palavras mais dificeis. Escolha a direcao e pratique!
          </p>
        </div>

        {/* Direction toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-full p-1 w-fit">
          <button
            onClick={() => setDirection('pt-en')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${direction === 'pt-en' ? 'bg-white text-[#232625] shadow-[0_1px_3px_rgba(20,20,19,0.06)]' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            PT &rarr; EN
          </button>
          <button
            onClick={() => setDirection('en-pt')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${direction === 'en-pt' ? 'bg-white text-[#35403A] shadow-[0_1px_3px_rgba(20,20,19,0.06)]' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            EN &rarr; PT
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 max-w-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleStart}
          disabled={phase === 'loading'}
          className="bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-8 py-2.5 text-sm font-semibold transition-colors"
        >
          {phase === 'loading' ? 'Gerando frases...' : 'Gerar sessao'}
        </Button>

        {!config?.provider && (
          <p className="text-xs text-neutral-400 max-w-xs">
            Sem IA configurada: serao usados seus flashcards salvos como exercicios.{' '}
            <button onClick={() => navigate('/settings')} className="text-[#647568] underline underline-offset-2">
              Configurar IA
            </button>
          </p>
        )}
      </div>
    );
  }

  // ── Resultado final ───────────────────────────────────────────────────────
  if (phase === 'done') {
    const correctCount = results.filter(r => r.correct).length;
    const avgScore = results.length > 0 ? (results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length).toFixed(1) : '0';
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#dde2dc] text-[#35403A]">
          <WriteIcon size={36} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1">
            Sessao completa
          </p>
          <h2 className="text-3xl font-semibold text-neutral-900">
            Media: {avgScore}/10
          </h2>
          <p className="mt-1 text-sm text-neutral-600">{correctCount}/{sentences.length} corretas</p>
          <p className="mt-1.5 text-neutral-500 text-sm">+{xpEarned} XP ganhos</p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {results.map((r, i) => {
            const s = r.score ?? 0;
            const bg = s >= 7 ? 'bg-green-500' : s >= 4 ? 'bg-amber-400' : 'bg-red-400';
            return (
              <span key={i} className={`inline-flex h-7 w-7 rounded-full items-center justify-center text-[10px] font-bold text-white ${bg}`}>
                {s}
              </span>
            );
          })}
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            onClick={handleRestart}
            className="bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
          >
            Nova sessao
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/vocabulary')}
            className="border border-neutral-300 rounded-full px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Ver vocabulario
          </Button>
        </div>
      </div>
    );
  }

  // ── Sessao em andamento ───────────────────────────────────────────────────
  const sentence = sentences[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-5">
      {/* Cabecalho da sessao */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">
          Frase <span className="font-semibold text-neutral-700">{currentIndex + 1}</span> de{' '}
          <span className="font-semibold text-neutral-700">{sentences.length}</span>
        </span>
        <span className="font-semibold text-[#35403A]">+{xpEarned} XP</span>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#35403A] transition-all duration-300"
          style={{ width: `${(currentIndex / sentences.length) * 100}%` }}
        />
      </div>

      {/* Card da frase prompt */}
      <div className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 md:p-8">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-3">
          {direction === 'en-pt' ? 'Traduza para portugues' : 'Traduza para ingles'}
        </p>
        <p className="text-xl font-semibold text-neutral-900 leading-relaxed">
          &ldquo;{direction === 'en-pt' ? sentence.english : sentence.portuguese}&rdquo;
        </p>
        {sentence.targetWord && (
          <p className="mt-3 text-xs text-neutral-400">
            Palavra-alvo:{' '}
            <span className="font-semibold text-[#647568]">{sentence.targetWord}</span>
          </p>
        )}
      </div>

      {/* Input de resposta */}
      {!feedback && (
        <div className="space-y-3">
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleVerify();
              }
            }}
            placeholder={direction === 'en-pt' ? 'Digite a traducao em portugues...' : 'Digite a traducao em ingles...'}
            className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-[#647568] focus:outline-none focus:ring-2 focus:ring-[#35403A]/15 resize-none disabled:opacity-50"
            rows={3}
            autoFocus
            disabled={phase === 'verifying'}
          />
          <Button
            onClick={handleVerify}
            disabled={!userAnswer.trim() || phase === 'verifying'}
            className="w-full bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {phase === 'verifying' ? (
                <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    Analisando...
                </>
            ) : 'Verificar'}
          </Button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (() => {
        const score = feedback.score ?? (feedback.correct ? 10 : 0);
        const scoreColor = score >= 7 ? 'text-green-700' : score >= 4 ? 'text-amber-600' : 'text-red-600';
        const scoreBg = score >= 7 ? 'bg-green-100 border-green-300' : score >= 4 ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300';
        const containerBorder = score >= 7 ? 'border-green-200 bg-green-50' : 'border-[#CED1C6] bg-[#eef0ec]';
        return (
        <div className={`rounded-xl border p-5 space-y-3 ${containerBorder}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{score >= 7 ? <CheckCircleIcon size={22} className="text-green-600" /> : <SparkIcon size={22} className="text-[#35403A]" />}</span>
              <span className={`font-semibold text-base ${score >= 7 ? 'text-green-800' : 'text-[#232625]'}`}>
                {score >= 7 ? 'Correto!' : 'Quase la!'}
              </span>
            </div>
            <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-lg font-bold ${scoreBg} ${scoreColor}`}>
              {score}/10
            </span>
          </div>

          <div className="text-sm space-y-1.5">
            {score < 10 && (
              <p className="text-neutral-500">
                <span className="font-medium">Sua resposta:</span>{' '}
                <span className="italic">&ldquo;{userAnswer}&rdquo;</span>
              </p>
            )}
            {feedback.note ? (
              <div className="mt-3 p-3 bg-white/50 rounded-lg border border-white/40">
                <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                   <strong>Nota do IA:</strong> {feedback.note}
                </p>
              </div>
            ) : null}
            <p className="text-neutral-700 mt-2">
              <span className="font-medium">&rarr; Esperado:</span>{' '}
              <span className="font-semibold">&ldquo;{feedback.expected}&rdquo;</span>
            </p>
            {feedback.alternatives?.map((alt, i) => (
              <p key={i} className="text-neutral-500">
                <span className="font-medium">&rarr; Tambem aceito:</span>{' '}
                <span className="italic">&ldquo;{alt}&rdquo;</span>
              </p>
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="w-full bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors mt-1"
          >
            {currentIndex + 1 < sentences.length ? 'Proxima' : 'Ver resultado'}
          </Button>
        </div>
        );
      })()}
    </div>
  );
}
