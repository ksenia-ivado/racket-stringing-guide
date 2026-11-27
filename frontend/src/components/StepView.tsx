import { sceneFor } from '../animations/scenes'
import type { Step } from '../data/steps'
import { techniques } from '../data/techniques'
import { fmt, useUnits } from '../units'
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
  const units = useUnits()
  const isFirst = index === 0
  const isLast = index === total - 1
  const related = techniques.filter((t) => step.related?.includes(t.id))

  return (
    <article className="step" aria-labelledby={`step-${step.id}`}>
      <header className="step__header">
        <p className="step__eyebrow">
          Step {index + 1} of {total} · about {step.minutes} min
        </p>
        <h2 id={`step-${step.id}`}>{step.title}</h2>
        <p className="step__summary">{step.summary}</p>
      </header>

      <PixelAnimation
        scene={sceneFor(step.id)}
        command={`STEP_${String(index + 1).padStart(2, '0')}.EXE ${step.title}`}
        label={step.title}
      />

      <ol className="step__instructions">
        {step.instructions.map((text) => (
          <li key={text}>{fmt(text, units)}</li>
        ))}
      </ol>

      {step.warnings?.map((text) => (
        <aside key={text} className="callout callout--warning">
          <strong>Warning</strong>
          <p>{fmt(text, units)}</p>
        </aside>
      ))}

      {step.tips?.map((text) => (
        <aside key={text} className="callout callout--tip">
          <strong>Tip</strong>
          <p>{fmt(text, units)}</p>
        </aside>
      ))}

      {related.length > 0 && (
        <p className="related">
          <span>See also:</span>
          {related.map((t) => (
            <a key={t.id} href={`#/knots/${t.id}`} className="chip">
              {t.title}
            </a>
          ))}
        </p>
      )}

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
