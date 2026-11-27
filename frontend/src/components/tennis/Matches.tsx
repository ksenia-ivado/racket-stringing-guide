import type { Draw, DrawStats, Match, Tournament } from '../../api/client'
import { roundName, statusName, useLang, useT, type T } from '../../i18n'
import { DRAW_OPTIONS, STATUS_RANK, formatDay, formatTime, tourClass, type DrawFilter } from './format'

/** Men / women / all toggle, shared by the live and history views. */
export function DrawToggle({ value, onChange }: { value: DrawFilter; onChange: (d: DrawFilter) => void }) {
  const tr = useT()
  return (
    <div className="segmented" role="radiogroup" aria-label={tr('draw.aria')}>
      {DRAW_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`segmented__option${value === o.value ? ' is-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {tr(o.label)}
        </button>
      ))}
    </div>
  )
}

export function TourBadges({ tournament: t }: { tournament: Tournament }) {
  const tr = useT()
  return (
    <>
      <span className={`badge badge--${tourClass(t)}`}>{t.tour}</span>
      {t.major && <span className="badge badge--major">{tr('badge.slam')}</span>}
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
  const tr = useT()
  const lang = useLang()
  return (
    <article className={`t-card${selected ? ' is-selected' : ''}`}>
      <header>
        <p className="t-card__badges">
          <TourBadges tournament={t} />
        </p>
        <h3>{t.name}</h3>
        <p className="t-card__meta">
          {t.location && `${t.location} · `}
          {formatDay(t.start_date, lang)} – {formatDay(t.end_date, lang)}
        </p>
      </header>

      {draws.map((d) => (
        <section key={d.draw} className="t-draw" aria-label={tr(`draw.${d.draw}`)}>
          {draws.length > 1 && <p className="t-draw__name">{tr(`draw.${d.draw}`)}</p>}
          {d.matches === 0 ? (
            <p className="t-draw__status">{tr('card.drawNotOut')}</p>
          ) : (
            <>
              <div className="meter" aria-hidden="true">
                <div className="meter__fill" style={{ width: `${(d.completed / d.matches) * 100}%` }} />
              </div>
              <dl className="stats">
                <div>
                  <dt>{tr('card.played')}</dt>
                  <dd>
                    {d.completed}
                    <span>/{d.matches}</span>
                  </dd>
                </div>
                <div>
                  <dt>{tr('card.live')}</dt>
                  <dd className={d.live ? 'is-live' : undefined}>{d.live}</dd>
                </div>
                <div>
                  <dt>{tr('card.toPlay')}</dt>
                  <dd>{d.scheduled}</dd>
                </div>
                <div>
                  <dt>{tr('card.retired')}</dt>
                  <dd>{d.retirements}</dd>
                </div>
              </dl>
              <p className="t-draw__status">
                {d.champion ? (
                  <>
                    {tr('card.champion')} <strong>{d.champion}</strong>
                  </>
                ) : d.current_round ? (
                  <>
                    {tr('card.nowPlaying')} <strong>{roundName(tr, d.current_round)}</strong>
                  </>
                ) : null}
              </p>
            </>
          )}
        </section>
      ))}

      <button type="button" className="chip" onClick={onSelect} aria-pressed={selected}>
        {tr(selected ? 'card.showAll' : 'card.onlyThis')}
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
  const tr = useT()
  const lang = useLang()
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
              {showDates && <span className="match-group__dates"> · {formatDay(t.start_date, lang)}</span>}
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
                    {showDraw && `${tr(`draw.${draw}`)} · `}
                    {roundName(tr, round)}
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

function statusLabel(m: Match, tr: T, lang: Parameters<typeof formatTime>[1]) {
  if (m.status === 'live') return tr('match.live')
  if (m.status === 'completed') return statusName(tr, m.status_detail || 'Final')
  return m.start ? formatTime(m.start, lang) : tr('match.timeTbd')
}

export function MatchRow({ match: m }: { match: Match }) {
  const tr = useT()
  const lang = useLang()
  return (
    <li className={`match match--${m.status}`}>
      <span className={`pill pill--${m.status}`}>{statusLabel(m, tr, lang)}</span>
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
