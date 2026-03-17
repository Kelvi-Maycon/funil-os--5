import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore.js';
import { useConfig } from '../../store/useConfig.js';
import { useProgressStore } from '../../store/useProgressStore.js';
import { generateTranslationSentences, evaluateTranslation } from '../../services/ai.js';
import { selectTranslationWords } from './translationSession.js';
import { Button } from '../ui/button.jsx';
import { WriteIcon } from '../shared/icons.jsx';

const XP_CORRECT = 10;
const XP_ATTEMPT = 3;

export default function Escrever() {
  const navigate = useNavigate();
  const { words } = useWordStore();
  const { config } = useConfig();
  const { awardXp } = useProgressStore();

  // phase: 'idle' | 'loading' | 'session' | 'done'
  const [phase, setPhase] = useState('idle');
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [error, setError] = useState(null);

  const handleStart = useCallback(async () => {
    if (!config?.provider) {
      setError('Configure sua IA nas Configurações para usar esta funcionalidade.');
      return;
    }
    setPhase('loading');
    setError(null);

    try {
      const targetWords = selectTranslationWords(words, config.userLevel, 5);
      const generated = await generateTranslationSentences({
        words: targetWords,
        cefrLevel: config.userLevel,
        config,
        signal: undefined,
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
    } catch {
      setError('Erro ao gerar frases. Verifique sua chave de API.');
      setPhase('idle');
    }
  }, [words, config]);

  const handleVerify = useCallback(() => {
    if (!userAnswer.trim()) return;
    const sentence = sentences[currentIndex];
    const { correct } = evaluateTranslation(userAnswer, sentence.english, sentence.alternatives);
    const xp = correct ? XP_CORRECT : XP_ATTEMPT;
    awardXp(xp, correct ? 'translation:correct' : 'translation:attempt');
    setXpEarned(prev => prev + xp);
    setFeedback({ correct, expected: sentence.english, alternatives: sentence.alternatives });
  }, [sentences, currentIndex, userAnswer, awardXp]);

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

  // ── Estado vazio / carregando ─────────────────────────────────────────────
  if (phase === 'idle' || phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
          <WriteIcon size={36} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Pratique tradução PT→EN
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
            Frases do cotidiano com suas palavras mais difíceis. Escreva a tradução em inglês e veja o feedback.
          </p>
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
          <button
            onClick={() => navigate('/settings')}
            className="text-sm text-violet-600 underline underline-offset-2"
          >
            Configurar IA nas Configurações
          </button>
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

      {/* Card da frase portuguesa */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
          Traduza para inglês
        </p>
        <p className="text-xl font-semibold text-neutral-900 leading-relaxed">
          &ldquo;{sentence.portuguese}&rdquo;
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
            placeholder="Digite a tradução em inglês…"
            className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none shadow-sm"
            rows={3}
            autoFocus
          />
          <Button
            onClick={handleVerify}
            disabled={!userAnswer.trim()}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 shadow-sm"
          >
            Verificar
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
            <p className="text-neutral-700">
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
