import { useMemo } from 'react';
import { BookOpen, Brain, Calendar, Download, Shield, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import { useCardStore } from '../../store/useCardStore.js';
import { calculateRetentionRate, calculateStreakStats, useProgressStore } from '../../store/useProgressStore.js';
import { useConfig } from '../../store/useConfig.js';
import { useWordStore } from '../../store/useWordStore.js';
import {
  buildLearningCurveSeries,
  buildRange,
  buildSmoothCurve,
  buildSnapshotSeries,
  buildSpacedXAxisLabels,
  buildZeroBasedYAxisLabels,
} from './dashboardMetrics.js';
import PageHeader from './PageHeader.jsx';
import { Button } from '../ui/button.jsx';
import { Card, CardContent } from '../ui/card.jsx';
import {
  BoltIcon,
  BookOpenIcon,
  ClockIcon,
  GridIcon,
  LayersIcon,
  MapIcon,
  PencilIcon,
  SearchIcon,
  UserCircleIcon,
  WriteIcon,
} from './icons.jsx';

const SKILL_LABELS = ['Vocabulário', 'Retenção', 'Precisão', 'Escrita', 'Consistência'];
const SKILL_CENTER = 140;
const SKILL_RADIUS = 82;
const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const CONSISTENCY_LEVEL_STYLES = [
  'bg-white border-neutral-200',
  'bg-[#dde2dc] border-[#CED1C6]',
  'bg-[#CED1C6] border-[#CED1C6]',
  'bg-[#647568] border-[#647568]',
  'bg-[#35403A] border-[#35403A]',
];

function buildSkillPolygon(values, radius = SKILL_RADIUS, center = SKILL_CENTER) {
  const total = values.length;
  return values.map((value, index) => {
    const angle = (-Math.PI / 2) + ((Math.PI * 2) * index) / total;
    const scaled = radius * value;
    const x = center + Math.cos(angle) * scaled;
    const y = center + Math.sin(angle) * scaled;
    return `${x},${y}`;
  }).join(' ');
}

function buildSkillAxis(label, index, total, radius = SKILL_RADIUS, center = SKILL_CENTER) {
  const angle = (-Math.PI / 2) + ((Math.PI * 2) * index) / total;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
    labelX: center + Math.cos(angle) * (radius + 42),
    labelY: center + Math.sin(angle) * (radius + 42),
    textAnchor: Math.cos(angle) > 0.25 ? 'start' : Math.cos(angle) < -0.25 ? 'end' : 'middle',
    label,
  };
}

function getDayActivityValue(day = {}) {
  const xpValue = (day.xp || 0) + (day.streakBonus || 0);
  if (xpValue > 0) {
    return xpValue;
  }

  return (
    (day.readerWords || 0) +
    (day.builderExercises || 0) +
    (day.transformExercises || 0) +
    (day.clozeExercises || 0) +
    (day.flashcardReviews || 0) +
    (day.productionWrites || 0)
  );
}

function toDayKey(date) {
  return date.toLocaleDateString('en-CA');
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function resolveConsistencyLevel(value, maxValue) {
  if (!value || !maxValue) {
    return 0;
  }

  return Math.max(1, Math.min(4, Math.ceil((value / maxValue) * 4)));
}

function buildConsistencyMap(dailyStats) {
  const end = startOfDay(new Date());
  const start = startOfDay(new Date(end));
  start.setDate(start.getDate() - 119);
  start.setDate(start.getDate() - start.getDay());

  const cells = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const date = new Date(cursor);
    const key = toDayKey(date);
    const value = getDayActivityValue(dailyStats[key] || {});
    cells.push({ date, key, value });
  }

  const maxValue = cells.reduce((highest, cell) => Math.max(highest, cell.value), 0);
  const weeks = [];

  cells.forEach((cell, index) => {
    if (index % 7 === 0) {
      weeks.push([]);
    }

    weeks.at(-1).push({
      ...cell,
      level: resolveConsistencyLevel(cell.value, maxValue),
    });
  });

  while (weeks.at(-1)?.length < 7) {
    weeks.at(-1).push(null);
  }

  const monthStarts = [];
  let lastMonthId = null;

  weeks.forEach((week, columnIndex) => {
    const firstDay = week.find(Boolean);
    if (!firstDay) {
      return;
    }

    const monthId = `${firstDay.date.getFullYear()}-${firstDay.date.getMonth()}`;
    if (monthId !== lastMonthId) {
      monthStarts.push({
        label: MONTH_LABELS[firstDay.date.getMonth()],
        start: columnIndex,
      });
      lastMonthId = monthId;
    }
  });

  const monthSegments = monthStarts.map((segment, index) => ({
    label: segment.label,
    span: (monthStarts[index + 1]?.start ?? weeks.length) - segment.start,
  }));

  return { monthSegments, weeks };
}

