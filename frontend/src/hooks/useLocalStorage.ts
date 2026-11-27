import { useEffect, useState } from 'react'

/** useState backed by localStorage. Falls back to the initial value if storage is unavailable. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage blocked (private mode etc.); state still works for this session.
    }
  }, [key, value])

  return [value, setValue] as const
}
