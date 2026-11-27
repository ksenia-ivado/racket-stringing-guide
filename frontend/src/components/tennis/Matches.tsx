import type { Draw, DrawStats, Match, Tournament } from '../../api/client'
import { DRAW_LABEL, DRAW_OPTIONS, STATUS_RANK, formatDay, timeFormat, tourClass, type DrawFilter } from './format'

/** Men / women / all toggle, shared by the live and history views. */
export function DrawToggle({ value, onChange }: { value: DrawFilter; onChange: (d: DrawFilter) => void }) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Draw">
      {DRAW_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`segmented__option${value === o.value ? ' is-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function TourBadges({ tournament: t }: { tournament: Tournament }) {
  return (
    <>
      <span className={`badge badge--${tourClass(t)}`}>{t.tour}</span>
      {t.major && <span className="badge badge--major">Grand Slam</span>}
    </>
  )
}

interface CardProps {
  tournament: Tournament
  draws: DrawStats[]
  selected: boolean
  onSelect: () => void
}

export function TournamentCard({ tournament: t, draws, selected, onSelect }: CardProps) {
  return (
    <article className={`t-card${selected ? ' is-selected' : ''}`}>
      <header>
        <p className="t-card__badges">
          <TourBadges tournament={t} />
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

interface GroupsProps {
  /** Tournaments in the order to show them. */
  tournaments: Tournament[]
  matches: Match[]
  showDraw: boolean
  /** Show the tournament's dates next to its name (useful in history). */
  showDates?: boolean
}

export function MatchGroups({ tournaments, matches, showDraw, showDates }: GroupsProps) {
  const byTournament = new Map<string, Match[]>()
  for (const m of matches) {
    const list = byTournament.get(m.tournament_id)
    if (list) list.push(m)
    else byTournament.set(m.tournament_id, [m])
  }
  return (
    <div className="match-groups">
      {tournaments.map((t) => {
        const own = byTournament.get(t.id)
        if (!own) return null
        // Latest round first.
        const rounds = [...new Set(own.map((m) => `${m.draw}|${m.round_order}|${m.round}`))].sort((a, b) => {
          const [da, oa] = a.split('|')
          const [db, ob] = b.split('|')
          return da.localeCompare(db) || Number(ob) - Number(oa)
        })
        return (
          <section key={t.id} className="match-group" aria-label={t.name}>
            <h4 className="match-group__title">
              {t.name}
              {showDates && <span className="match-group__dates"> · {formatDay(t.start_date)}</span>}
            </h4>
            {rounds.map((key) => {
              const [draw, , round] = key.split('|') as [Draw, string, string]
              const list = own
                .filter((m) => m.draw === draw && m.round === round)
                .sort(
                  (a, b) =>
                    STATUS_RANK[a.status] - STATUS_RANK[b.status] || (a.start ?? '').localeCompare(b.start ?? ''),
                )
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

export function MatchRow({ match: m }: { match: Match }) {
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
