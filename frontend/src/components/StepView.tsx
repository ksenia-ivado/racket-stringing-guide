import type { Step } from '../data/steps'
import { PixelAnimation } from './PixelAnimation'

interface Props {
  step: Step
  index: number
  total: number
  done: boolean
  onToggleDone: () => void
  onPrev: () => void
  onNext: () => void
}

export function StepView({ step, index, total, done, onToggleDone, onPrev, onNext }: Props) {
  const isFirst = index === 0
  const isLast = index === total - 1

  return (
    <article className="step" aria-labelledby={`step-${step.id}`}>
      <header className="step__header">
        <p className="step__eyebrow">
          Step {index + 1} of {total} · about {step.minutes} min
        </p>
        <h2 id={`step-${step.id}`}>{step.title}</h2>
        <p className="step__summary">{step.summary}</p>
      </header>

      <PixelAnimation stepId={step.id} title={step.title} number={index + 1} />

      <ol className="step__instructions">
        {step.instructions.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ol>

      {step.warnings?.map((text) => (
        <aside key={text} className="callout callout--warning">
          <strong>Warning</strong>
          <p>{text}</p>
        </aside>
      ))}

      {step.tips?.map((text) => (
        <aside key={text} className="callout callout--tip">
          <strong>Tip</strong>
          <p>{text}</p>
        </aside>
      ))}

      <footer className="step__footer">
        <button type="button" className="button button--ghost" onClick={onPrev} disabled={isFirst}>
          ← Back
        </button>
        <label className="step__done">
          <input type="checkbox" checked={done} onChange={onToggleDone} />
          Mark as done
        </label>
        <button type="button" className="button button--primary" onClick={onNext} disabled={isLast}>
          Next →
        </button>
      </footer>
    </article>
  )
}
