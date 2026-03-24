// services/syncMiddleware.js — Auto-sync stores to Supabase on state changes
import { isSupabaseConfigured } from './supabase.js';
import { pushWords, pushSentences, pushFlashcards, pushProgress, pushConfig, deleteWord as remoteDeleteWord } from './sync.js';

let syncTimers = {};

/** Debounced sync — waits 1s after last change before pushing to Supabase */
function debouncedSync(key, fn, delay = 1000) {
  if (syncTimers[key]) clearTimeout(syncTimers[key]);
  syncTimers[key] = setTimeout(() => {
    fn().catch(err => console.error(`[sync:${key}] Error:`, err));
  }, delay);
}

/**
 * Subscribe stores to auto-sync to Supabase.
 * Call once at app init after stores are ready.
 */
export function setupAutoSync(stores) {
  if (!isSupabaseConfigured()) return;

  const { useWordStore, useCardStore, useProgressStore, useConfig } = stores;

  // Words — sync full array on change
  useWordStore.subscribe(
    (state, prevState) => {
      if (state.words !== prevState.words) {
        debouncedSync('words', () => pushWords(state.words));
      }
    }
  );

  // Cards — sync sentences + flashcards
  useCardStore.subscribe(
    (state, prevState) => {
      if (state.sentences !== prevState.sentences) {
        debouncedSync('sentences', () => pushSentences(state.sentences));
      }
      if (state.flashcards !== prevState.flashcards) {
        debouncedSync('flashcards', () => pushFlashcards(state.flashcards));
      }
    }
  );

  // Progress — sync full state
  useProgressStore.subscribe(
    (state, prevState) => {
      // Only sync if meaningful fields changed (not computed/derived)
      if (state.xp !== prevState.xp ||
          state.dailyStats !== prevState.dailyStats ||
          state.achievements !== prevState.achievements ||
          state.currentStreak !== prevState.currentStreak ||
          state.masteryXp !== prevState.masteryXp ||
          state.wordJourney !== prevState.wordJourney ||
          state.totals !== prevState.totals) {
        debouncedSync('progress', () => pushProgress(state), 2000);
      }
    }
  );

  // Config — sync on change
  useConfig.subscribe(
    (state, prevState) => {
      if (state.config !== prevState.config) {
        debouncedSync('config', () => pushConfig(state.config), 2000);
      }
    }
  );

  console.log('[sync] Auto-sync subscriptions active');
}
