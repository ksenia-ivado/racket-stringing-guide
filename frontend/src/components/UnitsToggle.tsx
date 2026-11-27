import { useT } from '../i18n'
import type { Units } from '../units'

interface Props {
  units: Units
  onChange: (units: Units) => void
}

const OPTIONS: { value: Units; short: string }[] = [
  { value: 'metric', short: 'm · kg' },
  { value: 'imperial', short: 'ft · lb' },
]

export function UnitsToggle({ units, onChange }: Props) {
  const t = useT()
  return (
    <div className="segmented" role="radiogroup" aria-label={t('units.aria')}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={units === o.value}
          className={`segmented__option${units === o.value ? ' is-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          <span className="segmented__long">{t(o.value === 'metric' ? 'units.metric' : 'units.imperial')}</span>
          <span className="segmented__short" aria-hidden="true">
            {o.short}
          </span>
        </button>
      ))}
    </div>
  )
}
