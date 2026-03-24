// services/ai.js — Serviço unificado de IA
import { callOpenAI, callOpenAIStructured } from './openai.js';
import { callGemini } from './gemini.js';
import { supabase, isSupabaseConfigured } from './supabase.js';

// Dicionário estático de fallback (sem IA)
const STATIC_DICT = {
    relentless: 'Continuing without stopping or getting less intense.',
    abundant: 'Existing or available in large quantities.',
    diligent: 'Having or showing care and conscientiousness in one\'s work.',
    persevere: 'To continue in a course of action even in the face of difficulty.',
    eloquent: 'Fluent or persuasive in speaking or writing.',
    ambiguous: 'Open to more than one interpretation; having a double meaning.',
    volatile: 'Liable to change rapidly and unpredictably.',
    pragmatic: 'Dealing with things sensibly and realistically.',
    inherent: 'Existing in something as a permanent, essential, or characteristic attribute.',
    substantial: 'Of considerable importance, size, or worth.',
};

function staticDefinition(word) {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    return STATIC_DICT[w] || `"${word}" — definition not found in offline dictionary. Configure an AI API for contextual explanations.`;
}

/**
 * Smart wrapper: routes to Edge Function if Supabase is configured, else to local OpenAI.
 * Matches the signature of callOpenAIStructured for drop-in replacement.
 */
async function smartStructuredCall({ apiKey, model, systemPrompt, userPrompt, schemaName, schema, signal }) {
    if (isSupabaseConfigured()) {
        return callEdgeFunctionStructured(systemPrompt, userPrompt, schemaName, schema);
    }
    return smartStructuredCall({ apiKey, model, systemPrompt, userPrompt, schemaName, schema, signal });
}

/**
 * Chama Edge Function do Supabase como proxy de IA.
 */
async function callEdgeFunction(systemPrompt, userPrompt, { mode, schema, schemaName } = {}) {
    const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: { systemPrompt, userPrompt, mode, schema, schemaName },
    });
    if (error) throw new Error(error.message || 'Edge Function error');
    if (data?.error) throw new Error(data.error);
    return data?.result;
}

/**
 * Chama Edge Function com structured output (JSON schema).
 */
async function callEdgeFunctionStructured(systemPrompt, userPrompt, schemaName, schema) {
    return callEdgeFunction(systemPrompt, userPrompt, { mode: 'structured', schema, schemaName });
}

/**
 * Chama a IA — Edge Function (Supabase) ou direta (local keys como fallback)
 */
async function callAI(config, systemPrompt, userPrompt, signal) {
    // Prefer Edge Function via Supabase
    if (isSupabaseConfigured()) {
        return callEdgeFunction(systemPrompt, userPrompt);
    }

    // Fallback to local keys
    if (!config) throw new Error('No AI configured');

    if (config?.provider === 'openai' || isSupabaseConfigured()) {
        return callOpenAI({
            apiKey: config.openaiKey,
            model: config.openaiModel || 'gpt-5.4-nano',
            systemPrompt,
            userPrompt,
            signal,
        });
    } else if (config.provider === 'gemini') {
        return callGemini({
            apiKey: config.geminiKey,
            model: config.geminiModel || 'gemini-2.0-flash',
            systemPrompt,
            userPrompt,
            signal,
        });
    }
    throw new Error('Unknown provider');
}

