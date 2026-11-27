import { useEffect, useState } from 'react'
import { apiEnabled, getTennis, type MatchStatus, type TennisSnapshot } from '../../api/client'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { roundName, useLang, useT, type UiKey } from '../../i18n'
import { ago, type DrawFilter } from './format'
import { DrawToggle, MatchGroups, TournamentCard } from './Matches'

interface Filters {
  draw: DrawFilter
  status: MatchStatus | 'all'
  tournament: string
  round: string
  player: string
}

const DEFAULT_FILTERS: Filters = { draw: 'all', status: 'all', tournament: 'all', round: 'all', player: '' }

const STATUS_OPTIONS: { value: Filters['status']; label: UiKey }[] = [
  { value: 'all', label: 'filters.all' },
  { value: 'live', label: 'filters.live' },
  { value: 'completed', label: 'filters.results' },
  { value: 'scheduled', label: 'filters.upcoming' },
]

const REFRESH_MS = 2 * 60 * 1000

/** What is on now: current tournaments, refreshed every couple of minutes. */
export function LiveView() {
  const t = useT()
  const lang = useLang()
  const [data, setData] = useState<TennisSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stored, setStored] = useLocalStorage<Filters>('tennisFilters', DEFAULT_FILTERS)
  const filters = { ...DEFAULT_FILTERS, ...stored }
  const setFilters = (patch: Partial<Filters>) => setStored((prev) => ({ ...DEFAULT_FILTERS, ...prev, ...patch }))
  // Ticks once a minute so "updated 3 minutes ago" stays true.
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    let controller = new AbortController()
    const load = () => {
      controller.abort()
      controller = new AbortController()
      const { signal } = controller
      getTennis(signal)
        .then((d) => {
          setData(d)
          setError(null)
          setNow(Date.now())
        })
        .catch((err: Error) => {
          if (!signal.aborted) setError(err.message)
        })
    }
    load()
    const id = window.setInterval(load, REFRESH_MS)
    return () => {
      window.clearInterval(id)
      controller.abort()
    }
  }, [])

  if (!data) {
    return <p className="empty">{error ? t('live.loadError', { error }) : t('live.loading')}</p>
  }

  // Each filter narrows the options of the next, and a stale choice falls back to "all".
  const inDraw = (d: string) => filters.draw === 'all' || d === filters.draw
  const tournaments = data.tournaments.filter((t) => t.draws.some((d) => inDraw(d.draw)))
  const tournament = tournaments.some((t) => t.id === filters.tournament) ? filters.tournament : 'all'
  const scoped = data.matches.filter((m) => inDraw(m.draw) && (tournament === 'all' || m.tournament_id === tournament))
  const rounds = [...new Map(scoped.map((m) => [m.round, m.round_order])).entries()].sort((a, b) => a[1] - b[1])
  const round = rounds.some(([r]) => r === filters.round) ? filters.round : 'all'
  const needle = filters.player.trim().toLowerCase()
  const beforeStatus = scoped.filter(
    (m) =>
      (round === 'all' || m.round === round) &&
      (!needle || m.players.some((p) => p.name.toLowerCase().includes(needle))),
  )
  const visible = beforeStatus.filter((m) => filters.status === 'all' || m.status === filters.status)
  const statusCount = (s: Filters['status']) =>
    s === 'all' ? beforeStatus.length : beforeStatus.filter((m) => m.status === s).length
  const filtered =
    filters.draw !== 'all' || filters.status !== 'all' || tournament !== 'all' || round !== 'all' || needle !== ''

  const shownTournaments = tournaments.filter((t) => tournament === 'all' || t.id === tournament)
  const snapshotAgeHours = (now - Date.parse(data.updated_at)) / 3600000

  return (
    <>
      <p className="view-meta">{t('live.updated', { ago: ago(data.updated_at, now, lang), source: data.source })}</p>
      {data.stale && <p className="notice">{t('live.stale')}</p>}
      {!apiEnabled && snapshotAgeHours > 2 && (
        <p className="notice">{t('live.old', { hours: Math.round(snapshotAgeHours) })}</p>
      )}
      {error && <p className="notice">{t('live.refreshFailed', { error })}</p>}

      <div className="filters" role="search" aria-label={t('filters.aria')}>
        <DrawToggle value={filters.draw} onChange={(draw) => setFilters({ draw })} />

        <div className="segmented" role="radiogroup" aria-label={t('filters.statusAria')}>
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={filters.status === o.value}
              className={`segmented__option${filters.status === o.value ? ' is-active' : ''}`}
              onClick={() => setFilters({ status: o.value })}
            >
              {t(o.label)} <span className="count">{statusCount(o.value)}</span>
            </button>
          ))}
        </div>

        <label className="field">
          <span>{t('filters.tournament')}</span>
          <select value={tournament} onChange={(e) => setFilters({ tournament: e.target.value })}>
            <option value="all">{t('filters.allTournaments')}</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{t('filters.round')}</span>
          <select value={round} onChange={(e) => setFilters({ round: e.target.value })}>
            <option value="all">{t('filters.allRounds')}</option>
            {rounds.map(([r]) => (
              <option key={r} value={r}>
                {roundName(t, r)}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--grow">
          <span>{t('filters.player')}</span>
          <input
            type="search"
            placeholder={t('filters.playerPlaceholder')}
            value={filters.player}
            onChange={(e) => setFilters({ player: e.target.value })}
          />
        </label>

        {filtered && (
          <button type="button" className="link-button" onClick={() => setStored(DEFAULT_FILTERS)}>
            {t('filters.clear')}
          </button>
        )}
      </div>

      {tournaments.length === 0 ? (
        <p className="empty">
          {t('live.none')} <a href="#history">{t('live.noneLink')}</a>.
        </p>
      ) : (
        <>
          <div className="t-grid">
            {shownTournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                draws={t.draws.filter((d) => inDraw(d.draw))}
                selected={tournament === t.id}
                onSelect={() => setFilters({ tournament: tournament === t.id ? 'all' : t.id })}
              />
            ))}
          </div>

          <h3 className="section-title">
            {t('matches.title')} <span className="count">{visible.length}</span>
          </h3>
          {visible.length === 0 ? (
            <p className="empty">
              {t('matches.none')}{' '}
              {filtered && (
                <button type="button" className="link-button" onClick={() => setStored(DEFAULT_FILTERS)}>
                  {t('filters.clear')}
                </button>
              )}
            </p>
          ) : (
            <MatchGroups tournaments={shownTournaments} matches={visible} showDraw={filters.draw === 'all'} />
          )}
        </>
      )}
    </>
  )
}
