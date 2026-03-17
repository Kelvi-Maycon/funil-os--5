# Builder & Reader Improvements — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 bugs/UX problems across Reader, Builder, Vocabulary and Escrever that break the core learning pipeline.

**Architecture:** Each task is self-contained and touches isolated files. Tasks 1, 2, 3 affect the Reader→Builder cycle. Tasks 4 and 6 fix Escrever. Task 5 is already implemented (SKIP).

**Tech Stack:** React 19, Zustand, Tailwind CSS, Vite

---

## Problem Map

| # | Problema | Sintoma | Arquivo |
|---|---------|---------|---------|
| 1 | Reader auto-adiciona palavra no clique | Badge aparece sem o usuário pedir | `Reader.jsx` |
| 2 | Tokens duplicados no Assembly | "I I learned learned the the…" | `Builder.jsx` |
| 3 | Frases locais sem contexto real | "I learned the word X today." | `services/ai.js` |
| 4 | `evaluateSemanticTranslation` sem import + `normalize` undefined | Escrever trava com IA ativa e sem IA | `Escrever.jsx`, `ai.js` |
| 5 | ~~Busca no Vocabulary sem lógica~~ | **JÁ IMPLEMENTADO — SKIP** | — |
| 6 | Escrever inutilizável sem IA | Tela de erro sem fallback | `Escrever.jsx` |

---

## Execution Order

```
Task 4 (import bug + normalize crash)
  → Task 1 (Reader)
  → Task 2 (Assembly duplicates)
  → Task 3 (Sentences)
  → Task 6 (Escrever offline)
```

Tasks 4 e 6 são independentes entre si e podem rodar em paralelo com Tasks 1-3.

---

## Task 1 — Reader: separar "ver tooltip" de "salvar palavra"

**Problema:** `handleWordClick` chama `addWord()` + `setSessionWords()` imediatamente no clique. A palavra aparece nas capturas antes do usuário confirmar.

**Comportamento desejado:**
- Clique na palavra → abre tooltip (nada é salvo)
- Clique "Salvar palavra" (nova) → adiciona ao banco + à sessão + XP
- Clique "Adicionar à prática" (existente) → adiciona à sessão + XP

**Arquivo:** `src/components/Reader/Reader.jsx`

- [ ] **Step 1: Substituir `handleWordClick` — remover todo auto-save**

Atenção: `existingId` DEVE ser incluído no objeto do `setTooltip` (é usado no Step 3 para verificar se a palavra já está na sessão):

```jsx
const handleWordClick = useCallback(async (tokenIdx, token) => {
  if (!token.clean) return;

  const existing = getWordByText(token.clean);
  const sentence = getSentenceForToken(tokens, tokenIdx);

  // Apenas abre o tooltip — não salva nada ainda
  setTooltip({
    tokenIdx,
    word: token.raw,
    clean: token.clean,
    loading: true,
    text: '',
    exist: Boolean(existing),
    existingId: existing?.id || null,   // OBRIGATÓRIO para o botão no Step 3
    sentence,
  });

  try {
    const aiConfig = config.provider ? config : null;
    const result = await explainWord({
      word: token.raw,
      sentence,
      userLevel: config.userLevel || 'B1',
      config: aiConfig,
    });
    setTooltip((current) => current?.tokenIdx === tokenIdx
      ? { ...current, loading: false, text: result.text, fromAI: result.fromAI }
      : current);
  } catch (error) {
    setTooltip((current) => current?.tokenIdx === tokenIdx
      ? { ...current, loading: false, text: `Erro: ${error.message}` }
      : current);
  }
}, [config, getWordByText, tokens]);
```

- [ ] **Step 2: Substituir `addToBank` — concentra toda a lógica de save**

```jsx
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
  }

  if (wordId && !sessionWords.find((sw) => sw.wordId === wordId)) {
    setSessionWords((current) => [
      ...current,
      { wordId, wordText: tooltip.clean, originalSentence: tooltip.sentence },
    ]);
    recordReaderWord({ wordId, isNewWord: !existing, isRecycled: Boolean(existing) });
    pushToast({
      kind: 'success',
      source: 'reader',
      title: 'Palavra capturada',
      description: `"${tooltip.clean}" adicionada às capturas.`,
    });
  }

  if (existing && wordId) {
    markSeenInReader(wordId);
    updateWord(wordId, { lastSeenAt: Date.now() });
  }

  setTooltip(null);
}, [addWord, getWordByText, markSeenInReader, pushToast, recordReaderWord, sessionWords, tooltip, updateWord]);
```