const LOCAL_SENTENCE_TEMPLATES = {
    positive: [
        { en: 'The presentation had {word} elements that impressed the audience.', pt: 'A apresentação tinha elementos {word} que impressionaram o público.' },
        { en: 'She gave a clear and {word} explanation of the topic.', pt: 'Ela deu uma explicação clara e {word} sobre o assunto.' },
        { en: 'The results were {word}, exceeding all expectations.', pt: 'Os resultados foram {word}, superando todas as expectativas.' },
        { en: 'He made a {word} decision that changed the outcome.', pt: 'Ele tomou uma decisão {word} que mudou o resultado.' },
        { en: 'Learning {word} skills can open many career doors.', pt: 'Aprender habilidades {word} pode abrir muitas portas na carreira.' },
        { en: 'The {word} approach helped solve the problem efficiently.', pt: 'A abordagem {word} ajudou a resolver o problema de forma eficiente.' },
        { en: 'It is important to stay {word} when things get difficult.', pt: 'É importante permanecer {word} quando as coisas ficam difíceis.' },
        { en: 'The team used a {word} strategy to meet the deadline.', pt: 'A equipe usou uma estratégia {word} para cumprir o prazo.' },
    ],
    negative: [
        { en: 'Without a {word} plan, the project fell apart quickly.', pt: 'Sem um plano {word}, o projeto desmoronou rapidamente.' },
        { en: 'She never expected such a {word} response from the team.', pt: 'Ela nunca esperou uma resposta tão {word} da equipe.' },
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

function extractJSONObject(raw) {
    const normalized = raw.replace(/```json?/gi, '').replace(/```/g, '').trim();
    const firstBrace = normalized.indexOf('{');
    const lastBrace = normalized.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('No JSON object found in AI response.');
    }

    return normalized.slice(firstBrace, lastBrace + 1);
}

function normalizeSentenceItem(sentence, index) {
    const english = String(sentence?.english || '').trim();
    const portuguese = String(sentence?.portuguese || '').trim();
    const type = ['positive', 'negative', 'past', 'future'].includes(sentence?.type) ? sentence.type : (index === 1 ? 'negative' : index === 2 ? 'past' : 'positive');

    if (!english || !portuguese) {
        throw new Error('Incomplete sentence payload returned by AI.');
    }

    return { english, portuguese, type };
}

function parseSentencePayload(raw) {
    const parsed = JSON.parse(extractJSONObject(raw));
    if (!parsed || typeof parsed.word !== 'string' || !Array.isArray(parsed.sentences) || parsed.sentences.length < 3) {
        throw new Error('Invalid sentence payload returned by AI.');
    }

    return {
        word: String(parsed.word || '').trim(),
        sentences: parsed.sentences.slice(0, 3).map(normalizeSentenceItem),
    };
}

const SENTENCE_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        word: { type: 'string' },
        sentences: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    english: { type: 'string' },
                    portuguese: { type: 'string' },
                    type: { type: 'string', enum: ['positive', 'negative', 'past', 'future'] },
                },
                required: ['english', 'portuguese', 'type'],
            },
        },
    },
    required: ['word', 'sentences'],
};

function buildSentencePrompts(word, originalSentence, userLevel) {
    const systemPrompt = `You generate sentence exercises for a Brazilian learner studying English.
Return ONLY valid JSON. No markdown. No commentary.
CEFR level: ${userLevel || 'B1'}.

CRITICAL RULES:
- The "english" field must be a natural English sentence that uses the target word.
- The "portuguese" field must be a 100% NATURAL Brazilian Portuguese translation.
- NEVER mix English words into the Portuguese translation. The Portuguese must be fully in Portuguese.
- Example: if target word is "friends", the Portuguese should say "amigos", NOT "friends".
- Keep sentences about everyday situations (work, school, shopping, food, travel, relationships).
- Sentences must be short (5-10 words in English).`;

    const userPrompt = `Target English word: "${word}"
${originalSentence ? `Context where user found it: "${originalSentence}"` : ''}

Generate 3 sentences using "${word}" in English with natural Portuguese translations.

{
  "word": "${word}",
  "sentences": [
    { "english": "I made new friends at school.", "portuguese": "Eu fiz novos amigos na escola.", "type": "positive" },
    { "english": "He doesn't have many friends here.", "portuguese": "Ele não tem muitos amigos aqui.", "type": "negative" },
    { "english": "We were good friends in college.", "portuguese": "Nós éramos bons amigos na faculdade.", "type": "past" }
  ]
}

Rules:
- Exactly 3 sentences: positive, negative, past.
- "${word}" must appear naturally in every English sentence.
- Portuguese translations must be 100% in Portuguese — NO English words mixed in.
- Short everyday sentences matching ${userLevel || 'B1'} level.`;

    return { systemPrompt, userPrompt };
}

// ── Translation Exercise (Escrever) ──────────────────────────────────────────

const TRANSLATION_SESSION_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        sentences: {
            type: 'array',
            minItems: 1,
            maxItems: 10,
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    portuguese: { type: 'string' },
                    english: { type: 'string' },
                    alternatives: { type: 'array', items: { type: 'string' } },
                    targetWord: { type: 'string' },
                },
                required: ['portuguese', 'english', 'alternatives', 'targetWord'],
            },
        },
    },
    required: ['sentences'],
};

function buildTranslationPrompts(words, cefrLevel) {
    const wordList = words.map(w => w.word).join(', ');

    const systemPrompt = `You generate translation exercises for a Brazilian learner studying English.
Return ONLY valid JSON. No markdown. No commentary.
CEFR level: ${cefrLevel || 'B1'}.

CRITICAL RULES:
- "portuguese" field: 100% natural Brazilian Portuguese. NEVER include English words.
- "english" field: the correct English translation using the target vocabulary word.
- "alternatives": 1-2 other valid ways to say it in English.
- "targetWord": the English vocabulary word being practiced.
- Sentences must be everyday situations a Brazilian would actually say.`;

    const userPrompt = `English vocabulary to practice: ${wordList}

Generate ${words.length} sentences. The user will see the Portuguese and must translate to English.

Example:
{
  "sentences": [
    {
      "portuguese": "Ela vai ao mercado toda semana para comprar frutas frescas.",
      "english": "She goes to the market every week to buy fresh fruit.",
      "alternatives": ["She visits the market weekly to buy fresh fruit."],
      "targetWord": "market"
    }
  ]
}

Rules:
- Portuguese must be 100% in Portuguese — NO English words mixed in.
- The English translation must naturally use one of these words: ${wordList}
- Short everyday sentences (8-15 words).
- Realistic situations: shopping, work, family, cooking, travel, health, hobbies.`;

    return { systemPrompt, userPrompt };
}

