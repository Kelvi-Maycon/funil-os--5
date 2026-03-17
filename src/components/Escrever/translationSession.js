// translationSession.js — Seleciona palavras para exercícios de tradução PT→EN

const WEAK_STATUSES = ['em_treino', 'reconhecida'];

/**
 * Seleciona palavras-alvo para a sessão de tradução.
 * Prioriza palavras fracas do vocabulário do usuário; completa com seed NGSL no nível certo.
 *
 * @param {Array} words - Lista de palavras do useWordStore
 * @param {string} userLevel - Nível CEFR do usuário (ex: 'B1')
 * @param {number} count - Número de palavras desejadas
 * @returns {Array}
 */
export function selectTranslationWords(words, userLevel, count = 5) {
    // Palavras não-seed com status fraco, ordenadas por fraqueza
    const weakWords = words
        .filter(w => WEAK_STATUSES.includes(w.status) && !w.isSeeded)
        .map(w => ({
            ...w,
            _weakness: Math.max(0, (w.errorCount || 0) - (w.correctCount || 0)) + (w.builderErrorStreak || 0),
        }))
        .sort((a, b) => b._weakness - a._weakness)
        .slice(0, count);

    if (weakWords.length >= count) return weakWords;

    // Completar com palavras seed do nível do usuário
    const needed = count - weakWords.length;
    const usedIds = new Set(weakWords.map(w => w.id));

    const seedWords = words
        .filter(w =>
            w.isSeeded &&
            !usedIds.has(w.id) &&
            (!w.cefrLevel || w.cefrLevel === userLevel)
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, needed);

    return [...weakWords, ...seedWords];
}
