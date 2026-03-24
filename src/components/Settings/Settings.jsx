import { useEffect, useRef, useState } from 'react';
import { useConfig } from '../../store/useConfig.js';
import { callOpenAI } from '../../services/openai.js';
import { callGemini } from '../../services/gemini.js';
import { useCardStore } from '../../store/useCardStore.js';
import { DEFAULT_MISSIONS, MISSION_META } from '../../constants/learning.js';
import { calculateStreakStats, getDayKey, useProgressStore } from '../../store/useProgressStore.js';
import { useUiStore } from '../../store/useUiStore.js';
import { storage } from '../../utils/storage.js';
import PageHeader from '../shared/PageHeader.jsx';
import { BrainIcon, BoltIcon, GridIcon, SettingsIcon, SparkIcon } from '../shared/icons.jsx';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const OAI_MODELS = ['gpt-5.4-nano', 'gpt-5-mini', 'gpt-5-nano', 'gpt-5.2', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-4o-mini', 'gpt-4o'];
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

/* ── shared tailwind fragments ── */
const cls = {
  card: 'bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 md:p-8',
  sectionTitle: 'text-lg font-semibold font-heading text-neutral-900 mb-4',
  sectionLabel: 'text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]',
  btnPrimary: 'inline-flex items-center justify-center bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
  btnOutline: 'inline-flex items-center justify-center border border-neutral-300 rounded-full px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
  btnOutlineSm: 'inline-flex items-center justify-center border border-neutral-300 rounded-full px-4 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer',
  input: 'w-full px-4 py-3 rounded-xl border border-neutral-200/70 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#647568] focus:ring-2 focus:ring-[#35403A]/15 focus:outline-none transition-colors',
  inputLabel: 'block mb-2 text-xs font-semibold text-neutral-500',
  pill: 'min-h-[42px] px-4 rounded-full border border-neutral-200/70 bg-white text-sm font-medium text-neutral-600 cursor-pointer transition-colors hover:bg-neutral-50',
  pillActive: 'min-h-[42px] px-4 rounded-full border border-[#35403A]/20 bg-[#eef0ec] text-sm font-semibold text-neutral-900 cursor-pointer transition-colors',
  tab: 'inline-flex items-center gap-2 min-h-[42px] px-4 rounded-full border border-neutral-200/70 bg-white text-sm font-medium text-neutral-600 cursor-pointer transition-colors hover:bg-neutral-50',
  tabActive: 'inline-flex items-center gap-2 min-h-[42px] px-4 rounded-full border border-[#35403A]/20 bg-[#eef0ec] text-sm font-semibold text-neutral-900 cursor-pointer transition-colors',
  statCard: 'bg-white rounded-xl border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-5 text-center',
  statVal: 'text-2xl font-bold font-heading text-neutral-900',
  statLabel: 'mt-1 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]',
};

function StatusDot({ status }) {
  const color = status === 'ok' ? '#10B981' : status === 'error' ? '#EF4444' : '#F59E0B';
  return <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: color }} />;
}