function normalizeTranslationSentences(sentences) {
    return (sentences || [])
        .filter(s => s?.portuguese && s?.english)
        .map(s => ({
            portuguese: String(s.portuguese).trim(),
            english: String(s.english).trim(),
            alternatives: Array.isArray(s.alternatives)
                ? s.alternatives.map(a => String(a).trim()).filter(Boolean)
                : [],
            targetWord: String(s.targetWord || '').trim(),
        }));
}

function parseTranslationPayload(raw) {
    const normalized = raw.replace(/```json?/gi, '').replace(/```/g, '').trim();
    const firstBrace = normalized.indexOf('{');
    const lastBrace = normalized.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace <= firstBrace) throw new Error('No JSON found');
    const parsed = JSON.parse(normalized.slice(firstBrace, lastBrace + 1));
    if (!Array.isArray(parsed?.sentences)) throw new Error('Invalid translation payload');
    return normalizeTranslationSentences(parsed.sentences);
}

/**
 * Gera frases em INGLÊS para exercícios de tradução reversa EN→PT.
 * O usuário recebe frase em inglês e precisa traduzir para português.
 * Retorna array de { portuguese, english, alternatives, targetWord } ou null se falhar.
 */
function buildReverseTranslationPrompts(words, cefrLevel) {
    const wordList = words.map(w => w.word).join(', ');

    const systemPrompt = `You generate English→Portuguese translation exercises for a Brazilian learner.
Return ONLY valid JSON. No markdown. No commentary.
CEFR level: ${cefrLevel || 'B1'}.

The user will see an English sentence and must translate it to Brazilian Portuguese.
- "english": the prompt sentence the user sees (must use the target word).
- "portuguese": the expected Portuguese translation (100% in Portuguese).
- "alternatives": 1-2 other valid Portuguese phrasings.`;

    const userPrompt = `English vocabulary to practice: ${wordList}

Generate ${words.length} sentences. The user sees English and writes Portuguese.

Example:
{
  "sentences": [
    {
      "english": "She goes to the market every week to buy fresh fruit.",
      "portuguese": "Ela vai ao mercado toda semana para comprar frutas frescas.",
      "alternatives": ["Ela vai à feira toda semana comprar frutas frescas."],
      "targetWord": "market"
    }
  ]
}

Rules:
- English sentences must naturally use one of: ${wordList}
- Portuguese translations must be natural Brazilian Portuguese.
- Be lenient with alternatives — accept informal and formal phrasings.
- Short everyday sentences (8-15 words).`;

    return { systemPrompt, userPrompt };
}

export async function generateReverseTranslationSentences({ words, cefrLevel, config, signal }) {
    if (!config?.provider || !words?.length) return null;

    const { systemPrompt, userPrompt } = buildReverseTranslationPrompts(words, cefrLevel);

    try {
        if (config?.provider === 'openai' || isSupabaseConfigured()) {
            try {
                const parsed = await smartStructuredCall({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    schemaName: 'langflow_reverse_translation_session',
                    schema: TRANSLATION_SESSION_SCHEMA,
                    signal,
                });
                return normalizeTranslationSentences(parsed.sentences);
            } catch {
                const raw = await callOpenAI({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    maxTokens: 1200,
                    signal,
                });
                return parseTranslationPayload(raw);
            }
        }

        const raw = await callAI(config, systemPrompt, userPrompt, signal);
        return parseTranslationPayload(raw);
    } catch {
        return null;
    }
}

/**
 * Avalia tradução reversa EN→PT semanticamente via IA.
 */
