import { useState } from 'react'
import { TERM_CATEGORIES, glossary, glossarySources, type Term } from '../data/glossary'
import { mentionsOf, targets } from '../data/links'
import { useScrollTo } from '../hooks/useScrollTo'
import { Linked } from './Linked'
import { MentionChips } from './MentionChips'

const BLURBS: Record<Term['category'], string> = {
  Racket: 'Parts of the frame.',
  Strings: 'Strings, their materials and the string bed.',
  Stringing: 'Words for the job itself.',
  Matches: 'Terms used on the live tennis page.',
}

const byTerm = (a: Term, b: Term) => a.term.localeCompare(b.term)

/** Group ids double as deep links, e.g. #/glossary/group-matches. */
const groupId = (c: Term['category']) => `group-${c.toLowerCase()}`

export function GlossaryPage({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState('')
  useScrollTo(focusId)

  const q = query.trim().toLowerCase()
  const shown = q
    ? glossary.filter((t) =>
        [t.term, t.definition, t.details ?? '', ...t.aliases].some((s) => s.toLowerCase().includes(q)),
      )
    : glossary

  return (
    <div className="layout layout--reference">
      <aside className="sidebar">
        <nav className="step-list step-list--scroll" aria-label="Glossary">
          {TERM_CATEGORIES.map((c) => {
            const terms = shown.filter((t) => t.category === c).sort(byTerm)
            if (terms.length === 0) return null
            return (
              <div key={c} className="step-list__group">
                <p className="step-list__heading">{c}</p>
                <ol>
                  {terms.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#/glossary/${t.id}`}
                        className={`step-list__item step-list__item--compact${t.id === focusId ? ' is-current' : ''}`}
                        aria-current={t.id === focusId ? 'location' : undefined}
                      >
                        <span className="step-list__title">{t.term}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </nav>
      </aside>

      <main className="content">
        <header className="page-intro">
          <h2>Glossary</h2>
          <p>Stringing and tennis terms. Underlined words anywhere on the site link here.</p>
        </header>

        <label className="field glossary-search">
          <span>Find a term</span>
          <input
            type="search"
            placeholder="e.g. grommet, gauge, walkover"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        {shown.length === 0 && <p className="empty">No terms match “{query}”.</p>}

        {TERM_CATEGORIES.map((c) => {
          const terms = shown.filter((t) => t.category === c).sort(byTerm)
          if (terms.length === 0) return null
          return (
            <section key={c} id={groupId(c)} className="glossary-group" aria-labelledby={`${groupId(c)}-title`}>
              <h3 id={`${groupId(c)}-title`} className="section-title">
                {c} <span className="section-title__blurb">· {BLURBS[c]}</span>
              </h3>
              <dl className="glossary">
                {terms.map((t) => (
                  <TermEntry key={t.id} term={t} focused={t.id === focusId} />
                ))}
              </dl>
            </section>
          )
        })}

        <details className="sources">
          <summary>Sources</summary>
          <ol>
            {glossarySources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </details>
      </main>
    </div>
  )
}

function TermEntry({ term: t, focused }: { term: Term; focused: boolean }) {
  const seen = new Set<string>()
  const related = (t.related ?? []).flatMap((id) => {
    const target = targets.get(id)
    return target ? [{ title: target.title, href: target.href }] : []
  })
  const relatedHrefs = new Set(related.map((r) => r.href))
  const usedIn = mentionsOf(t.id).filter((m) => !relatedHrefs.has(m.href))

  return (
    <div id={t.id} className={`glossary__entry${focused ? ' is-focused' : ''}`}>
      <dt>{t.term}</dt>
      <dd>
        <p>
          <Linked text={t.definition} seen={seen} self={t.id} />
        </p>
        {t.details && (
          <p className="glossary__details">
            <Linked text={t.details} seen={seen} self={t.id} />
          </p>
        )}
        <MentionChips label="See also:" items={related} />
        <MentionChips label="Used in:" items={usedIn} />
      </dd>
    </div>
  )
}