- [ ] **Step 3: Atualizar os botões de ação no JSX do tooltip**

Substituir o bloco `<div className="p-3 bg-neutral-50 flex border-t border-neutral-100 gap-2">` por:

```jsx
<div className="p-3 bg-neutral-50 flex border-t border-neutral-100 gap-2">
  {!tooltip.exist ? (
    <button
      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl text-xs transition-colors shadow-sm"
      onClick={addToBank}
    >
      + Salvar palavra
    </button>
  ) : sessionWords.find((sw) => sw.wordId === tooltip.existingId) ? (
    <span className="flex-1 text-center py-2 text-xs font-semibold text-green-600 uppercase tracking-wider">
      ✓ Na sessão
    </span>
  ) : (
    <button
      className="flex-1 bg-neutral-800 hover:bg-black text-white font-semibold py-2 rounded-xl text-xs transition-colors shadow-sm"
      onClick={addToBank}
    >
      + Adicionar à prática
    </button>
  )}
  <button
    className="px-4 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-semibold py-2 rounded-xl text-xs transition-colors"
    onClick={() => setTooltip(null)}
  >
    Fechar
  </button>
</div>
```

- [ ] **Step 4: Verificar no browser**

1. Clicar numa palavra nova → tooltip abre, rodapé "Capturas" permanece vazio
2. Clicar "Salvar palavra" → aparece no rodapé
3. Clicar numa palavra existente → tooltip mostra "Adicionar à prática" ou "✓ Na sessão"

- [ ] **Step 5: Commit**
```bash
git add src/components/Reader/Reader.jsx
git commit -m "fix(reader): word only added to session on explicit save, not on click"
```

---

## Task 2 — Builder: corrigir tokens duplicados no Assembly

**Causa real (confirmada pelo revisor):** O DnD Kit requer IDs únicos em todo o `DndContext`. Quando a mesma frase gera `expectedTokens` (para validação) E `availableTokens`/`answerTokens`, ambos usam o mesmo prefixo `sentenceId`, criando colisões de ID dentro do mesmo render. O DnD Kit "espelha" tokens, resultando nos pares duplicados visíveis na tela.

**Fix:** Gerar um prefixo único por instância de exercício (timestamp no mount), aplicado em TODOS os `createOrderedTokenItems` call sites para aquele exercício.

**Arquivo:** `src/components/Builder/Builder.jsx`

- [ ] **Step 1: Localizar todos os usos de `createOrderedTokenItems` e `createShuffledTokenItems`**

```bash
grep -n "createOrderedTokenItems\|createShuffledTokenItems\|expectedTokens" src/components/Builder/Builder.jsx
```

- [ ] **Step 2: Adicionar um `useRef` de prefixo único por exercício**

Dentro do componente do exercício Assembly (o que recebe `exercise.sentence`), adicionar:

```js
const tokenPrefixRef = useRef(`${exercise.sentence.id}_${Date.now()}`);
const tokenPrefix = tokenPrefixRef.current;
```

- [ ] **Step 3: Modificar `createOrderedTokenItems` para aceitar prefix externo**

```js
function createOrderedTokenItems(prefix, english) {
    return String(english || '')
        .replace(/[.,!?;:"]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .map((text, index) => ({
            id: `${prefix}_${index}_${text.toLowerCase()}`,
            text,
        }));
}

function createShuffledTokenItems(prefix, english) {
    return shuffle(createOrderedTokenItems(prefix, english));
}
```

- [ ] **Step 4: Atualizar todos os call sites para passar `tokenPrefix`**

Substituir todas as chamadas de `createOrderedTokenItems(exercise.sentence.id, ...)` e `createShuffledTokenItems(exercise.sentence.id, ...)` por `createOrderedTokenItems(tokenPrefix, ...)` e `createShuffledTokenItems(tokenPrefix, ...)`.