export async function evaluateSemanticReverseTranslation({ original, expected, userAnswer, userLevel, config, signal }) {
    if (!config?.provider && !isSupabaseConfigured()) {
        const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-záàâãéèêíïóôõúüç\s]/g, '').split(/\s+/).filter(Boolean);
        const expectedWords = normalize(expected);
        const answerWords = new Set(normalize(userAnswer));
        const matches = expectedWords.filter(w => answerWords.has(w)).length;
        const ratio = expectedWords.length > 0 ? matches / expectedWords.length : 0;
        const score = Math.round(ratio * 10);
        const correct = score >= 7;

        return {
            score,
            correct,
            note: correct ? 'Correto segundo os critérios básicos offline.' : 'Incorreto. Tente usar as palavras da frase esperada.',
            fromAI: false,
        };
    }

    const systemPrompt = `You are a Portuguese teacher evaluating a translation from English to Brazilian Portuguese.
Your goal is to score the translation on a scale of 0-10 based on meaning accuracy, grammar, and naturalness.
Be lenient with accent marks and minor spelling variations.

Scoring guide:
- 10: Perfect or near-perfect translation
- 7-9: Correct meaning with minor issues
- 4-6: Partially correct, core meaning understood but significant errors
- 1-3: Major errors, meaning largely lost
- 0: Completely wrong or unrelated

Reply ONLY in valid JSON format:
{
  "score": number,
  "note": string
}`;

    const userPrompt = `English original: "${original}"
Expected Portuguese: "${expected}"
User's translation: "${userAnswer}"

Score the translation from 0-10 and explain briefly. Respond in JSON.`;

    if (config?.provider === 'openai' || isSupabaseConfigured()) {
        try {
            const parsed = await smartStructuredCall({
                apiKey: config.openaiKey,
                model: config.openaiModel || 'gpt-5.4-nano',
                systemPrompt,
                userPrompt,
                schemaName: 'langflow_reverse_eval',
                schema: {
                    type: "object",
                    properties: {
                        score: { type: "number" },
                        note: { type: "string" }
                    },
                    required: ["score", "note"],
                    additionalProperties: false,
                },
                signal,
            });
            const score = Math.max(0, Math.min(10, Math.round(Number(parsed.score) || 0)));
            return { score, correct: score >= 7, note: parsed.note || '', fromAI: true };
        } catch {
            // fall through to text-based
        }
    }

    const raw = await callAI(config, systemPrompt, userPrompt, signal);
    try {
        const cleaned = raw.replace(/```json?/gi, '').replace(/```/g, '').trim();
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        const parsed = JSON.parse(cleaned.slice(start, end + 1));
        const score = Math.max(0, Math.min(10, Math.round(Number(parsed.score) || 0)));
        return { score, correct: score >= 7, note: parsed.note || '', fromAI: true };
    } catch {
        return { score: 0, correct: false, note: 'Não foi possível avaliar a tradução.', fromAI: false };
    }
}

/**
 * Gera frases em português para exercícios de tradução PT→EN (Escrever).
 * Retorna array de { portuguese, english, alternatives, targetWord } ou null se falhar.
 */
export async function generateTranslationSentences({ words, cefrLevel, config, signal }) {
    if (!config?.provider || !words?.length) return null;

    const { systemPrompt, userPrompt } = buildTranslationPrompts(words, cefrLevel);

    try {
        if (config?.provider === 'openai' || isSupabaseConfigured()) {
            try {
                const parsed = await smartStructuredCall({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    schemaName: 'langflow_translation_session',
                    schema: TRANSLATION_SESSION_SCHEMA,
                    signal,
                });
                return normalizeTranslationSentences(parsed.sentences);
            } catch {
                const raw = await callOpenAI({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    maxTokens: 1200,
                    signal,
                });
                return parseTranslationPayload(raw);
            }
        }

        const raw = await callAI(config, systemPrompt, userPrompt, signal);
        return parseTranslationPayload(raw);
    } catch {
        return null;
    }
}

/**
 * Avalia localmente se a tradução do usuário está correta.
 * Compara (case-insensitive, sem pontuação) contra o esperado + alternativas.
 */
