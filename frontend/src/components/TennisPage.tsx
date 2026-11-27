import { useEffect, useState } from 'react'
import { useT } from '../i18n'
import { HistoryView } from './tennis/HistoryView'
import { LiveView } from './tennis/LiveView'

type Mode = 'live' | 'history'

const modeFromHash = (): Mode => (window.location.hash === '#history' ? 'history' : 'live')

/** The live tennis page: what is on now, or past seasons (tennis.html#history). */
export function TennisPage() {
  const t = useT()
  const [mode, setMode] = useState<Mode>(modeFromHash)

  useEffect(() => {
    const onChange = () => setMode(modeFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return (
    <div className="page">
      <header className="page-intro">
        <h2>{t(mode === 'live' ? 'tennis.liveTitle' : 'tennis.historyTitle')}</h2>
        <p>
          {t(mode === 'live' ? 'tennis.liveIntro' : 'tennis.historyIntro')}{' '}
          <a href={`${import.meta.env.BASE_URL}#/glossary/group-matches`} className="page-intro__meta">
            {t('tennis.termsLink')}
          </a>
        </p>
      </header>

      <nav className="tabs tabs--inline" aria-label={t('tennis.tabsAria')}>
        <a href="#live" className={`tab${mode === 'live' ? ' is-active' : ''}`} aria-current={mode === 'live' ? 'page' : undefined}>
          {t('tennis.tabLive')}
        </a>
        <a
          href="#history"
          className={`tab${mode === 'history' ? ' is-active' : ''}`}
          aria-current={mode === 'history' ? 'page' : undefined}
        >
          {t('tennis.tabHistory')}
        </a>
      </nav>

      {mode === 'live' ? <LiveView /> : <HistoryView />}
    </div>
  )
}
