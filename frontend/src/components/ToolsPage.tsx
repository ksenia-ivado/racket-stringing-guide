import { toolScene } from '../animations/toolScenes'
import { useLinks } from '../data/links'
import type { Tool } from '../data/tools'
import { useScrollTo } from '../hooks/useScrollTo'
import { useT } from '../i18n'
import { useContent } from '../i18n/content'
import { Linked } from './Linked'
import { MentionChips } from './MentionChips'
import { PixelAnimation } from './PixelAnimation'
import { Sources } from './Sources'

const GROUPS: Tool['group'][] = ['Machine', 'Hand tools', 'Supplies']

export function ToolsPage({ focusId }: { focusId?: string }) {
  const t = useT()
  const { tools } = useContent()
  useScrollTo(focusId)

  return (
    <div className="layout layout--reference">
      <aside className="sidebar">
        <nav className="step-list" aria-label={t('tools.title')}>
          {GROUPS.map((group) => (
            <div key={group} className="step-list__group">
              <p className="step-list__heading">{t(`tools.group.${group}`)}</p>
              <ol>
                {tools
                  .filter((x) => x.group === group)
                  .map((x) => (
                    <li key={x.id}>
                      <a
                        href={`#/tools/${x.id}`}
                        className={`step-list__item${x.id === focusId ? ' is-current' : ''}`}
                        aria-current={x.id === focusId ? 'location' : undefined}
                      >
                        <span className="step-list__marker" aria-hidden="true">
                          {t(`tools.group.${group}`)[0]}
                        </span>
                        <span className="step-list__title">{x.name}</span>
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
          <h2>{t('tools.title')}</h2>
          <p>{t('tools.intro')}</p>
        </header>

        {GROUPS.map((group) => (
          <section key={group} aria-labelledby={`tools-${group}`}>
            <h3 id={`tools-${group}`} className="section-title">
              {t(`tools.group.${group}`)}{' '}
              <span className="section-title__blurb">· {t(`tools.blurb.${group}`)}</span>
            </h3>
            {tools
              .filter((x) => x.group === group)
              .map((x) => (
                <ToolCard key={x.id} tool={x} />
              ))}
          </section>
        ))}
      </main>
    </div>
  )
}

function ToolCard({ tool: x }: { tool: Tool }) {
  const t = useT()
  const { mentionsOf } = useLinks()
  // Each term is linked once per card.
  const seen = new Set<string>()
  const scene = toolScene(x.id)
  return (
    <article id={x.id} className="step technique" aria-labelledby={`tool-${x.id}`}>
      <header className="step__header">
        <p className="step__eyebrow">
          {t(`tools.group.${x.group}`)} · {t(x.essential ? 'tools.essential' : 'tools.optional')}
        </p>
        <h2 id={`tool-${x.id}`}>{x.name}</h2>
        <p className="step__summary">
          <Linked text={x.summary} seen={seen} self={x.id} />
        </p>
      </header>

      {scene && (
        <PixelAnimation scene={scene} command={`TOOL_${x.id.replace(/-/g, '_').toUpperCase()}.EXE`} label={x.name} />
      )}

      <div className="ref-text">
        {x.details.map((text) => (
          <p key={text}>
            <Linked text={text} seen={seen} self={x.id} />
          </p>
        ))}
      </div>

      {x.tips?.map((text) => (
        <aside key={text} className="callout callout--tip">
          <strong>{t('callout.tip')}</strong>
          <p>
            <Linked text={text} seen={seen} self={x.id} />
          </p>
        </aside>
      ))}

      <MentionChips label={t('related.usedIn')} items={mentionsOf(x.id)} />
      <Sources sources={x.sources} />
    </article>
  )
}
