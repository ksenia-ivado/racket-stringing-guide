import { useEffect, useState } from 'react'
import { HistoryView } from './tennis/HistoryView'
import { LiveView } from './tennis/LiveView'

type Mode = 'live' | 'history'

const modeFromHash = (): Mode => (window.location.hash === '#history' ? 'history' : 'live')

/** The live tennis page: what is on now, or past seasons (tennis.html#history). */
export function TennisPage() {
  const [mode, setMode] = useState<Mode>(modeFromHash)

  useEffect(() => {
    const onChange = () => setMode(modeFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return (
    <div className="page">
      <header className="page-intro">
        <h2>{mode === 'live' ? 'Live tennis' : 'Tennis history'}</h2>
        <p>
          {mode === 'live'
            ? 'Current ATP and WTA tournaments: men’s and women’s singles only.'
            : 'Past ATP and WTA singles results, season by season. Search a player to see their record.'}{' '}
          <a href={`${import.meta.env.BASE_URL}#/glossary/group-matches`} className="page-intro__meta">
            What do seed, walkover and tiebreak mean?
          </a>
        </p>
      </header>

      <nav className="tabs tabs--inline" aria-label="Live or history">
        <a href="#live" className={`tab${mode === 'live' ? ' is-active' : ''}`} aria-current={mode === 'live' ? 'page' : undefined}>
          Live now
        </a>
        <a
          href="#history"
          className={`tab${mode === 'history' ? ' is-active' : ''}`}
          aria-current={mode === 'history' ? 'page' : undefined}
        >
          History
        </a>
      </nav>

      {mode === 'live' ? <LiveView /> : <HistoryView />}
    </div>
  )
}
