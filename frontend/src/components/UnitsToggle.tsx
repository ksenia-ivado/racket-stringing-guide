import type { Units } from '../units'

interface Props {
  units: Units
  onChange: (units: Units) => void
}

const OPTIONS: { value: Units; label: string; short: string }[] = [
  { value: 'metric', label: 'Metric', short: 'm · kg' },
  { value: 'imperial', label: 'Imperial', short: 'ft · lb' },
]

export function UnitsToggle({ units, onChange }: Props) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Units">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={units === o.value}
          className={`segmented__option${units === o.value ? ' is-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          <span className="segmented__long">{o.label}</span>
          <span className="segmented__short" aria-hidden="true">
            {o.short}
          </span>
        </button>
      ))}
    </div>
  )
}