function formatChartLabel(dayKey) {
  return new Date(`${dayKey}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

function formatConsistencyTooltip(date, value) {
  const when = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `${value} XP ganhos em ${when}`;
}

function StatCard({ icon: Icon, tone = 'orange', label, value }) {
  const IconComponent = Icon;
  const toneMap = {
    blue: { bg: 'bg-white', icon: 'bg-[#eef0ec] text-[#35403A] border-[#CED1C6]', text: 'text-neutral-900', shadow: 'shadow-[0_1px_3px_rgba(20,20,19,0.06)]' },
    terracotta: { bg: 'bg-[#35403A]', icon: 'bg-white/10 text-white border-white/10', text: 'text-white', shadow: 'shadow-none' },
    orange: { bg: 'bg-[#647568]', icon: 'bg-white/10 text-white border-white/10', text: 'text-white', shadow: 'shadow-none' },
    green: { bg: 'bg-emerald-500', icon: 'bg-white/10 text-white border-white/10', text: 'text-white', shadow: 'shadow-none' },
  };

  const currentTheme = toneMap[tone] || toneMap.orange;

  return (
    <div className={`${currentTheme.bg} rounded-xl p-6 md:p-8 ${currentTheme.shadow} border ${tone === 'blue' ? 'border-neutral-200/70' : 'border-transparent'} flex flex-col justify-between relative overflow-hidden group transition-transform hover:-translate-y-1`}>
      {tone !== 'blue' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
      )}
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl border mb-6 relative z-10 ${currentTheme.icon}`}>
        <IconComponent className="h-6 w-6" />
      </div>
      <div>
        <div className={`text-[10px] font-bold uppercase tracking-[0.12em] opacity-80 mb-2 ${currentTheme.text}`}>{label}</div>
        <div className={`font-display text-4xl md:text-5xl font-semibold tracking-tight relative z-10 ${currentTheme.text}`}>{value}</div>
      </div>
    </div>
  );
}

