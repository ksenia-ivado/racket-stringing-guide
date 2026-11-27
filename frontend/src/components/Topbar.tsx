import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  subtitle: string
  /** Extra header actions, shown before the theme toggle. */
  children?: ReactNode
}

/** The header shared by the guide (index.html) and the live tennis page (tennis.html). */
export function Topbar({ subtitle, children }: Props) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <a href={import.meta.env.BASE_URL}>
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" className="logo">
            <ellipse cx="13" cy="12" rx="9" ry="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M8 6v13M13 3v18M18 6v13M5 9h16M4 13h18M6 17h14" stroke="currentColor" strokeWidth="1" opacity=".6" />
            <path d="M18 20l8 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div>
            <h1>StringTheory</h1>
            <p className="topbar__meta">{subtitle}</p>
          </div>
        </a>
      </div>
      <div className="topbar__actions">
        {children}
        <ThemeToggle />
      </div>
    </header>
  )
}

interface LinkProps {
  href: string
  label: string
  short: string
  /** Glowing dot, for the live page. */
  live?: boolean
  /** Fuller name for screen readers and the hover title, when the label is terse. */
  description?: string
}

export function HeaderLink({ href, label, short, live, description }: LinkProps) {
  return (
    <a
      href={href}
      className={`header-link${live ? ' header-link--live' : ''}`}
      aria-label={description}
      title={description}
    >
      {live && <span className="header-link__dot" aria-hidden="true" />}
      <span className="header-link__long">{label}</span>
      <span className="header-link__short" aria-hidden="true">
        {short}
      </span>
    </a>
  )
}
