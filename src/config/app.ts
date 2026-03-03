/**
 * Funil OS - Centralized App Configuration
 * 
 * Reads from environment variables (import.meta.env) with sensible defaults.
 * Single source of truth for all runtime configuration.
 * 
 * Usage:
 *   import { config } from '@/config/app'
 *   console.log(config.app.name)  // 'Funil OS'
 *   console.log(config.api.url)   // from VITE_API_URL or default
 */

const env = (key: string, fallback: string = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env[key] as string) ?? fallback
  }
  return fallback
}

const envBool = (key: string, fallback: boolean = false): boolean => {
  const val = env(key)
  if (!val) return fallback
  return val === 'true' || val === '1'
}

const envNumber = (key: string, fallback: number = 0): number => {
  const val = env(key)
  if (!val) return fallback
  const parsed = Number(val)
  return Number.isNaN(parsed) ? fallback : parsed
}

export const config = {
  app: {
    name: env('VITE_APP_NAME', 'Funil OS'),
    version: env('VITE_APP_VERSION', '0.0.5'),
    env: env('VITE_APP_ENV', 'development'),
    isDev: env('VITE_APP_ENV', 'development') === 'development',
    isProd: env('VITE_APP_ENV', 'development') === 'production',
  },
  api: {
    url: env('VITE_API_URL', 'http://localhost:3001'),
    timeout: envNumber('VITE_API_TIMEOUT', 30000),
  },
  auth: {
    provider: env('VITE_AUTH_PROVIDER', 'none') as 'none' | 'supabase' | 'firebase',
    supabase: {
      url: env('VITE_SUPABASE_URL'),
      anonKey: env('VITE_SUPABASE_ANON_KEY'),
    },
  },
  features: {
    darkMode: envBool('VITE_ENABLE_DARK_MODE', true),
    analytics: envBool('VITE_ENABLE_ANALYTICS', false),
    canvasAutosave: envBool('VITE_ENABLE_CANVAS_AUTOSAVE', true),
    collaboration: envBool('VITE_ENABLE_COLLABORATION', false),
  },
  storage: {
    prefix: env('VITE_STORAGE_PREFIX', 'funilos_v1_'),
    version: envNumber('VITE_STORAGE_VERSION', 1),
  },
} as const

export type AppConfig = typeof config
