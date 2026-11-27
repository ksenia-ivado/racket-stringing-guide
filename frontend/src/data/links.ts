/**
 * Cross-links between the guide, knots & techniques, tools and glossary.
 *
 * Every glossary term, tool and technique has aliases. Wherever an alias appears
 * in the site's text, it becomes a link to that entry (see components/Linked.tsx),
 * and each entry can list where it is mentioned.
 */
import { glossary } from './glossary'
import { steps } from './steps'
import { techniques } from './techniques'
import { tools } from './tools'

export type LinkKind = 'term' | 'tool' | 'technique'

export interface LinkTarget {
  id: string
  kind: LinkKind
  title: string
  href: string
  /** Hover text. */
  hint: string
}

/** Extra phrases for techniques; their titles always match too. */
const TECHNIQUE_ALIASES: Record<string, string[]> = {
  'double-half-hitch': ['double half hitch', 'double half hitches'],
  'parnell-knot': ['parnell knot', 'parnell knots'],
  'starting-knot': ['starting knot', 'starting knots'],
  'weave-one-ahead': ['weave one ahead', 'one ahead'],
  'pull-slack': ['wide u'],
  'tie-off-tension': ['extra tension'],
}

export const targets = new Map<string, LinkTarget>()
const aliasTo = new Map<string, string>()

function add(target: LinkTarget, aliases: string[]) {
  if (targets.has(target.id)) throw new Error(`Duplicate link id: ${target.id}`)
  targets.set(target.id, target)
  for (const alias of [target.title, ...aliases]) {
    const key = isAcronym(alias) ? alias : alias.toLowerCase()
    if (!aliasTo.has(key)) aliasTo.set(key, target.id)
  }
}

const isAcronym = (s: string) => s.length > 1 && s === s.toUpperCase() && /[A-Z]/.test(s)

for (const t of glossary)
  add({ id: t.id, kind: 'term', title: t.term, href: `#/glossary/${t.id}`, hint: t.definition }, t.aliases)
for (const t of tools) add({ id: t.id, kind: 'tool', title: t.name, href: `#/tools/${t.id}`, hint: t.summary }, t.aliases)
for (const t of techniques)
  add(
    { id: t.id, kind: 'technique', title: t.title, href: `#/knots/${t.id}`, hint: t.summary },
    TECHNIQUE_ALIASES[t.id] ?? [],
  )

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Longest alias first, so "starting clamp" wins over "clamp". Not inside other words. */
const PATTERN = new RegExp(
  `(?<![\\w-])(${[...aliasTo.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|')})(?![\\w-])`,
  'gi',
)

export type Segment = string | { text: string; target: LinkTarget }

/**
 * Split text into plain strings and links. `seen` holds ids already linked in
 * the same article, so each entry is linked once per article, not on every
 * mention. `self` is the entry being displayed, which never links to itself.
 */
export function segment(text: string, seen: Set<string>, self?: string): Segment[] {
  const out: Segment[] = []
  let last = 0
  for (const match of text.matchAll(PATTERN)) {
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

/** Does this text mention entry `id`? */
function mentions(text: string, id: string) {
  return segment(text, new Set()).some((s) => typeof s !== 'string' && s.target.id === id)
}

export interface Mention {
  title: string
  href: string
}

/** Everywhere an entry is mentioned: steps, techniques, tools and other terms. */
export function mentionsOf(id: string): Mention[] {
  const found: Mention[] = []
  steps.forEach((s, i) => {
    const text = [s.summary, ...s.instructions, ...(s.tips ?? []), ...(s.warnings ?? [])].join(' ')
    if (mentions(text, id)) found.push({ title: `Step ${i + 1}: ${s.title}`, href: `#/step/${s.id}` })
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