Especialmente: `expectedTokens` (usado para validação) e `availableTokens` (estado inicial) DEVEM usar o mesmo `tokenPrefix` para que a comparação continue funcionando, mas ambos serão únicos no DndContext.

- [ ] **Step 5: Testar**

Abrir `/practice` → confirmar que as palavras aparecem uma única vez no banco e na frase montada.

- [ ] **Step 6: Commit**
```bash
git add src/components/Builder/Builder.jsx
git commit -m "fix(builder): prevent DndKit ID collision causing duplicate tokens in assembly"
```

---

## Task 3 — Frases locais com contexto real

**Problema:** `buildLocalSentenceSet` gera frases meta ("I learned the word X today") sem valor pedagógico.

**Nota sobre os templates:** os templates abaixo tratam `{word}` como adjetivo/substantivo genérico. Para a maioria das palavras isso funciona, mas para verbos pode soar estranho. Ainda assim é vastamente melhor que as frases meta atuais.

**Arquivo:** `src/services/ai.js`

- [ ] **Step 1: Substituir `buildLocalSentenceSet` completamente**

```js
const LOCAL_SENTENCE_TEMPLATES = {
    positive: [
        { en: 'The presentation had {word} elements that impressed everyone.', pt: 'A apresentação tinha elementos {word} que impressionaram a todos.' },
        { en: 'She gave a clear and {word} explanation of the topic.', pt: 'Ela deu uma explicação clara e {word} sobre o assunto.' },
        { en: 'The results were {word}, exceeding all expectations.', pt: 'Os resultados foram {word}, superando todas as expectativas.' },
        { en: 'He made a {word} decision that changed everything.', pt: 'Ele tomou uma decisão {word} que mudou tudo.' },
        { en: 'Learning {word} skills can open many career doors.', pt: 'Aprender habilidades {word} pode abrir muitas portas na carreira.' },
        { en: 'The {word} approach helped solve the problem efficiently.', pt: 'A abordagem {word} ajudou a resolver o problema de forma eficiente.' },
        { en: 'It is important to stay {word} when things get difficult.', pt: 'É importante permanecer {word} quando as coisas ficam difíceis.' },
        { en: 'The team used a {word} strategy to meet the deadline.', pt: 'A equipe usou uma estratégia {word} para cumprir o prazo.' },
    ],
    negative: [
        { en: 'Without a {word} plan, the project fell apart quickly.', pt: 'Sem um plano {word}, o projeto desmoronou rapidamente.' },
        { en: 'She never expected such a {word} response from the audience.', pt: 'Ela nunca esperou uma resposta tão {word} do público.' },
        { en: 'The lack of {word} resources made everything harder.', pt: 'A falta de recursos {word} tornou tudo mais difícil.' },
        { en: 'He was not {word} enough to handle the situation alone.', pt: 'Ele não era {word} o suficiente para lidar com a situação sozinho.' },
        { en: 'The {word} feedback made it difficult to improve.', pt: 'O feedback {word} dificultou a melhora.' },
    ],
    past: [
        { en: 'The team worked in a {word} way to finish the project.', pt: 'A equipe trabalhou de forma {word} para terminar o projeto.' },
        { en: 'She had to make a {word} choice when the situation changed.', pt: 'Ela teve que fazer uma escolha {word} quando a situação mudou.' },
        { en: 'The project succeeded because of their {word} effort.', pt: 'O projeto teve sucesso por causa do esforço {word} deles.' },
        { en: 'He applied a {word} method that surprised his colleagues.', pt: 'Ele aplicou um método {word} que surpreendeu seus colegas.' },
        { en: 'The manager explained the {word} strategy to the whole team.', pt: 'O gerente explicou a estratégia {word} para toda a equipe.' },
    ],
};

export function buildLocalSentenceSet(word) {
    const cleanWord = String(word || '').trim() || 'word';
    const seed = cleanWord.length % 5;

    const pick = (templates, offset = 0) => {
        const t = templates[(seed + offset) % templates.length];
        return {
            english: t.en.replace(/\{word\}/g, cleanWord),
            portuguese: t.pt.replace(/\{word\}/g, cleanWord),
        };
    };

    return {
        word: cleanWord,
        sentences: [
            { ...pick(LOCAL_SENTENCE_TEMPLATES.positive, 0), type: 'positive' },
            { ...pick(LOCAL_SENTENCE_TEMPLATES.negative, 0), type: 'negative' },
            { ...pick(LOCAL_SENTENCE_TEMPLATES.past, 1),     type: 'past' },
        ],
    };
}
```

