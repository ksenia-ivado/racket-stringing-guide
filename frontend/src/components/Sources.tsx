import type { Source } from '../data/sources'
import { useT } from '../i18n'

/** The quiet, collapsed list of sources under an entry. */
export function Sources({ sources }: { sources?: Source[] }) {
  const t = useT()
  if (!sources?.length) return null
  return (
    <details className="sources">
      <summary>{t('sources')}</summary>
      <ol>
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" lang="en">
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </details>
  )
}
