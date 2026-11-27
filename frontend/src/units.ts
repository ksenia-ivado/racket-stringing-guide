import { createContext, useContext } from 'react'

export type Units = 'metric' | 'imperial'

/** The US (and Liberia and Myanmar) default to imperial; everywhere else to metric. */
export function defaultUnits(): Units {
  const lang = typeof navigator === 'undefined' ? '' : navigator.language
  return /-(US|LR|MM)$/i.test(lang) ? 'imperial' : 'metric'
}

const UnitsContext = createContext<Units>('metric')
export const UnitsProvider = UnitsContext.Provider
export const useUnits = () => useContext(UnitsContext)

/**
 * Text in the guide writes measurements as {{metric|imperial}}, for example
 * "about {{6 m|20 ft}}". This picks the side for the current unit system.
 */
export function fmt(text: string, units: Units) {
  return text.replace(/\{\{([^|}]*)\|([^}]*)\}\}/g, (_, metric: string, imperial: string) =>
    units === 'metric' ? metric : imperial,
  )
}
