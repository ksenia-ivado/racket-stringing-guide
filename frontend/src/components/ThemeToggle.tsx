import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useT } from '../i18n'

export type Theme = 'dark' | 'light'

export function ThemeToggle() {
  // Dark is the default; the choice persists per browser.
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'
  const t = useT()
  const label = t(next === 'dark' ? 'theme.toDark' : 'theme.toLight')

  return (
    <button
      type="button"
      className="icon-button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
