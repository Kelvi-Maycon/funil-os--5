import { useMemo, useState } from 'react';
import { BookOpen, Download, Search, Sparkles, Trash2, Upload, WandSparkles } from 'lucide-react';
import { CheckCircleIcon, RecycleIcon } from '../shared/icons.jsx';
import { useConfig } from '../../store/useConfig.js';
import { useWordStore } from '../../store/useWordStore.js';
import { getSeedEntriesForLevel } from '../../data/ngslSeed.js';
import { WORD_STATUS_META } from '../../constants/learning.js';
import PageHeader from '../shared/PageHeader.jsx';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';

function StatCard({ label, value, tone = 'default' }) {
  const toneMap = {
    default: { bg: 'bg-white', icon: 'bg-neutral-50 text-neutral-400 border-neutral-100', text: 'text-neutral-900' },
    warm: { bg: 'bg-[#35403A]', icon: 'bg-white/10 text-white border-white/10', text: 'text-white' },
    terracotta: { bg: 'bg-[#35403A]', icon: 'bg-white/10 text-white border-white/10', text: 'text-white' },
    orange: { bg: 'bg-[#647568]', icon: 'bg-white/10 text-white border-white/10', text: 'text-white' },
  };

  const currentTheme = toneMap[tone];

  return (
    <div className={`${currentTheme.bg} rounded-xl p-6 lg:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border ${tone === 'default' ? 'border-neutral-200/70' : 'border-transparent'} flex flex-col justify-between relative overflow-hidden group`}>
      {tone !== 'default' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
      )}
      <div className={`text-[10px] font-bold uppercase tracking-[0.12em] mb-4 opacity-80 ${currentTheme.text}`}>{label}</div>
      <div className={`text-4xl md:text-5xl font-semibold ${currentTheme.text} relative z-10`}>{value}</div>
    </div>
  );
}

