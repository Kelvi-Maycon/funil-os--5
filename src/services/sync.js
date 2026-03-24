// services/sync.js — Sync bidirectional entre localStorage (Zustand) e Supabase
import { supabase, isSupabaseConfigured } from './supabase.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert camelCase JS object keys to snake_case for Supabase */
function toSnake(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const snakeKey = k.replace(/([A-Z])/g, '_$1').toLowerCase();
    out[snakeKey] = v;
  }
  return out;
}

/** Convert snake_case Supabase row to camelCase JS object */
function toCamel(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camelKey] = v;
  }
  return out;
}

// ── Words ────────────────────────────────────────────────────────────────────

export async function pushWords(words) {
  if (!isSupabaseConfigured() || !words?.length) return;
  const rows = words.map(w => {
    const row = toSnake(w);
    // masteryAwarded is JSONB
    if (w.masteryAwarded) row.mastery_awarded = w.masteryAwarded;
    delete row.created_at; // let DB handle
    return row;
  });
  const { error } = await supabase.from('words').upsert(rows, { onConflict: 'id' });
  if (error) console.error('pushWords error:', error);
}

export async function pullWords() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('words').select('*');
  if (error) { console.error('pullWords error:', error); return null; }
  return data.map(row => {
    const w = toCamel(row);
    if (row.mastery_awarded) w.masteryAwarded = row.mastery_awarded;
    return w;
  });
}

export async function pushWord(word) {
  if (!isSupabaseConfigured()) return;
  return pushWords([word]);
}

export async function deleteWord(id) {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.from('words').delete().eq('id', id);
  if (error) console.error('deleteWord error:', error);
}

// ── Sentences ────────────────────────────────────────────────────────────────

export async function pushSentences(sentences) {
  if (!isSupabaseConfigured() || !sentences?.length) return;
  const rows = sentences.map(s => {
    const row = toSnake(s);
    if (Array.isArray(s.words)) row.words = s.words; // JSONB
    delete row.created_at;
    return row;
  });
  const { error } = await supabase.from('sentences').upsert(rows, { onConflict: 'id' });
  if (error) console.error('pushSentences error:', error);
}

export async function pullSentences() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('sentences').select('*');
  if (error) { console.error('pullSentences error:', error); return null; }
  return data.map(toCamel);
}

// ── Flashcards ───────────────────────────────────────────────────────────────

export async function pushFlashcards(flashcards) {
  if (!isSupabaseConfigured() || !flashcards?.length) return;
  const rows = flashcards.map(f => {
    const row = toSnake(f);
    delete row.created_at;
    return row;
  });
  const { error } = await supabase.from('flashcards').upsert(rows, { onConflict: 'id' });
  if (error) console.error('pushFlashcards error:', error);
}

export async function pullFlashcards() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('flashcards').select('*');
  if (error) { console.error('pullFlashcards error:', error); return null; }
  return data.map(toCamel);
}

export async function pushFlashcard(card) {
  if (!isSupabaseConfigured()) return;
  return pushFlashcards([card]);
}

// ── Progress (singleton id=1) ────────────────────────────────────────────────

export async function pushProgress(progressState) {
  if (!isSupabaseConfigured()) return;
  const row = {
    id: 1,
    xp: progressState.xp,
    level: progressState.level,
    mastery_xp: progressState.masteryXp,
    current_streak: progressState.currentStreak,
    longest_streak: progressState.longestStreak,
    last_active_day: progressState.lastActiveDay,
    daily_stats: progressState.dailyStats,
    totals: progressState.totals,
    word_journey: progressState.wordJourney,
    achievements: progressState.achievements,
    daily_prompt_history: progressState.dailyPromptHistory,
    error_patterns: progressState.errorPatterns,
    builder_recent_results: progressState.builderRecentResults,
    auto_adjust_meta: progressState.autoAdjustMeta,
    last_xp_gain: progressState.lastXpGain,
  };
  const { error } = await supabase.from('progress').upsert(row, { onConflict: 'id' });
  if (error) console.error('pushProgress error:', error);
}

