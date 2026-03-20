// DailySession/sessionBuilder.js — Monta o plano da sessão diária de 15 min
import { getWeakCategories, selectReinforcementWords } from '../../services/errorReinforcement.js';

/**
 * Monta um plano de sessão diária com 4 segmentos.
 */
export function buildDailySessionPlan({ dueCards, words, errorPatterns, config }) {
    // 1. Flashcard segment: up to 6 due cards (~3 min at ~30s each)
    const flashcardSlice = (dueCards || []).slice(0, 6);

    // 2. Error analysis for reinforcement
    const weakCategories = getWeakCategories(errorPatterns, 3);
    const { words: reinforcementWords } = selectReinforcementWords(errorPatterns, words, 3);

    // 3. Builder words: prefer reinforcement words, fill with active/training words
    const builderCandidates = reinforcementWords.length > 0
        ? reinforcementWords
        : words
            .filter(w => ['em_treino', 'ativa'].includes(w.status))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

    // 4. Translation words: active words for PT→EN
    const translationWords = words
        .filter(w => ['em_treino', 'ativa', 'reconhecida'].includes(w.status))
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    // 5. Dialogue config
    const dialogueWords = words
        .filter(w => ['ativa', 'em_treino'].includes(w.status))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    return {
        flashcards: flashcardSlice,
        builderWords: builderCandidates,
        translationWords,
        dialogueConfig: {
            words: dialogueWords,
            focusCategory: weakCategories[0]?.category || null,
        },
        weakCategories: weakCategories.map(c => c.category),
        startedAt: Date.now(),
    };
}
