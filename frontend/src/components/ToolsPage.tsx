import { toolScene } from '../animations/toolScenes'
import { mentionsOf } from '../data/links'
import { tools, type Tool } from '../data/tools'
import { useScrollTo } from '../hooks/useScrollTo'
import { Linked } from './Linked'
import { MentionChips } from './MentionChips'
import { PixelAnimation } from './PixelAnimation'

const GROUPS: { group: Tool['group']; blurb: string }[] = [
  { group: 'Machine', blurb: 'The stringing machine and its parts.' },
  { group: 'Hand tools', blurb: 'Small tools you keep next to the machine.' },
  { group: 'Supplies', blurb: 'What gets used up.' },
]

export function ToolsPage({ focusId }: { focusId?: string }) {
  useScrollTo(focusId)

  return (
    <div className="layout layout--reference">
      <aside className="sidebar">
        <nav className="step-list" aria-label="Tools">
          {GROUPS.map(({ group }) => (
            <div key={group} className="step-list__group">
              <p className="step-list__heading">{group}</p>
              <ol>
                {tools
                  .filter((t) => t.group === group)
                  .map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#/tools/${t.id}`}
                        className={`step-list__item${t.id === focusId ? ' is-current' : ''}`}
                        aria-current={t.id === focusId ? 'location' : undefined}
                      >
                        <span className="step-list__marker" aria-hidden="true">
                          {group[0]}
                        </span>
                        <span className="step-list__title">{t.name}</span>
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
          <h2>Tools</h2>
          <p>What you need to string a racket, and what each part of the machine does.</p>
        </header>

        {GROUPS.map(({ group, blurb }) => (
          <section key={group} aria-labelledby={`tools-${group}`}>
            <h3 id={`tools-${group}`} className="section-title">
              {group} <span className="section-title__blurb">· {blurb}</span>
            </h3>
            {tools
              .filter((t) => t.group === group)
              .map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
          </section>
        ))}
      </main>
    </div>
  )
}

function ToolCard({ tool: t }: { tool: Tool }) {
  // Each term is linked once per card.
  const seen = new Set<string>()
  const scene = toolScene(t.id)
  return (
    <article id={t.id} className="step technique" aria-labelledby={`tool-${t.id}`}>
      <header className="step__header">
        <p className="step__eyebrow">
          {t.group} · {t.essential ? 'Essential' : 'Nice to have'}
        </p>
        <h2 id={`tool-${t.id}`}>{t.name}</h2>
        <p className="step__summary">
          <Linked text={t.summary} seen={seen} self={t.id} />
        </p>
      </header>

      {scene && (
        <PixelAnimation scene={scene} command={`TOOL_${t.id.replace(/-/g, '_').toUpperCase()}.EXE`} label={t.name} />
      )}

      <div className="ref-text">
        {t.details.map((text) => (
          <p key={text}>
            <Linked text={text} seen={seen} self={t.id} />
          </p>
        ))}
      </div>

      {t.tips?.map((text) => (
        <aside key={text} className="callout callout--tip">
          <strong>Tip</strong>
          <p>
            <Linked text={text} seen={seen} self={t.id} />
          </p>
        </aside>
      ))}

      <MentionChips label="Used in:" items={mentionsOf(t.id)} />

      {t.sources && (
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
      )}
    </article>
  )
}
