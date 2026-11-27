export type Lang = 'en' | 'es' | 'fr'

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', label: 'FR', name: 'Français' },
]

/*
 * Translations of the guide's content, keyed by the same ids as the English
 * data in src/data. Measurements keep the {{metric|imperial}} form. Aliases are
 * the phrases in that language's text that become cross-links (see data/links.ts).
 */

export interface StepText {
  title: string
  summary: string
  instructions: string[]
  tips?: string[]
  warnings?: string[]
}

export interface TechniqueText {
  title: string
  summary: string
  instructions: string[]
  tips?: string[]
  /** Extra phrases that link to this technique (its title always links). */
  aliases?: string[]
}

export interface ToolText {
  name: string
  aliases: string[]
  summary: string
  details: string[]
  tips?: string[]
}

export interface TermText {
  term: string
  aliases: string[]
  definition: string
  details?: string
}

export interface ContentOverlay {
  steps: Record<string, StepText>
  techniques: Record<string, TechniqueText>
  tools: Record<string, ToolText>
  glossary: Record<string, TermText>
}
