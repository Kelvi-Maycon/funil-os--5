import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateTranslationSentences, evaluateTranslation } from '../../services/ai.js';
import { ACHIEVEMENT_META, XP_PER_LEVEL, DAILY_XP_CAP } from '../../constants/learning.js';
import { isDueToday } from '../../services/srs.js';
import { useCardStore } from '../../store/useCardStore.js';
import {
  calculateRetentionRate,
  calculateStreakStats,
  computeMasteryLevel,
  getDayKey,
  getStreakBonus,
  useProgressStore,
} from '../../store/useProgressStore.js';
import { useConfig } from '../../store/useConfig.js';
import { useWordStore } from '../../store/useWordStore.js';
import {
  buildAchievementSpotlight,
  buildAreaPath,
  buildMissionProgress,
  buildPromptCardState,
  buildRange,
  buildSmoothCurve,
  buildTopDashboardStats,
  computePeriodXp,
  resolveNextStudyStep,
} from './dashboardMetrics.js';
import { selectDailyPromptTargets } from '../Builder/practiceModes.js';
import NotificationsPopover from './NotificationsPopover.jsx';
import {
  BookIcon,
  BrainIcon,
  FlameIcon,
  GridIcon,
  LockIcon,
  MapIcon,
  MedalBronzeIcon,
  MedalGoldIcon,
  MedalSilverIcon,
  GemIcon,
  PartyIcon,
  PencilIcon,
  PlayIcon,
  PuzzleIcon,
  QueueIcon,
  ReloadIcon,
  ReviewIcon,
  SearchIcon,
  ShieldIcon,
  SparkIcon,
  TargetIcon,
  TrophyIcon,
} from './icons.jsx';
import { Badge } from '../ui/badge.jsx';

const AWARD_ICONS = {
  'medal-bronze': MedalBronzeIcon,
  'medal-silver': MedalSilverIcon,
  'medal-gold': MedalGoldIcon,
  'gem': GemIcon,
};

const missionIcons = {
  readerWords: BookIcon,
  builderExercises: PuzzleIcon,
  flashcardReviews: ReviewIcon,
  productionWrites: PencilIcon,
  recycledWords: ReloadIcon,
};

const achievementIcons = {
  first_discovery: BookIcon,
  builder_apprentice: PuzzleIcon,
  memory_keeper: QueueIcon,
  recycler: ReloadIcon,
  perfect_flow: SparkIcon,
  weekly_rhythm: FlameIcon,
  active_lexicon: TargetIcon,
  prompt_starter: PencilIcon,
};

const STATUS_LABELS = {
  desconhecida: 'Desconhecida',
  reconhecida: 'Reconhecida',
  em_treino: 'Em treino',
  ativa: 'Ativa',
  dominada: 'Dominada',
};

const STEP_META = {
  flashcards: {
    label: 'Revisao em foco',
    headline: 'Revise o que venceu',
    accent: 'e proteja a retencao',
    icon: ReviewIcon,
  },
  practice: {
    label: 'Pratica em foco',
    headline: 'Transforme leitura em pratica',
    accent: 'antes da memoria esfriar',
    icon: SparkIcon,
  },
  reader: {
    label: 'Leitura em foco',
    headline: 'Abra um novo texto',
    accent: 'e capture contexto real',
    icon: BookIcon,
  },
};

const WEEKDAY_LABELS = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatDashboardDate(date = new Date()) {
  return `${WEEKDAY_LABELS[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')} ${MONTH_LABELS[date.getMonth()]}`;
}

function formatStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function getAchievementCopy(key, fallback = {}) {
  const meta = ACHIEVEMENT_META[key] || {};
  return {
    title: meta.title || fallback.title || 'Marco em andamento',
    desc: meta.desc || fallback.description || fallback.desc || 'Continue estudando para liberar o proximo marco.',
  };
}