- [ ] **Step 2: Testar no Builder sem IA**

Abrir `/practice` → confirmar que a frase exibida é um template real, não "I learned the word X today."

- [ ] **Step 3: Commit**
```bash
git add src/services/ai.js
git commit -m "fix(builder): replace meta fallback sentences with contextual templates"
```

---

## Task 4 — Escrever: import faltante + `normalize` undefined

**Dois bugs confirmados:**

**Bug A:** `evaluateSemanticTranslation` existe em `ai.js` mas não está no import de `Escrever.jsx` → `ReferenceError` ao submeter resposta não-exata com IA.

**Bug B (crítico):** A implementação existente de `evaluateSemanticTranslation` em `ai.js` usa uma função `normalize` no branch de fallback (sem IA) que **não está definida nesse escopo** → `ReferenceError: normalize is not defined` para qualquer usuário sem IA configurada.

**Arquivos:** `src/components/Escrever/Escrever.jsx`, `src/services/ai.js`

- [ ] **Step 1: Corrigir o import em `Escrever.jsx`**

Localizar a linha de import de `ai.js`:
```js
import { generateTranslationSentences, evaluateTranslation } from '../../services/ai.js';
```

Substituir por:
```js
import { generateTranslationSentences, evaluateTranslation, evaluateSemanticTranslation } from '../../services/ai.js';
```

- [ ] **Step 2: Corrigir `evaluateSemanticTranslation` em `ai.js`**

Localizar a função `evaluateSemanticTranslation` em `ai.js`. No branch de fallback (sem IA), adicionar a função `normalize` localmente:

```js
export async function evaluateSemanticTranslation({ original, expected, userAnswer, userLevel, config }) {
    if (!config?.provider) {
        // Fallback sem IA: normalize deve ser definida LOCALMENTE aqui
        const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
        const expectedWords = new Set(normalize(expected));
        const answerWords = normalize(userAnswer);
        const matches = answerWords.filter((w) => expectedWords.has(w)).length;
        const score = expectedWords.size > 0 ? matches / expectedWords.size : 0;
        return { correct: score >= 0.6, note: null };
    }

    const prompt = `You are evaluating an English translation exercise.
Original (Portuguese): "${original}"
Expected answer: "${expected}"
Student's answer: "${userAnswer}"
Student level: ${userLevel || 'B1'}

