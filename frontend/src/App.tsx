import { useCallback, useEffect, useState } from 'react'
import { Footer } from './components/Footer'
import { GlossaryPage } from './components/GlossaryPage'
import { StepList } from './components/StepList'
import { StepView } from './components/StepView'
import { TechniquesPage } from './components/TechniquesPage'
import { TermTooltip } from './components/TermTooltip'
import { ToolsPage } from './components/ToolsPage'
import { HeaderLink, Topbar } from './components/Topbar'
import { UnitsToggle } from './components/UnitsToggle'
import { steps, totalMinutes } from './data/steps'
import { useLocalStorage } from './hooks/useLocalStorage'
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

const TABS: { page: Page; href: string; label: string; short: string }[] = [
  { page: 'guide', href: '#/', label: 'Step-by-step guide', short: 'Guide' },
  { page: 'knots', href: '#/knots', label: 'Knots & techniques', short: 'Knots' },
  { page: 'tools', href: '#/tools', label: 'Tools', short: 'Tools' },
  { page: 'glossary', href: '#/glossary', label: 'Glossary', short: 'Terms' },
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
  const route = useRoute()
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
    [setIndex],
  )

  // #/step/<id> (from "Used in" links) opens that step, then settles on #/.
  const stepId = route.page === 'guide' ? route.id : undefined
  useEffect(() => {
    if (!stepId) return
    const i = steps.findIndex((s) => s.id === stepId)
    if (i >= 0) goTo(i)
    window.location.replace('#/')
  }, [stepId, goTo])

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
        <Topbar subtitle={`${steps.length} steps · about ${totalMinutes} min`}>
          <HeaderLink href={TENNIS_URL} label="Live" short="Live" live description="Live tennis scores" />
          <UnitsToggle units={units} onChange={setUnits} />
        </Topbar>
        <TermTooltip />

        <div
          className="progress"
          role="progressbar"
          aria-label="Steps completed"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress__bar" style={{ width: `${progress}%` }} />
        </div>

        <nav className="tabs" aria-label="Sections">
          {TABS.map((tab) => (
            <a
              key={tab.page}
              href={tab.href}
              className={`tab${route.page === tab.page ? ' is-active' : ''}`}
              aria-current={route.page === tab.page ? 'page' : undefined}
            >
              <span className="tab__long">{tab.label}</span>
              <span className="tab__short" aria-hidden="true">
                {tab.short}
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
                <span>
                  {completed.length}/{steps.length} done
                </span>
                {completed.length > 0 && (
                  <button type="button" className="link-button" onClick={reset}>
                    Reset progress
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
              <p className="hint">Tip: use ← and → to move between steps.</p>
            </main>
          </div>
        )}
        <Footer />
      </div>
    </UnitsProvider>
  )
}
