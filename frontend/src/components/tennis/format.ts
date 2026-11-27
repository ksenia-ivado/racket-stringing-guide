import type { Draw, MatchStatus, Tournament } from '../../api/client'
import { localeOf, type Lang, type UiKey } from '../../i18n'

export type DrawFilter = Draw | 'all'

export const DRAW_OPTIONS: { value: DrawFilter; label: UiKey }[] = [
  { value: 'all', label: 'draw.all' },
  { value: 'mens-singles', label: 'draw.men' },
  { value: 'womens-singles', label: 'draw.women' },
]

/** Within a round: live first, then upcoming, then results. */
export const STATUS_RANK: Record<MatchStatus, number> = { live: 0, scheduled: 1, completed: 2 }

/** Intl formatters are costly to build, so keep one per language. */
function cached<T>(make: (lang: Lang) => T) {
  const cache = new Map<Lang, T>()
  return (lang: Lang) => {
    let v = cache.get(lang)
    if (!v) cache.set(lang, (v = make(lang)))
    return v
  }
}

const dayFormat = cached((lang) => new Intl.DateTimeFormat(localeOf(lang), { day: 'numeric', month: 'short' }))
const timeFormat = cached(
  (lang) =>
    new Intl.DateTimeFormat(localeOf(lang), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
)
const relative = cached((lang) => new Intl.RelativeTimeFormat(localeOf(lang), { numeric: 'auto' }))

/** 'YYYY-MM-DD' as a local date, so it does not shift a day in western time zones. */
export function formatDay(iso: string, lang: Lang) {
  const [y, m, d] = iso.split('-').map(Number)
  return dayFormat(lang).format(new Date(y, m - 1, d))
}

export const formatTime = (iso: string, lang: Lang) => timeFormat(lang).format(new Date(iso))

export function ago(iso: string, now: number, lang: Lang) {
  const minutes = Math.round((Date.parse(iso) - now) / 60000)
  return Math.abs(minutes) < 60
    ? relative(lang).format(minutes, 'minute')
    : relative(lang).format(Math.round(minutes / 60), 'hour')
}

/** CSS modifier for a tour badge: atp, wta or atpwta. */
export const tourClass = (t: Tournament) => t.tour.toLowerCase().replace('/', '')