function DashboardIcon({ achievementKey, size = 18 }) {
  const Icon = achievementIcons[achievementKey] || TrophyIcon;
  return <Icon size={size} />;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartWindow, setChartWindow] = useState(30);
  const { config, setConfig } = useConfig();
  const { words } = useWordStore();
  const { flashcards } = useCardStore();
  const { dailyStats, dailyPromptHistory, totals, xp, masteryXp = 0, achievements } = useProgressStore();

  const todayKey = getDayKey();
  const todayStats = dailyStats[todayKey] || {};
  const dueCards = flashcards.filter(isDueToday);
  const longTermCards = flashcards.filter((card) => card.interval >= 21).length;
  const shortTermCards = flashcards.filter((card) => card.interval > 1 && card.interval < 21).length;
  const newCards = flashcards.filter((card) => card.interval <= 1).length;
  const missions = buildMissionProgress(config.missions, todayStats);
  const completedMissions = missions.filter((mission) => mission.done).length;
  const streakStats = calculateStreakStats(dailyStats, config.study?.minSessionMinutes ?? 5);
  const retention = calculateRetentionRate(dailyStats, 7);
  const activeWords = totals.activeWords || words.filter((word) => word.status === 'ativa').length;
  const masteredWords = totals.masteredWords || words.filter((word) => word.status === 'dominada').length;

  const range = useMemo(() => buildRange(chartWindow), [chartWindow]);

  const promptTargets = selectDailyPromptTargets({
    words,
    userLevel: config.userLevel,
    limit: 3,
  });

  const pendingPrompt = !dailyPromptHistory?.[todayKey] && promptTargets.length > 0;

  const [dailyPromptData, setDailyPromptData] = useState(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [promptAnswer, setPromptAnswer] = useState('');
  const [promptResult, setPromptResult] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (pendingPrompt && !dailyPromptData && !isLoadingPrompt) {
      setIsLoadingPrompt(true);
      async function fetchPrompt() {
        try {
          const wordsToGenerate = promptTargets.map(t => ({ word: t.wordText }));
          const sentences = await generateTranslationSentences({
            words: wordsToGenerate,
            cefrLevel: config.userLevel,
            config
          });

          if (isMounted) {
            if (sentences && sentences.length > 0) {
              setDailyPromptData(sentences[0]);
            } else {
              setDailyPromptData({
                portuguese: `Eu não sei como usar "${promptTargets[0]?.wordText}" ainda.`,
                english: `I don't know how to use "${promptTargets[0]?.wordText}" yet.`,
                alternatives: [],
                targetWord: promptTargets[0]?.wordText
              });
            }
          }
        } catch (err) {
          if (isMounted) {
            setDailyPromptData({
              portuguese: `Eu não sei como usar "${promptTargets[0]?.wordText}" ainda.`,
              english: `I don't know how to use "${promptTargets[0]?.wordText}" yet.`,
              alternatives: [],
              targetWord: promptTargets[0]?.wordText
            });
          }
        } finally {
          if (isMounted) setIsLoadingPrompt(false);
        }
      }
      fetchPrompt();
    }
    return () => { isMounted = false; };
  }, [pendingPrompt, promptTargets, config, dailyPromptData]);

  const submitPrompt = () => {
    if (!promptAnswer.trim() || !dailyPromptData) return;
    const { recordDailyPromptCompletion } = useProgressStore.getState();
    const evaluation = evaluateTranslation(promptAnswer, dailyPromptData.english, dailyPromptData.alternatives);

    setPromptResult({
      correct: evaluation.correct,
      expected: dailyPromptData.english
    });

    recordDailyPromptCompletion({
      wordIds: [promptTargets.find(t => t.wordText === dailyPromptData.targetWord)?.wordId || promptTargets[0]?.wordId],
      answers: [{ answer: promptAnswer, expected: dailyPromptData.english, correct: evaluation.correct }],
      targets: [dailyPromptData.targetWord]
    });
  };

  const promptState = buildPromptCardState({
    promptTargets,
    pendingPrompt,
  });

  const nextStep = resolveNextStudyStep({
    dueCards: dueCards.length,
    hasRecentReaderActivity: (todayStats.readerWords || 0) > 0,
    recentSessionWords: promptTargets.length,
    pendingPrompt,
    retentionRate: retention.rate,
    streakRisk: !dailyStats[todayKey] && (new Date().getHours() >= 20 || streakStats.currentStreak > 0),
  });

  const heroMeta = STEP_META[nextStep.id] || STEP_META.reader;
  const HeroIcon = heroMeta.icon;

  const topStats = buildTopDashboardStats({
    completedMissions,
    totalMissions: missions.length,
    dueCards: dueCards.length,
    retentionRate: retention.rate,
    longTermCards,
    shortTermCards,
    newCards,
    currentStreak: streakStats.currentStreak,
    longestStreak: streakStats.longestStreak,
    weeklyActive: streakStats.weeklyActive,
  });

  const spotlight = buildAchievementSpotlight({
    achievements,
    totals,
    dailyStats,
    minSessionMinutes: config.study?.minSessionMinutes ?? 5,
  });

  const spotlightCopy = getAchievementCopy(spotlight.key, spotlight);

  const todayStart = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }, []);

  const recentCapturedWords = useMemo(
    () => words
      .filter((word) => (word.lastSeenAt || word.addedAt || 0) >= todayStart)
      .sort((left, right) => (right.lastSeenAt || right.addedAt || 0) - (left.lastSeenAt || left.addedAt || 0))
      .slice(0, 4),
    [todayStart, words]
  );

  const activitySeries = useMemo(
    () => range.map((day) => {
      const stats = dailyStats[day.key] || {};
      return (
        (stats.readerWords || 0) +
        (stats.builderExercises || 0) +
        (stats.transformExercises || 0) +
        (stats.clozeExercises || 0) +
        (stats.flashcardReviews || 0) +
        (stats.productionWrites || 0)
      );
    }),
    [dailyStats, range]
  );

  const chartPath = useMemo(() => buildSmoothCurve(activitySeries, 680, 220), [activitySeries]);
  const areaPath = useMemo(() => buildAreaPath(activitySeries, 680, 220), [activitySeries]);
  const totalActivity = activitySeries.reduce((sum, value) => sum + value, 0);

  const levelProgress = xp % XP_PER_LEVEL;
  const levelProgressPct = Math.round((levelProgress / XP_PER_LEVEL) * 100);
  const currentDate = formatDashboardDate();

  // Mastery level (A1 → B2+) — progressInLevel/levelRange/progressPct come from the function
  const masteryInfo = computeMasteryLevel(masteryXp);
  const { progressInLevel: masteryProgressInLevel, levelRange: masteryRangeSize, progressPct: masteryProgressPct } = masteryInfo;

  // Auto-sync config.userLevel with computed mastery level (only upgrade, never downgrade)
  useEffect(() => {
    const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const computedId = masteryInfo.current?.id;
    if (computedId && computedId !== config.userLevel) {
      const computedIdx = LEVELS.indexOf(computedId);
      const currentIdx = LEVELS.indexOf(config.userLevel);
      if (computedIdx > currentIdx) {
        setConfig({ userLevel: computedId });
      }
    }
  }, [masteryInfo.current?.id, config.userLevel, setConfig]);

  // XP period stats
  const xpToday = (todayStats.xp || 0) + (todayStats.streakBonus || 0);
  const xpWeek = computePeriodXp(dailyStats, 7);
  const xpMonth = computePeriodXp(dailyStats, 30);
  const todayStreakBonus = getStreakBonus(streakStats.currentStreak);
  const todayCapRemaining = Math.max(0, DAILY_XP_CAP - (todayStats.xp || 0));

  const handlePromptAction = () => {
    if (promptState.action === 'reader') {
      navigate('/reader');
      return;
    }
    navigate('/practice', { state: { mode: 'prompt' } });
  };

  return (
    <div className="text-[#232625] antialiased min-h-screen flex flex-col pt-0 pb-16">
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pt-2 lg:pt-0">
        <div>
          <h1 className="text-xl font-semibold font-heading tracking-tight text-neutral-900 flex items-center gap-2.5">
            <GridIcon size={18} className="text-[#35403A]" strokeWidth={1.5} />
            Dashboard
          </h1>
          <p className="text-[10px] font-bold tracking-[0.12em] text-neutral-400 uppercase mt-0.5">{currentDate}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden lg:block">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-[#35403A] transition-colors" />
            <input type="text" placeholder="Buscar no painel" className="pl-10 pr-4 py-2 bg-white border border-neutral-200 focus:border-[#647568] focus:ring-2 focus:ring-[#35403A]/15 rounded-full text-sm w-60 transition-all outline-none placeholder-neutral-400 shadow-[0_1px_2px_rgba(20,20,19,0.04)]" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CED1C6]/30 border border-[#CED1C6] cursor-pointer hover:bg-[#CED1C6]/50 transition-colors">
            <FlameIcon size={13} className="text-[#647568]" />
            <span className="text-xs font-semibold text-[#35403A]">{streakStats.currentStreak} dias</span>
          </div>

          <div className="hidden md:block">
            <NotificationsPopover />
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className="grid grid-cols-12 gap-5">

          {/* Hero Widget */}
          <section className="col-span-12 bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 mb-6">
                <span className={`w-1.5 h-1.5 rounded-full ${nextStep.priority === 'high' ? 'bg-[#35403A] animate-pulse' : 'bg-neutral-400'}`}></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                  {nextStep.priority === 'high' ? 'Ação Prioritária' : heroMeta.label}
                </span>
              </div>
              <h2 className="font-body italic text-4xl md:text-5xl text-neutral-900 leading-tight mb-3">
                {nextStep.title || heroMeta.headline}
                {heroMeta.accent && nextStep.priority !== 'high' && (
                  <span className="text-[#35403A]"> {heroMeta.accent}</span>
                )}
              </h2>
              <p className="text-base text-neutral-500 leading-relaxed mb-8 max-w-md">
                {nextStep.description || 'Importe um texto ou legenda para iniciar o ciclo de estudo de hoje.'}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate(nextStep.route)}
                  className="bg-[#35403A] text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#232625] transition-colors flex items-center gap-2"
                >
                  <PlayIcon size={16} />
                  {nextStep.cta}
                </button>
                <button
                  onClick={() => navigate('/study')}
                  className="border border-neutral-300 rounded-full px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                >
                  <PlayIcon size={16} />
                  Estudar (15 min)
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-2xl bg-neutral-50 border border-neutral-200 shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#35403A] flex items-center justify-center text-white">
                <HeroIcon size={22} />
              </div>
            </div>
          </section>

          {/* Level Widget */}
          <section className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                <TrophyIcon size={10} /> Rank: {config.userLevel}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 mt-4 lg:mt-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#35403A] flex items-center justify-center text-white shrink-0">
                  <ShieldIcon size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1">Nível de Vocabulário</p>
                  <h3 className="text-3xl font-bold font-heading text-neutral-900 tracking-tight">{masteryInfo.current.id}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{activeWords} palavras ativas · {masteredWords} dominadas</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-neutral-900 tracking-tight">{xpToday}</span>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mt-1">XP Hoje {todayCapRemaining > 0 ? `· ${todayCapRemaining} restam` : '· cap ✓'}</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#35403A] h-full rounded-full transition-all duration-1000" style={{ width: `${masteryProgressPct}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                <span>{masteryProgressInLevel.toLocaleString('pt-BR')} / {masteryRangeSize.toLocaleString('pt-BR')} MP</span>
                {masteryInfo.next
                  ? <span>{masteryInfo.next.id} →</span>
                  : <span className="flex items-center gap-1">Nivel maximo <PartyIcon size={12} /></span>
                }
              </div>
            </div>

            {/* Awards */}
            <div className="flex items-center gap-6 mt-auto pt-5 border-t border-neutral-100">
              <div className="shrink-0">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Marcos</p>
                <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-[0.12em] mt-0.5">{masteryInfo.current.id}</p>
              </div>
              <div className="flex items-center justify-between flex-1 relative">
                <div className="absolute left-5 right-5 top-5 h-px bg-neutral-100 -z-10"></div>
                {masteryInfo.current.awards.map((award, i) => {
                  const unlocked = masteryXp >= award.mp;
                  const awardStyle = i === 0
                    ? 'bg-[#CED1C6] text-[#35403A]'
                    : i === 1
                      ? 'bg-[#647568]/30 text-[#35403A]'
                      : 'bg-[#35403A] text-white';
                  return (
                    <div key={award.name} className="flex flex-col items-center gap-2 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-all
                        ${unlocked ? awardStyle : 'bg-neutral-100 text-neutral-300'}`}>
                        {unlocked ? (() => { const AIcon = AWARD_ICONS[award.icon]; return AIcon ? <AIcon size={16} /> : null; })() : <LockIcon size={16} />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${unlocked ? 'text-neutral-500' : 'text-neutral-300'}`}>
                        {award.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* XP semana/mês */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">
              <span>Semana: <span className="text-neutral-600">{xpWeek} XP</span></span>
              <span className="text-neutral-200">|</span>
              <span>Mês: <span className="text-neutral-600">{xpMonth} XP</span></span>
              {todayStreakBonus > 0 && <span className="text-[#647568] flex items-center gap-1"><FlameIcon size={10} /> +{todayStreakBonus} streak</span>}
            </div>
          </section>

          {/* Prompt Widget */}
          <section className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 md:p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-6">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mt-1">Daily Prompt</p>
              <span className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-[0.1em] uppercase ${promptState.status === 'empty' ? 'border-[#CED1C6] text-[#35403A] bg-[#eef0ec]' : 'border-[#CED1C6] text-[#35403A] bg-[#dde2dc]'}`}>
                {promptState.status === 'empty' ? 'Indisponivel' : 'Pronto'}
              </span>
            </div>

            <div className="mb-auto">
              <h3 className="font-body italic text-2xl text-neutral-900 mb-3 leading-tight">
                {pendingPrompt ? 'Desafio Diário' : promptState.title}
              </h3>
              {!pendingPrompt && (
                <p className="text-sm text-neutral-500 mb-8 leading-relaxed max-w-sm">{promptState.challenge || promptState.description || 'Capture vocabulário no reader para liberar um desafio contextual amanhã.'}</p>
              )}
              {pendingPrompt && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-[0.1em]">Traduza para o inglês:</p>
                  {isLoadingPrompt ? (
                    <div className="animate-pulse bg-neutral-100 h-10 w-full rounded-lg mb-4"></div>
                  ) : dailyPromptData ? (
                    <p className="text-base font-body italic text-neutral-800 mb-4">{dailyPromptData.portuguese}</p>
                  ) : null}

                  {promptResult ? (
                    <div className={`p-4 rounded-xl border ${promptResult.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-[#eef0ec] border-[#CED1C6] text-[#35403A]'} mb-4`}>
                      <p className="font-semibold mb-1 flex items-center gap-1 text-sm">{promptResult.correct ? <><PartyIcon size={14} /> Excelente!</> : 'Quase la!'}</p>
                      {!promptResult.correct && <p className="text-xs">A tradução esperada era: <strong>{promptResult.expected}</strong></p>}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={promptAnswer}
                      onChange={(e) => setPromptAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitPrompt()}
                      placeholder="Sua tradução em inglês..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#35403A]/20 focus:border-[#647568] mb-4"
                      disabled={isLoadingPrompt || !dailyPromptData}
                    />
                  )}
                </div>
              )}
            </div>

            {pendingPrompt ? (
              !promptResult && (
                <button
                  onClick={submitPrompt}
                  disabled={isLoadingPrompt || !dailyPromptData || !promptAnswer.trim()}
                  className="bg-[#35403A] hover:bg-[#232625] disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 w-full mt-auto">
                  <SparkIcon size={16} />
                  Verificar Resposta
                </button>
              )
            ) : (
              <button
                onClick={handlePromptAction}
                className="bg-[#35403A] hover:bg-[#232625] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 w-full mt-auto">
                <SparkIcon size={16} />
                {promptState.ctaLabel || 'Abrir reader para capturar'}
              </button>
            )}
          </section>

          {/* Learn Rhythm Chart */}
          <section className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 md:p-8 flex flex-col min-h-[360px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1">Ritmo de aprendizado</p>
                <h3 className="text-lg font-semibold font-heading text-neutral-900">Atividade por dia</h3>
              </div>
              <div className="flex items-center bg-neutral-50 p-1 rounded-lg border border-neutral-200">
                <button onClick={() => setChartWindow(7)} className={`px-3 py-1 text-xs ${chartWindow === 7 ? 'font-semibold text-neutral-900 bg-white shadow-sm border border-neutral-200' : 'font-medium text-neutral-500 hover:text-neutral-700'} rounded-md transition-all`}>7d</button>
                <button onClick={() => setChartWindow(30)} className={`px-3 py-1 text-xs ${chartWindow === 30 ? 'font-semibold text-neutral-900 bg-white shadow-sm border border-neutral-200' : 'font-medium text-neutral-500 hover:text-neutral-700'} rounded-md transition-all`}>30d</button>
                <button onClick={() => setChartWindow(90)} className={`px-3 py-1 text-xs ${chartWindow === 90 ? 'font-semibold text-neutral-900 bg-white shadow-sm border border-neutral-200' : 'font-medium text-neutral-500 hover:text-neutral-700'} rounded-md transition-all`}>90d</button>
              </div>
            </div>

            {totalActivity === 0 ? (
              <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-300 mb-4">
                  <MapIcon size={20} />
                </div>
                <p className="font-semibold text-neutral-600 text-sm mb-1">Sem atividade nesta janela</p>
                <p className="text-xs text-neutral-400 max-w-xs">Inicie uma sessao para ver seu progresso aqui.</p>
              </div>
            ) : (
              <div className="flex-1 relative w-full h-[220px]">
                <svg viewBox="0 0 680 220" className="w-full h-full dashboard-chart-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dashboardChartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(100,117,104,0.20)" />
                      <stop offset="100%" stopColor="rgba(100,117,104,0)" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#dashboardChartGradient)" />
                  <path d={chartPath} fill="none" stroke="#647568" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </section>

          {/* Captures & Achievement Panel */}
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-5 min-w-0">
            <section className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 flex flex-col overflow-hidden min-w-0">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-4">Capturas recentes</p>

              <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-lg flex flex-col items-center justify-center text-center p-4 overflow-y-auto min-w-0">
                {recentCapturedWords.length > 0 ? (
                  <div className="w-full h-full flex flex-col gap-3 text-left min-w-0">
                    {recentCapturedWords.map((word) => (
                      <div key={word.id} className="flex justify-between items-center text-sm min-w-0">
                        <div className="min-w-0 pr-2 flex-1">
                          <strong className="text-neutral-800 block truncate text-sm">{word.word}</strong>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">{word.originalSentence || 'Sem contexto salvo'}</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] px-2 py-0.5 whitespace-nowrap bg-white border-neutral-200 shrink-0">
                          {formatStatusLabel(word.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 bg-white rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-300 mb-3">
                      <BookIcon size={18} />
                    </div>
                    <p className="font-semibold text-neutral-600 text-sm mb-1">Nenhuma captura hoje</p>
                  </>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 flex flex-col overflow-hidden min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Proxima Conquista</p>
                <div className="w-7 h-7 rounded-full bg-[#35403A] flex items-center justify-center text-white">
                  <TrophyIcon size={13} />
                </div>
              </div>
              <p className="text-sm font-semibold text-neutral-800 mb-1">{spotlightCopy.title}</p>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">{spotlightCopy.desc}</p>
              <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-[#35403A] rounded-full transition-all duration-1000" style={{ width: `${spotlight.percent}%` }}></div>
              </div>
              <p className="text-[10px] text-neutral-400 mt-2">{spotlight.current}/{spotlight.goal} completo</p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400"><BookIcon size={12} /></div>
                <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400"><SparkIcon size={12} /></div>
                <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400"><FlameIcon size={12} /></div>
                <span className="text-[10px] text-neutral-400 ml-1">+ {achievements.length} conquistas</span>
              </div>
            </section>
          </div>

          {/* Missions List */}
          <section className="col-span-12 bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1">Missões de hoje</p>
                <h3 className="text-lg font-semibold font-heading text-neutral-900">Complete para ganhar XP</h3>
              </div>
              <span className="text-xs font-semibold text-neutral-400">{completedMissions}/{missions.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {missions.slice(0, 4).map((mission, idx) => {
                const MissionIcons = [BookIcon, ReloadIcon, PencilIcon, TargetIcon];
                const MissionIcon = MissionIcons[idx % 4];
                const isDone = mission.done;
                const percent = Math.min(100, (mission.current / mission.goal) * 100);

                return (
                  <div key={mission.key} className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${isDone ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-500'}`}>
                      <MissionIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">{mission.label}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full ${isDone ? 'bg-green-400' : 'bg-[#35403A]'} rounded-full transition-all duration-700`} style={{ width: `${percent}%` }}></div>
                        </div>
                        <span className={`text-[10px] font-semibold shrink-0 ${isDone ? 'text-green-600' : 'text-neutral-400'}`}>+{mission.xp || 10} XP</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* KPIs Overview */}
          <section className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-5 pb-12">
            <div className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Meta Diária</p>
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <TargetIcon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-neutral-900 tracking-tight">{topStats.dailyGoal.value}</span>
                <span className="text-base font-medium text-neutral-400">/{topStats.dailyGoal.total}</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-[#35403A] rounded-full" style={{ width: `${topStats.dailyGoal.percent}%` }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Revisões</p>
                <div className="w-8 h-8 rounded-full bg-[#eef0ec] flex items-center justify-center text-[#35403A]">
                  <ReviewIcon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-neutral-900 tracking-tight">{topStats.pendingReviews.value}</span>
              </div>
              <p className="text-[10px] text-[#35403A] font-bold mt-2 uppercase tracking-[0.1em]">Pendentes Hoje</p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Memória</p>
                <div className="w-8 h-8 rounded-full bg-[#eef0ec] flex items-center justify-center text-[#35403A]">
                  <BrainIcon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-neutral-900 tracking-tight">{topStats.retention.value}%</span>
              </div>
              <p className="text-[10px] text-[#35403A] font-bold mt-2 uppercase tracking-[0.1em]">Taxa de Retencao</p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Ofensiva</p>
                <div className="w-8 h-8 rounded-full bg-[#CED1C6]/40 flex items-center justify-center text-[#647568]">
                  <FlameIcon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-neutral-900 tracking-tight">{topStats.streak.value}</span>
                <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Dias</span>
              </div>
              <p className="text-[10px] text-[#647568] font-bold mt-1 flex items-center gap-1"><TargetIcon size={10} /> Recorde: {topStats.streak.longestStreak} dias</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
