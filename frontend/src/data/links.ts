/**
 * Cross-links between the guide, knots & techniques, tools and glossary, per language.
 *
 * Every glossary term, tool and technique has aliases. Wherever an alias appears
 * in the site's text, it becomes a link to that entry (see components/Linked.tsx),
 * and each entry can list where it is mentioned.
 */
import { contentFor } from '../i18n/content'
import { useLang } from '../i18n/index'
import type { Lang } from '../i18n/types'

export { TECHNIQUE_ALIASES } from './techniqueAliases'

export type LinkKind = 'term' | 'tool' | 'technique'

export interface LinkTarget {
  id: string
  kind: LinkKind
  title: string
  href: string
  /** Hover text. */
  hint: string
}

export type Segment = string | { text: string; target: LinkTarget }

export interface Mention {
  title: string
  href: string
  /** Set for steps, so the caller can say "Step 3: ...". */
  step?: number
}

export interface Links {
  targets: Map<string, LinkTarget>
  /**
   * Split text into plain strings and links. `seen` holds ids already linked in
   * the same article, so each entry is linked once per article. `self` is the
   * entry being displayed, which never links to itself.
   */
  segment: (text: string, seen: Set<string>, self?: string) => Segment[]
  /** Everywhere an entry is mentioned: steps, techniques, tools and other terms. */
  mentionsOf: (id: string) => Mention[]
}

const isAcronym = (s: string) => s.length > 1 && s === s.toUpperCase() && /\p{Lu}/u.test(s)
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function build(lang: Lang): Links {
  const { steps, techniques, tools, glossary } = contentFor(lang)
  const targets = new Map<string, LinkTarget>()
  const aliasTo = new Map<string, string>()

  const add = (target: LinkTarget, aliases: string[]) => {
    if (targets.has(target.id)) throw new Error(`Duplicate link id: ${target.id}`)
    targets.set(target.id, target)
    for (const alias of [target.title, ...aliases]) {
      const key = isAcronym(alias) ? alias : alias.toLowerCase()
      if (!aliasTo.has(key)) aliasTo.set(key, target.id)
    }
  }
  for (const t of glossary)
    add({ id: t.id, kind: 'term', title: t.term, href: `#/glossary/${t.id}`, hint: t.definition }, t.aliases)
  for (const t of tools) add({ id: t.id, kind: 'tool', title: t.name, href: `#/tools/${t.id}`, hint: t.summary }, t.aliases)
  for (const t of techniques)
    add({ id: t.id, kind: 'technique', title: t.title, href: `#/knots/${t.id}`, hint: t.summary }, t.aliases)

  // Longest alias first, so "starting clamp" wins over "clamp". Never inside another
  // word: letters in any script (é, œ, ñ) count as word characters.
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}_-])(${[...aliasTo.keys()]
      .sort((a, b) => b.length - a.length)
      .map(escape)
      .join('|')})(?![\\p{L}\\p{N}_-])`,
    'giu',
  )

  const segment = (text: string, seen: Set<string>, self?: string): Segment[] => {
    const out: Segment[] = []
    let last = 0
    for (const match of text.matchAll(pattern)) {
      const word = match[0]
      // Acronyms match as written; a capitalised word like a brand name ("HEAD") is not a term.
      const id = aliasTo.get(word) ?? (isAcronym(word) ? undefined : aliasTo.get(word.toLowerCase()))
      if (!id || id === self || seen.has(id)) continue
      seen.add(id)
      if (match.index > last) out.push(text.slice(last, match.index))
      out.push({ text: word, target: targets.get(id)! })
      last = match.index + word.length
    }
    if (last < text.length) out.push(text.slice(last))
    return out
  }

  const mentions = (text: string, id: string) =>
    segment(text, new Set()).some((s) => typeof s !== 'string' && s.target.id === id)

  const mentionsOf = (id: string): Mention[] => {
    const found: Mention[] = []
    steps.forEach((s, i) => {
      const text = [s.summary, ...s.instructions, ...(s.tips ?? []), ...(s.warnings ?? [])].join(' ')
      if (mentions(text, id)) found.push({ title: s.title, href: `#/step/${s.id}`, step: i + 1 })
    })
    for (const t of techniques)
      if (t.id !== id && mentions([t.summary, ...t.instructions, ...(t.tips ?? [])].join(' '), id))
        found.push({ title: t.title, href: `#/knots/${t.id}` })
    for (const t of tools)
      if (t.id !== id && mentions([t.summary, ...t.details, ...(t.tips ?? [])].join(' '), id))
        found.push({ title: t.name, href: `#/tools/${t.id}` })
    for (const t of glossary)
      if (t.id !== id && mentions(`${t.definition} ${t.details ?? ''}`, id))
        found.push({ title: t.term, href: `#/glossary/${t.id}` })
    return found
  }

  return { targets, segment, mentionsOf }
}

const cache = new Map<Lang, Links>()

export function linksFor(lang: Lang): Links {
  let links = cache.get(lang)
  if (!links) cache.set(lang, (links = build(lang)))
  return links
}

/** Cross-links for the current language. */
export const useLinks = () => linksFor(useLang())
