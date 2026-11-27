import { useEffect, useState } from 'react'
import {
  apiEnabled,
  getTennis,
  type Draw,
  type DrawStats,
  type Match,
  type MatchStatus,
  type TennisSnapshot,
  type Tournament,
} from '../api/client'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Filters {
  draw: Draw | 'all'
  status: MatchStatus | 'all'
  tournament: string
  round: string
  player: string
}

const DEFAULT_FILTERS: Filters = { draw: 'all', status: 'all', tournament: 'all', round: 'all', player: '' }

const DRAW_LABEL: Record<Draw, string> = {
  'mens-singles': "Men's singles",
  'womens-singles': "Women's singles",
}

const STATUS_OPTIONS: { value: Filters['status']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Results' },
  { value: 'scheduled', label: 'Upcoming' },
]

const REFRESH_MS = 2 * 60 * 1000
const STATUS_RANK: Record<MatchStatus, number> = { live: 0, scheduled: 1, completed: 2 }

const dayFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
const timeFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})
const relative = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

/** 'YYYY-MM-DD' as a local date, so it does not shift a day in western time zones. */
function formatDay(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return dayFormat.format(new Date(y, m - 1, d))
}

function ago(iso: string, now: number) {
  const minutes = Math.round((Date.parse(iso) - now) / 60000)
  return Math.abs(minutes) < 60 ? relative.format(minutes, 'minute') : relative.format(Math.round(minutes / 60), 'hour')
}

