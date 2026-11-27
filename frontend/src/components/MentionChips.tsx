import type { Mention } from '../data/links'
import { useT } from '../i18n'

/** A row of chips linking to other parts of the site. */
export function MentionChips({ label, items }: { label: string; items: Mention[] }) {
  const t = useT()
  if (items.length === 0) return null
  return (
    <p className="related">
      <span>{label}</span>
      {items.map((m) => (
        <a key={m.href} href={m.href} className="chip">
          {m.step ? t('mention.step', { n: m.step, title: m.title }) : m.title}
        </a>
      ))}
    </p>
  )
}
