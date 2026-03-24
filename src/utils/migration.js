// utils/migration.js — One-time migration from localStorage to Supabase
import { isSupabaseConfigured } from '../services/supabase.js';
import { pushWords, pushSentences, pushFlashcards, pushProgress, pushConfig } from '../services/sync.js';

const MIGRATION_FLAG = 'langflow_migrated_to_supabase';

export async function migrateToSupabase(stores) {
  if (!isSupabaseConfigured()) return false;
  if (localStorage.getItem(MIGRATION_FLAG) === 'true') return false;

  const { useWordStore, useCardStore, useProgressStore, useConfig } = stores;

  try {
    console.log('[migration] Starting localStorage → Supabase migration...');

    const words = useWordStore.getState().words;
    const { sentences, flashcards } = useCardStore.getState();
    const progress = useProgressStore.getState();
    const config = useConfig.getState().config;

    const promises = [];

    if (words?.length) promises.push(pushWords(words));
    if (sentences?.length) promises.push(pushSentences(sentences));
    if (flashcards?.length) promises.push(pushFlashcards(flashcards));
    if (progress?.xp !== undefined) promises.push(pushProgress(progress));
    if (config?.onboardingDone) promises.push(pushConfig(config));

    await Promise.all(promises);

    localStorage.setItem(MIGRATION_FLAG, 'true');
    console.log('[migration] Migration completed successfully');
    return true;
  } catch (err) {
    console.error('[migration] Migration failed:', err);
    return false;
  }
}
