import { useSyncExternalStore } from 'react'
import { config } from '@/config/app'

// ============================================================
// Funil OS - Enhanced Store Engine
// ============================================================
// Features:
//   - Versioned persistence (envelope: { __v, __d })
//   - Automatic migration when version changes
//   - reset() / getState() / setState() accessible outside React
//   - DevTools: window.__FUNILOS_STORES__ in dev mode
//   - Retrocompat: reads legacy data (no envelope) seamlessly
// ============================================================

const STORE_VERSION = config.storage.version
const PREFIX = config.storage.prefix

interface StoreEnvelope<T> {
  __v: number
  __d: T
}

function isEnvelope<T>(val: unknown): val is StoreEnvelope<T> {
  return (
    typeof val === 'object' &&
    val !== null &&
    '__v' in val &&
    '__d' in val
  )
}

// Dev tools registry
const storeRegistry: Record<string, { getState: () => unknown; reset: () => void }> = {}

if (config.app.isDev && typeof window !== 'undefined') {
  ;(window as any).__FUNILOS_STORES__ = storeRegistry
}

export function createStore<T>(name: string, initialValue: T) {
  const key = `${PREFIX}${name}`
  let state = initialValue

  // Hydrate from localStorage with version check
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (isEnvelope<T>(parsed)) {
          if (parsed.__v === STORE_VERSION) {
            state = parsed.__d
          } else {
            // Version mismatch: reset to initial (migration point)
            console.warn(
              `[Store:${name}] version mismatch (stored: ${parsed.__v}, current: ${STORE_VERSION}). Resetting.`
            )
            persist(initialValue)
          }
        } else {
          // Legacy data (no envelope) - migrate
          state = parsed as T
          persist(state) // re-save with envelope
        }
      }
    }
  } catch (err) {
    console.error(`[Store:${name}] hydration error:`, err)
  }

  const listeners = new Set<() => void>()

  function persist(value: T) {
    try {
      if (typeof window !== 'undefined') {
        const envelope: StoreEnvelope<T> = { __v: STORE_VERSION, __d: value }
        window.localStorage.setItem(key, JSON.stringify(envelope))
      }
    } catch (err) {
      console.error(`[Store:${name}] persist error:`, err)
    }
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const getSnapshot = () => state

  const setState = (newValue: T | ((prev: T) => T)) => {
    state = typeof newValue === 'function' ? (newValue as any)(state) : newValue
    persist(state)
    listeners.forEach((listener) => listener())
  }

  const reset = () => {
    setState(initialValue)
  }

  const getState = () => state

  // Register in devtools
  if (config.app.isDev) {
    storeRegistry[name] = { getState, reset }
  }

  function useStore(): [T, typeof setState]
  function useStore<U>(selector: (state: T) => U): U
  function useStore<U>(selector?: (state: T) => U) {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot)
    if (selector) {
      return selector(snapshot) as U
    }
    return [snapshot, setState] as any
  }

  // Expose utilities on the hook
  useStore.getState = getState
  useStore.setState = setState
  useStore.reset = reset
  useStore.subscribe = subscribe

  return useStore
}
