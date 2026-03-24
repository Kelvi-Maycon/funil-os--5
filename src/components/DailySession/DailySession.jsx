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
import { BookOpenIcon, PuzzleIcon, PencilIcon, ChatBubbleIcon, PartyIcon, TrophyIcon, BookIcon, CheckCircleIcon, SparkIcon, PlayIcon } from '../shared/icons.jsx';


const SEGMENTS = ['flashcards', 'builder', 'translation', 'dialogue'];
const SEGMENT_LABELS = {
  flashcards: 'Flashcards',
  builder: 'Builder',
  translation: 'Traducao PT>EN',
  dialogue: 'Micro-dialogo',
};
const SEGMENT_ICONS = {
  flashcards: BookOpenIcon,
  builder: PuzzleIcon,
  translation: PencilIcon,
  dialogue: ChatBubbleIcon,
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
  const [transFetching, setTransFetching] = useState(false);
  const [transFetchFailed, setTransFetchFailed] = useState(false);
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
    if (config?.provider) {
      const targetWords = selectTranslationWords(words, config.userLevel, 2);
      if (targetWords.length > 0) {
        setTransFetching(true);
        generateTranslationSentences({
          words: targetWords,
          cefrLevel: config.userLevel,
          config,
        }).then(result => {
          if (result?.length) setTransSentences(result);
          else setTransFetchFailed(true);
        }).catch(() => {
          setTransFetchFailed(true);
        }).finally(() => {
          setTransFetching(false);
        });
      } else {
        setTransFetchFailed(true);
      }
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
        <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center">
          <PartyIcon size={32} className="text-[#647568]" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold font-heading text-neutral-900 tracking-tight">Tudo em dia!</h2>
          <p className="text-sm text-neutral-500 max-w-xs mt-2 leading-relaxed">Adicione mais palavras no Reader ou volte mais tarde quando tiver flashcards para revisar.</p>
        </div>
        <Button onClick={() => navigate('/')} className="bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold">
          Dashboard
        </Button>
      </div>
    );
  }

  // ── LOADING state ──
  if (phase === 'loading' || !plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="w-8 h-8 rounded-full border-2 border-[#CED1C6] border-t-[#647568] animate-spin" />
        <p className="text-sm text-neutral-500">Montando sua sessão...</p>
      </div>
    );
  }

  // ── SUMMARY ──
  if (phase === 'summary') {
    const allResults = [...segmentResults.flashcards, ...segmentResults.translation, ...segmentResults.dialogue];
    const correctCount = allResults.filter(Boolean).length;
    const totalCount = allResults.length;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center">
            <TrophyIcon size={28} className="text-[#647568]" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#647568] mb-1">Sessão completa</p>
            <h2 className="text-3xl font-semibold font-heading text-neutral-900 tracking-tight">
              {totalCount > 0 ? `${correctCount}/${totalCount}` : 'Sessão'} completa
            </h2>
            <p className="mt-2 text-base text-[#35403A] font-semibold">+{totalXp} XP ganhos</p>
          </div>

          {/* Segment breakdown */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
            {plan.validSegments.map(seg => {
              const results = segmentResults[seg] || [];
              const correct = results.filter(Boolean).length;
              return (
                <div key={seg} className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-4 text-center">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1 flex items-center justify-center gap-1.5">
                    {(() => { const SegIcon = SEGMENT_ICONS[seg]; return SegIcon ? <SegIcon size={14} /> : null; })()}
                    {SEGMENT_LABELS[seg]}
                  </div>
                  <div className="text-lg font-bold text-neutral-900">
                    {results.length > 0 ? `${correct}/${results.length}` : <CheckCircleIcon size={18} className="inline text-green-500" />}
                  </div>
                </div>
              );
            })}
          </div>

          {plan.weakCategories?.length > 0 && (
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mt-2">
              Áreas reforçadas: {plan.weakCategories.join(', ')}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button onClick={() => navigate('/')} className="bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors">
              Dashboard
            </button>
            <button onClick={() => navigate('/evolution')} className="border border-neutral-300 rounded-full px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
              Ver evolução
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SEGMENT rendering ──
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Segment progress bar */}
        <div className="flex items-center gap-1.5 mb-6">
          {plan.validSegments.map((seg, i) => (
            <div
              key={seg}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < segmentIdx ? 'bg-[#35403A]' : i === segmentIdx ? 'bg-[#CED1C6]' : 'bg-neutral-100'
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
          <button onClick={advanceSegment} className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 uppercase tracking-[0.12em] underline underline-offset-2">
            Pular segmento
          </button>
        </div>

        {/* ── FLASHCARD SEGMENT ── */}
        {currentSegment === 'flashcards' && plan.flashcards[fcIndex] && (
          <div className="space-y-5">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] text-center">
              Card {fcIndex + 1} de {plan.flashcards.length}
            </p>

            <div
              className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-8 min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFcFlipped(prev => !prev)}
            >
              {!fcFlipped ? (
                <>
                  <p className="text-[10px] font-bold text-[#35403A] uppercase tracking-[0.12em] mb-4 flex items-center justify-center gap-1.5">
                    {plan.flashcards[fcIndex].isContextual ? <><BookIcon size={12} /> Contexto</> : 'Português'}
                  </p>
                  <p className="text-xl font-semibold text-neutral-900 leading-relaxed">{plan.flashcards[fcIndex].front}</p>
                  <p className="mt-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Clique para revelar</p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-bold text-[#35403A] uppercase tracking-[0.12em] mb-4">Inglês</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold text-neutral-900 leading-relaxed">{plan.flashcards[fcIndex].back}</p>
                    <SpeakButton text={plan.flashcards[fcIndex].back} size={14} />
                  </div>
                </>
              )}
            </div>

            {fcFlipped && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  ['nao_lembro', 'Não lembro', 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'],
                  ['dificil', 'Difícil', 'bg-[#eef0ec] text-[#647568] border-[#CED1C6] hover:bg-[#dde2dc]'],
                  ['bom', 'Bom', 'bg-[#eef0ec] text-[#35403A] border-[#CED1C6] hover:bg-[#dde2dc]'],
                  ['facil', 'Fácil', 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'],
                ].map(([rating, label, cls]) => (
                  <button
                    key={rating}
                    onClick={() => handleFcRate(rating)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all hover:-translate-y-0.5 ${cls}`}
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
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center">
              <PuzzleIcon size={28} className="text-[#647568]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold font-heading text-neutral-900 tracking-tight mb-1">Builder</h3>
              <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                Pratique construção de frases com suas palavras.
              </p>
            </div>
            <button
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
              className="bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <PlayIcon size={16} />
              Ir para Builder
            </button>
            <button onClick={advanceSegment} className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] underline underline-offset-2">
              Pular para próximo segmento
            </button>
          </div>
        )}

        {/* ── TRANSLATION SEGMENT ── */}
        {currentSegment === 'translation' && (
          <div className="space-y-5">
            {transSentences.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-4 text-center">
                {transFetchFailed ? (
                  <>
                    <p className="text-sm text-neutral-500">Não foi possível gerar frases agora.</p>
                    <button onClick={advanceSegment} className="text-[10px] font-bold text-[#35403A] uppercase tracking-[0.12em] underline underline-offset-2">
                      Pular segmento
                    </button>
                  </>
                ) : (
                  <>
                    <span className="w-6 h-6 rounded-full border-2 border-[#CED1C6] border-t-[#647568] animate-spin" />
                    <p className="text-sm text-neutral-500">Gerando frases...</p>
                  </>
                )}
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] text-center">
                  Frase {transIdx + 1} de {transSentences.length}
                </p>

                <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(20,20,19,0.06)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-3">
                    Traduza para inglês
                  </p>
                  <p className="text-xl font-semibold text-neutral-900 leading-relaxed">
                    &ldquo;{transSentences[transIdx].portuguese}&rdquo;
                  </p>
                  {transSentences[transIdx].targetWord && (
                    <p className="mt-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">
                      Palavra-alvo: <span className="text-[#647568] normal-case tracking-normal">{transSentences[transIdx].targetWord}</span>
                    </p>
                  )}
                </div>

                {!transFeedback ? (
                  <div className="space-y-3">
                    <textarea
                      value={transAnswer}
                      onChange={e => setTransAnswer(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTransVerify(); } }}
                      placeholder="Digite a tradução em inglês..."
                      className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#647568] focus:outline-none focus:ring-2 focus:ring-[#35403A]/15 resize-none shadow-[0_1px_2px_rgba(20,20,19,0.04)]"
                      rows={2}
                      autoFocus
                      disabled={transLoading}
                    />
                    <button
                      onClick={handleTransVerify}
                      disabled={!transAnswer.trim() || transLoading}
                      className="w-full bg-[#35403A] hover:bg-[#232625] disabled:opacity-50 text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
                    >
                      {transLoading ? 'Analisando...' : 'Verificar'}
                    </button>
                  </div>
                ) : (
                  <div className={`rounded-xl border p-5 space-y-3 ${transFeedback.correct ? 'border-green-200 bg-green-50' : 'border-[#CED1C6] bg-[#eef0ec]'}`}>
                    <div className="flex items-center gap-2">
                      {transFeedback.correct
                        ? <CheckCircleIcon size={22} className="text-green-600" />
                        : <SparkIcon size={22} className="text-[#35403A]" />
                      }
                      <span className={`text-sm font-semibold ${transFeedback.correct ? 'text-green-800' : 'text-[#232625]'}`}>
                        {transFeedback.correct ? 'Correto!' : 'Quase lá!'}
                      </span>
                    </div>
                    {transFeedback.note && (
                      <p className="text-sm text-neutral-700"><strong>Nota:</strong> {transFeedback.note}</p>
                    )}
                    <p className="text-sm text-neutral-700">
                      <span className="font-medium">&rarr; Esperado:</span> &ldquo;{transFeedback.expected}&rdquo;
                    </p>
                    <button onClick={handleTransNext} className="w-full bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors">
                      {transIdx + 1 < transSentences.length ? 'Próxima' : 'Continuar'}
                    </button>
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
