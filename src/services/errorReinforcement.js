// services/errorReinforcement.js — Análise de padrões de erro e seleção de reforço

const DAY_MS = 86400000;

/**
 * Analisa errorPatterns e retorna as top N categorias fracas
 * ordenadas por score ponderado (recência + frequência).
 */
export function getWeakCategories(errorPatterns, limit = 3) {
    const now = Date.now();

    return Object.entries(errorPatterns || {})
        .map(([category, data]) => {
            const recencyScore = data.lastSeen
                ? Math.max(0, 1 - (now - data.lastSeen) / (7 * DAY_MS))
                : 0;
            const frequencyScore = Math.min(1, (data.count || 0) / 10);
            const weight = (frequencyScore * 0.6) + (recencyScore * 0.4);
            return { category, ...data, weight };
        })
        .filter(e => e.weight > 0.1)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, limit);
}

/**
 * Seleciona palavras que causaram erros nas categorias fracas.
 * Retorna { words, categories } para uso na geração de exercícios.
 */
export function selectReinforcementWords(errorPatterns, allWords, limit = 3) {
    const weakCategories = getWeakCategories(errorPatterns, 3);
    const errorWordIds = new Set();

    weakCategories.forEach(cat => {
        (cat.words || []).forEach(id => errorWordIds.add(id));
    });

    const errorWords = allWords
        .filter(w => errorWordIds.has(w.id))
        .slice(0, limit);

    return {
        words: errorWords,
        categories: weakCategories.map(c => c.category),
    };
}