export function evaluateTranslation(userAnswer, expected, alternatives = []) {
    const normalize = (str) =>
        String(str || '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

    const normalizedUser = normalize(userAnswer);
    const allExpected = [expected, ...alternatives].map(normalize);
    const correct = allExpected.some(exp => exp === normalizedUser);
    return { correct };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gera explicação contextual de uma palavra (Tooltip M2)
 */
export async function explainWord({ word, sentence, userLevel, config }) {
    if (!config?.provider && !isSupabaseConfigured()) {
        return { text: staticDefinition(word), fromAI: false };
    }

    const systemPrompt = `You are an English vocabulary assistant. Explain words simply and in context.
The user's English level is ${userLevel || 'B1'}.
Always explain in English. Keep explanations under 3 sentences. Be concise and clear.`;

    const userPrompt = `Word: "${word}"
Sentence: "${sentence}"
Explain what "${word}" means in this context.
Use simple English. Do not translate to Portuguese.`;

    const text = await callAI(config, systemPrompt, userPrompt);
    return { text, fromAI: true };
}

/**
 * Gera frases para Drag & Drop (M3)
 * Retorna JSON: { word, sentences: [{english, portuguese, type}] }
 */
export async function generateSentences({ word, originalSentence, userLevel, config, signal }) {
    if (!config?.provider && !isSupabaseConfigured()) {
        return buildLocalSentenceSet(word);
    }

    const { systemPrompt, userPrompt } = buildSentencePrompts(word, originalSentence, userLevel);

    if (config?.provider === 'openai' || isSupabaseConfigured()) {
        try {
            const parsed = await smartStructuredCall({
                apiKey: config.openaiKey,
                model: config.openaiModel || 'gpt-5.4-nano',
                systemPrompt,
                userPrompt,
                schemaName: 'langflow_sentence_set',
                schema: SENTENCE_SCHEMA,
                signal,
            });

            return {
                word: String(parsed.word || word).trim() || word,
                sentences: parsed.sentences.map(normalizeSentenceItem),
            };
        } catch {
            const raw = await callOpenAI({
                apiKey: config.openaiKey,
                model: config.openaiModel || 'gpt-5.4-nano',
                systemPrompt,
                userPrompt,
                maxTokens: 800,
                signal,
            });

            const parsed = parseSentencePayload(raw);
            return {
                word: parsed.word || word,
                sentences: parsed.sentences,
            };
        }
    }

    const raw = await callAI(config, systemPrompt, userPrompt, signal);
    const parsed = parseSentencePayload(raw);

    return {
        word: parsed.word || word,
        sentences: parsed.sentences,
    };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Explica um erro gramatical ou de construção de frase (M3/Builder)
 */
/**
 * Error categories for tracking patterns.
 * The AI will classify errors into one of these buckets.
 */
export const ERROR_CATEGORIES = [
    'word_order',
    'verb_tense',
    'preposition',
    'article',
    'spelling',
    'vocabulary',
    'plural_singular',
    'pronoun',
    'conjunction',
    'other',
];

/**
 * Traduz uma frase EN→PT para contextual flashcards (sentence mining).
 */
export async function translateSentenceForContext({ sentence, word, config, signal }) {
    if (!config?.provider && !isSupabaseConfigured()) return null;

    const systemPrompt = `You translate English sentences to natural Brazilian Portuguese.
Return only the Portuguese translation, nothing else. No quotes, no explanation.`;

    const userPrompt = `Translate to Brazilian Portuguese:
"${sentence}"
(Target vocabulary word: "${word}")`;

    try {
        const raw = await callAI(config, systemPrompt, userPrompt, signal);
        return raw?.trim().replace(/^["']|["']$/g, '') || null;
    } catch {
        return null;
    }
}

/**
 * Gera frases de contexto para palavras seed importadas em batch.
 * Recebe array de words (strings), retorna map { word: { english, portuguese } }.
 */
export async function generateSeedContextSentences({ words, cefrLevel, config, signal }) {
    if (!config?.provider || !words?.length) return {};

    const BATCH_SIZE = 12;
    const results = {};

    for (let i = 0; i < words.length; i += BATCH_SIZE) {
        const batch = words.slice(i, i + BATCH_SIZE);
        const wordList = batch.join(', ');

        const systemPrompt = `You generate example sentences for English vocabulary words for a Brazilian learner at CEFR ${cefrLevel || 'B1'} level.
For each word, create ONE natural everyday sentence in English and its Brazilian Portuguese translation.

Reply ONLY in valid JSON format:
{
  "sentences": [
    { "word": "...", "english": "...", "portuguese": "..." }
  ]
}`;

        const userPrompt = `Generate one example sentence for each word: ${wordList}

Each sentence should:
- Use the word naturally in an everyday context
- Be appropriate for ${cefrLevel || 'B1'} level
- Be 6-15 words long`;

        try {
            if (config?.provider === 'openai' || isSupabaseConfigured()) {
                try {
                    const parsed = await smartStructuredCall({
                        apiKey: config.openaiKey,
                        model: config.openaiModel || 'gpt-5.4-nano',
                        systemPrompt,
                        userPrompt,
                        schemaName: 'langflow_seed_context',
                        schema: {
                            type: "object",
                            properties: {
                                sentences: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            word: { type: "string" },
                                            english: { type: "string" },
                                            portuguese: { type: "string" }
                                        },
                                        required: ["word", "english", "portuguese"],
                                        additionalProperties: false
                                    }
                                }
                            },
                            required: ["sentences"],
                            additionalProperties: false
                        },
                        signal,
                    });
                    if (parsed?.sentences) {
                        parsed.sentences.forEach(s => {
                            if (s.word && s.english) {
                                results[s.word.toLowerCase()] = { english: s.english, portuguese: s.portuguese || '' };
                            }
                        });
                    }
                    continue;
                } catch {
                    // fall through to generic
                }
            }

            const raw = await callAI(config, systemPrompt, userPrompt, signal);
            const match = raw.match(/\{[\s\S]*\}/);
            if (match) {
                const parsed = JSON.parse(match[0]);
                if (parsed?.sentences) {
                    parsed.sentences.forEach(s => {
                        if (s.word && s.english) {
                            results[s.word.toLowerCase()] = { english: s.english, portuguese: s.portuguese || '' };
                        }
                    });
                }
            }
        } catch (e) {
            console.error('Seed context generation batch failed:', e);
        }
    }

    return results;
}

/**
 * Gera exercícios de reforço direcionado baseados em categorias fracas.
 */
export async function generateReinforcementExercises({ words, weakCategories, cefrLevel, config, signal }) {
    if (!config?.provider || !words?.length || !weakCategories?.length) return null;

    const categoryDescriptions = {
        word_order: 'word order in sentences',
        verb_tense: 'verb tense usage (past, present, future, perfect)',
        preposition: 'preposition choice (in, on, at, for, to, with, by)',
        article: 'article usage (a, an, the, zero article)',
        spelling: 'common spelling mistakes',
        vocabulary: 'vocabulary precision and word choice',
        plural_singular: 'singular vs plural forms',
        pronoun: 'pronoun usage (he/him/his, they/them)',
        conjunction: 'connecting words (and, but, because, although)',
    };

    const focusAreas = weakCategories.map(cat => categoryDescriptions[cat] || cat).join('; ');
    const wordList = words.map(w => w.word || w).join(', ');

    const systemPrompt = `You generate targeted PT→EN translation exercises for a Brazilian English learner.
These exercises specifically test weak grammar areas: ${focusAreas}.
Return only valid JSON. No markdown. Target CEFR level: ${cefrLevel || 'B1'}.`;

    const userPrompt = `Vocabulary words: ${wordList}
Weak grammar areas to test: ${focusAreas}

Generate ${Math.max(words.length, 2)} Portuguese sentences that specifically create opportunities for the listed grammar mistakes.

Return:
{
  "sentences": [
    {
      "portuguese": "...",
      "english": "...",
      "alternatives": ["..."],
      "targetWord": "...",
      "focusCategory": "preposition"
    }
  ]
}`;

    try {
        if (config?.provider === 'openai' || isSupabaseConfigured()) {
            try {
                const parsed = await smartStructuredCall({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    schemaName: 'langflow_reinforcement',
                    schema: TRANSLATION_SESSION_SCHEMA,
                    signal,
                });
                return normalizeTranslationSentences(parsed.sentences);
            } catch {
                const raw = await callOpenAI({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    maxTokens: 1200,
                    signal,
                });
                return parseTranslationPayload(raw);
            }
        }

        const raw = await callAI(config, systemPrompt, userPrompt, signal);
        return parseTranslationPayload(raw);
    } catch {
        return null;
    }
}

/**
 * Gera um micro-diálogo situacional para prática conversacional.
 */
export async function generateMicroDialogue({ words, cefrLevel, focusCategory, config, signal }) {
    if (!config?.provider && !isSupabaseConfigured()) return null;

    const wordList = words?.length ? words.map(w => w.word || w).join(', ') : '';
    const focusNote = focusCategory ? `Try to create situations that test ${focusCategory} usage.` : '';

    const systemPrompt = `You create the FIRST message of a natural English conversation for a Brazilian ${cefrLevel || 'A2'} learner.
Return ONLY valid JSON. No markdown.

IMPORTANT: This is a CONVERSATIONAL exercise. The AI starts with ONE line, and the user will respond freely.
The dialogue is NOT pre-scripted — the user responds naturally and the system continues the conversation dynamically.

Rules:
- Scene description in Portuguese (natural, informal).
- The AI's first line must be simple, friendly, and invite a response.
- Include a Portuguese translation of the AI line.
- Use everyday vocabulary matching ${cefrLevel || 'A2'} level.
- Scenarios: café, supermarket, airport, hotel, doctor, restaurant, bus, clothing store, gym, park, school, work, etc.`;

    const userPrompt = `Create a conversation starter for level ${cefrLevel || 'A2'}.
${wordList ? `Try to create a scenario where these words might come up: ${wordList}` : ''}
${focusNote}

Return ONLY the scene + the FIRST AI line. The rest of the conversation will happen dynamically.

{
  "scene": "Você está num café. Você encontra um colega de trabalho que não via há tempo.",
  "turns": [
    { "role": "ai", "text": "Hey! Long time no see! How have you been?", "textPT": "Oi! Quanto tempo! Como você tem passado?" }
  ],
  "targetWords": ["been", "time"]
}

Rules:
- Only 1 AI turn (the opening line). The conversation continues dynamically.
- The scene must be relatable and specific (not generic).
- The AI line should be warm and naturally invite a response.
- Keep the English simple for ${cefrLevel || 'A2'} level.`;

    const DIALOGUE_SCHEMA = {
        type: "object",
        properties: {
            scene: { type: "string" },
            turns: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        role: { type: "string", enum: ["ai", "user"] },
                        text: { type: "string" },
                        textPT: { type: "string" },
                        expectedEN: { type: "string" },
                        alternatives: { type: "array", items: { type: "string" } },
                    },
                    required: ["role"],
                    additionalProperties: false,
                },
            },
            targetWords: { type: "array", items: { type: "string" } },
        },
        required: ["scene", "turns"],
        additionalProperties: false,
    };

    try {
        if (config?.provider === 'openai' || isSupabaseConfigured()) {
            try {
                return await smartStructuredCall({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    schemaName: 'langflow_dialogue',
                    schema: DIALOGUE_SCHEMA,
                    signal,
                });
            } catch {
                // fall through
            }
        }

        const raw = await callAI(config, systemPrompt, userPrompt, signal);
        const cleaned = raw.replace(/```json?/gi, '').replace(/```/g, '').trim();
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
        return null;
    }
}