export function TennisPage() {
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
    return (
      <div className="page">
        <TennisHeader />
        <p className="empty">{error ? `Could not load tennis data: ${error}` : 'Loading tournaments…'}</p>
      </div>
    )
  }

  // Each filter narrows the options of the next, and a stale choice falls back to "all".
  const inDraw = (d: Draw) => filters.draw === 'all' || d === filters.draw
  const tournaments = data.tournaments.filter((t) => t.draws.some((d) => inDraw(d.draw)))
  const tournament = tournaments.some((t) => t.id === filters.tournament) ? filters.tournament : 'all'
  const scoped = data.matches.filter((m) => inDraw(m.draw) && (tournament === 'all' || m.tournament_id === tournament))
  const rounds = [...new Map(scoped.map((m) => [m.round, m.round_order])).entries()].sort((a, b) => a[1] - b[1])
  const round = rounds.some(([r]) => r === filters.round) ? filters.round : 'all'
  const needle = filters.player.trim().toLowerCase()
  const beforeStatus = scoped.filter(
    (m) => (round === 'all' || m.round === round) && (!needle || m.players.some((p) => p.name.toLowerCase().includes(needle))),
  )
  const visible = beforeStatus.filter((m) => filters.status === 'all' || m.status === filters.status)
  const statusCount = (s: Filters['status']) => (s === 'all' ? beforeStatus.length : beforeStatus.filter((m) => m.status === s).length)
  const filtered = filters.draw !== 'all' || filters.status !== 'all' || tournament !== 'all' || round !== 'all' || needle !== ''

  const shownTournaments = tournaments.filter((t) => tournament === 'all' || t.id === tournament)
  const snapshotAgeHours = (now - Date.parse(data.updated_at)) / 3600000

  return (
    <div className="page">
      <TennisHeader updatedAt={data.updated_at} source={data.source} now={now} />

      {data.stale && <p className="notice">The data source is not responding, so this is the last data we got.</p>}
      {!apiEnabled && snapshotAgeHours > 2 && (
        <p className="notice">This snapshot is {Math.round(snapshotAgeHours)} hours old; scores may have moved on.</p>
      )}
      {error && <p className="notice">Refresh failed ({error}). Showing the last data loaded.</p>}

      <div className="filters" role="search" aria-label="Filter matches">
        <div className="segmented" role="radiogroup" aria-label="Draw">
          {(['all', 'mens-singles', 'womens-singles'] as const).map((d) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={filters.draw === d}
              className={`segmented__option${filters.draw === d ? ' is-active' : ''}`}
              onClick={() => setFilters({ draw: d })}
            >
              {d === 'all' ? 'All singles' : d === 'mens-singles' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>

        <div className="segmented" role="radiogroup" aria-label="Match status">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={filters.status === o.value}
              className={`segmented__option${filters.status === o.value ? ' is-active' : ''}`}
              onClick={() => setFilters({ status: o.value })}
            >
              {o.label} <span className="count">{statusCount(o.value)}</span>
            </button>
          ))}
        </div>

        <label className="field">
          <span>Tournament</span>
          <select value={tournament} onChange={(e) => setFilters({ tournament: e.target.value })}>
            <option value="all">All tournaments</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Round</span>
          <select value={round} onChange={(e) => setFilters({ round: e.target.value })}>
            <option value="all">All rounds</option>
            {rounds.map(([r]) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--grow">
          <span>Player</span>
          <input
            type="search"
            placeholder="Search by name"
            value={filters.player}
            onChange={(e) => setFilters({ player: e.target.value })}
          />
        </label>

        {filtered && (
          <button type="button" className="link-button" onClick={() => setStored(DEFAULT_FILTERS)}>
            Clear filters
          </button>
        )}
      </div>

      {tournaments.length === 0 ? (
        <p className="empty">No ATP or WTA singles tournaments are on right now. Check back when the season resumes.</p>
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
            Matches <span className="count">{visible.length}</span>
          </h3>
          {visible.length === 0 ? (
            <p className="empty">
              No matches fit these filters.{' '}
              {filtered && (
                <button type="button" className="link-button" onClick={() => setStored(DEFAULT_FILTERS)}>
                  Clear filters
                </button>
              )}
            </p>
          ) : (
            <MatchGroups tournaments={shownTournaments} matches={visible} showDraw={filters.draw === 'all'} />
          )}
        </>
      )}
    </div>
  )
}

function TennisHeader({ updatedAt, source, now = 0 }: { updatedAt?: string; source?: string; now?: number }) {
  return (
    <header className="page-intro">
      <h2>Live tennis</h2>
      <p>
        Current ATP and WTA tournaments: men&apos;s and women&apos;s singles only.
        {updatedAt && (
          <span className="page-intro__meta">
            {' '}
            Updated {ago(updatedAt, now)} · data from {source}
          </span>
        )}
      </p>
    </header>
  )
}

interface CardProps {
  tournament: Tournament
  draws: DrawStats[]
  selected: boolean
  onSelect: () => void
}

function TournamentCard({ tournament: t, draws, selected, onSelect }: CardProps) {
  return (
    <article className={`t-card${selected ? ' is-selected' : ''}`}>
      <header>
        <p className="t-card__badges">
          <span className={`badge badge--${t.tour.toLowerCase()}`}>{t.tour}</span>
          {t.major && <span className="badge badge--major">Grand Slam</span>}
        </p>
        <h3>{t.name}</h3>
        <p className="t-card__meta">
          {t.location && `${t.location} · `}
          {formatDay(t.start_date)} – {formatDay(t.end_date)}
        </p>
      </header>

      {draws.map((d) => (
        <section key={d.draw} className="t-draw" aria-label={DRAW_LABEL[d.draw]}>
          {draws.length > 1 && <p className="t-draw__name">{DRAW_LABEL[d.draw]}</p>}
          {d.matches === 0 ? (
            <p className="t-draw__status">Draw not published yet</p>
          ) : (
            <>
              <div className="meter" aria-hidden="true">
                <div className="meter__fill" style={{ width: `${(d.completed / d.matches) * 100}%` }} />
              </div>
              <dl className="stats">
                <div>
                  <dt>Played</dt>
                  <dd>
                    {d.completed}
                    <span>/{d.matches}</span>
                  </dd>
                </div>
                <div>
                  <dt>Live</dt>
                  <dd className={d.live ? 'is-live' : undefined}>{d.live}</dd>
                </div>
                <div>
                  <dt>To play</dt>
                  <dd>{d.scheduled}</dd>
                </div>
                <div>
                  <dt>Retired</dt>
                  <dd>{d.retirements}</dd>
                </div>
              </dl>
              <p className="t-draw__status">
                {d.champion ? (
                  <>
                    Champion: <strong>{d.champion}</strong>
                  </>
                ) : d.current_round ? (
                  <>
                    Now playing: <strong>{d.current_round}</strong>
                  </>
                ) : null}
              </p>
            </>
          )}
        </section>
      ))}

      <button type="button" className="chip" onClick={onSelect} aria-pressed={selected}>
        {selected ? 'Show all tournaments' : 'Only this tournament'}
      </button>
    </article>
  )
}

function MatchGroups({ tournaments, matches, showDraw }: { tournaments: Tournament[]; matches: Match[]; showDraw: boolean }) {
  return (
    <div className="match-groups">
      {tournaments.map((t) => {
        const own = matches.filter((m) => m.tournament_id === t.id)
        if (own.length === 0) return null
        // Latest round first; within a round, live, then upcoming, then results.
        const rounds = [...new Set(own.map((m) => `${m.draw}|${m.round_order}|${m.round}`))].sort((a, b) => {
          const [da, oa] = a.split('|')
          const [db, ob] = b.split('|')
          return da.localeCompare(db) || Number(ob) - Number(oa)
        })
        return (
          <section key={t.id} className="match-group" aria-label={t.name}>
            <h4 className="match-group__title">{t.name}</h4>
            {rounds.map((key) => {
              const [draw, , round] = key.split('|') as [Draw, string, string]
              const list = own
                .filter((m) => m.draw === draw && m.round === round)
                .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || (a.start ?? '').localeCompare(b.start ?? ''))
              return (
                <div key={key} className="round">
                  <p className="round__title">
                    {showDraw && `${DRAW_LABEL[draw]} · `}
                    {round}
                  </p>
                  <ul className="matches">
                    {list.map((m) => (
                      <MatchRow key={m.id} match={m} />
                    ))}
                  </ul>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}

function statusLabel(m: Match) {
  if (m.status === 'live') return 'Live'
  if (m.status === 'completed') return m.status_detail || 'Final'
  return m.start ? timeFormat.format(new Date(m.start)) : 'Time TBD'
}

function MatchRow({ match: m }: { match: Match }) {
  return (
    <li className={`match match--${m.status}`}>
      <span className={`pill pill--${m.status}`}>{statusLabel(m)}</span>
      <div className="match__players">
        {m.players.map((p, i) => {
          const other = m.players[1 - i]
          return (
            <div key={`${p.name}-${i}`} className={`match__player${p.winner ? ' is-winner' : ''}`}>
              <span className="match__country">{p.country ?? ''}</span>
              <span className="match__name">
                {p.name}
                {p.seed && <span className="match__seed"> ({p.seed})</span>}
              </span>
              <span className="match__sets">
                {p.sets.map((s, n) => (
                  <span key={n} className={s.won ? 'is-won' : undefined}>
                    {s.games}
                    {/* Tiebreak points are shown on the loser's score, e.g. 6⁴ */}
                    {s.tiebreak != null && !s.won && other?.sets[n]?.tiebreak != null && <sup>{s.tiebreak}</sup>}
                  </span>
                ))}
              </span>
            </div>
          )
        })}
      </div>
    </li>
  )
}
