import { segment } from '../data/links'
import { fmt, useUnits } from '../units'

interface Props {
  text: string
  /** Ids already linked in this article; shared by every Linked in it. */
  seen: Set<string>
  /** The entry being shown, which should not link to itself. */
  self?: string
}

/** Text with glossary terms, tools and techniques turned into links. */
export function Linked({ text, seen, self }: Props) {
  const units = useUnits()
  return (
    <>
      {segment(fmt(text, units), seen, self).map((s, i) =>
        typeof s === 'string' ? (
          s
        ) : (
          <a key={i} href={s.target.href} className={`term term--${s.target.kind}`} title={fmt(s.target.hint, units)}>
            {s.text}
          </a>
        ),
      )}
    </>
  )
}
