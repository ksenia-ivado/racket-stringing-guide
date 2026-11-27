import type { Draw, MatchStatus, Tournament } from '../../api/client'

export type DrawFilter = Draw | 'all'

export const DRAW_LABEL: Record<Draw, string> = {
  'mens-singles': "Men's singles",
  'womens-singles': "Women's singles",
}

export const DRAW_OPTIONS: { value: DrawFilter; label: string }[] = [
  { value: 'all', label: 'All singles' },
  { value: 'mens-singles', label: 'Men' },
  { value: 'womens-singles', label: 'Women' },
]

/** Within a round: live first, then upcoming, then results. */
export const STATUS_RANK: Record<MatchStatus, number> = { live: 0, scheduled: 1, completed: 2 }

const dayFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
export const timeFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})
const relative = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

/** 'YYYY-MM-DD' as a local date, so it does not shift a day in western time zones. */
export function formatDay(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return dayFormat.format(new Date(y, m - 1, d))
}

export function ago(iso: string, now: number) {
  const minutes = Math.round((Date.parse(iso) - now) / 60000)
  return Math.abs(minutes) < 60
    ? relative.format(minutes, 'minute')
    : relative.format(Math.round(minutes / 60), 'hour')
}

/** CSS modifier for a tour badge: atp, wta or atpwta. */
export const tourClass = (t: Tournament) => t.tour.toLowerCase().replace('/', '')
