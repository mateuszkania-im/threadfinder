import { useCallback, useEffect, useState } from 'react'

/**
 * Persist a piece of UI state to localStorage. SSR/quota-safe: falls back to the
 * initial value if storage is unavailable, and never throws on write.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore write failures (private mode, quota) */
    }
  }, [key, value])

  const set = useCallback((next: T | ((prev: T) => T)) => setValue(next), [])

  return [value, set] as const
}
