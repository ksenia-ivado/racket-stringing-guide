import { useCallback, useEffect } from 'react'
import { apiEnabled } from './api/client'
import { ApiStatus } from './components/ApiStatus'
import { StepList } from './components/StepList'
import { StepView } from './components/StepView'
import { ThemeToggle } from './components/ThemeToggle'
import { steps, totalMinutes } from './data/steps'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
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
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable]')) return
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, goTo])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" className="logo">
            <ellipse cx="13" cy="12" rx="9" ry="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path
              d="M8 6v13M13 3v18M18 6v13M5 9h16M4 13h18M6 17h14"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".6"
            />
            <path d="M18 20l8 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div>
            <h1>String Your Racket</h1>
            <p className="topbar__meta">
              {steps.length} steps · about {totalMinutes} min
            </p>
          </div>
        </div>
        <div className="topbar__actions">
          {apiEnabled && <ApiStatus />}
          <ThemeToggle />
        </div>
      </header>

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
    </div>
  )
}
