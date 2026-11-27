import { useState } from 'react'
import { TERM_CATEGORIES, glossarySources, type Term } from '../data/glossary'
import { useLinks } from '../data/links'
import { useScrollTo } from '../hooks/useScrollTo'
import { localeOf, useLang, useT } from '../i18n'
import { useContent } from '../i18n/content'
import { Linked } from './Linked'
import { MentionChips } from './MentionChips'
import { Sources } from './Sources'

/** Group ids double as deep links, e.g. #/glossary/group-matches. */
const groupId = (c: Term['category']) => `group-${c.toLowerCase()}`

/** Accent- and case-insensitive, so "oeillet" finds "œillet" and "tension" finds "tensión". */
const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')

export function GlossaryPage({ focusId }: { focusId?: string }) {
  const t = useT()
  const lang = useLang()
  const { glossary } = useContent()
  const [query, setQuery] = useState('')
  useScrollTo(focusId)

  const q = fold(query.trim())
  const shown = q
    ? glossary.filter((x) => [x.term, x.definition, x.details ?? '', ...x.aliases].some((s) => fold(s).includes(q)))
    : glossary
  const collator = new Intl.Collator(localeOf(lang))
  const byTerm = (a: Term, b: Term) => collator.compare(a.term, b.term)

  return (
    <div className="layout layout--reference">
      <aside className="sidebar">
        <nav className="step-list step-list--scroll" aria-label={t('glossary.title')}>
          {TERM_CATEGORIES.map((c) => {
            const terms = shown.filter((x) => x.category === c).sort(byTerm)
            if (terms.length === 0) return null
            return (
              <div key={c} className="step-list__group">
                <p className="step-list__heading">{t(`cat.${c}`)}</p>
                <ol>
                  {terms.map((x) => (
                    <li key={x.id}>
                      <a
                        href={`#/glossary/${x.id}`}
                        className={`step-list__item step-list__item--compact${x.id === focusId ? ' is-current' : ''}`}
                        aria-current={x.id === focusId ? 'location' : undefined}
                      >
                        <span className="step-list__title">{x.term}</span>
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
          <h2>{t('glossary.title')}</h2>
          <p>{t('glossary.intro')}</p>
        </header>

        <label className="field glossary-search">
          <span>{t('glossary.find')}</span>
          <input
            type="search"
            placeholder={t('glossary.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        {shown.length === 0 && <p className="empty">{t('glossary.noMatch', { query })}</p>}

        {TERM_CATEGORIES.map((c) => {
          const terms = shown.filter((x) => x.category === c).sort(byTerm)
          if (terms.length === 0) return null
          return (
            <section key={c} id={groupId(c)} className="glossary-group" aria-labelledby={`${groupId(c)}-title`}>
              <h3 id={`${groupId(c)}-title`} className="section-title">
                {t(`cat.${c}`)} <span className="section-title__blurb">· {t(`cat.blurb.${c}`)}</span>
              </h3>
              <dl className="glossary">
                {terms.map((x) => (
                  <TermEntry key={x.id} term={x} focused={x.id === focusId} />
                ))}
              </dl>
            </section>
          )
        })}

        <Sources sources={glossarySources} />
      </main>
    </div>
  )
}

function TermEntry({ term: x, focused }: { term: Term; focused: boolean }) {
  const t = useT()
  const { targets, mentionsOf } = useLinks()
  const seen = new Set<string>()
  const related = (x.related ?? []).flatMap((id) => {
    const target = targets.get(id)
    return target ? [{ title: target.title, href: target.href }] : []
  })
  const relatedHrefs = new Set(related.map((r) => r.href))
  const usedIn = mentionsOf(x.id).filter((m) => !relatedHrefs.has(m.href))

  return (
    <div id={x.id} className={`glossary__entry${focused ? ' is-focused' : ''}`}>
      <dt>{x.term}</dt>
      <dd>
        <p>
          <Linked text={x.definition} seen={seen} self={x.id} />
        </p>
        {x.details && (
          <p className="glossary__details">
            <Linked text={x.details} seen={seen} self={x.id} />
          </p>
        )}
        <MentionChips label={t('related.seeAlso')} items={related} />
        <MentionChips label={t('related.usedIn')} items={usedIn} />
      </dd>
    </div>
  )
}
