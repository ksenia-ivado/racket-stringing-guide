import { createContext, useCallback, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { LANGS, type Lang } from './types'
import { ui, type UiKey } from './ui'

export { LANGS, type Lang } from './types'
export type { UiKey } from './ui'

const isLang = (v: unknown): v is Lang => LANGS.some((l) => l.code === v)

/** ?lang=fr in the URL, if present (for sharing a link in a given language). */
function urlLang(): Lang | undefined {
  const v = new URLSearchParams(window.location.search).get('lang')
  return isLang(v) ? v : undefined
}

/** First of the browser's preferred languages that the site speaks; English otherwise. */
export function detectLang(): Lang {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const code = tag.slice(0, 2).toLowerCase()
    if (isLang(code)) return code
  }
  return 'en'
}

/**
 * The visitor's language: ?lang= wins, then their saved choice, then the browser.
 * Keeps <html lang> in sync for screen readers and hyphenation.
 */
export function useLanguage() {
  const [stored, setLang] = useLocalStorage<Lang>('lang', urlLang() ?? detectLang())
  const fromUrl = urlLang()
  const lang = fromUrl ?? (isLang(stored) ? stored : 'en')
  useEffect(() => {
    if (fromUrl && fromUrl !== stored) setLang(fromUrl)
  }, [fromUrl, stored, setLang])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const choose = useCallback(
    (next: Lang) => {
      // Drop ?lang= so the choice is not overridden on the next load.
      if (urlLang()) {
        const url = new URL(window.location.href)
        url.searchParams.delete('lang')
        window.history.replaceState(null, '', url)
      }
      setLang(next)
    },
    [setLang],
  )
  return [lang, choose] as const
}

const LangContext = createContext<Lang>('en')
export const LangProvider = LangContext.Provider
export const useLang = () => useContext(LangContext)

export type Vars = Record<string, string | number>

export function translate(lang: Lang, key: UiKey, vars?: Vars) {
  const text: string = ui[lang][key] ?? ui.en[key]
  return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text
}

export type T = (key: UiKey, vars?: Vars) => string

/** t('step.next') in the current language. */
export function useT(): T {
  const lang = useLang()
  return useCallback((key: UiKey, vars?: Vars) => translate(lang, key, vars), [lang])
}

/** Locale for Intl formatters: the browser's own for English, so US and UK readers keep their formats. */
export const localeOf = (lang: Lang) => (lang === 'en' ? undefined : lang)

/** ESPN round names ("Round 2", "Qualifying 1st Round", "Quarterfinal") in the current language. */
export function roundName(t: T, round: string) {
  let m = round.match(/^Round (\d+)$/)
  if (m) return t('round.Round {n}', { n: m[1] })
  m = round.match(/^Qualifying (\d+)\w* Round$/)
  if (m) return t('round.Qualifying {n} Round', { n: m[1] })
  const key = `round.${round}` as UiKey
  return key in ui.en ? t(key) : round
}

/** ESPN status text ("Final", "Retired", "Walkover") in the current language. */
export function statusName(t: T, status: string) {
  const key = `status.${status}` as UiKey
  return key in ui.en ? t(key) : status
}
