import { LANGS, useT, type Lang } from '../i18n'

interface Props {
  lang: Lang
  onChange: (lang: Lang) => void
}

export function LangToggle({ lang, onChange }: Props) {
  const t = useT()
  return (
    <div className="segmented segmented--lang" role="radiogroup" aria-label={t('lang.aria')}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          role="radio"
          lang={l.code}
          aria-checked={lang === l.code}
          aria-label={l.name}
          title={l.name}
          className={`segmented__option${lang === l.code ? ' is-active' : ''}`}
          onClick={() => onChange(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
