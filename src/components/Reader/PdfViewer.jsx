// components/Reader/PdfViewer.jsx — Renders PDF pages with clickable word overlay
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useConfig } from '../../store/useConfig.js';
import { useWordStore } from '../../store/useWordStore.js';
import { useProgressStore } from '../../store/useProgressStore.js';
import { useUiStore } from '../../store/useUiStore.js';
import { explainWord } from '../../services/ai.js';
import SpeakButton from '../shared/SpeakButton.jsx';
import { SearchIcon, SparkIcon, ChevronLeftIcon, ChevronRightIcon } from '../shared/icons.jsx';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const SCALE = 1.5;

export default function PdfViewer({ file, onClose }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [textItems, setTextItems] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [sessionWords, setSessionWords] = useState([]);

  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const { config } = useConfig();
  const { words, addWord, getWordByText, markSeenInReader, updateWord } = useWordStore();
  const { recordReaderWord } = useProgressStore();
  const { pushToast } = useUiStore();

  const aiConfig = useMemo(() => {
    if (!config.provider) return null;
    return config;
  }, [config]);

  const bankWords = useMemo(() => new Set(words.map(w => w.word)), [words]);
  const clickedWords = useMemo(() => new Set(sessionWords.map(w => w.wordText)), [sessionWords]);

  // Load PDF document
  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (!cancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
      }
    };

    loadPdf();
    return () => { cancelled = true; };
  }, [file]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;

    const renderPage = async () => {
      setRendering(true);
      setTooltip(null);

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: SCALE });

        // Render canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Extract text content
        const textContent = await page.getTextContent();
        if (!cancelled) {
          setTextItems(textContent.items.map(item => ({
            str: item.str,
            transform: item.transform,
            width: item.width,
            height: item.height,
            fontName: item.fontName,
          })));

          // Build text layer overlay
          buildTextLayer(textContent.items, viewport);
        }
      } catch (err) {
        console.error('Error rendering page:', err);
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    renderPage();
    return () => { cancelled = true; };
  }, [pdfDoc, currentPage]);

  // Build clickable text layer
  const buildTextLayer = useCallback((items, viewport) => {
    const layerDiv = textLayerRef.current;
    if (!layerDiv) return;
    layerDiv.innerHTML = '';
    layerDiv.style.width = `${viewport.width}px`;
    layerDiv.style.height = `${viewport.height}px`;

    items.forEach(item => {
      if (!item.str.trim()) return;

      const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
      const fontSize = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]);

      // Split text item into individual words
      const wordRegex = /([A-Za-z0-9]+(?:[''\u2019-][A-Za-z0-9]+)*)|(\s+|[^A-Za-z0-9\s]+)/g;
      let match;
      let offsetX = 0;
      const fullStr = item.str;

      // Estimate char width for positioning
      const avgCharWidth = (item.width * SCALE) / Math.max(fullStr.length, 1);

      while ((match = wordRegex.exec(fullStr)) !== null) {
        const text = match[0];
        const charOffset = match.index;
        const x = tx[4] + charOffset * avgCharWidth;
        const y = tx[5] - fontSize;

        if (match[1]) {
          // Word — make clickable
          const clean = text.replace(/[^A-Za-z0-9'-]/g, '').toLowerCase();
          const inBank = bankWords.has(clean);
          const inSession = clickedWords.has(clean);

          const span = document.createElement('span');
          span.textContent = text;
          span.className = 'pdf-word';
          span.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${fontSize}px;
            line-height: 1;
            cursor: pointer;
            padding: 1px 2px;
            border-radius: 3px;
            color: transparent;
            transition: background-color 0.15s;
          `;

          if (inBank) {
            span.style.backgroundColor = 'rgba(206, 209, 198, 0.4)';
          } else if (inSession) {
            span.style.backgroundColor = 'rgba(221, 226, 220, 0.6)';
          }

          span.addEventListener('mouseenter', () => {
            if (!inBank && !inSession) span.style.backgroundColor = 'rgba(206, 209, 198, 0.25)';
          });
          span.addEventListener('mouseleave', () => {
            if (!inBank && !inSession) span.style.backgroundColor = 'transparent';
          });
          span.addEventListener('click', (e) => {
            e.stopPropagation();
            handleWordClick(text, clean, getSentenceFromItems(items, item), e.currentTarget);
          });

          layerDiv.appendChild(span);
        }
      }
    });
  }, [bankWords, clickedWords]);

  // Extract sentence context from surrounding text items
  const getSentenceFromItems = (items, currentItem) => {
    const currentIdx = items.indexOf(currentItem);
    let parts = [];
    // Go back until sentence boundary
    for (let i = Math.max(0, currentIdx - 5); i <= Math.min(items.length - 1, currentIdx + 5); i++) {
      parts.push(items[i].str);
    }
    const fullText = parts.join(' ');
    // Find sentence containing current item's text
    const sentences = fullText.split(/[.!?]+/).filter(Boolean);
    const target = currentItem.str.trim();
    for (const s of sentences) {
      if (s.includes(target)) return s.trim() + '.';
    }
    return currentItem.str;
  };

  // Handle word click — same logic as Reader.jsx
  const handleWordClick = useCallback(async (raw, clean, sentence, element) => {
    if (!clean) return;

    const existing = getWordByText(clean);
    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

    setTooltip({
      word: raw,
      clean,
      loading: true,
      text: '',
      exist: Boolean(existing),
      existingId: existing?.id || null,
      sentence,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.bottom - containerRect.top + 8,
      fromAI: false,
    });

    try {
      const result = await explainWord({
        word: raw,
        sentence,
        userLevel: config.userLevel || 'B1',
        config: aiConfig,
      });
      setTooltip(prev => prev?.clean === clean
        ? { ...prev, loading: false, text: result.text, fromAI: result.fromAI }
        : prev);
    } catch (err) {
      setTooltip(prev => prev?.clean === clean
        ? { ...prev, loading: false, text: `Erro: ${err.message}` }
        : prev);
    }
  }, [config, aiConfig, getWordByText]);

  // Add word to bank — same logic as Reader.jsx
  const addToBank = useCallback(() => {
    if (!tooltip) return;

    const existing = getWordByText(tooltip.clean);
    let wordId = existing?.id;

    if (!existing) {
      const added = addWord(tooltip.clean, {
        originalSentence: tooltip.sentence,
        tag: 'contexto',
        initialStatus: 'reconhecida',
      });
      wordId = added?.id;

      if (wordId && tooltip.sentence) {
        import('../../store/useCardStore.js').then(({ useCardStore }) => {
          useCardStore.getState().addContextualFlashcard({
            wordId,
            wordText: tooltip.clean,
            originalSentence: tooltip.sentence,
            config,
          });
        });
      }
    }

    if (wordId && !sessionWords.find(sw => sw.wordId === wordId)) {
      setSessionWords(prev => [...prev, {
        wordId,
        wordText: tooltip.clean,
        originalSentence: tooltip.sentence,
      }]);
      recordReaderWord({ wordId, isNewWord: !existing, isRecycled: Boolean(existing) });
      pushToast({ kind: 'success', source: 'reader', title: 'Palavra capturada', description: `"${tooltip.clean}" salva no banco` });
    }

    if (existing && wordId) {
      markSeenInReader(wordId);
      updateWord(wordId, { lastSeenAt: Date.now() });
    }

    setTooltip(null);
  }, [addWord, getWordByText, markSeenInReader, pushToast, recordReaderWord, sessionWords, tooltip, updateWord, config]);

  // Close tooltip on outside click
  useEffect(() => {
    const handler = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setTooltip(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Navigation
  const goPage = (delta) => {
    const next = currentPage + delta;
    if (next >= 1 && next <= totalPages) setCurrentPage(next);
  };

  const goToPage = (num) => {
    const n = Math.max(1, Math.min(totalPages, num));
    setCurrentPage(n);
  };

  if (!file) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full max-w-4xl bg-white rounded-xl border border-neutral-200/70 shadow-sm px-6 py-3">
        <button
          onClick={onClose}
          className="text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Voltar ao Reader
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => goPage(-1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeftIcon size={18} />
          </button>

          <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
            <input
              type="number"
              value={currentPage}
              onChange={e => goToPage(parseInt(e.target.value) || 1)}
              className="w-12 text-center border border-neutral-200 rounded-lg py-1 text-sm font-semibold outline-none focus:border-neutral-400"
              min={1}
              max={totalPages}
            />
            <span className="text-neutral-400">/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => goPage(1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {sessionWords.length} palavras capturadas
          </span>
        </div>
      </div>

      {/* PDF Canvas + Text Layer */}
      <div ref={containerRef} className="relative inline-block shadow-lg rounded-xl overflow-hidden bg-white">
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex items-center gap-2 text-neutral-500">
              <SparkIcon size={18} className="animate-spin" />
              <span className="text-sm font-semibold">Carregando página...</span>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="block" />

        <div
          ref={textLayerRef}
          className="absolute top-0 left-0"
          style={{ pointerEvents: 'auto' }}
        />

        {/* Tooltip */}
        {tooltip && (
          <div
            ref={tooltipRef}
            className="absolute z-50 w-[320px] bg-white rounded-xl shadow-[0_4px_20px_rgba(20,20,19,0.12)] border border-neutral-200/70"
            style={{
              left: Math.min(tooltip.x, (canvasRef.current?.width || 600) - 340),
              top: tooltip.y,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Header */}
            <div className="bg-neutral-50 border-b border-neutral-100 p-4 rounded-t-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[22px] font-bold font-heading text-neutral-900">{tooltip.word}</div>
                <SpeakButton text={tooltip.word} size={14} />
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tooltip.exist ? 'bg-neutral-200 text-neutral-600' : 'bg-[#35403A] text-white'}`}>
                  {tooltip.exist ? 'Ja no banco' : 'Novo item'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tooltip.fromAI ? 'bg-[#647568] text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                  {tooltip.fromAI ? 'IA' : 'Contexto'}
                </span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em] mb-1.5">
                Significado contextual
              </div>
              {tooltip.loading ? (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <SparkIcon size={14} className="animate-spin" />
                  Buscando contexto...
                </div>
              ) : (
                <>
                  <div className="text-[15px] font-medium text-neutral-800 mb-3">{tooltip.text}</div>
                  {tooltip.sentence && (
                    <div className="text-[12px] italic text-neutral-500 bg-neutral-50/80 p-3 rounded-xl border border-neutral-100 flex items-start gap-2">
                      <span className="flex-1">{tooltip.sentence}</span>
                      <SpeakButton text={tooltip.sentence} size={12} />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="p-3 bg-neutral-50 flex border-t border-neutral-100 gap-2 rounded-b-xl">
              {!tooltip.exist ? (
                <button
                  onClick={addToBank}
                  className="flex-1 bg-[#35403A] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#232625] transition-colors"
                >
                  + Salvar palavra
                </button>
              ) : sessionWords.find(sw => sw.wordId === tooltip.existingId) ? (
                <span className="flex-1 text-center text-sm font-semibold text-neutral-400 py-2">Na sessao</span>
              ) : (
                <button
                  onClick={addToBank}
                  className="flex-1 bg-[#35403A] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#232625] transition-colors"
                >
                  + Adicionar a pratica
                </button>
              )}
              <button
                onClick={() => setTooltip(null)}
                className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom pagination (for long PDFs) */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm text-neutral-500 pb-8">
          <button onClick={() => goToPage(1)} disabled={currentPage <= 1} className="px-3 py-1 rounded-lg hover:bg-neutral-100 disabled:opacity-30 font-semibold">
            Primeira
          </button>
          <button onClick={() => goPage(-10)} disabled={currentPage <= 10} className="px-3 py-1 rounded-lg hover:bg-neutral-100 disabled:opacity-30 font-semibold">
            -10
          </button>
          <button onClick={() => goPage(10)} disabled={currentPage + 10 > totalPages} className="px-3 py-1 rounded-lg hover:bg-neutral-100 disabled:opacity-30 font-semibold">
            +10
          </button>
          <button onClick={() => goToPage(totalPages)} disabled={currentPage >= totalPages} className="px-3 py-1 rounded-lg hover:bg-neutral-100 disabled:opacity-30 font-semibold">
            Ultima
          </button>
        </div>
      )}
    </div>
  );
}