function VocabularyRow({ word, onRemove }) {
  return (
    <div className="bg-white rounded-xl p-5 md:p-6 border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] hover:border-[#CED1C6] transition-all group flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 group-hover:text-[#232625] transition-colors">{word.word}</div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500 border border-neutral-200/60">
              {word.entryType === 'collocation' ? 'Collocation' : 'Word'}
            </span>
            <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] border ${WORD_STATUS_META[word.status].badgeClass}`}>
              {WORD_STATUS_META[word.status].label}
            </span>
            {word.cefrLevel && (
              <span className="rounded-md bg-[#eef0ec] border border-[#CED1C6]/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#35403A]">
                {word.cefrLevel}
              </span>
            )}
          </div>
        </div>

        <button className="text-[11px] font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 self-start" onClick={() => onRemove(word.id)}>
          <Trash2 className="h-3.5 w-3.5" /> Remover
        </button>
      </div>

      <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-sm font-medium text-neutral-600">
        {word.originalSentence
          ? `${word.originalSentence.slice(0, 180)}${word.originalSentence.length > 180 ? '...' : ''}`
          : 'Sem frase de contexto salva ainda.'}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 font-semibold pt-2 border-t border-neutral-50/80">
        <span className="uppercase tracking-[0.12em] text-[10px]">{word.source || 'manual'}{word.isSeeded ? ' · seeded' : ''}</span>
        <strong className="font-bold text-neutral-600 bg-white px-2 py-1 rounded-md border border-neutral-100 shadow-[0_1px_3px_rgba(20,20,19,0.06)] flex items-center gap-1"><CheckCircleIcon size={12} className="text-green-500" /> {word.correctCount ?? word.dragCorrectCount ?? 0} <span className="mx-1 opacity-30 text-neutral-300">|</span> <RecycleIcon size={12} className="text-red-500" /> {word.errorCount ?? word.dragWrongCount ?? 0}</strong>
      </div>
    </div>
  );
}

export default function Vocabulary() {
  const { config } = useConfig();
  const {
    words,
    addWord,
    addManyWords,
    importSeedWords,
    removeUnstudiedSeedWords,
    removeWord,
  } = useWordStore();

  const [newWord, setNewWord] = useState('');
  const [bulkWords, setBulkWords] = useState('');
  const [bulkFeedback, setBulkFeedback] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [entryType, setEntryType] = useState('word');

  const collocationCount = useMemo(() => words.filter((item) => item.entryType === 'collocation').length, [words]);
  const seededCount = useMemo(() => words.filter((item) => item.isSeeded).length, [words]);

  const filteredWords = useMemo(
    () => words.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (search && !item.word.includes(search.toLowerCase())) return false;
      return true;
    }),
    [filter, search, words]
  );

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    addWord(newWord.trim(), { entryType, tag: 'manual', source: 'manual' });
    setNewWord('');
  };

  const handleBulkAdd = () => {
    const entries = bulkWords
      .split(/[\n,]+/)
      .map((word) => word.trim())
      .filter(Boolean);

    if (entries.length === 0) {
      setBulkFeedback({ type: 'warning', text: 'Nenhuma palavra válida encontrada para importar.' });
      return;
    }

    const result = addManyWords(entries, {
      tag: 'bulk',
      entryType,
      source: 'manual',
    });

    setBulkFeedback({
      type: result.added > 0 ? 'success' : 'warning',
      text: `${result.added} adicionadas · ${result.skipped} ignoradas por duplicidade ou valor vazio.`,
    });

    if (result.added > 0) setBulkWords('');
  };

  const handleSeedImport = async (through = false) => {
    const entries = getSeedEntriesForLevel(config.userLevel, { through });
    const result = importSeedWords(entries);

    if (result.added === 0) {
      setBulkFeedback({
        type: 'warning',
        text: `${result.added} itens seed importados · ${result.skipped} ignorados.`,
      });
      return;
    }

    const baseText = through
      ? `${result.added} itens seed importados até ${config.userLevel} · ${result.skipped} ignorados.`
      : `${result.added} itens seed importados para ${config.userLevel} · ${result.skipped} ignorados.`;

    if (config?.provider) {
      setBulkFeedback({ type: 'success', text: `${baseText} Gerando frases de contexto...` });

      try {
        const { generateSeedContextSentences } = await import('../../services/ai.js');
        const newWords = entries.map(e => e.text).filter(Boolean);
        const contextMap = await generateSeedContextSentences({
          words: newWords,
          cefrLevel: config.userLevel,
          config,
        });

        const { words: currentWords, updateWord } = useWordStore.getState();
        let updated = 0;
        currentWords.forEach(w => {
          const ctx = contextMap[w.word?.toLowerCase()];
          if (ctx?.english && !w.originalSentence) {
            updateWord(w.id, { originalSentence: ctx.english });
            updated++;
          }
        });

        setBulkFeedback({
          type: 'success',
          text: `${baseText} ${updated} frases de contexto geradas.`,
        });
      } catch (err) {
        console.error('Seed context generation failed:', err);
        setBulkFeedback({
          type: 'warning',
          text: `${baseText} Erro ao gerar frases de contexto.`,
        });
      }
    } else {
      setBulkFeedback({
        type: 'success',
        text: `${baseText} Configure IA para gerar frases de contexto.`,
      });
    }
  };

  const handleClearSeed = () => {
    const removed = removeUnstudiedSeedWords();
    setBulkFeedback({
      type: removed > 0 ? 'success' : 'warning',
      text: removed > 0
        ? `${removed} itens seed sem progresso foram removidos.`
        : 'Nenhum item seed sem progresso para remover.',
    });
  };

  return (
        <div className="text-neutral-800 antialiased min-h-screen flex flex-col pt-0 lg:pt-0 pb-16">
            <main className="w-full mt-2 lg:mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard label="Itens no banco" value={words.length} tone="default" />
                    <StatCard label="Seed NGSL" value={seededCount} tone="warm" />
                    <StatCard label="Collocations" value={collocationCount} tone="terracotta" />
                    <StatCard label="Ativas" value={words.filter((item) => item.status === 'ativa').length} tone="orange" />
                </div>

                <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)]">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#eef0ec] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1 relative z-10">Adicionar manualmente</div>
                            <h3 className="text-lg font-semibold font-heading text-neutral-900 mb-6 relative z-10">Entrada rápida</h3>

                            <div className="space-y-4 relative z-10">
                                <Input
                                    className="w-full bg-neutral-50/50 border-neutral-200 focus:border-[#647568] focus:ring-2 focus:ring-[#35403A]/15 rounded-xl px-4 py-3"
                                    placeholder="Adicionar palavra ou expressão..."
                                    value={newWord}
                                    onChange={(event) => setNewWord(event.target.value)}
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter') handleAddWord();
                                    }}
                                />

                                <select className="w-full bg-neutral-50/50 border border-neutral-200 focus:border-[#647568] focus:ring-2 focus:ring-[#35403A]/15 rounded-xl px-4 py-3 text-sm font-semibold outline-none" value={entryType} onChange={(event) => setEntryType(event.target.value)}>
                                    <option value="word">Palavra</option>
                                    <option value="collocation">Collocation</option>
                                </select>

                                <button className="w-full bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2" onClick={handleAddWord}>
                                    <Sparkles className="h-4 w-4" />
                                    Adicionar
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70 flex flex-col relative overflow-hidden">
                            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1">Upload em lote</div>
                            <h3 className="text-lg font-semibold font-heading text-neutral-900 mb-3">Importação rápida</h3>
                            <p className="text-xs font-semibold text-neutral-500 mb-4 leading-relaxed">
                                Cole palavras ou expressões separadas por vírgula ou quebra de linha. Duplicados serão ignorados.
                            </p>

                            <div className="space-y-4">
                                <Textarea
                                    className="w-full min-h-[140px] bg-neutral-50/50 border-neutral-200 focus:border-[#647568] focus:ring-2 focus:ring-[#35403A]/15 rounded-xl p-4 text-sm outline-none resize-none"
                                    placeholder={entryType === 'collocation'
                                      ? 'make a decision\npay attention\nrather than'
                                      : 'abundant, diligent, relentless\npursuit\nachievement'}
                                    value={bulkWords}
                                    onChange={(event) => setBulkWords(event.target.value)}
                                />
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-[#35403A] hover:bg-[#232625] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2" onClick={handleBulkAdd}>
                                        <Upload className="h-4 w-4" /> Importar
                                    </button>
                                    <button className="border border-neutral-300 rounded-full px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors font-semibold" onClick={() => { setBulkWords(''); setBulkFeedback(null); }}>
                                        Limpar
                                    </button>
                                </div>
                                {bulkFeedback && (
                                    <div className={`mt-2 p-3 rounded-xl text-xs font-bold leading-tight flex items-center gap-2 ${bulkFeedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#eef0ec] text-[#35403A] border border-[#CED1C6]'}`}>
                                        {bulkFeedback.text}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#35403A] to-[#647568] rounded-xl p-6 md:p-8 text-white shadow-[0_1px_3px_rgba(20,20,19,0.06)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
                            <div className="text-[10px] font-bold text-[#CED1C6] uppercase tracking-[0.12em] mb-1 relative z-10">Banco seed</div>
                            <h3 className="text-lg font-semibold font-heading text-white mb-6 relative z-10">NGSL por nível</h3>

                            <div className="space-y-3 relative z-10 flex flex-col">
                                <button className="w-full bg-white text-[#232625] hover:bg-neutral-50 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors flex items-center justify-start gap-3" onClick={() => handleSeedImport(false)}>
                                    <WandSparkles className="h-4 w-4 text-[#647568]" />
                                    Importar nível atual ({config.userLevel})
                                </button>
                                <button className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors flex items-center justify-start gap-3" onClick={() => handleSeedImport(true)}>
                                    <Download className="h-4 w-4" />
                                    Importar até o nível atual
                                </button>
                                <button className="w-full bg-black/20 text-white/90 hover:bg-black/30 text-xs mt-2 rounded-full px-5 py-2.5 font-semibold transition-colors flex items-center justify-center gap-2" onClick={handleClearSeed}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Limpar seed sem progresso
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70 flex flex-col">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1">Banco atual</div>
                                    <h3 className="text-lg font-semibold font-heading text-neutral-900">Explorar e filtrar</h3>
                                </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-[1fr_200px] mb-8 pb-8 border-b border-neutral-100">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        className="w-full min-h-[52px] bg-neutral-50/50 border border-neutral-200 focus:border-[#647568] focus:ring-2 focus:ring-[#35403A]/15 rounded-xl pl-12 pr-4 text-sm font-semibold outline-none transition-colors"
                                        placeholder="Buscar por termo..."
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value.toLowerCase())}
                                    />
                                </div>
                                <select className="w-full min-h-[52px] bg-neutral-50/50 border border-neutral-200 focus:border-[#647568] focus:ring-2 focus:ring-[#35403A]/15 rounded-xl px-4 text-sm font-semibold outline-none cursor-pointer transition-colors" value={filter} onChange={(event) => setFilter(event.target.value)}>
                                    <option value="all">Todos os status</option>
                                    <option value="desconhecida">Desconhecida</option>
                                    <option value="reconhecida">Reconhecida</option>
                                    <option value="em_treino">Em treino</option>
                                    <option value="ativa">Ativa</option>
                                    <option value="dominada">Dominada</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                {filteredWords.length > 0 ? (
                                    filteredWords.map((word) => (
                                        <VocabularyRow key={word.id} word={word} onRemove={removeWord} />
                                    ))
                                ) : (
                                    <div className="bg-neutral-50 border border-neutral-200/60 border-dashed rounded-xl p-12 text-center flex flex-col items-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-neutral-400 mb-4 shadow-[0_1px_3px_rgba(20,20,19,0.06)] border border-neutral-200/70">
                                            <Search className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold font-heading text-neutral-800 mb-2">Nenhum termo encontrado</h3>
                                        <p className="text-sm font-semibold text-neutral-400">Tente buscar por outras palavras ou remover os filtros ativos.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
