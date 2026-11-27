import { glossary as enGlossary, type Term } from '../data/glossary'
import { steps as enSteps, type Step } from '../data/steps'
import { TECHNIQUE_ALIASES } from '../data/techniqueAliases'
import { techniques as enTechniques, type Technique } from '../data/techniques'
import { tools as enTools, type Tool } from '../data/tools'
import { es } from './content/es'
import { fr } from './content/fr'
import { useLang } from './index'
import type { ContentOverlay, Lang } from './types'

export interface LocalTechnique extends Technique {
  /** Extra phrases that link to it, in this language. */
  aliases: string[]
}

export interface Content {
  steps: Step[]
  techniques: LocalTechnique[]
  tools: Tool[]
  glossary: Term[]
}

const overlays: Partial<Record<Lang, ContentOverlay>> = { es, fr }
const cache = new Map<Lang, Content>()

/**
 * The guide's content in one language: English data with the translated text
 * laid over it by id. Anything not translated falls back to English, so ids,
 * order, sources and links always come from the English data.
 */
export function contentFor(lang: Lang): Content {
  const hit = cache.get(lang)
  if (hit) return hit
  const o = overlays[lang]
  const result: Content = {
    steps: enSteps.map((s) => ({ ...s, ...o?.steps[s.id] })),
    techniques: enTechniques.map((t) => {
      const { aliases, ...text } = o?.techniques[t.id] ?? {}
      return { ...t, ...text, aliases: aliases ?? (o ? [] : (TECHNIQUE_ALIASES[t.id] ?? [])) }
    }),
    tools: enTools.map((t) => ({ ...t, ...o?.tools[t.id] })),
    glossary: enGlossary.map((t) => ({ ...t, ...o?.glossary[t.id] })),
  }
  cache.set(lang, result)
  return result
}

/** Content in the current language. */
export const useContent = () => contentFor(useLang())
