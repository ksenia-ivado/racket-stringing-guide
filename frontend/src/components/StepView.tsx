import { sceneFor } from '../animations/scenes'
import type { Step } from '../data/steps'
import { useT } from '../i18n'
import { useContent } from '../i18n/content'
import { Linked } from './Linked'
import { PixelAnimation } from './PixelAnimation'
import { Sources } from './Sources'

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
  const t = useT()
  const { techniques } = useContent()
  // Each glossary term, tool or technique is linked once per step.
  const seen = new Set<string>()
  const isFirst = index === 0
  const isLast = index === total - 1
  const related = techniques.filter((x) => step.related?.includes(x.id))

  return (
    <article className="step" aria-labelledby={`step-${step.id}`}>
      <header className="step__header">
        <p className="step__eyebrow">{t('step.eyebrow', { n: index + 1, total, minutes: step.minutes })}</p>
        <h2 id={`step-${step.id}`}>{step.title}</h2>
        <p className="step__summary">
          <Linked text={step.summary} seen={seen} />
        </p>
      </header>

      <PixelAnimation
        scene={sceneFor(step.id)}
        command={`STEP_${String(index + 1).padStart(2, '0')}.EXE ${step.title}`}
        label={step.title}
      />

      <ol className="step__instructions">
        {step.instructions.map((text) => (
          <li key={text}>
            <Linked text={text} seen={seen} />
          </li>
        ))}
      </ol>

      {step.warnings?.map((text) => (
        <aside key={text} className="callout callout--warning">
          <strong>{t('callout.warning')}</strong>
          <p>
            <Linked text={text} seen={seen} />
          </p>
        </aside>
      ))}

      {step.tips?.map((text) => (
        <aside key={text} className="callout callout--tip">
          <strong>{t('callout.tip')}</strong>
          <p>
            <Linked text={text} seen={seen} />
          </p>
        </aside>
      ))}

      {related.length > 0 && (
        <p className="related">
          <span>{t('related.seeAlso')}</span>
          {related.map((x) => (
            <a key={x.id} href={`#/knots/${x.id}`} className="chip">
              {x.title}
            </a>
          ))}
        </p>
      )}

      <Sources sources={step.sources} />

      <footer className="step__footer">
        <button type="button" className="button button--ghost" onClick={onPrev} disabled={isFirst}>
          {t('step.back')}
        </button>
        <label className="step__done">
          <input type="checkbox" checked={done} onChange={onToggleDone} />
          {t('step.markDone')}
        </label>
        <button type="button" className="button button--primary" onClick={onNext} disabled={isLast}>
          {t('step.next')}
        </button>
      </footer>
    </article>
  )
}
