import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore.js';
import { useConfig } from '../../store/useConfig.js';
import { useProgressStore } from '../../store/useProgressStore.js';
import { generateMicroDialogue, evaluateDialogueResponse } from '../../services/ai.js';
import { Button } from '../ui/button.jsx';
import SpeakButton from '../shared/SpeakButton.jsx';
import { ChatBubbleIcon, RobotIcon, UserCircleIcon } from '../shared/icons.jsx';

const MAX_TURNS = 6; // max user turns before ending

export default function Dialogue({ targetWords, focusCategory, onComplete, compact = false }) {
  const navigate = useNavigate();
  const { words } = useWordStore();
  const { config } = useConfig();
  const { recordDialogueTurn } = useProgressStore();

  const [phase, setPhase] = useState('idle'); // idle | loading | playing | evaluating | done
  const [scene, setScene] = useState('');
  // conversation: array of { role: 'ai'|'user', text, textPT?, corrections?, correctedVersion? }
  const [conversation, setConversation] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [turnCount, setTurnCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [error, setError] = useState(null);
  const [interrupted, setInterrupted] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleStart = useCallback(async () => {
    if (!config?.provider) {
      setError('Configure uma IA em Settings para usar micro-dialogos.');
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase('loading');
    setError(null);

    try {
      const dialogueWords = targetWords?.length
        ? targetWords
        : words
            .filter(w => ['ativa', 'em_treino'].includes(w.status))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

      const result = await generateMicroDialogue({
        words: dialogueWords,
        cefrLevel: config.userLevel,
        focusCategory: focusCategory || null,
        config,
        signal: controller.signal,
      });

      if (!result?.turns?.length) {
        setError('Nao foi possivel gerar o dialogo. Tente novamente.');
        setPhase('idle');
        return;
      }

      // Extract scene and first AI line
      setScene(result.scene);
      const firstAiTurn = result.turns.find(t => t.role === 'ai');
      const initialConversation = firstAiTurn
        ? [{ role: 'ai', text: firstAiTurn.text, textPT: firstAiTurn.textPT }]
        : [];
      setConversation(initialConversation);
      setTurnCount(0);
      setXpEarned(0);
      setUserAnswer('');
      setInterrupted(false);
      setPhase('playing');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Erro ao gerar dialogo. Verifique sua chave de API.');
      setPhase('idle');
    }
  }, [words, config, targetWords, focusCategory]);

  const handleSubmit = useCallback(async () => {
    if (!userAnswer.trim()) return;

    const lastAiLine = [...conversation].reverse().find(t => t.role === 'ai');
    const userText = userAnswer.trim();

    // Add user message to conversation immediately
    setConversation(prev => [...prev, { role: 'user', text: userText }]);
    setUserAnswer('');
    setPhase('evaluating');

    try {
      const result = await evaluateDialogueResponse({
        scene,
        aiLine: lastAiLine?.text || '',
        userResponse: userText,
        conversationSoFar: conversation,
        userLevel: config.userLevel,
        config,
      });

      const newTurnCount = turnCount + 1;
      setTurnCount(newTurnCount);

      // Record XP
      const hasErrors = result.corrections && result.corrections.trim().length > 0;
      const xp = hasErrors ? 4 : 10;
      setXpEarned(prev => prev + xp);
      recordDialogueTurn({ correct: !hasErrors });

      if (!result.understandable) {
        // Incomprehensible — interrupt and show error
        setConversation(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            corrections: result.corrections,
            correctedVersion: result.correctedVersion,
          };
          return updated;
        });
        setInterrupted(true);
        setPhase('done');
        return;
      }

      // Update user turn with silent corrections
      setConversation(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          corrections: result.corrections,
          correctedVersion: result.correctedVersion,
        };

        // Add AI's next line if provided
        if (result.nextAiLine) {
          updated.push({
            role: 'ai',
            text: result.nextAiLine,
            textPT: result.nextAiLinePT,
          });
        }

        return updated;
      });

      // Check if we should end (max turns or no next AI line)
      if (newTurnCount >= MAX_TURNS || !result.nextAiLine) {
        setTimeout(() => {
          setPhase('done');
          if (onComplete) {
            // Use setConversation callback to access latest state
            setConversation(latest => {
              const userTurns = latest.filter(t => t.role === 'user');
              onComplete({ results: userTurns.map(t => !t.corrections?.trim()), xpEarned: xpEarned + xp });
              return latest; // don't modify
            });
          }
        }, 1500);
      } else {
        setPhase('playing');
      }
    } catch {
      setPhase('playing');
    }
  }, [userAnswer, conversation, scene, config, turnCount, recordDialogueTurn, xpEarned, onComplete]);

  // ── Idle screen ──
  if (phase === 'idle' || phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#eef0ec] text-[#35403A] text-3xl">
          <ChatBubbleIcon size={36} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold font-heading text-neutral-900 tracking-tight">
            Micro-dialogo
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
            Converse em ingles! A IA responde naturalmente e corrige seus erros no final.
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
          className="rounded-full bg-[#35403A] hover:bg-[#232625] text-white px-8 py-3 font-semibold text-sm transition-colors"
        >
          {phase === 'loading' ? 'Gerando cenario...' : 'Iniciar dialogo'}
        </Button>

        {!config?.provider && (
          <p className="text-xs text-neutral-400 max-w-xs">
            Micro-dialogos requerem IA configurada.{' '}
            <button onClick={() => navigate('/settings')} className="text-[#647568] underline underline-offset-2">
              Configurar IA
            </button>
          </p>
        )}
      </div>
    );
  }

  // ── Done screen — show full conversation with corrections ──
  if (phase === 'done') {
    const userTurns = conversation.filter(t => t.role === 'user');
    const turnsWithErrors = userTurns.filter(t => t.corrections?.trim());
    const perfectTurns = userTurns.length - turnsWithErrors.length;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Summary header */}
        <div className="text-center py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-1">
            {interrupted ? 'Dialogo interrompido' : 'Dialogo completo'}
          </p>
          <h2 className="text-2xl font-semibold font-heading text-neutral-900">
            {perfectTurns}/{userTurns.length} sem erros
          </h2>
          <p className="mt-1 text-sm text-[#35403A] font-semibold">+{xpEarned} XP</p>
        </div>

        {/* Full conversation with annotations */}
        <div className="rounded-xl border border-neutral-200/70 bg-white shadow-[0_1px_3px_rgba(20,20,19,0.06)] p-6 md:p-8 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-2">
            Revisao do dialogo
          </p>
          <div className="bg-[#eef0ec] rounded-xl p-3 border border-[#CED1C6] text-sm text-neutral-700 mb-4">
            <span className="font-bold text-[#35403A]">Cenario:</span> {scene}
          </div>

          {conversation.map((turn, idx) => (
            <div key={idx} className={`flex gap-3 ${turn.role === 'user' ? 'justify-end' : ''}`}>
              {turn.role === 'ai' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#dde2dc] flex items-center justify-center text-xs"><RobotIcon size={14} /></div>
              )}
              <div className={`max-w-[85%] ${turn.role === 'ai' ? '' : 'text-right'}`}>
                <div className={`rounded-xl p-3 ${
                  turn.role === 'ai'
                    ? 'bg-neutral-50 border border-neutral-200/70 rounded-tl-md'
                    : turn.corrections?.trim()
                      ? 'bg-[#eef0ec] border border-[#CED1C6] rounded-tr-md'
                      : 'bg-green-50 border border-green-200 rounded-tr-md'
                }`}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-neutral-900">{turn.text}</p>
                    {turn.role === 'ai' && <SpeakButton text={turn.text} size={12} />}
                  </div>
                  {turn.role === 'ai' && turn.textPT && (
                    <p className="text-xs text-neutral-400 mt-1 italic">{turn.textPT}</p>
                  )}
                </div>

                {/* Show corrections for user turns */}
                {turn.role === 'user' && turn.corrections?.trim() && (
                  <div className="mt-1.5 text-left bg-[#eef0ec] rounded-xl p-3 border border-[#CED1C6]">
                    <p className="text-xs text-[#232625]">
                      <span className="font-bold">Erros:</span> {turn.corrections}
                    </p>
                    {turn.correctedVersion && turn.correctedVersion !== turn.text && (
                      <p className="text-xs text-green-700 mt-1">
                        <span className="font-bold">Correto:</span> &ldquo;{turn.correctedVersion}&rdquo;
                      </p>
                    )}
                  </div>
                )}
                {turn.role === 'user' && !turn.corrections?.trim() && (
                  <p className="text-[10px] text-green-600 font-bold mt-1">Perfeito</p>
                )}
              </div>
              {turn.role === 'user' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#dde2dc] flex items-center justify-center text-xs"><UserCircleIcon size={14} /></div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {!compact && (
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setPhase('idle'); setConversation([]); setScene(''); }} className="rounded-full bg-[#35403A] hover:bg-[#232625] text-white px-6 py-2.5 text-sm font-semibold transition-colors">
              Novo dialogo
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="border border-neutral-300 rounded-full px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
              Dashboard
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ── Playing / Evaluating ──
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Scene */}
      <div className="rounded-xl border border-neutral-200/70 bg-[#eef0ec] p-6 shadow-[0_1px_3px_rgba(20,20,19,0.06)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-2">Cenario</p>
        <p className="text-base font-semibold text-neutral-800">{scene}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">
          Turno <span className="font-semibold text-neutral-700">{turnCount + 1}</span>
        </span>
        <span className="font-semibold text-[#35403A]">+{xpEarned} XP</span>
      </div>

      {/* Conversation bubbles */}
      <div className="space-y-3">
        {conversation.map((turn, idx) => (
          <div key={idx} className={`flex gap-3 ${turn.role === 'user' ? 'justify-end' : ''}`}>
            {turn.role === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#dde2dc] flex items-center justify-center text-sm"><RobotIcon size={16} /></div>
            )}
            <div className={`rounded-xl p-4 max-w-[80%] ${
              turn.role === 'ai'
                ? 'bg-white border border-neutral-200/70 shadow-[0_1px_3px_rgba(20,20,19,0.06)] rounded-tl-md'
                : 'bg-[#eef0ec] border border-[#CED1C6] rounded-tr-md'
            }`}>
              <div className="flex items-center gap-2">
                <p className="text-base text-neutral-900">{turn.text}</p>
                {turn.role === 'ai' && <SpeakButton text={turn.text} size={14} />}
              </div>
              {turn.role === 'ai' && turn.textPT && (
                <p className="text-xs text-neutral-400 mt-1 italic">{turn.textPT}</p>
              )}
            </div>
            {turn.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#dde2dc] flex items-center justify-center text-sm"><UserCircleIcon size={16} /></div>
            )}
          </div>
        ))}

        {/* Evaluating indicator */}
        {phase === 'evaluating' && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#dde2dc] flex items-center justify-center text-sm"><RobotIcon size={16} /></div>
            <div className="bg-white border border-neutral-200/70 rounded-xl rounded-tl-md p-4 shadow-[0_1px_3px_rgba(20,20,19,0.06)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#647568] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#647568] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-[#647568] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User input */}
      {phase === 'playing' && (
        <div className="space-y-3 mt-4">
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Digite sua resposta em ingles..."
            className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-[#647568] focus:outline-none focus:ring-2 focus:ring-[#35403A]/15 resize-none shadow-[0_1px_3px_rgba(20,20,19,0.06)]"
            rows={2}
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="flex-1 rounded-full bg-[#35403A] hover:bg-[#232625] text-white font-semibold text-sm py-2.5 transition-colors"
            >
              Enviar
            </Button>
            <Button
              onClick={() => { setPhase('done'); }}
              variant="outline"
              className="border border-neutral-300 rounded-full px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Encerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
