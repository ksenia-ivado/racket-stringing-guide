import { useEffect, useMemo, useState } from 'react'
import { getHistory, getHistorySeasons, type Draw, type Match, type TennisSnapshot, type Tournament } from '../../api/client'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { DRAW_LABEL, formatDay, type DrawFilter } from './format'
import { DrawToggle, MatchGroups, TourBadges, TournamentCard } from './Matches'

interface Filters {
  season: number | null
  draw: DrawFilter
  slams: boolean
  tournament: string
  round: string
  player: string
}

const DEFAULT_FILTERS: Filters = { season: null, draw: 'all', slams: false, tournament: 'all', round: 'all', player: '' }

/**
 * Rendering thousands of match cards at once is slow and useless, so a whole
 * season shows the most recent. One tournament (a Slam has ~480) shows in full.
 */
const MATCH_LIMIT = 300
const TOURNAMENT_LIMIT = 600

const DRAWS: Draw[] = ['mens-singles', 'womens-singles']

/** Past results: pick a season, then narrow by draw, Slams, tournament, round or player. */
export function HistoryView() {
  const [seasons, setSeasons] = useState<number[] | null>(null)
  const [seasonsError, setSeasonsError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<Record<number, TennisSnapshot>>({})
  const [loadError, setLoadError] = useState<{ season: number; message: string } | null>(null)
  const [stored, setStored] = useLocalStorage<Filters>('tennisHistoryFilters', DEFAULT_FILTERS)
  const filters = { ...DEFAULT_FILTERS, ...stored }
  const setFilters = (patch: Partial<Filters>) => setStored((prev) => ({ ...DEFAULT_FILTERS, ...prev, ...patch }))

  useEffect(() => {
    const controller = new AbortController()
    getHistorySeasons(controller.signal)
      .then(setSeasons)
      .catch((err: Error) => {
        if (!controller.signal.aborted) setSeasonsError(err.message)
      })
    return () => controller.abort()
  }, [])

  const season = seasons && (seasons.includes(filters.season ?? -1) ? filters.season! : seasons[0])
  const data = season != null ? loaded[season] : undefined

  useEffect(() => {
    if (season == null || loaded[season]) return
    const controller = new AbortController()
    getHistory(season, controller.signal)
      .then((d) => setLoaded((prev) => ({ ...prev, [season]: d })))
      .catch((err: Error) => {
        if (!controller.signal.aborted) setLoadError({ season, message: err.message })
      })
    return () => controller.abort()
  }, [season, loaded])

  // Keyed on the stored filters (a stable state value), not the merged copy made each render.
  const view = useMemo(() => (data ? derive(data, { ...DEFAULT_FILTERS, ...stored }) : null), [data, stored])

  if (seasonsError) return <p className="empty">Could not load the list of seasons: {seasonsError}</p>
  if (!seasons || season == null) return <p className="empty">Loading seasons…</p>

  const filtered =
    filters.draw !== 'all' || filters.slams || filters.tournament !== 'all' || filters.round !== 'all' || filters.player !== ''
  const clear = () => setStored({ ...DEFAULT_FILTERS, season })

  return (
    <>
      <div className="filters" role="search" aria-label="Filter past results">
        <label className="field">
          <span>Season</span>
          <select
            value={season}
            // Tournament ids are per season, so a new season starts from the whole year.
            onChange={(e) => setFilters({ season: Number(e.target.value), tournament: 'all', round: 'all' })}
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <DrawToggle value={filters.draw} onChange={(draw) => setFilters({ draw })} />

        <label className="check">
          <input type="checkbox" checked={filters.slams} onChange={(e) => setFilters({ slams: e.target.checked })} />
          Grand Slams only
        </label>

        {view && (
          <>
            <label className="field">
              <span>Tournament</span>
              <select value={view.tournament} onChange={(e) => setFilters({ tournament: e.target.value })}>
                <option value="all">All tournaments</option>
                {view.tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Round</span>
              <select value={view.round} onChange={(e) => setFilters({ round: e.target.value })}>
                <option value="all">All rounds</option>
                {view.rounds.map((r) => (
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
                list="history-players"
                placeholder="Search a player's season"
                value={filters.player}
                onChange={(e) => setFilters({ player: e.target.value })}
              />
              <datalist id="history-players">
                {view.names.map(([name]) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </label>
          </>
        )}

        {filtered && (
          <button type="button" className="link-button" onClick={clear}>
            Clear filters
          </button>
        )}
      </div>

      {!view ? (
        <p className="empty">
          {loadError?.season === season
            ? `Could not load ${season}: ${loadError.message}`
            : `Loading the ${season} season…`}
        </p>
      ) : (
        <HistoryResults
          view={view}
          season={season}
          draw={filters.draw}
          onTournament={(id) => setFilters({ tournament: id, round: 'all' })}
          onPlayer={(name) => setFilters({ player: name })}
          onClear={clear}
        />
      )}
    </>
  )
}

/* ---------- Filtering ---------- */

interface View {
  tournaments: Tournament[]
  tournament: string
  rounds: string[]
  round: string
  /** Player names in scope with their match counts, most matches first. */
  names: [string, number][]
  /** The search resolved to one player. */
  player: string | null
  /** Other players matching a partial search. */
  suggestions: string[]
  /** Matches in scope before the round and player filters (for the player's record). */
  scoped: Match[]
  visible: Match[]
  searching: boolean
}

function derive(data: TennisSnapshot, f: Filters): View {
  const inDraw = (d: Draw) => f.draw === 'all' || d === f.draw
  // Newest first: history reads backwards from the latest tournament.
  const tournaments = data.tournaments
    .filter((t) => (!f.slams || t.major) && t.draws.some((d) => inDraw(d.draw) && d.matches > 0))
    .sort((a, b) => b.start_date.localeCompare(a.start_date) || a.name.localeCompare(b.name))
  const ids = new Set(tournaments.map((t) => t.id))
  const tournament = ids.has(f.tournament) ? f.tournament : 'all'
  const scoped = data.matches.filter(
    (m) => inDraw(m.draw) && ids.has(m.tournament_id) && (tournament === 'all' || m.tournament_id === tournament),
  )

  const roundOrder = new Map<string, number>()
  for (const m of scoped) roundOrder.set(m.round, Math.max(roundOrder.get(m.round) ?? -999, m.round_order))
  const rounds = [...roundOrder.entries()].sort((a, b) => a[1] - b[1]).map(([r]) => r)
  const round = rounds.includes(f.round) ? f.round : 'all'

  const counts = new Map<string, number>()
  for (const m of scoped) for (const p of m.players) if (p.name !== 'TBD') counts.set(p.name, (counts.get(p.name) ?? 0) + 1)
  const names = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  const needle = f.player.trim().toLowerCase()
  const matching = needle ? names.filter(([n]) => n.toLowerCase().includes(needle)).map(([n]) => n) : []
  const exact = matching.find((n) => n.toLowerCase() === needle)
  const player = exact ?? (matching.length === 1 ? matching[0] : null)
  const hasPlayer = (m: Match) =>
    !needle || m.players.some((p) => (player ? p.name === player : p.name.toLowerCase().includes(needle)))

  const visible = scoped.filter((m) => (round === 'all' || m.round === round) && hasPlayer(m))
  return {
    tournaments,
    tournament,
    rounds,
    round,
    names,
    player,
    suggestions: player ? [] : matching.slice(0, 12),
    scoped,
    visible,
    searching: needle !== '',
  }
}

/* ---------- Results ---------- */

interface ResultsProps {
  view: View
  season: number
  draw: DrawFilter
  onTournament: (id: string) => void
  onPlayer: (name: string) => void
  onClear: () => void
}

function HistoryResults({ view, season, draw, onTournament, onPlayer, onClear }: ResultsProps) {
  const { tournaments, tournament, round, visible, searching } = view

  if (tournaments.length === 0) {
    return (
      <p className="empty">
        No tournaments fit these filters in {season}.{' '}
        <button type="button" className="link-button" onClick={onClear}>
          Clear filters
        </button>
      </p>
    )
  }

  // Nothing narrowed down yet: the season at a glance, one row per tournament.
  if (!searching && tournament === 'all' && round === 'all') {
    return <SeasonTable tournaments={tournaments} draw={draw} onTournament={onTournament} onPlayer={onPlayer} />
  }

  const selected = tournaments.find((t) => t.id === tournament)
  const position = new Map(tournaments.map((t, i) => [t.id, i]))
  const limit = selected ? TOURNAMENT_LIMIT : MATCH_LIMIT
  const shown = visible
    .slice()
    .sort((a, b) => position.get(a.tournament_id)! - position.get(b.tournament_id)! || b.round_order - a.round_order)
    .slice(0, limit)

  return (
    <>
      {view.player && <PlayerSummary name={view.player} matches={view.scoped} tournaments={tournaments} />}

      {view.suggestions.length > 1 && (
        <p className="related">
          <span>Players matching:</span>
          {view.suggestions.map((n) => (
            <button key={n} type="button" className="chip" onClick={() => onPlayer(n)}>
              {n}
            </button>
          ))}
        </p>
      )}

      {selected && !searching && (
        <div className="t-grid">
          <TournamentCard
            tournament={selected}
            draws={selected.draws.filter((d) => draw === 'all' || d.draw === draw)}
            selected
            onSelect={() => onTournament('all')}
          />
        </div>
      )}

      <h3 className="section-title">
        Matches <span className="count">{visible.length}</span>
      </h3>
      {visible.length > limit && (
        <p className="view-meta">
          Showing the {limit} most recent. Pick a tournament, round or player to see the rest.
        </p>
      )}
      {visible.length === 0 ? (
        <p className="empty">
          No matches fit these filters.{' '}
          <button type="button" className="link-button" onClick={onClear}>
            Clear filters
          </button>
        </p>
      ) : (
        <MatchGroups tournaments={tournaments} matches={shown} showDraw={draw === 'all'} showDates />
      )}
    </>
  )
}

interface TableProps {
  tournaments: Tournament[]
  draw: DrawFilter
  onTournament: (id: string) => void
  onPlayer: (name: string) => void
}

function SeasonTable({ tournaments, draw, onTournament, onPlayer }: TableProps) {
  const draws = DRAWS.filter((d) => draw === 'all' || d === draw)
  return (
    <>
      <h3 className="section-title">
        Tournaments <span className="count">{tournaments.length}</span>
      </h3>
      <div className="table-wrap">
        <table className="season-table">
          <thead>
            <tr>
              <th scope="col">Dates</th>
              <th scope="col">Tournament</th>
              {draws.map((d) => (
                <th key={d} scope="col">
                  {d === 'mens-singles' ? "Men's champion" : "Women's champion"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t) => (
              <tr key={t.id}>
                <td className="season-table__dates">
                  {formatDay(t.start_date)} – {formatDay(t.end_date)}
                </td>
                <td>
                  <button type="button" className="table-link" onClick={() => onTournament(t.id)}>
                    {t.name}
                  </button>{' '}
                  <TourBadges tournament={t} />
                </td>
                {draws.map((d) => {
                  const stats = t.draws.find((s) => s.draw === d)
                  return (
                    <td key={d} data-label={d === 'mens-singles' ? "Men's champion" : "Women's champion"}>
                      {stats?.champion ? (
                        <button type="button" className="table-link" onClick={() => onPlayer(stats.champion!)}>
                          {stats.champion}
                        </button>
                      ) : stats && stats.matches > 0 ? (
                        <span className="muted">{stats.current_round ? `In progress (${stats.current_round})` : '—'}</span>
                      ) : (
                        <span className="muted" aria-label={`No ${DRAW_LABEL[d]}`}>
                          —
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

interface SummaryProps {
  name: string
  matches: Match[]
  tournaments: Tournament[]
}

/** Win/loss record and finals for one player, within the current filters. */
function PlayerSummary({ name, matches, tournaments }: SummaryProps) {
  const own = matches.filter((m) => m.players.some((p) => p.name === name))
  const decided = own.filter((m) => m.status === 'completed' && m.players.some((p) => p.winner))
  const won = decided.filter((m) => m.players.find((p) => p.name === name)?.winner).length
  const lost = decided.length - won
  const country = own.flatMap((m) => m.players).find((p) => p.name === name)?.country
  const finals = decided.filter((m) => m.round === 'Final')
  const nameOf = (m: Match) => tournaments.find((t) => t.id === m.tournament_id)?.name ?? ''
  const titles = finals.filter((m) => m.players.find((p) => p.name === name)?.winner).map(nameOf)
  const runnerUp = finals.filter((m) => !m.players.find((p) => p.name === name)?.winner).map(nameOf)

  return (
    <section className="t-card player-card" aria-label={`${name}'s record`}>
      <header>
        <h3>
          {name} {country && <span className="match__country">{country}</span>}
        </h3>
        <p className="t-card__meta">Record within the current filters</p>
      </header>
      <dl className="stats">
        <div>
          <dt>Matches</dt>
          <dd>{decided.length}</dd>
        </div>
        <div>
          <dt>Won</dt>
          <dd className="is-live">{won}</dd>
        </div>
        <div>
          <dt>Lost</dt>
          <dd>{lost}</dd>
        </div>
        <div>
          <dt>Win rate</dt>
          <dd>{decided.length ? `${Math.round((won / decided.length) * 100)}%` : '—'}</dd>
        </div>
      </dl>
      {(titles.length > 0 || runnerUp.length > 0) && (
        <p className="t-draw__status">
          {titles.length > 0 && (
            <>
              Titles: <strong>{titles.join(', ')}</strong>
            </>
          )}
          {titles.length > 0 && runnerUp.length > 0 && <br />}
          {runnerUp.length > 0 && <>Runner-up: {runnerUp.join(', ')}</>}
        </p>
      )}
    </section>
  )
}
