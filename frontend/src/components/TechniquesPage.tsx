import { techniqueScene } from '../animations/techniqueScenes'
import type { Technique } from '../data/techniques'
import { useScrollTo } from '../hooks/useScrollTo'
import { useT, type UiKey } from '../i18n'
import { useContent } from '../i18n/content'
import { Linked } from './Linked'
import { PixelAnimation } from './PixelAnimation'
import { Sources } from './Sources'

interface Props {
  /** Technique to scroll to, from the URL. */
  focusId?: string
  onOpenStep: (index: number) => void
}

const GROUPS: { kind: Technique['kind']; title: UiKey; eyebrow: UiKey; marker: string }[] = [
  { kind: 'knot', title: 'knots.groupKnots', eyebrow: 'knots.knot', marker: 'K' },
  { kind: 'technique', title: 'knots.groupTechniques', eyebrow: 'knots.technique', marker: 'T' },
]

export function TechniquesPage({ focusId, onOpenStep }: Props) {
  const t = useT()
  const { steps, techniques } = useContent()
  useScrollTo(focusId)

  return (
    <div className="layout layout--reference">
      <aside className="sidebar">
        <nav className="step-list" aria-label={t('knots.aria')}>
          {GROUPS.map((group) => (
            <div key={group.kind} className="step-list__group">
              <p className="step-list__heading">{t(group.title)}</p>
              <ol>
                {techniques
                  .filter((x) => x.kind === group.kind)
                  .map((x) => (
                    <li key={x.id}>
                      <a
                        href={`#/knots/${x.id}`}
                        className={`step-list__item${x.id === focusId ? ' is-current' : ''}`}
                        aria-current={x.id === focusId ? 'location' : undefined}
                      >
                        <span className="step-list__marker" aria-hidden="true">
                          {group.marker}
                        </span>
                        <span className="step-list__title">{x.title}</span>
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
          <h2>{t('knots.title')}</h2>
          <p>{t('knots.intro')}</p>
        </header>

        {GROUPS.map((group) => (
          <section key={group.kind} aria-labelledby={`group-${group.kind}`}>
            <h3 id={`group-${group.kind}`} className="section-title">
              {t(group.title)}
            </h3>
            {techniques
              .filter((x) => x.kind === group.kind)
              .map((x) => {
                const scene = techniqueScene(x.id)
                const seen = new Set<string>()
                const usedIn = steps.flatMap((s, i) => (s.related?.includes(x.id) ? [{ step: s, index: i }] : []))
                return (
                  <article key={x.id} id={x.id} className="step technique" aria-labelledby={`t-${x.id}`}>
                    <header className="step__header">
                      <p className="step__eyebrow">{t(group.eyebrow)}</p>
                      <h2 id={`t-${x.id}`}>{x.title}</h2>
                      <p className="step__summary">
                        <Linked text={x.summary} seen={seen} self={x.id} />
                      </p>
                    </header>

                    {scene && (
                      <PixelAnimation
                        scene={scene}
                        command={`${x.id.replace(/-/g, '_').toUpperCase()}.EXE`}
                        label={x.title}
                      />
                    )}

                    <ol className="step__instructions">
                      {x.instructions.map((text) => (
                        <li key={text}>
                          <Linked text={text} seen={seen} self={x.id} />
                        </li>
                      ))}
                    </ol>

                    {x.tips?.map((text) => (
                      <aside key={text} className="callout callout--tip">
                        <strong>{t('callout.tip')}</strong>
                        <p>
                          <Linked text={text} seen={seen} self={x.id} />
                        </p>
                      </aside>
                    ))}

                    {usedIn.length > 0 && (
                      <p className="related">
                        <span>{t('related.usedIn')}</span>
                        {usedIn.map(({ step, index }) => (
                          <button key={step.id} type="button" className="chip" onClick={() => onOpenStep(index)}>
                            {t('mention.step', { n: index + 1, title: step.title })}
                          </button>
                        ))}
                      </p>
                    )}

                    <Sources sources={x.sources} />
                  </article>
                )
              })}
          </section>
        ))}
      </main>
    </div>
  )
}
