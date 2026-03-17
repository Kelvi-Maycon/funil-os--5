// services/ai.js — Serviço unificado de IA
import { callOpenAI, callOpenAIStructured } from './openai.js';
import { callGemini } from './gemini.js';

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
 * Chama a IA configurada pelo usuário
 */
async function callAI(config, systemPrompt, userPrompt, signal) {
    if (!config) throw new Error('No AI configured');

    if (config.provider === 'openai') {
        return callOpenAI({
            apiKey: config.openaiKey,
            model: config.openaiModel || 'gpt-4o-mini',
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

export function buildLocalSentenceSet(word) {
    const cleanWord = String(word || '').trim() || 'word';
    return {
        word: cleanWord,
        sentences: [
            {
                english: `I learned the word "${cleanWord}" today.`,
                portuguese: `Eu aprendi a palavra "${cleanWord}" hoje.`,
                type: 'positive',
            },
            {
                english: `I don't know how to use "${cleanWord}" yet.`,
                portuguese: `Eu não sei como usar "${cleanWord}" ainda.`,
                type: 'negative',
            },
            {
                english: `We studied the word "${cleanWord}" yesterday.`,
                portuguese: `Nós estudamos a palavra "${cleanWord}" ontem.`,
                type: 'past',
            },
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
    const systemPrompt = `You generate sentence exercises for an English learning app.
Return only valid JSON.
No markdown.
No commentary.
Follow the exact schema.
Use natural English and natural Brazilian Portuguese.
Keep the output suitable for level ${userLevel || 'B1'}.`;

    const userPrompt = `Target word: "${word}"
Original context: "${originalSentence || ''}"

Return exactly:
{
  "word": "${word}",
  "sentences": [
    { "english": "...", "portuguese": "...", "type": "positive" },
    { "english": "...", "portuguese": "...", "type": "negative" },
    { "english": "...", "portuguese": "...", "type": "past" }
  ]
}

Rules:
- Exactly 3 sentences.
- First item type must be "positive".
- Second item type must be "negative".
- Third item type must be "past".
- Every English sentence must use the target word naturally.
- Keep sentences short to medium length.
- Do not leave any field empty.`;

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

    const systemPrompt = `You generate Portuguese→English translation exercises for a Brazilian English learner.
Return only valid JSON. No markdown. No commentary. Follow the exact schema.
Target CEFR level: ${cefrLevel || 'B1'}.`;

    const userPrompt = `Vocabulary words to include (use at least some): ${wordList}

Generate ${words.length} natural, everyday Brazilian Portuguese sentences. Each sentence must:
- Use one of the vocabulary words naturally in context
- Be a realistic everyday situation (shopping, work, family, travel, hobbies, etc.)
- Match CEFR level ${cefrLevel || 'B1'} (not too simple, not too complex)
- Have a clear English translation and 1-2 alternative valid English phrasings

Return exactly:
{
  "sentences": [
    {
      "portuguese": "Ela vai ao mercado toda semana para comprar frutas frescas.",
      "english": "She goes to the market every week to buy fresh fruit.",
      "alternatives": ["She visits the market every week to buy fresh fruit.", "She goes to the market weekly to buy fresh fruit."],
      "targetWord": "market"
    }
  ]
}`;

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
 * Gera frases em português para exercícios de tradução PT→EN (Escrever).
 * Retorna array de { portuguese, english, alternatives, targetWord } ou null se falhar.
 */
export async function generateTranslationSentences({ words, cefrLevel, config, signal }) {
    if (!config?.provider || !words?.length) return null;

    const { systemPrompt, userPrompt } = buildTranslationPrompts(words, cefrLevel);

    try {
        if (config.provider === 'openai') {
            try {
                const parsed = await callOpenAIStructured({
                    apiKey: config.openaiKey,
                    model: config.openaiModel || 'gpt-4o-mini',
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
                    model: config.openaiModel || 'gpt-4o-mini',
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
    if (!config?.provider) {
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
    if (!config?.provider) {
        return buildLocalSentenceSet(word);
    }

    const { systemPrompt, userPrompt } = buildSentencePrompts(word, originalSentence, userLevel);

    if (config.provider === 'openai') {
        try {
            const parsed = await callOpenAIStructured({
                apiKey: config.openaiKey,
                model: config.openaiModel || 'gpt-5-mini',
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
                model: config.openaiModel || 'gpt-5-mini',
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
export async function explainGrammarError({ expected, userAnswer, userLevel, config, signal }) {
    if (!config?.provider) {
        return { text: 'Verifique a ordem das palavras e tente novamente.', fromAI: false };
    }

    const systemPrompt = `You are a friendly English grammar tutor. Correct the user's mistake.
The user's English level is ${userLevel || 'B1'}.
Explain briefly (1-2 sentences) why their answer is wrong and why the expected answer is correct.
Speak directly to the user in Portuguese, but keep English words in quotes. Be encouraging.`;

    const userPrompt = `Expected correct phrase: "${expected}"
User typed: "${userAnswer}"
Explain the mistake.`;

    const text = await callAI(config, systemPrompt, userPrompt, signal);
    return { text, fromAI: true };
}

/**
 * Avalia se uma tradução está semanticamente correta, mesmo que não seja a string exata (M4/Escrever)
 */
export async function evaluateSemanticTranslation({ original, expected, userAnswer, userLevel, config, signal }) {
    if (!config?.provider) {
       // Fallback: se não tem IA, a resposta tem que conter a maior parte das palavras esperadas.
       const normalizedExpected = normalize(expected).split(' ');
       const normalizedUser = normalize(userAnswer);
       const matches = normalizedExpected.filter(w => normalizedUser.includes(w)).length;
       const correct = matches >= normalizedExpected.length * 0.7; // Exige 70% de match no fallback local
       
       return { 
           correct, 
           note: correct ? 'Correto segundo os critérios básicos salvos offline.' : 'Incorreto. Tente usar as palavras da frase esperada.',
           fromAI: false 
       };
    }

    const systemPrompt = `You are an English teacher evaluating a translation from Portuguese to English.
Your goal is to accept valid variations of translations, as long as the core meaning, tense, and target terminology are preserved.

Reply ONLY in valid JSON format:
{
  "correct": boolean, // true if the user's translation is semantically accurate and grammatically sound
  "note": string // A short (1 sentence), encouraging explanation or minor correction in Portuguese. Empty string if perfect.
}`;

    const userPrompt = `Portuguese original: "${original}"
Expected strictly correct English: "${expected}"
User's translation attempt: "${userAnswer}"

Is the user's translation an acceptable and correct way to say this in English? Respond in JSON.`;

    if (config.provider === 'openai') {
        try {
            const parsed = await callOpenAIStructured({
                apiKey: config.openaiKey,
                model: config.openaiModel || 'gpt-5-mini',
                systemPrompt,
                userPrompt,
                schemaName: 'langflow_translation_eval',
                schema: {
                    type: "object",
                    properties: {
                        correct: { type: "boolean" },
                        note: { type: "string" }
                    },
                    required: ["correct", "note"],
                    additionalProperties: false
                },
                signal,
            });
            return {
                correct: Boolean(parsed.correct),
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
       return {
           correct: Boolean(parsed.correct),
           note: parsed.note || '',
           fromAI: true
       };
    } catch (e) {
        console.error("Fallback AI Eval failed", e);
        return { correct: false, note: 'Não foi possível validar a tradução agora.', fromAI: false };
    }
}
