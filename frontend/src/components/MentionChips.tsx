import type { Mention } from '../data/links'

/** A row of chips linking to other parts of the site. */
export function MentionChips({ label, items }: { label: string; items: Mention[] }) {
  if (items.length === 0) return null
  return (
    <p className="related">
      <span>{label}</span>
      {items.map((m) => (
        <a key={m.href} href={m.href} className="chip">
          {m.title}
        </a>
      ))}
    </p>
  )
}
