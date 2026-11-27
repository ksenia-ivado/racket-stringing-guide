import { techniqueScene } from '../animations/techniqueScenes'
import { steps } from '../data/steps'
import { techniques, type Technique } from '../data/techniques'
import { useScrollTo } from '../hooks/useScrollTo'
import { Linked } from './Linked'
import { PixelAnimation } from './PixelAnimation'

interface Props {
  /** Technique to scroll to, from the URL. */
  focusId?: string
  onOpenStep: (index: number) => void
}

const GROUPS: { kind: Technique['kind']; title: string }[] = [
  { kind: 'knot', title: 'Knots' },
  { kind: 'technique', title: 'Techniques' },
]

export function TechniquesPage({ focusId, onOpenStep }: Props) {

  useScrollTo(focusId)

  return (
    <div className="layout layout--reference">
      <aside className="sidebar">
        <nav className="step-list" aria-label="Knots and techniques">
          {GROUPS.map((group) => (
            <div key={group.kind} className="step-list__group">
              <p className="step-list__heading">{group.title}</p>
              <ol>
                {techniques
                  .filter((t) => t.kind === group.kind)
                  .map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#/knots/${t.id}`}
                        className={`step-list__item${t.id === focusId ? ' is-current' : ''}`}
                        aria-current={t.id === focusId ? 'location' : undefined}
                      >
                        <span className="step-list__marker" aria-hidden="true">
                          {group.kind === 'knot' ? 'K' : 'T'}
                        </span>
                        <span className="step-list__title">{t.title}</span>
                      </a>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="page-intro">
          <h2>Knots &amp; techniques</h2>
          <p>The knots you tie and the habits that make a string job last. The guide links here where each one comes up.</p>
        </header>

        {GROUPS.map((group) => (
          <section key={group.kind} aria-labelledby={`group-${group.kind}`}>
            <h3 id={`group-${group.kind}`} className="section-title">
              {group.title}
            </h3>
            {techniques
              .filter((t) => t.kind === group.kind)
              .map((t) => {
                const scene = techniqueScene(t.id)
                const seen = new Set<string>()
                const usedIn = steps.flatMap((s, i) => (s.related?.includes(t.id) ? [{ step: s, index: i }] : []))
                return (
                  <article key={t.id} id={t.id} className="step technique" aria-labelledby={`t-${t.id}`}>
                    <header className="step__header">
                      <p className="step__eyebrow">{group.kind === 'knot' ? 'Knot' : 'Technique'}</p>
                      <h2 id={`t-${t.id}`}>{t.title}</h2>
                      <p className="step__summary">
                        <Linked text={t.summary} seen={seen} self={t.id} />
                      </p>
                    </header>

                    {scene && (
                      <PixelAnimation
                        scene={scene}
                        command={`${t.id.replace(/-/g, '_').toUpperCase()}.EXE`}
                        label={t.title}
                      />
                    )}

                    <ol className="step__instructions">
                      {t.instructions.map((text) => (
                        <li key={text}><Linked text={text} seen={seen} self={t.id} /></li>
                      ))}
                    </ol>

                    {t.tips?.map((text) => (
                      <aside key={text} className="callout callout--tip">
                        <strong>Tip</strong>
                        <p><Linked text={text} seen={seen} self={t.id} /></p>
                      </aside>
                    ))}

                    {usedIn.length > 0 && (
                      <p className="related">
                        <span>Used in:</span>
                        {usedIn.map(({ step, index }) => (
                          <button key={step.id} type="button" className="chip" onClick={() => onOpenStep(index)}>
                            Step {index + 1}: {step.title}
                          </button>
                        ))}
                      </p>
                    )}

                    <details className="sources">
                      <summary>Sources</summary>
                      <ol>
                        {t.sources.map((s) => (
                          <li key={s.url}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer">
                              {s.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </details>
                  </article>
                )
              })}
          </section>
        ))}
      </main>
    </div>
  )
}