export default function Evolution() {
  const { words } = useWordStore();
  const { flashcards } = useCardStore();
  const { config } = useConfig();
  const { xp, dailyStats, totals, achievements, errorPatterns = {} } = useProgressStore();

  const learningRange = useMemo(() => buildRange(90), []);
  const learningSeries = useMemo(() => buildLearningCurveSeries(dailyStats, learningRange), [dailyStats, learningRange]);
  const learningPath = useMemo(() => buildSmoothCurve(learningSeries, 700, 220), [learningSeries]);
  const learningYAxisLabels = useMemo(() => buildZeroBasedYAxisLabels(learningSeries), [learningSeries]);
  const learningXAxisLabels = useMemo(() => buildSpacedXAxisLabels(learningRange, 11), [learningRange]);

  const masteredSeries = useMemo(() => buildSnapshotSeries(dailyStats, buildRange(14)), [dailyStats]);
  const consistencyMap = useMemo(() => buildConsistencyMap(dailyStats), [dailyStats]);
  const retention = calculateRetentionRate(dailyStats, 7);
  const streak = calculateStreakStats(dailyStats, config.study?.minSessionMinutes ?? 5);
  const activeWords = totals.activeWords || words.filter((word) => word.status === 'ativa').length;
  const masteredWords = totals.masteredWords || words.filter((word) => word.status === 'dominada').length;
  const learnedWords = words.filter((word) => ['reconhecida', 'em_treino', 'ativa', 'dominada'].includes(word.status)).length;

  const skillValues = [
    Math.min(1, words.length / 25),
    Math.min(1, retention.rate / 100),
    Math.min(1, flashcards.length ? retention.rate / 100 : 0.08),
    Math.min(1, totals.productionWrites / 12),
    Math.min(1, streak.weeklyActive / 7),
  ];
  const skillPolygon = buildSkillPolygon(skillValues);
  const skillAxes = SKILL_LABELS.map((label, index) => buildSkillAxis(label, index, SKILL_LABELS.length));

  const funnel = [
    { label: 'Aprendido', value: learnedWords, tone: 'bg-neutral-200' },
    { label: 'Construção', value: totals.builderExercises, tone: 'bg-primary' },
    { label: 'Revisão', value: totals.flashcardReviews, tone: 'bg-warning' },
    { label: 'Dominadas', value: masteredWords, tone: 'bg-emerald-500' },
  ];
  const funnelMax = Math.max(1, ...funnel.map((item) => item.value));

  return (
    <div className="text-neutral-800 antialiased min-h-screen flex flex-col pt-0 lg:pt-0 pb-16">
      <main className="w-full mt-2 lg:mt-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={BookOpen} tone="blue" label="Palavras" value={words.length} />
          <StatCard icon={Sparkles} tone="terracotta" label="Experiência" value={`${xp} XP`} />
          <StatCard icon={Brain} tone="orange" label="Retenção" value={`${retention.rate}%`} />
          <StatCard icon={Shield} tone="green" label="Nível CEFR" value={config.userLevel} />
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70 flex flex-col relative overflow-hidden">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#CED1C6] bg-[#eef0ec] text-[#35403A]">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-heading text-neutral-900">Curva de Aprendizado</h3>
                  <p className="mt-1 text-base font-medium text-neutral-500">Evolução do seu XP de Domínio (Últimos 90 Dias)</p>
                </div>
              </div>
              <div className="rounded-full bg-neutral-50 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-900 border border-neutral-300 whitespace-nowrap">
                90 DIAS
              </div>
            </div>

            <div className="relative h-[320px] w-full">
              <div className="pointer-events-none absolute inset-y-4 left-0 flex flex-col justify-between text-[11px] font-semibold text-neutral-500">
                {learningYAxisLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-y-4 left-10 right-0 flex flex-col justify-between">
                {learningYAxisLabels.map((label) => (
                  <span key={label} className="border-t border-dashed border-neutral-200"></span>
                ))}
              </div>

              <div className="absolute inset-y-4 left-10 right-0">
                <svg viewBox="0 0 700 240" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                  <path d={learningPath} fill="none" stroke="#35403A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="pointer-events-none absolute bottom-0 left-10 right-0 flex justify-between gap-6 text-[11px] font-medium text-neutral-500">
                {learningXAxisLabels.map((day) => (
                  <span key={day.key} className="whitespace-nowrap first:text-left last:text-right">
                    {formatChartLabel(day.key)}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70 flex flex-col relative overflow-hidden">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#CED1C6] bg-[#eef0ec] text-[#35403A]">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-heading text-neutral-900">Mapa de Consistência</h3>
                  <p className="mt-1 text-base font-medium text-neutral-500">Sua frequência de estudos nos últimos 4 meses</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-[10px] font-bold text-neutral-500 tracking-[0.12em] whitespace-nowrap">
                <span>Menos XP</span>
                <div className="flex items-center gap-1.5">
                  {CONSISTENCY_LEVEL_STYLES.slice(1).map((style, index) => (
                    <span key={index} className={`h-3.5 w-3.5 rounded-full border ${style}`}></span>
                  ))}
                </div>
                <span>Mais XP</span>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[1040px]">
                <div
                  className="mb-4 grid items-end gap-2"
                  style={{ gridTemplateColumns: `32px repeat(${consistencyMap.weeks.length}, minmax(0, 1fr))` }}
                >
                  <div></div>
                  {consistencyMap.monthSegments.map((segment, index) => (
                    <div
                      key={`${segment.label}-${index}`}
                      className="text-sm font-medium text-neutral-500"
                      style={{ gridColumn: `span ${segment.span} / span ${segment.span}` }}
                    >
                      {segment.label}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <div className="grid grid-rows-7 items-center gap-2 pt-0.5 text-[11px] font-medium text-neutral-500">
                    {Array.from({ length: 7 }, (_, index) => (
                      <span key={index}>
                        {index === 1 ? 'Seg' : index === 3 ? 'Qua' : index === 5 ? 'Sex' : ''}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {consistencyMap.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-rows-7 gap-2">
                        {week.map((day, dayIndex) => (
                          day ? (
                            <span
                              key={day.key}
                              aria-label={formatConsistencyTooltip(day.date, day.value)}
                              className={`h-4 w-4 rounded-full border ${CONSISTENCY_LEVEL_STYLES[day.level]}`}
                              title={formatConsistencyTooltip(day.date, day.value)}
                            ></span>
                          ) : (
                            <span key={`empty-${weekIndex}-${dayIndex}`} className="h-4 w-4"></span>
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70 flex flex-col">
                  <div className="mb-6">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-1">Equilíbrio de Habilidades</div>
                    <h3 className="text-lg font-semibold font-heading text-neutral-900">Visão geral do desempenho</h3>
                  </div>

                  <div className="flex justify-center flex-1 items-center">
                    <svg viewBox="0 0 280 280" className="h-[260px] w-[260px] overflow-visible drop-shadow-sm">
                      {[0.25, 0.5, 0.75, 1].map((ratio) => (
                        <polygon
                          key={ratio}
                          points={buildSkillPolygon(Array(SKILL_LABELS.length).fill(ratio))}
                          fill="none"
                          stroke="rgba(53, 64, 58, 0.15)"
                          strokeWidth="1.5"
                          strokeDasharray={ratio < 1 ? "4 4" : "none"}
                        />
                      ))}

                      {skillAxes.map((axis) => (
                        <g key={axis.label}>
                          <line x1={SKILL_CENTER} y1={SKILL_CENTER} x2={axis.x} y2={axis.y} stroke="rgba(53, 64, 58, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
                          <text x={axis.labelX} y={axis.labelY} textAnchor={axis.textAnchor} dominantBaseline="middle" className="fill-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                            {axis.label}
                          </text>
                        </g>
                      ))}

                      <polygon points={skillPolygon} fill="rgba(53, 64, 58, 0.25)" stroke="#35403A" strokeWidth="4" strokeLinejoin="round" />

                      {skillValues.map((value, index) => {
                        const angle = (-Math.PI / 2) + ((Math.PI * 2) * index) / SKILL_LABELS.length;
                        const scaled = SKILL_RADIUS * value;
                        const x = SKILL_CENTER + Math.cos(angle) * scaled;
                        const y = SKILL_CENTER + Math.sin(angle) * scaled;
                        return <circle key={index} cx={x} cy={y} r={4} fill="#fff" stroke="#35403A" strokeWidth="2" />;
                      })}
                    </svg>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70 flex flex-col">
                  <div className="mb-8">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-1">Funil de Vocabulário</div>
                    <h3 className="text-lg font-semibold font-heading text-neutral-900">Métricas de transição</h3>
                  </div>

                  <div className="space-y-6 flex-1 flex flex-col justify-center">
                    {funnel.map((item) => {
                      const percentage = Math.max(6, (item.value / funnelMax) * 100);
                      const toneColor = {
                        'bg-neutral-200': 'bg-neutral-400',
                        'bg-primary': 'bg-[#35403A]',
                        'bg-warning': 'bg-[#647568]',
                        'bg-emerald-500': 'bg-emerald-500'
                      }[item.tone] || 'bg-[#35403A]';

                      return (
                        <div key={item.label} className="group">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-bold text-neutral-600 uppercase tracking-[0.12em] text-[10px]">{item.label}</span>
                            <strong className="font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200 text-xs">{item.value}</strong>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${toneColor} relative overflow-hidden`} style={{ width: `${percentage}%` }}>
                              <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70">
                <div className="mb-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-1">Marcos Históricos</div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#CED1C6] bg-[#eef0ec] text-[#647568]">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold font-heading text-neutral-900">Sua jornada</h3>
                  </div>
                </div>

                <p className="mb-8 text-neutral-500 font-medium leading-relaxed">
                  Continue praticando para desbloquear suas primeiras conquistas e ver seu histórico crescer.
                </p>

                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#dde2dc] before:z-0">
                  <div className={`relative z-10 rounded-xl border p-5 shadow-[0_1px_3px_rgba(20,20,19,0.06)] transition-transform hover:-translate-y-1 ${words.length > 0 ? 'border-emerald-200 bg-emerald-50' : 'border-neutral-200/70 bg-white'}`}>
                    <div className={`text-lg font-semibold mb-1 ${words.length > 0 ? 'text-emerald-700' : 'text-neutral-900'}`}>Primeiras palavras</div>
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.12em]">{words.length > 0 ? `${words.length} itens adicionados` : 'Adicione vocabulário'}</div>
                    {words.length > 0 && <div className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-100 border-4 border-white rounded-full flex items-center justify-center shadow-sm"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span></div>}
                  </div>

                  <div className={`relative z-10 rounded-xl border p-5 shadow-[0_1px_3px_rgba(20,20,19,0.06)] transition-transform hover:-translate-y-1 ${streak.currentStreak > 0 ? 'border-[#CED1C6] bg-[#eef0ec]' : 'border-neutral-200/70 bg-white'}`}>
                    <div className={`text-lg font-semibold mb-1 ${streak.currentStreak > 0 ? 'text-[#232625]' : 'text-neutral-900'}`}>Ofensiva iniciada</div>
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.12em]">{streak.currentStreak > 0 ? `${streak.currentStreak} dias seguidos` : 'Ative sua primeira streak'}</div>
                    {streak.currentStreak > 0 && <div className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#dde2dc] border-4 border-white rounded-full flex items-center justify-center shadow-sm"><span className="w-2.5 h-2.5 bg-[#647568] rounded-full"></span></div>}
                  </div>

                  <div className={`relative z-10 rounded-xl border p-5 shadow-[0_1px_3px_rgba(20,20,19,0.06)] transition-transform hover:-translate-y-1 ${achievements.length > 0 ? 'border-[#CED1C6] bg-[#eef0ec]' : 'border-neutral-200/70 bg-white'}`}>
                    <div className={`text-lg font-semibold mb-1 ${achievements.length > 0 ? 'text-[#232625]' : 'text-neutral-900'}`}>Conquista liberada</div>
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.12em]">{achievements.length > 0 ? `${achievements.length} emblemas` : 'Cumpra desafios'}</div>
                    {achievements.length > 0 && <div className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#dde2dc] border-4 border-white rounded-full flex items-center justify-center shadow-sm"><span className="w-2.5 h-2.5 bg-[#647568] rounded-full"></span></div>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-6">Insights rápidos</div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-5 shadow-[0_1px_3px_rgba(20,20,19,0.06)] transition-shadow">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#35403A] mb-2">Vocabulário ativo</div>
                    <div className="text-3xl font-semibold tracking-tight text-neutral-900">{activeWords}</div>
                  </div>
                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-5 shadow-[0_1px_3px_rgba(20,20,19,0.06)] transition-shadow">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 mb-2">Dominadas</div>
                    <div className="text-3xl font-semibold tracking-tight text-neutral-900">{masteredWords}</div>
                  </div>
                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-5 shadow-[0_1px_3px_rgba(20,20,19,0.06)] transition-shadow">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#35403A] mb-2">Retenção semanal</div>
                    <div className="text-3xl font-semibold tracking-tight text-neutral-900">{retention.rate}%</div>
                  </div>
                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-5 shadow-[0_1px_3px_rgba(20,20,19,0.06)] transition-shadow">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#647568] mb-2">Dominadas 14d</div>
                    <div className="text-3xl font-semibold tracking-tight text-neutral-900">{masteredSeries.at(-1) ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Error Patterns Section */}
        {Object.keys(errorPatterns).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold font-heading text-neutral-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#647568]" />
              Seus pontos fracos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(errorPatterns)
                .sort(([, a], [, b]) => b.count - a.count)
                .slice(0, 6)
                .map(([category, data]) => {
                  const labels = {
                    word_order: { name: 'Ordem das palavras', icon: BoltIcon, bg: 'bg-[#eef0ec]', border: 'border-[#CED1C6]', text: 'text-[#232625]' },
                    verb_tense: { name: 'Tempos verbais', icon: ClockIcon, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
                    preposition: { name: 'Preposições', icon: MapIcon, bg: 'bg-[#eef0ec]', border: 'border-[#CED1C6]', text: 'text-[#232625]' },
                    article: { name: 'Artigos (a/an/the)', icon: PencilIcon, bg: 'bg-[#eef0ec]', border: 'border-[#CED1C6]', text: 'text-[#647568]' },
                    spelling: { name: 'Ortografia', icon: WriteIcon, bg: 'bg-[#eef0ec]', border: 'border-[#CED1C6]', text: 'text-[#35403A]' },
                    vocabulary: { name: 'Vocabulário', icon: BookOpenIcon, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                    plural_singular: { name: 'Plural/Singular', icon: GridIcon, bg: 'bg-[#eef0ec]', border: 'border-[#CED1C6]', text: 'text-[#647568]' },
                    pronoun: { name: 'Pronomes', icon: UserCircleIcon, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
                    conjunction: { name: 'Conjunções', icon: LayersIcon, bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
                    other: { name: 'Outros', icon: SearchIcon, bg: 'bg-neutral-50', border: 'border-neutral-200', text: 'text-neutral-700' },
                  };
                  const meta = labels[category] || labels.other;
                  const ErrorIcon = meta.icon;

                  return (
                    <div key={category} className={`${meta.bg} ${meta.border} border rounded-xl p-5 flex flex-col gap-2`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ErrorIcon size={18} />
                          <span className={`text-sm font-semibold ${meta.text}`}>{meta.name}</span>
                        </div>
                        <span className="text-2xl font-semibold text-neutral-900">{data.count}</span>
                      </div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">
                        {data.count === 1 ? '1 erro' : `${data.count} erros`} · {(data.words || []).length} {(data.words || []).length === 1 ? 'palavra' : 'palavras'}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