/**
 * Avalia resposta do usuário em um micro-diálogo.
 */
/**
 * Avalia resposta do usuário num micro-diálogo de forma conversacional.
 * Retorna:
 *   understandable: boolean — se a IA consegue entender e continuar
 *   corrections: string — erros anotados (vazio se perfeito)
 *   correctedVersion: string — versão corrigida da frase
 *   nextAiLine: string — próxima fala da IA continuando a conversa
 *   nextAiLinePT: string — tradução da próxima fala
 */
export async function evaluateDialogueResponse({ scene, aiLine, userResponse, conversationSoFar, userLevel, config, signal }) {
    if (!config?.provider && !isSupabaseConfigured()) {
        return { understandable: true, corrections: '', correctedVersion: '', nextAiLine: '', nextAiLinePT: '' };
    }

    const EVAL_SCHEMA = {
        type: "object",
        properties: {
            understandable: { type: "boolean" },
            corrections: { type: "string" },
            correctedVersion: { type: "string" },
            nextAiLine: { type: "string" },
            nextAiLinePT: { type: "string" },
        },
        required: ["understandable", "corrections", "correctedVersion", "nextAiLine", "nextAiLinePT"],
        additionalProperties: false,
    };

    const systemPrompt = `You are a friendly English conversation partner for a Brazilian ${userLevel || 'A2'} learner.
Scene: ${scene}

You are having a NATURAL conversation. Your job:
1. Decide if the user's reply makes sense in context (understandable = true/false)
2. Silently note grammar errors (the user will see these LATER, not now)
3. Continue the conversation naturally

Rules:
- understandable: false ONLY if completely incomprehensible or totally random/off-topic
- corrections: brief notes in Portuguese about errors (e.g., "faltou 'the' antes de 'market'", "verbo deveria ser 'went' no passado"). Empty string "" if perfect.
- correctedVersion: the user's sentence properly corrected. Copy user input exactly if perfect.
- nextAiLine: YOUR next conversational line in English. Be natural, ask follow-up questions, react to what they said. Keep it simple for ${userLevel || 'A2'}.
- nextAiLinePT: Brazilian Portuguese translation of your line.

IMPORTANT: You are a conversation PARTNER, not a teacher. React to the CONTENT of what the user says, not to their grammar. If they say something interesting, engage with it!

Reply ONLY in valid JSON.`;

    const historyText = (conversationSoFar || [])
        .map(t => `${t.role === 'ai' ? 'AI' : 'User'}: ${t.text}`)
        .join('\n');

    const userPrompt = `${historyText ? `Conversation:\n${historyText}\n` : ''}AI: ${aiLine}
User: ${userResponse}

Continue the conversation naturally. Reply in JSON.`;

    try {
        if (config?.provider === 'openai' || isSupabaseConfigured()) {
            try {
                const parsed = await smartStructuredCall({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-5.4-nano',
                    systemPrompt,
                    userPrompt,
                    schemaName: 'langflow_dialogue_eval_v2',
                    schema: EVAL_SCHEMA,
                    signal,
                });
                return {
                    understandable: parsed.understandable !== false,
                    corrections: parsed.corrections || '',
                    correctedVersion: parsed.correctedVersion || userResponse,
                    nextAiLine: parsed.nextAiLine || '',
                    nextAiLinePT: parsed.nextAiLinePT || '',
                    fromAI: true,
                };
            } catch {
                // fall through
            }
        }

        const raw = await callAI(config, systemPrompt, userPrompt, signal);
        const cleaned = raw.replace(/```json?/gi, '').replace(/```/g, '').trim();
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        const parsed = JSON.parse(cleaned.slice(start, end + 1));
        return {
            understandable: parsed.understandable !== false,
            corrections: parsed.corrections || '',
            correctedVersion: parsed.correctedVersion || userResponse,
            nextAiLine: parsed.nextAiLine || '',
            nextAiLinePT: parsed.nextAiLinePT || '',
            fromAI: true,
        };
    } catch {
        return { understandable: true, corrections: '', correctedVersion: userResponse, nextAiLine: '', nextAiLinePT: '' };
    }
}

