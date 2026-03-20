import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore.js';
import { useCardStore } from '../../store/useCardStore.js';
import { useConfig } from '../../store/useConfig.js';
import { useProgressStore } from '../../store/useProgressStore.js';
import { generateTranslationSentences, generateReverseTranslationSentences, evaluateTranslation, evaluateSemanticTranslation, evaluateSemanticReverseTranslation } from '../../services/ai.js';
import { selectTranslationWords } from './translationSession.js';
import { Button } from '../ui/button.jsx';
import { WriteIcon } from '../shared/icons.jsx';

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
      // Fallback offline: usar flashcards existentes como exercícios de tradução
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
        setError('Não foi possível gerar as frases. Verifique sua chave de API e tente novamente.');
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

    // Se não for exato, tentar avaliação semântica
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
            const xp = aiResult.correct ? XP_CORRECT : XP_ATTEMPT;
            awardXp(xp, aiResult.correct ? 'translation:correct' : 'translation:attempt');
            setXpEarned(prev => prev + xp);
            setFeedback({
                correct: aiResult.correct,
                expected: expectedAnswer,
                alternatives: sentence.alternatives,
                note: aiResult.note
            });
        } catch (err) {
            console.error(err);
            const xp = XP_ATTEMPT;
            awardXp(xp, 'translation:attempt');
            setXpEarned(prev => prev + xp);
            setFeedback({ correct: false, expected: expectedAnswer, alternatives: sentence.alternatives });
        } finally {
            setPhase('session');
        }
    } else {
        const xp = exactCorrect ? XP_CORRECT : XP_ATTEMPT;
        awardXp(xp, exactCorrect ? 'translation:correct' : 'translation:attempt');
        setXpEarned(prev => prev + xp);
        setFeedback({ correct: exactCorrect, expected: expectedAnswer, alternatives: sentence.alternatives });
    }
  }, [sentences, currentIndex, userAnswer, awardXp, config, direction]);

  const handleNext = useCallback(() => {
    const newResults = [...results, feedback.correct];
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
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-400 border border-orange-100">
          📚
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Sem material suficiente</h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
            Configure uma IA para gerar exercícios personalizados, ou salve pelo menos 2 flashcards durante a prática para usar o Escrever offline.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/settings')} className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-6 font-bold">
            Configurar IA
          </Button>
          <Button variant="outline" onClick={() => navigate('/flashcards')} className="rounded-xl px-6">
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
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
          <WriteIcon size={36} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Pratique tradução
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
            Frases do cotidiano com suas palavras mais difíceis. Escolha a direção e pratique!
          </p>
        </div>

        {/* Direction toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setDirection('pt-en')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${direction === 'pt-en' ? 'bg-white text-violet-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            🇧🇷 → 🇺🇸 PT→EN
          </button>
          <button
            onClick={() => setDirection('en-pt')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${direction === 'en-pt' ? 'bg-white text-violet-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            🇺🇸 → 🇧🇷 EN→PT
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleStart}
          disabled={phase === 'loading'}
          className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 font-bold text-base shadow-sm"
        >
          {phase === 'loading' ? 'Gerando frases…' : 'Gerar sessão'}
        </Button>

        {!config?.provider && (
          <p className="text-xs text-neutral-400 max-w-xs">
            Sem IA configurada: serão usados seus flashcards salvos como exercícios.{' '}
            <button onClick={() => navigate('/settings')} className="text-violet-500 underline underline-offset-2">
              Configurar IA
            </button>
          </p>
        )}
      </div>
    );
  }

  // ── Resultado final ───────────────────────────────────────────────────────
  if (phase === 'done') {
    const correctCount = results.filter(Boolean).length;
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
          <WriteIcon size={36} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-1">
            Sessão completa
          </p>
          <h2 className="text-3xl font-extrabold text-neutral-900">
            {correctCount}/{sentences.length} corretas
          </h2>
          <p className="mt-1.5 text-neutral-500 text-sm">+{xpEarned} XP ganhos</p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {results.map((r, i) => (
            <span
              key={i}
              className={`inline-flex h-3 w-3 rounded-full ${r ? 'bg-green-500' : 'bg-red-400'}`}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            onClick={handleRestart}
            className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-6 font-bold"
          >
            Nova sessão
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/vocabulary')}
            className="rounded-xl px-6"
          >
            Ver vocabulário
          </Button>
        </div>
      </div>
    );
  }

  // ── Sessão em andamento ───────────────────────────────────────────────────
  const sentence = sentences[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-5">
      {/* Cabeçalho da sessão */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">
          Frase <span className="font-semibold text-neutral-700">{currentIndex + 1}</span> de{' '}
          <span className="font-semibold text-neutral-700">{sentences.length}</span>
        </span>
        <span className="font-semibold text-violet-600">+{xpEarned} XP</span>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-300"
          style={{ width: `${(currentIndex / sentences.length) * 100}%` }}
        />
      </div>

      {/* Card da frase prompt */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
          {direction === 'en-pt' ? 'Traduza para português' : 'Traduza para inglês'}
        </p>
        <p className="text-xl font-semibold text-neutral-900 leading-relaxed">
          &ldquo;{direction === 'en-pt' ? sentence.english : sentence.portuguese}&rdquo;
        </p>
        {sentence.targetWord && (
          <p className="mt-3 text-xs text-neutral-400">
            Palavra-alvo:{' '}
            <span className="font-semibold text-violet-500">{sentence.targetWord}</span>
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
            placeholder={direction === 'en-pt' ? 'Digite a tradução em português…' : 'Digite a tradução em inglês…'}
            className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none shadow-sm disabled:opacity-50"
            rows={3}
            autoFocus
            disabled={phase === 'verifying'}
          />
          <Button
            onClick={handleVerify}
            disabled={!userAnswer.trim() || phase === 'verifying'}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 shadow-sm flex items-center justify-center gap-2"
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
      {feedback && (
        <div
          className={`rounded-2xl border p-5 space-y-3 ${
            feedback.correct
              ? 'border-green-200 bg-green-50'
              : 'border-orange-200 bg-orange-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{feedback.correct ? '✅' : '❌'}</span>
            <span
              className={`font-bold text-base ${
                feedback.correct ? 'text-green-800' : 'text-orange-800'
              }`}
            >
              {feedback.correct ? 'Correto!' : 'Quase lá!'}
            </span>
          </div>

          <div className="text-sm space-y-1.5">
            {!feedback.correct && (
              <p className="text-neutral-500">
                <span className="font-medium">Sua resposta:</span>{' '}
                <span className="italic">&ldquo;{userAnswer}&rdquo;</span>
              </p>
            )}
            {feedback.note ? (
              <div className="mt-3 p-3 bg-white/50 rounded-xl border border-white/40 shadow-sm">
                <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                   <strong>Nota do IA:</strong> {feedback.note}
                </p>
              </div>
            ) : null}
            <p className="text-neutral-700 mt-2">
              <span className="font-medium">→ Esperado:</span>{' '}
              <span className="font-semibold">&ldquo;{feedback.expected}&rdquo;</span>
            </p>
            {feedback.alternatives?.map((alt, i) => (
              <p key={i} className="text-neutral-500">
                <span className="font-medium">→ Também aceito:</span>{' '}
                <span className="italic">&ldquo;{alt}&rdquo;</span>
              </p>
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="w-full rounded-xl bg-neutral-900 hover:bg-black text-white font-bold py-3 mt-1"
          >
            {currentIndex + 1 < sentences.length ? 'Próxima →' : 'Ver resultado'}
          </Button>
        </div>
      )}
    </div>
  );
}