Is the student's answer semantically equivalent? Respond with JSON only: {"correct": true or false, "note": "brief feedback or null"}`;

    try {
        const raw = await callAI(config, 'You are a language teacher evaluating translations.', prompt);
        const parsed = extractJSONObject(raw);
        return { correct: Boolean(parsed.correct), note: parsed.note || null };
    } catch {
        return { correct: false, note: null };
    }
}
```

- [ ] **Step 3: Verificar que não há outra `normalize` no escopo exterior**

```bash
grep -n "function normalize\|const normalize\|let normalize" src/services/ai.js
```

Se houver uma global no arquivo, verificar se ela é acessível em `evaluateSemanticTranslation`. Se não for (por ser closure de outra função), a definição local do Step 2 prevalece.

- [ ] **Step 4: Testar ambos os cenários**

Com IA: submeter resposta parecida mas não idêntica → não deve lançar ReferenceError, deve retornar feedback.
Sem IA: submeter qualquer resposta → não deve lançar ReferenceError, deve retornar `{ correct: true/false }`.

- [ ] **Step 5: Commit**
```bash
git add src/components/Escrever/Escrever.jsx src/services/ai.js
git commit -m "fix(escrever): add missing import and fix undefined normalize in evaluateSemanticTranslation"
```

---

## Task 5 — Vocabulary: busca ~~(SKIP — já implementado)~~

A busca no Vocabulary já está conectada ao filtro real via `useState('search')` e `filteredWords`. Nenhuma alteração necessária. ✓

---

## Task 6 — Escrever: fallback offline usando flashcards

**Problema:** Sem IA, `Escrever.jsx` exibe erro genérico e para. Nenhum fallback funcional existe.

**Solução:** Usar flashcards existentes do banco (`useCardStore`) como exercícios de tradução quando não há IA.

**Arquivos:** `src/components/Escrever/Escrever.jsx`, `src/store/useCardStore.js`

- [ ] **Step 1: Adicionar imports de `useCardStore` e `useWordStore` em `Escrever.jsx`**

```js
import { useCardStore } from '../../store/useCardStore.js';
import { useWordStore } from '../../store/useWordStore.js';
```

E dentro do componente:
```js
const { flashcards } = useCardStore();
const { words } = useWordStore();
```

- [ ] **Step 2: Criar a função `buildOfflineSessions` dentro do arquivo (antes do componente)**

```js
function buildOfflineSessions(flashcards = [], words = [], limit = 5) {
    const eligible = flashcards
        .filter((card) => card.front && card.back && card.back.length > 5)
        .slice(0, limit * 3);

    if (eligible.length === 0) return [];

    return eligible.slice(0, limit).map((card) => ({
        id: card.id,
        portuguese: card.front,
        english: card.back,
        alternatives: [],
        targetWord: words.find((w) => w.id === card.wordId)?.word || '',
    }));
}
```

- [ ] **Step 3: Encontrar a função que inicia a sessão (provavelmente `handleStart`)**

```bash
grep -n "handleStart\|handleGenerate\|setPhase\|setLoading" src/components/Escrever/Escrever.jsx | head -20
```

- [ ] **Step 4: Modificar a função de início para usar o fallback quando não há IA**

Na função de início (seja `handleStart` ou outro nome), adicionar o branch offline **antes** da lógica de IA:

```js
// Se não há IA, tenta usar flashcards existentes
if (!config?.provider) {
    const offline = buildOfflineSessions(flashcards, words);
    if (offline.length >= 2) {
        setSentences(offline);
        setCurrentIndex(0);
        setPhase('session');
    } else {
        setPhase('offline-empty');
    }
    return;
}
// ... lógica original com IA continua abaixo
```

- [ ] **Step 5: Verificar que o botão CTA usa o nome correto da função**

O botão "Gerar sessão" no JSX usa `onClick={handleStart}` (ou outro nome). Garantir que o `onClick` aponta para a função modificada no Step 4. Se a função foi renomeada, atualizar o JSX.

- [ ] **Step 6: Adicionar o estado `offline-empty` no JSX**

```jsx
{phase === 'offline-empty' && (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400 border border-orange-100">
            📚
        </div>
        <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Sem material suficiente</h3>
            <p className="text-sm text-neutral-500 max-w-sm">
                Configure uma IA para gerar exercícios, ou salve pelo menos 2 flashcards durante a prática para usar o Escrever offline.
            </p>
        </div>
        <div className="flex gap-3">
            <a href="/settings" className="px-6 py-2.5 bg-violet-600 text-white rounded-full text-sm font-semibold">Configurar IA</a>
            <a href="/flashcards" className="px-6 py-2.5 bg-neutral-100 text-neutral-700 rounded-full text-sm font-semibold">Ver flashcards</a>
        </div>
    </div>
)}
```

- [ ] **Step 7: Testar sem IA**

- Com flashcards salvos: Escrever abre e mostra exercícios dos cards
- Sem flashcards: mostra a tela `offline-empty` com links de orientação
- Com IA: comportamento original inalterado

- [ ] **Step 8: Commit**
```bash
git add src/components/Escrever/Escrever.jsx
git commit -m "feat(escrever): offline fallback using existing flashcards when no AI configured"
```

---

## Verificação final do ciclo completo

1. `/reader` → colar texto → clicar palavra → tooltip abre, capturas vazias
2. Clicar "Salvar palavra" → aparece nas capturas
3. "Praticar Capturas" → vai para `/practice`
4. Assembly: palavras sem duplicatas, frase é um template real
5. `/escrever` sem IA + com flashcards → exercícios funcionam
6. `/escrever` sem IA + sem flashcards → tela orientativa clara