export async function pullProgress() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('progress').select('*').eq('id', 1).single();
  if (error) { console.error('pullProgress error:', error); return null; }
  return {
    xp: data.xp,
    level: data.level,
    masteryXp: data.mastery_xp,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    lastActiveDay: data.last_active_day,
    dailyStats: data.daily_stats || {},
    totals: data.totals || {},
    wordJourney: data.word_journey || {},
    achievements: data.achievements || [],
    dailyPromptHistory: data.daily_prompt_history || {},
    errorPatterns: data.error_patterns || {},
    builderRecentResults: data.builder_recent_results || [],
    autoAdjustMeta: data.auto_adjust_meta || {},
    lastXpGain: data.last_xp_gain,
  };
}

// ── Config (singleton id=1) ──────────────────────────────────────────────────

export async function pushConfig(configState) {
  if (!isSupabaseConfigured()) return;
  const row = {
    id: 1,
    user_level: configState.userLevel,
    provider: configState.provider || '',
    srs: configState.srs || {},
    builder: configState.builder || {},
    study: configState.study || {},
    onboarding_done: configState.onboardingDone ?? false,
    auto_adjust_difficulty: configState.autoAdjustDifficulty ?? true,
    tts: configState.tts || {},
    missions: configState.missions || {},
  };
  const { error } = await supabase.from('config').upsert(row, { onConflict: 'id' });
  if (error) console.error('pushConfig error:', error);
}

export async function pullConfig() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('config').select('*').eq('id', 1).single();
  if (error) { console.error('pullConfig error:', error); return null; }
  return {
    userLevel: data.user_level,
    provider: data.provider || '',
    srs: data.srs || {},
    builder: data.builder || {},
    study: data.study || {},
    onboardingDone: data.onboarding_done,
    autoAdjustDifficulty: data.auto_adjust_difficulty,
    tts: data.tts || {},
    missions: data.missions || {},
  };
}

// ── Full Sync ────────────────────────────────────────────────────────────────

/**
 * Pull all data from Supabase and merge into local stores.
 * Supabase is source of truth — remote data overwrites local for singletons.
 * For arrays (words, sentences, flashcards), merge by ID (remote wins on conflict).
 */
export async function syncAll(stores) {
  if (!isSupabaseConfigured()) return;

  const { useWordStore, useCardStore, useProgressStore, useConfig } = stores;

  try {
    // Pull all in parallel
    const [remoteWords, remoteSentences, remoteFlashcards, remoteProgress, remoteConfig] =
      await Promise.all([pullWords(), pullSentences(), pullFlashcards(), pullProgress(), pullConfig()]);

    // Merge words
    if (remoteWords?.length) {
      const localWords = useWordStore.getState().words;
      const remoteMap = new Map(remoteWords.map(w => [w.id, w]));
      const localMap = new Map(localWords.map(w => [w.id, w]));

      // Remote wins on conflict, keep local-only items
      const merged = [...remoteWords];
      for (const [id, localWord] of localMap) {
        if (!remoteMap.has(id)) merged.push(localWord);
      }
      useWordStore.setState({ words: merged });

      // Push local-only words to remote
      const localOnly = localWords.filter(w => !remoteMap.has(w.id));
      if (localOnly.length) await pushWords(localOnly);
    }

    // Merge sentences + flashcards
    if (remoteSentences || remoteFlashcards) {
      const localState = useCardStore.getState();

      if (remoteSentences?.length) {
        const remoteMap = new Map(remoteSentences.map(s => [s.id, s]));
        const localOnly = localState.sentences.filter(s => !remoteMap.has(s.id));
        useCardStore.setState({ sentences: [...remoteSentences, ...localOnly] });
        if (localOnly.length) await pushSentences(localOnly);
      }

      if (remoteFlashcards?.length) {
        const remoteMap = new Map(remoteFlashcards.map(f => [f.id, f]));
        const localOnly = localState.flashcards.filter(f => !remoteMap.has(f.id));
        useCardStore.setState({ flashcards: [...remoteFlashcards, ...localOnly] });
        if (localOnly.length) await pushFlashcards(localOnly);
      }
    }

    // Progress — remote wins (singleton)
    if (remoteProgress) {
      const local = useProgressStore.getState();
      // Keep whichever has more XP (simple heuristic for "more recent")
      if (remoteProgress.xp >= (local.xp || 0)) {
        useProgressStore.setState(remoteProgress);
      } else {
        await pushProgress(local);
      }
    }

    // Config — remote wins (singleton)
    if (remoteConfig && remoteConfig.onboardingDone) {
      useConfig.getState().setConfig(remoteConfig);
    }

    console.log('[sync] Full sync completed');
  } catch (err) {
    console.error('[sync] Full sync failed:', err);
  }
}
