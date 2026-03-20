import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore.js';
import { useCardStore } from '../../store/useCardStore.js';
import { useConfig } from '../../store/useConfig.js';
import { useProgressStore } from '../../store/useProgressStore.js';
import { generateTranslationSentences, evaluateTranslation, evaluateSemanticTranslation } from '../../services/ai.js';
import { selectTranslationWords } from '../Escrever/translationSession.js';
import { buildDailySessionPlan } from './sessionBuilder.js';
import SegmentTimer from './SegmentTimer.jsx';
import Dialogue from '../Dialogue/Dialogue.jsx';
import SpeakButton from '../shared/SpeakButton.jsx';
import { Button } from '../ui/button.jsx';


const SEGMENTS = ['flashcards', 'builder', 'translation', 'dialogue'];
const SEGMENT_LABELS = {
  flashcards: '📚 Flashcards',
  builder: '🔨 Builder',
  translation: '✍️ Tradução PT→EN',
  dialogue: '💬 Micro-diálogo',
};
const SEGMENT_DURATION = { flashcards: 180, builder: 240, translation: 240, dialogue: 240 };

export default function DailySession() {
  const navigate = useNavigate();
  const { words } = useWordStore();
  const { getDueCardsSorted, reviewCard } = useCardStore();
  const { config } = useConfig();
  const { errorPatterns, recordDailySession, recordFlashcardReview, awardXp } = useProgressStore();

  const [phase, setPhase] = useState('loading'); // loading | segment | summary
  const [plan, setPlan] = useState(null);
  const [segmentIdx, setSegmentIdx] = useState(0);
  const [segmentResults, setSegmentResults] = useState({ flashcards: [], builder: [], translation: [], dialogue: [] });
  const [totalXp, setTotalXp] = useState(0);

  // Flashcard sub-state
  const [fcIndex, setFcIndex] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);

  // Translation sub-state
  const [transSentences, setTransSentences] = useState([]);
  const [transIdx, setTransIdx] = useState(0);
  const [transAnswer, setTransAnswer] = useState('');
  const [transFeedback, setTransFeedback] = useState(null);
  const [transLoading, setTransLoading] = useState(false);

  // Build plan on mount
  useEffect(() => {
    const dueCards = getDueCardsSorted(6);
    const sessionPlan = buildDailySessionPlan({
      dueCards,
      words,
      errorPatterns,
      config,
    });

    // Skip empty segments
    const validSegments = SEGMENTS.filter(seg => {
      if (seg === 'flashcards') return sessionPlan.flashcards.length > 0;
      if (seg === 'builder') return sessionPlan.builderWords.length > 0;
      if (seg === 'translation') return config?.provider;
      if (seg === 'dialogue') return config?.provider;
      return true;
    });

    if (validSegments.length === 0) {
      // Nothing to study
      setPlan({ ...sessionPlan, validSegments: [] });
      setPhase('empty');
      return;
    }

    setPlan({ ...sessionPlan, validSegments });

    // Pre-generate translation sentences
    if (config?.provider && sessionPlan.translationWords.length > 0) {
      const targetWords = selectTranslationWords(words, config.userLevel, 2);
      generateTranslationSentences({
        words: targetWords,
        cefrLevel: config.userLevel,
        config,
      }).then(result => {
        if (result?.length) setTransSentences(result);
      }).catch(() => {});
    }

    setPhase('segment');
  }, []);

  const currentSegment = plan?.validSegments?.[segmentIdx];

  const advanceSegment = useCallback(() => {
    if (!plan) return;
    const nextIdx = segmentIdx + 1;
    if (nextIdx >= plan.validSegments.length) {
      recordDailySession();
      setPhase('summary');
    } else {
      setSegmentIdx(nextIdx);
      // Reset sub-states
      setFcIndex(0);
      setFcFlipped(false);
      setTransIdx(0);
      setTransAnswer('');
      setTransFeedback(null);
    }
  }, [segmentIdx, plan, recordDailySession]);

  // ── FLASHCARD segment handlers ──
  const handleFcRate = useCallback((rating) => {
    const card = plan.flashcards[fcIndex];
    if (!card) return;
    const srsResult = reviewCard(card.id, rating);
    if (card.wordId) {
      useWordStore.getState().promoteFromSRS(card.wordId, srsResult);
    }
    recordFlashcardReview({ wordId: card.wordId, rating });
    const xpMap = { nao_lembro: 0, dificil: 1, bom: 2, facil: 3 };
    const xp = xpMap[rating] || 0;
    setTotalXp(prev => prev + xp);
    setSegmentResults(prev => ({
      ...prev,
      flashcards: [...prev.flashcards, rating !== 'nao_lembro'],
    }));

    if (fcIndex + 1 >= plan.flashcards.length) {
      advanceSegment();
    } else {
      setFcIndex(prev => prev + 1);
      setFcFlipped(false);
    }
  }, [plan, fcIndex, reviewCard, recordFlashcardReview, advanceSegment]);

  // ── TRANSLATION segment handlers ──
  const handleTransVerify = useCallback(async () => {
    if (!transAnswer.trim() || !transSentences[transIdx]) return;
    const sentence = transSentences[transIdx];
    const { correct: exactCorrect } = evaluateTranslation(transAnswer, sentence.english, sentence.alternatives);

    if (!exactCorrect && config?.provider) {
      setTransLoading(true);
      try {
        const result = await evaluateSemanticTranslation({
          original: sentence.portuguese,
          expected: sentence.english,
          userAnswer: transAnswer,
          userLevel: config.userLevel,
          config,
        });
        const xp = result.correct ? 12 : 4;
        awardXp(xp, result.correct ? 'translation:correct' : 'translation:attempt');
        setTotalXp(prev => prev + xp);
        setTransFeedback({ correct: result.correct, expected: sentence.english, note: result.note });
        setSegmentResults(prev => ({ ...prev, translation: [...prev.translation, result.correct] }));
      } catch {
        setTransFeedback({ correct: false, expected: sentence.english });
        setSegmentResults(prev => ({ ...prev, translation: [...prev.translation, false] }));
        awardXp(4, 'translation:attempt');
        setTotalXp(prev => prev + 4);
      }
      setTransLoading(false);
    } else {
      const xp = exactCorrect ? 12 : 4;
      awardXp(xp, exactCorrect ? 'translation:correct' : 'translation:attempt');
      setTotalXp(prev => prev + xp);
      setTransFeedback({ correct: exactCorrect, expected: sentence.english });
      setSegmentResults(prev => ({ ...prev, translation: [...prev.translation, exactCorrect] }));
    }
  }, [transAnswer, transSentences, transIdx, config, awardXp]);

  const handleTransNext = useCallback(() => {
    if (transIdx + 1 >= transSentences.length) {
      advanceSegment();
    } else {
      setTransIdx(prev => prev + 1);
      setTransAnswer('');
      setTransFeedback(null);
    }
  }, [transIdx, transSentences.length, advanceSegment]);

  // ── EMPTY state ──
  if (phase === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-extrabold text-neutral-900">Tudo em dia!</h2>
        <p className="text-sm text-neutral-500 max-w-xs">Adicione mais palavras no Reader ou volte mais tarde quando tiver flashcards para revisar.</p>
        <Button onClick={() => navigate('/')} className="rounded-xl bg-neutral-900 text-white px-6 font-bold">
          Dashboard
        </Button>
      </div>
    );
  }

  // ── LOADING state ──
  if (phase === 'loading' || !plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="w-8 h-8 rounded-full border-3 border-teal-200 border-t-teal-600 animate-spin" />
        <p className="text-sm font-semibold text-neutral-500">Montando sua sessão…</p>
      </div>
    );
  }

  // ── SUMMARY ──
  if (phase === 'summary') {
    const allResults = [...segmentResults.flashcards, ...segmentResults.translation, ...segmentResults.dialogue];
    const correctCount = allResults.filter(Boolean).length;
    const totalCount = allResults.length;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
          <div className="text-6xl">🏆</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-1">Sessão completa</p>
            <h2 className="text-3xl font-extrabold text-neutral-900">
              {totalCount > 0 ? `${correctCount}/${totalCount}` : 'Sessão'} completa
            </h2>
            <p className="mt-2 text-lg font-semibold text-teal-600">+{totalXp} XP ganhos</p>
          </div>

          {/* Segment breakdown */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
            {plan.validSegments.map(seg => {
              const results = segmentResults[seg] || [];
              const correct = results.filter(Boolean).length;
              return (
                <div key={seg} className="bg-white rounded-2xl border border-neutral-200 p-4 text-center">
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    {SEGMENT_LABELS[seg]}
                  </div>
                  <div className="text-lg font-extrabold text-neutral-900">
                    {results.length > 0 ? `${correct}/${results.length}` : '✓'}
                  </div>
                </div>
              );
            })}
          </div>

          {plan.weakCategories?.length > 0 && (
            <div className="text-xs text-neutral-400 mt-2">
              Áreas reforçadas: {plan.weakCategories.join(', ')}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button onClick={() => navigate('/')} className="rounded-xl bg-neutral-900 hover:bg-black text-white px-8 font-bold">
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/evolution')} className="rounded-xl px-6">
              Ver evolução
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── SEGMENT rendering ──
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Segment progress bar */}
        <div className="flex items-center gap-1 mb-6">
          {plan.validSegments.map((seg, i) => (
            <div
              key={seg}
              className={`flex-1 h-2 rounded-full transition-all ${
                i < segmentIdx ? 'bg-teal-500' : i === segmentIdx ? 'bg-teal-300' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="mb-6">
          <SegmentTimer
            durationSeconds={SEGMENT_DURATION[currentSegment]}
            label={SEGMENT_LABELS[currentSegment]}
          />
        </div>

        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <button onClick={advanceSegment} className="text-xs text-neutral-400 hover:text-neutral-600 underline underline-offset-2">
            Pular segmento →
          </button>
        </div>

        {/* ── FLASHCARD SEGMENT ── */}
        {currentSegment === 'flashcards' && plan.flashcards[fcIndex] && (
          <div className="space-y-5">
            <div className="text-sm text-neutral-500 text-center mb-2">
              Card {fcIndex + 1} de {plan.flashcards.length}
            </div>

            <div
              className="bg-white rounded-2xl border-2 border-neutral-100 p-8 min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              onClick={() => setFcFlipped(prev => !prev)}
            >
              {!fcFlipped ? (
                <>
                  <div className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-4">
                    {plan.flashcards[fcIndex].isContextual ? '📖 Contexto' : 'Português'}
                  </div>
                  <div className="text-xl font-extrabold text-neutral-900">{plan.flashcards[fcIndex].front}</div>
                  <div className="mt-6 text-xs text-neutral-400">Clique para revelar</div>
                </>
              ) : (
                <>
                  <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-4">Inglês</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-extrabold text-neutral-900">{plan.flashcards[fcIndex].back}</div>
                    <SpeakButton text={plan.flashcards[fcIndex].back} size={14} />
                  </div>
                </>
              )}
            </div>

            {fcFlipped && (
              <div className="grid grid-cols-4 gap-2">
                {[
                  ['nao_lembro', 'Não lembro', 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'],
                  ['dificil', 'Difícil', 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'],
                  ['bom', 'Bom', 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'],
                  ['facil', 'Fácil', 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'],
                ].map(([rating, label, cls]) => (
                  <button
                    key={rating}
                    onClick={() => handleFcRate(rating)}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all hover:-translate-y-0.5 ${cls}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BUILDER SEGMENT ── */}
        {currentSegment === 'builder' && (
          <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
            <div className="text-4xl">🔨</div>
            <p className="text-sm text-neutral-500 max-w-xs">
              Pratique construção de frases com suas palavras.
            </p>
            <Button
              onClick={() => {
                navigate('/practice', {
                  state: {
                    initialWords: plan.builderWords.map(w => ({
                      wordId: w.id,
                      wordText: w.word,
                      originalSentence: w.originalSentence,
                    })),
                    fromDailySession: true,
                  },
                });
              }}
              className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 font-bold"
            >
              Ir para Builder
            </Button>
            <button onClick={advanceSegment} className="text-sm text-neutral-400 underline underline-offset-2">
              Pular para próximo segmento
            </button>
          </div>
        )}

        {/* ── TRANSLATION SEGMENT ── */}
        {currentSegment === 'translation' && (
          <div className="space-y-5">
            {transSentences.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-4 text-center">
                <span className="w-6 h-6 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
                <p className="text-sm text-neutral-500">Gerando frases…</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-neutral-500 text-center">
                  Frase {transIdx + 1} de {transSentences.length}
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                    Traduza para inglês
                  </p>
                  <p className="text-xl font-semibold text-neutral-900 leading-relaxed">
                    &ldquo;{transSentences[transIdx].portuguese}&rdquo;
                  </p>
                  {transSentences[transIdx].targetWord && (
                    <p className="mt-3 text-xs text-neutral-400">
                      Palavra-alvo: <span className="font-semibold text-violet-500">{transSentences[transIdx].targetWord}</span>
                    </p>
                  )}
                </div>

                {!transFeedback ? (
                  <div className="space-y-3">
                    <textarea
                      value={transAnswer}
                      onChange={e => setTransAnswer(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTransVerify(); } }}
                      placeholder="Digite a tradução em inglês…"
                      className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 resize-none shadow-sm"
                      rows={2}
                      autoFocus
                      disabled={transLoading}
                    />
                    <Button
                      onClick={handleTransVerify}
                      disabled={!transAnswer.trim() || transLoading}
                      className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold py-3"
                    >
                      {transLoading ? 'Analisando…' : 'Verificar'}
                    </Button>
                  </div>
                ) : (
                  <div className={`rounded-2xl border p-5 space-y-3 ${transFeedback.correct ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{transFeedback.correct ? '✅' : '❌'}</span>
                      <span className={`font-bold ${transFeedback.correct ? 'text-green-800' : 'text-orange-800'}`}>
                        {transFeedback.correct ? 'Correto!' : 'Quase lá!'}
                      </span>
                    </div>
                    {transFeedback.note && (
                      <p className="text-sm text-neutral-700"><strong>Nota:</strong> {transFeedback.note}</p>
                    )}
                    <p className="text-sm text-neutral-700">
                      <span className="font-medium">→ Esperado:</span> &ldquo;{transFeedback.expected}&rdquo;
                    </p>
                    <Button onClick={handleTransNext} className="w-full rounded-xl bg-neutral-900 hover:bg-black text-white font-bold py-3">
                      {transIdx + 1 < transSentences.length ? 'Próxima →' : 'Continuar →'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── DIALOGUE SEGMENT ── */}
        {currentSegment === 'dialogue' && (
          <Dialogue
            targetWords={plan.dialogueConfig.words}
            focusCategory={plan.dialogueConfig.focusCategory}
            onComplete={(dialogueResults) => {
              setSegmentResults(prev => ({
                ...prev,
                dialogue: dialogueResults.results,
              }));
              setTotalXp(prev => prev + (dialogueResults.xpEarned || 0));
              advanceSegment();
            }}
            compact
          />
        )}
    </div>
  );
}
