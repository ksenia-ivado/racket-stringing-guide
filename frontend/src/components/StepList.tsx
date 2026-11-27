import type { Step } from '../data/steps'

interface Props {
  steps: Step[]
  currentIndex: number
  completed: string[]
  onSelect: (index: number) => void
}

export function StepList({ steps, currentIndex, completed, onSelect }: Props) {
  return (
    <nav className="step-list" aria-label="Steps">
      <ol>
        {steps.map((step, i) => {
          const done = completed.includes(step.id)
          const current = i === currentIndex
          return (
            <li key={step.id}>
              <button
                type="button"
                className={`step-list__item${current ? ' is-current' : ''}${done ? ' is-done' : ''}`}
                aria-current={current ? 'step' : undefined}
                onClick={() => onSelect(i)}
              >
                <span className="step-list__marker" aria-hidden="true">
                  {done ? '✓' : i + 1}
                </span>
                <span className="step-list__title">{step.title}</span>
                {done && <span className="visually-hidden">(done)</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