export default function Settings() {
  const fileInputRef = useRef(null);
  const { config, setConfig, setAI } = useConfig();
  const { flashcards } = useCardStore();
  const { xp, level, dailyStats, totals, achievements, autoAdjustMeta, resetProgress } = useProgressStore();
  const { publishMilestone, pushToast } = useUiStore();

  const [testStatus, setTestStatus] = useState(null);
  const [testMsg, setTestMsg] = useState('');
  const [tab, setTab] = useState('essential');
  const [banner, setBanner] = useState(null);
  const [form, setForm] = useState({
    provider: config.provider || '',
    openaiKey: config.openaiKey || '',
    openaiModel: config.openaiModel || 'gpt-5.4-nano',
    geminiKey: config.geminiKey || '',
    geminiModel: config.geminiModel || 'gemini-2.0-flash',
  });

  const todayStats = dailyStats[getDayKey()] || {};
  const streakStats = calculateStreakStats(dailyStats, config.study?.minSessionMinutes ?? 5);
  const usageBytes = storage.getUsage();
  const usageKB = (usageBytes / 1024).toFixed(1);
  const usagePct = Math.round((usageBytes / (5 * 1024 * 1024)) * 100);

  const save = () => {
    setAI(
      form.provider,
      form.provider === 'openai' ? form.openaiKey : form.geminiKey,
      form.provider === 'openai' ? form.openaiModel : form.geminiModel
    );
    setTestStatus(null);
    setBanner({ type: 'success', text: 'Configuracoes salvas localmente.' });
    pushToast({
      kind: 'success',
      source: 'settings',
      title: 'Configuracoes salvas',
      description: 'Seu setup foi atualizado no navegador.',
    });
  };

  const test = async () => {
    setTestStatus('testing');
    setTestMsg('');
    try {
      let response;
      if (form.provider === 'openai') {
        response = await callOpenAI({
          apiKey: form.openaiKey,
          model: form.openaiModel,
          systemPrompt: 'You are a helper.',
          userPrompt: 'Reply: OK',
        });
      } else {
        response = await callGemini({
          apiKey: form.geminiKey,
          model: form.geminiModel,
          systemPrompt: 'You are a helper.',
          userPrompt: 'Reply: OK',
        });
      }

      setTestStatus('ok');
      setTestMsg(`Conexao confirmada: ${response.slice(0, 40)}`);
      pushToast({
        kind: 'success',
        source: 'settings',
        title: 'Conexao validada',
        description: 'O provedor respondeu ao teste.',
      });
    } catch (error) {
      setTestStatus('error');
      setTestMsg(error.message);
      pushToast({
        kind: 'error',
        source: 'settings',
        title: 'Falha no teste',
        description: error.message,
      });
    }
  };

  const exportBackup = () => {
    const data = storage.exportAll();
    const anchor = document.createElement('a');
    anchor.href = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
    anchor.download = 'langflow-backup.json';
    anchor.click();

    publishMilestone({
      kind: 'success',
      source: 'settings',
      title: 'Backup exportado',
      description: 'Seus dados locais foram baixados em JSON.',
    });
  };

  const importBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        storage.importAll(loadEvent.target?.result);
        publishMilestone({
          kind: 'success',
          source: 'settings',
          title: 'Backup importado',
          description: 'Os dados foram carregados. A pagina sera atualizada.',
        });
        setBanner({ type: 'success', text: 'Backup importado com sucesso. Atualizando a aplicacao...' });
        window.setTimeout(() => window.location.reload(), 250);
      } catch {
        setBanner({ type: 'error', text: 'Arquivo invalido. Use um backup JSON gerado pelo LangFlow.' });
        pushToast({
          kind: 'error',
          source: 'settings',
          title: 'Importacao falhou',
          description: 'O arquivo nao pode ser lido como backup valido.',
        });
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleResetProgress = () => {
    resetProgress();
    publishMilestone({
      kind: 'info',
      source: 'settings',
      title: 'Gamificacao reiniciada',
      description: 'XP, streak e missoes foram limpos sem apagar palavras ou cards.',
    });
  };

  useEffect(() => {
    const handlePageAction = (event) => {
      if (event.detail?.action === 'settings-primary') {
        save();
      }
    };

    window.addEventListener('langflow:page-action', handlePageAction);
    return () => window.removeEventListener('langflow:page-action', handlePageAction);
  }, [form]);

  return (
    <div className="text-neutral-800 antialiased min-h-screen flex flex-col pt-0 lg:pt-0 pb-16">
      <main className="w-full mt-2 lg:mt-4">
        <div className="page-content settings-page">
          {/* ── Tabs ── */}
          <div className="flex gap-2.5 flex-wrap mb-6">
          {[
            ['essential', 'Essencial', <GridIcon key="essential" size={16} />],
            ['ai', 'IA', <SparkIcon key="ai" size={16} />],
            ['study', 'Estudo & SRS', <BrainIcon key="study" size={16} />],
            ['data', 'Dados & progresso', <BoltIcon key="data" size={16} />],
          ].map(([key, label, icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={tab === key ? cls.tabActive : cls.tab}
            >
              <span className="w-4 h-4 inline-grid place-items-center">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {banner ? (
          <div className={`rounded-xl px-4 py-3 text-sm mb-6 ${banner.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : banner.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#eef0ec] text-neutral-700 border border-neutral-200'}`}>
            {banner.text}
          </div>
        ) : null}

        {/* ── Essential tab ── */}
        {tab === 'essential' ? (
          <div className="grid gap-5 md:grid-cols-2">
            <div className={cls.card}>
              <h3 className={cls.sectionTitle}>Nivel atual</h3>
              <div className="flex gap-2.5 flex-wrap mb-4">
                {LEVELS.map((levelOption) => (
                  <button
                    key={levelOption}
                    type="button"
                    onClick={() => setConfig({ userLevel: levelOption })}
                    className={config.userLevel === levelOption ? cls.pillActive : cls.pill}
                  >
                    {levelOption}
                  </button>
                ))}
              </div>
              <div className="text-xs text-neutral-500">
                Sessao minima: {config.study?.minSessionMinutes ?? 5} min · Cards por dia: {config.srs?.dailyLimit ?? 20}
              </div>
            </div>

            <div className={cls.card}>
              <h3 className={cls.sectionTitle}>Controles frequentes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cls.inputLabel}>Cards por dia</label>
                  <input
                    className={cls.input}
                    type="number"
                    min={5}
                    max={200}
                    value={config.srs?.dailyLimit ?? 20}
                    onChange={(event) => setConfig({ srs: { ...config.srs, dailyLimit: Number(event.target.value) } })}
                  />
                </div>
                <div>
                  <label className={cls.inputLabel}>Palavras por sessao</label>
                  <input
                    className={cls.input}
                    type="number"
                    min={1}
                    max={10}
                    value={config.builder?.sessionWordLimit ?? 5}
                    onChange={(event) => setConfig({ builder: { ...config.builder, sessionWordLimit: Number(event.target.value) } })}
                  />
                </div>
                <div>
                  <label className={cls.inputLabel}>Palavras no prompt diario</label>
                  <input
                    className={cls.input}
                    type="number"
                    min={1}
                    max={10}
                    value={config.builder?.dailyPromptWords ?? 3}
                    onChange={(event) => setConfig({ builder: { ...config.builder, dailyPromptWords: Number(event.target.value) } })}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── AI tab ── */}
        {tab === 'ai' ? (
          <div>
            <div className={`${cls.card} mb-5`}>
              <h3 className={cls.sectionTitle}>Provedor de IA</h3>
              <div className="flex gap-2.5 flex-wrap mb-5">
                {[['openai', 'OpenAI'], ['gemini', 'Gemini'], ['', 'Sem IA']].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, provider: key }))}
                    className={form.provider === key ? cls.pillActive : cls.pill}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {form.provider === 'openai' ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={cls.inputLabel}>API key OpenAI</label>
                    <input
                      className={cls.input}
                      type="password"
                      placeholder="sk-proj-..."
                      value={form.openaiKey}
                      onChange={(event) => setForm((current) => ({ ...current, openaiKey: event.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={cls.inputLabel}>Modelo</label>
                    <select
                      className={cls.input}
                      value={form.openaiModel}
                      onChange={(event) => setForm((current) => ({ ...current, openaiModel: event.target.value }))}
                    >
                      {OAI_MODELS.map((model) => <option key={model} value={model}>{model}</option>)}
                    </select>
                  </div>
                </div>
              ) : null}

              {form.provider === 'gemini' ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={cls.inputLabel}>API key Gemini</label>
                    <input
                      className={cls.input}
                      type="password"
                      placeholder="AIza..."
                      value={form.geminiKey}
                      onChange={(event) => setForm((current) => ({ ...current, geminiKey: event.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={cls.inputLabel}>Modelo</label>
                    <select
                      className={cls.input}
                      value={form.geminiModel}
                      onChange={(event) => setForm((current) => ({ ...current, geminiModel: event.target.value }))}
                    >
                      {GEMINI_MODELS.map((model) => <option key={model} value={model}>{model}</option>)}
                    </select>
                  </div>
                </div>
              ) : null}

              {!form.provider ? (
                <div className="rounded-xl px-4 py-3 text-sm bg-[#eef0ec] text-neutral-700 border border-neutral-200">Sem IA configurada. Reader e Builder vao usar fallback local.</div>
              ) : null}

              <div className="flex gap-3 mt-5">
                <button className={cls.btnPrimary} onClick={save}>Salvar</button>
                {form.provider ? (
                  <button className={cls.btnOutline} onClick={test} disabled={testStatus === 'testing'}>
                    {testStatus === 'testing' ? 'Testando...' : 'Testar conexao'}
                  </button>
                ) : null}
              </div>

              {testStatus && testStatus !== 'testing' ? (
                <div className={`rounded-xl px-4 py-3 text-sm mt-4 ${testStatus === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  <StatusDot status={testStatus} /> {testMsg}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ── Study tab ── */}
        {tab === 'study' ? (
          <div className="flex flex-col gap-5">
            <div className={cls.card}>
              <h3 className={cls.sectionTitle}>Pratica e SRS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cls.inputLabel}>Variacoes por palavra</label>
                  <input
                    className={cls.input}
                    type="number"
                    min={1}
                    max={3}
                    value={config.builder?.phrasesPerWord ?? 3}
                    onChange={(event) => setConfig({ builder: { ...config.builder, phrasesPerWord: Number(event.target.value) } })}
                  />
                </div>
                <div>
                  <label className={cls.inputLabel}>Peso de palavras dificeis (%)</label>
                  <input
                    className={cls.input}
                    type="number"
                    min={0}
                    max={100}
                    value={config.builder?.difficultWordsWeight ?? 30}
                    onChange={(event) => setConfig({ builder: { ...config.builder, difficultWordsWeight: Number(event.target.value) } })}
                  />
                </div>
                <div className="col-span-2">
                  <label className={cls.inputLabel}>Modo Preferido (Builder)</label>
                  <select
                     className={cls.input}
                     value={config.builder?.preferredMode || 'mixed'}
                     onChange={(event) => setConfig({ builder: { ...config.builder, preferredMode: event.target.value } })}
                  >
                     <option value="mixed">Misto (Montagem, Transform e Cloze)</option>
                     <option value="assembly">Apenas Montagem</option>
                     <option value="transform">Apenas Transformacao</option>
                     <option value="cloze">Apenas Lacunas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={cls.card}>
              <h3 className={cls.sectionTitle}>Missoes e ritmo</h3>
              <div className="flex flex-col gap-4">
                {MISSION_META.map(({ key, label, icon }) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[13px] font-semibold text-neutral-900">{icon} {label}</div>
                      <div className="text-xs text-neutral-500">
                        hoje: {todayStats[key] || 0} / {config.missions?.[key] ?? DEFAULT_MISSIONS[key]}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={key === 'flashcardReviews' ? 30 : 12}
                        value={config.missions?.[key] ?? DEFAULT_MISSIONS[key]}
                        onChange={(event) => setConfig({ missions: { ...config.missions, [key]: Number(event.target.value) } })}
                        className="flex-1"
                        style={{ accentColor: '#35403A' }}
                      />
                      <span className="text-sm font-semibold text-neutral-700 w-6 text-right">{config.missions?.[key] ?? DEFAULT_MISSIONS[key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cls.card}>
              <h3 className={cls.sectionTitle}>Streak e auto-ajuste</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cls.inputLabel}>Sessao minima para contar streak</label>
                  <input
                    className={cls.input}
                    type="number"
                    min={1}
                    max={60}
                    value={config.study?.minSessionMinutes ?? 5}
                    onChange={(event) => setConfig({ study: { ...config.study, minSessionMinutes: Number(event.target.value) } })}
                  />
                </div>
                <div>
                  <label className={cls.inputLabel}>Auto-ajuste</label>
                  <button
                    type="button"
                    className={config.autoAdjustDifficulty ? cls.pillActive : cls.pill}
                    onClick={() => setConfig({ autoAdjustDifficulty: !config.autoAdjustDifficulty })}
                  >
                    {config.autoAdjustDifficulty ? 'Ativado' : 'Desativado'}
                  </button>
                </div>
              </div>

              <div className="text-xs text-neutral-500 mt-3">
                Ultimo ajuste: {autoAdjustMeta?.toLevel ? `${autoAdjustMeta.fromLevel} -> ${autoAdjustMeta.toLevel}` : 'nenhum ajuste ainda'}
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Data tab ── */}
        {tab === 'data' ? (
          <div>
            <div className={`${cls.card} mb-5`}>
              <h3 className={cls.sectionTitle}>Uso local e progresso</h3>
              <div className="text-sm text-neutral-500 mb-2.5">
                Uso: <strong className="text-neutral-900">{usageKB} KB</strong> de ~5000 KB ({usagePct}%)
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#35403A] transition-all" style={{ width: `${Math.min(usagePct, 100)}%`, background: usagePct > 80 ? '#EF4444' : undefined }} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-5">
                <div className={cls.statCard}><div className={cls.statVal}>{level}</div><div className={cls.statLabel}>Nivel</div></div>
                <div className={cls.statCard}><div className={cls.statVal}>{xp}</div><div className={cls.statLabel}>XP</div></div>
                <div className={cls.statCard}><div className={cls.statVal}>{streakStats.currentStreak}</div><div className={cls.statLabel}>Streak</div></div>
                <div className={cls.statCard}><div className={cls.statVal}>{flashcards.length}</div><div className={cls.statLabel}>Cards</div></div>
                <div className={cls.statCard}><div className={cls.statVal}>{achievements.length}</div><div className={cls.statLabel}>Conquistas</div></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className={cls.card}>
                  <div className={`${cls.sectionLabel} mb-3`}>Colecoes</div>
                  <div className="flex flex-col gap-2.5">
                    {[
                      ['Palavras lidas', totals.readerWords],
                      ['Exercicios builder', totals.builderExercises],
                      ['Cards salvos', totals.savedCards],
                      ['Revisoes', totals.flashcardReviews],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center text-sm">
                        <span className="text-neutral-600">{label}</span>
                        <strong className="text-neutral-900">{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cls.card}>
                  <div className={`${cls.sectionLabel} mb-3`}>Backup e reset</div>
                  <div className="flex gap-2.5 flex-wrap">
                    <button className={cls.btnOutlineSm} onClick={exportBackup}>Exportar backup</button>
                    <button className={cls.btnOutlineSm} onClick={() => fileInputRef.current?.click()}>Importar backup</button>
                    <button className={cls.btnOutlineSm} onClick={handleResetProgress}>Resetar gamificacao</button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={importBackup}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      </main>
    </div>
  );
}
