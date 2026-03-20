import { useState } from 'react';
import { useConfig } from '../../store/useConfig.js';
import { useWordStore } from '../../store/useWordStore.js';
import { getSeedEntriesForLevel } from '../../data/ngslSeed.js';
import { SparkIcon, BookIcon } from './icons.jsx';

const LEVELS = [
    { id: 'A1', label: 'A1 — Iniciante', desc: 'Palavras básicas do dia a dia' },
    { id: 'A2', label: 'A2 — Elementar', desc: 'Frases simples e situações comuns' },
    { id: 'B1', label: 'B1 — Intermediário', desc: 'Conversas sobre temas familiares' },
    { id: 'B2', label: 'B2 — Avançado', desc: 'Textos complexos e argumentação' },
    { id: 'C1', label: 'C1 — Proficiente', desc: 'Fluência quase nativa' },
];

export default function Onboarding({ onComplete }) {
    const { setConfig } = useConfig();
    const { importSeedWords } = useWordStore();
    const [step, setStep] = useState(0);
    const [selectedLevel, setSelectedLevel] = useState('B1');
    const [apiKey, setApiKey] = useState('');
    const [provider, setProvider] = useState('openai');
    const [skipAI, setSkipAI] = useState(false);

    const handleFinish = () => {
        // Save level
        const updates = { userLevel: selectedLevel, onboardingDone: true };

        // Save AI config if provided
        if (!skipAI && apiKey.trim()) {
            updates.provider = provider;
            if (provider === 'openai') {
                updates.openaiKey = apiKey.trim();
            } else {
                updates.geminiKey = apiKey.trim();
            }
        }

        setConfig(updates);

        // Seed NGSL words for the selected level (cumulative through that level)
        const entries = getSeedEntriesForLevel(selectedLevel, { through: true });
        importSeedWords(entries);

        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 w-full max-w-lg overflow-hidden relative">

                {/* Close button */}
                <button
                    onClick={() => { setConfig({ onboardingDone: true }); onComplete(); }}
                    className="absolute top-5 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors z-10"
                    aria-label="Fechar"
                    title="Pular configuração"
                >
                    ✕
                </button>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 pt-8 pb-2">
                    {[0, 1, 2].map((s) => (
                        <div
                            key={s}
                            className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-violet-600' : s < step ? 'w-2 bg-violet-300' : 'w-2 bg-neutral-200'}`}
                        />
                    ))}
                </div>

                <div className="p-8 pt-6">

                    {/* Step 0: Welcome */}
                    {step === 0 && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <BookIcon size={36} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">
                                Bem-vindo ao LangFlow
                            </h2>
                            <p className="text-neutral-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                Aprenda inglês lendo textos reais, praticando com exercícios inteligentes e revisando com repetição espaçada.
                            </p>
                            <button
                                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                onClick={() => setStep(1)}
                            >
                                <SparkIcon size={18} />
                                Começar configuração
                            </button>
                        </div>
                    )}

                    {/* Step 1: Level selection */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-extrabold text-neutral-900 mb-2 tracking-tight">
                                Qual seu nível de inglês?
                            </h2>
                            <p className="text-neutral-500 mb-6 text-sm">
                                Isso ajusta a dificuldade dos exercícios e o vocabulário inicial.
                            </p>
                            <div className="flex flex-col gap-2 mb-8">
                                {LEVELS.map((level) => (
                                    <button
                                        key={level.id}
                                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedLevel === level.id
                                                ? 'border-violet-500 bg-violet-50 shadow-sm'
                                                : 'border-neutral-100 bg-white hover:border-neutral-200 hover:bg-neutral-50'
                                            }`}
                                        onClick={() => setSelectedLevel(level.id)}
                                    >
                                        <div className="font-bold text-neutral-900 text-sm">{level.label}</div>
                                        <div className="text-xs text-neutral-500 mt-0.5">{level.desc}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    className="px-6 py-3 rounded-xl font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                                    onClick={() => setStep(0)}
                                >
                                    Voltar
                                </button>
                                <button
                                    className="flex-1 bg-neutral-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all"
                                    onClick={() => setStep(2)}
                                >
                                    Próximo →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: AI Config (optional) */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-extrabold text-neutral-900 mb-2 tracking-tight">
                                Configure a IA <span className="text-neutral-400 font-normal text-lg">(opcional)</span>
                            </h2>
                            <p className="text-neutral-500 mb-6 text-sm">
                                A IA gera explicações contextuais e avalia suas respostas. Sem ela, o app usa fallback local.
                            </p>

                            {!skipAI ? (
                                <>
                                    <div className="flex gap-2 mb-4">
                                        {['openai', 'gemini'].map((p) => (
                                            <button
                                                key={p}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${provider === p
                                                        ? 'bg-neutral-900 text-white border-neutral-900'
                                                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                                                    }`}
                                                onClick={() => setProvider(p)}
                                            >
                                                {p === 'openai' ? 'OpenAI' : 'Gemini'}
                                            </button>
                                        ))}
                                    </div>

                                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2 block">
                                        API Key {provider === 'openai' ? 'OpenAI' : 'Google Gemini'}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 rounded-xl text-sm transition-all outline-none mb-4"
                                        placeholder={provider === 'openai' ? 'sk-proj-...' : 'AIza...'}
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />

                                    <button
                                        className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 underline underline-offset-4 mb-6 block"
                                        onClick={() => setSkipAI(true)}
                                    >
                                        Pular — usar sem IA por enquanto
                                    </button>
                                </>
                            ) : (
                                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 mb-6 text-center">
                                    <p className="text-sm text-neutral-600 font-medium mb-3">
                                        Sem IA configurada. Você pode adicionar depois em Configurações.
                                    </p>
                                    <button
                                        className="text-xs font-semibold text-violet-600 hover:text-violet-800 underline underline-offset-4"
                                        onClick={() => setSkipAI(false)}
                                    >
                                        Voltar atrás — quero configurar
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    className="px-6 py-3 rounded-xl font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                                    onClick={() => setStep(1)}
                                >
                                    Voltar
                                </button>
                                <button
                                    className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                                    onClick={handleFinish}
                                >
                                    <SparkIcon size={16} />
                                    Começar a aprender
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
