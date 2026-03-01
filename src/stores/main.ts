import { useSyncExternalStore } from 'react'

export function createStore<T>(name: string, initialValue: T) {
  let state = initialValue

  try {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(name)
      if (stored) {
        state = JSON.parse(stored)
      }
    }
  } catch (err) {
    console.error(err)
  }

  const listeners = new Set<() => void>()

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const getSnapshot = () => state

  const setState = (newValue: T | ((prev: T) => T)) => {
    state = typeof newValue === 'function' ? (newValue as any)(state) : newValue
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(name, JSON.stringify(state))
      }
    } catch (err) {
      console.error(err)
    }
    listeners.forEach((listener) => listener())
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

  return useStore
}
