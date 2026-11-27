import { useCallback, useEffect, useState } from 'react'
import { Footer } from './components/Footer'
import { GlossaryPage } from './components/GlossaryPage'
import { StepList } from './components/StepList'
import { StepView } from './components/StepView'
import { TechniquesPage } from './components/TechniquesPage'
import { TermTooltip } from './components/TermTooltip'
import { ToolsPage } from './components/ToolsPage'
import { HeaderLink, Topbar } from './components/Topbar'
import { LangToggle } from './components/LangToggle'
import { UnitsToggle } from './components/UnitsToggle'
import { totalMinutes } from './data/steps'
import { useLocalStorage } from './hooks/useLocalStorage'
import { LangProvider, useLanguage, useT, type Lang, type UiKey } from './i18n'
import { useContent } from './i18n/content'
import { UnitsProvider, defaultUnits, type Units } from './units'

type Page = 'guide' | 'knots' | 'tools' | 'glossary'

/** Live tennis is its own page (tennis.html); see src/tennis.tsx. */
const TENNIS_URL = `${import.meta.env.BASE_URL}tennis.html`

/** Old links to the tennis tab (#/tennis) now go to the tennis page. */
function redirectOldTennisLink() {
  if (window.location.hash.startsWith('#/tennis')) window.location.replace(TENNIS_URL)
}
redirectOldTennisLink()

/**
 * Hash routes, so deep links work on GitHub Pages: #/ (guide), #/step/<id>,
 * #/knots[/<id>], #/tools[/<id>], #/glossary[/<id>].
 */
function parseRoute(hash: string): { page: Page; id?: string } {
  const [, page, id] = hash.replace(/^#/, '').split('/')
  if (page === 'knots' || page === 'tools' || page === 'glossary') return { page, id: id || undefined }
  if (page === 'step') return { page: 'guide', id: id || undefined }
  return { page: 'guide' }
}

const TABS: { page: Page; href: string; label: UiKey; short: UiKey }[] = [
  { page: 'guide', href: '#/', label: 'tab.guide', short: 'tab.guide.short' },
  { page: 'knots', href: '#/knots', label: 'tab.knots', short: 'tab.knots.short' },
  { page: 'tools', href: '#/tools', label: 'tab.tools', short: 'tab.tools.short' },
  { page: 'glossary', href: '#/glossary', label: 'tab.glossary', short: 'tab.glossary.short' },
]

function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => {
      redirectOldTennisLink()
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return parseRoute(hash)
}

export default function App() {
  const [lang, setLang] = useLanguage()
  return (
    <LangProvider value={lang}>
      <Guide lang={lang} onLang={setLang} />
    </LangProvider>
  )
}

function Guide({ lang, onLang }: { lang: Lang; onLang: (lang: Lang) => void }) {
  const t = useT()
  const { steps } = useContent()
  const route = useRoute()

  useEffect(() => {
    document.title = t('title.guide')
  }, [t])

  const [units, setUnits] = useLocalStorage<Units>('units', defaultUnits())
  const [storedIndex, setIndex] = useLocalStorage('currentStep', 0)
  const [completed, setCompleted] = useLocalStorage<string[]>('completedSteps', [])

  // Guard against a stale index if steps are removed later.
  const index = Math.min(Math.max(storedIndex, 0), steps.length - 1)
  const step = steps[index]
  const done = completed.includes(step.id)
  const progress = Math.round((completed.length / steps.length) * 100)

  const goTo = useCallback(
    (i: number) => {
      setIndex(Math.min(Math.max(i, 0), steps.length - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setIndex, steps.length],
  )

  // #/step/<id> (from "Used in" links) opens that step, then settles on #/.
  const stepId = route.page === 'guide' ? route.id : undefined
  useEffect(() => {
    if (!stepId) return
    const i = steps.findIndex((s) => s.id === stepId)
    if (i >= 0) goTo(i)
    window.location.replace('#/')
  }, [stepId, goTo, steps])

  const openStep = (i: number) => {
    window.location.hash = '#/'
    goTo(i)
  }

  const toggleDone = () =>
    setCompleted((prev) =>
      prev.includes(step.id) ? prev.filter((id) => id !== step.id) : [...prev, step.id],
    )

  const reset = () => {
    setCompleted([])
    goTo(0)
  }

  // Left/right arrow keys move between steps.
  useEffect(() => {
    if (route.page !== 'guide') return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable]')) return
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, goTo, route.page])

  return (
    <UnitsProvider value={units}>
      <div className="app">
        <Topbar subtitle={t('app.subtitle', { steps: steps.length, minutes: totalMinutes })}>
          <HeaderLink
            href={TENNIS_URL}
            label={t('header.live')}
            short={t('header.live')}
            live
            description={t('header.live.desc')}
          />
          <UnitsToggle units={units} onChange={setUnits} />
          <LangToggle lang={lang} onChange={onLang} />
        </Topbar>
        <TermTooltip />

        <div
          className="progress"
          role="progressbar"
          aria-label={t('guide.progress')}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress__bar" style={{ width: `${progress}%` }} />
        </div>

        <nav className="tabs" aria-label={t('nav.sections')}>
          {TABS.map((tab) => (
            <a
              key={tab.page}
              href={tab.href}
              className={`tab${route.page === tab.page ? ' is-active' : ''}`}
              aria-current={route.page === tab.page ? 'page' : undefined}
            >
              <span className="tab__long">{t(tab.label)}</span>
              <span className="tab__short" aria-hidden="true">
                {t(tab.short)}
              </span>
            </a>
          ))}
        </nav>

        {route.page === 'knots' ? (
          <TechniquesPage focusId={route.id} onOpenStep={openStep} />
        ) : route.page === 'tools' ? (
          <ToolsPage focusId={route.id} />
        ) : route.page === 'glossary' ? (
          <GlossaryPage focusId={route.id} />
        ) : (
          <div className="layout">
            <aside className="sidebar">
              <StepList steps={steps} currentIndex={index} completed={completed} onSelect={goTo} />
              <div className="sidebar__footer">
                <span>{t('guide.done', { done: completed.length, total: steps.length })}</span>
                {completed.length > 0 && (
                  <button type="button" className="link-button" onClick={reset}>
                    {t('guide.reset')}
                  </button>
                )}
              </div>
            </aside>

            <main className="content">
              <StepView
                step={step}
                index={index}
                total={steps.length}
                done={done}
                onToggleDone={toggleDone}
                onPrev={() => goTo(index - 1)}
                onNext={() => goTo(index + 1)}
              />
              <p className="hint">{t('guide.hint')}</p>
            </main>
          </div>
        )}
        <Footer />
      </div>
    </UnitsProvider>
  )
}