export async function explainGrammarError({ expected, userAnswer, userLevel, config, signal }) {
    if (!config?.provider && !isSupabaseConfigured()) {
        return { text: 'Verifique a ordem das palavras e tente novamente.', fromAI: false, errorCategory: 'other' };
    }

    const categoriesList = ERROR_CATEGORIES.join(', ');

    const systemPrompt = `You are a friendly English tutor helping a Brazilian learner (level ${userLevel || 'B1'}).
Explain the mistake in Portuguese. Be brief, specific, and encouraging.

Format your response like this:
1. What was wrong (1 sentence, be specific about the grammar rule)
2. Why the correct version works (1 sentence)
3. A simple tip to remember (1 sentence, practical)

Keep English words in "quotes". Use informal Portuguese (você, não tu).

IMPORTANT: On the VERY LAST line, write ONLY one error category from: ${categoriesList}
Nothing else on that line — just the category tag.`;

    const userPrompt = `Frase correta: "${expected}"
O aluno escreveu: "${userAnswer}"

Explique o erro de forma clara e curta.`;

    const rawText = await callAI(config, systemPrompt, userPrompt, signal);

    // Parse category from last line
    const lines = rawText.trim().split('\n').filter(l => l.trim());
    const lastLine = (lines.at(-1) || '').trim().toLowerCase().replace(/[^a-z_]/g, '');
    const errorCategory = ERROR_CATEGORIES.includes(lastLine) ? lastLine : 'other';

    // Remove category tag from displayed explanation
    const text = errorCategory !== 'other' && lines.length > 1
        ? lines.slice(0, -1).join('\n').trim()
        : rawText.trim();

    return { text, fromAI: true, errorCategory };
}

/**
 * Avalia se uma tradução está semanticamente correta, mesmo que não seja a string exata (M4/Escrever)
 */
export async function evaluateSemanticTranslation({ original, expected, userAnswer, userLevel, config, signal }) {
    if (!config?.provider && !isSupabaseConfigured()) {
       // Fallback: normalize definida localmente para não depender de escopo externo
       const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
       const expectedWords = normalize(expected);
       const answerWords = new Set(normalize(userAnswer));
       const matches = expectedWords.filter(w => answerWords.has(w)).length;
       const ratio = expectedWords.length > 0 ? matches / expectedWords.length : 0;
       const score = Math.round(ratio * 10);
       const correct = score >= 7;

       return {
           score,
           correct,
           note: correct ? 'Correto segundo os critérios básicos offline.' : 'Incorreto. Tente usar as palavras da frase esperada.',
           fromAI: false,
       };
    }

    const systemPrompt = `You are an English teacher evaluating a translation from Portuguese to English.
Your goal is to score the translation on a scale of 0-10 based on meaning accuracy, grammar, and naturalness.

Scoring guide:
- 10: Perfect or near-perfect translation
- 7-9: Correct meaning with minor issues (article missing, slight word choice difference)
- 4-6: Partially correct, core meaning understood but significant errors
- 1-3: Major errors, meaning largely lost
- 0: Completely wrong or unrelated

Reply ONLY in valid JSON format:
{
  "score": number, // 0-10 integer score
  "note": string // A short (1 sentence), encouraging explanation or correction in Portuguese. Empty string if perfect.
}`;

    const userPrompt = `Portuguese original: "${original}"
Expected strictly correct English: "${expected}"
User's translation attempt: "${userAnswer}"

Score the translation from 0-10 and explain briefly. Respond in JSON.`;

    if (config?.provider === 'openai' || isSupabaseConfigured()) {
        try {
            const parsed = await smartStructuredCall({
                apiKey: config.openaiKey,
                model: config.openaiModel || 'gpt-5.4-nano',
                systemPrompt,
                userPrompt,
                schemaName: 'langflow_translation_eval',
                schema: {
                    type: "object",
                    properties: {
                        score: { type: "number" },
                        note: { type: "string" }
                    },
                    required: ["score", "note"],
                    additionalProperties: false
                },
                signal,
            });
            const score = Math.max(0, Math.min(10, Math.round(Number(parsed.score) || 0)));
            return {
                score,
                correct: score >= 7,
                note: parsed.note || '',
                fromAI: true
            };
        } catch (e) {
            console.error("OpenAI Struct Eval failed, falling back", e);
            // fallback handled down below
        }
    }

    try {
       const text = await callAI(config, systemPrompt, userPrompt, signal);
       // Attempt to parse out basic JSON from the raw text
       let jsonText = text;
       const match = text.match(/\{[\s\S]*\}/);
       if (match) jsonText = match[0];

       const parsed = JSON.parse(jsonText);
       const score = Math.max(0, Math.min(10, Math.round(Number(parsed.score) || 0)));
       return {
           score,
           correct: score >= 7,
           note: parsed.note || '',
           fromAI: true
       };
    } catch (e) {
        console.error("Fallback AI Eval failed", e);
        return { score: 0, correct: false, note: 'Não foi possível validar a tradução agora.', fromAI: false };
    }
}
