import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useT } from '../i18n'

/** Where feedback goes. The deploy workflow sets this from the repository it builds. */
const REPO = import.meta.env.VITE_GITHUB_REPO || 'ksenia-ivado/string-theory'

const KINDS = ['Idea', 'Problem', 'Praise'] as const
type Kind = (typeof KINDS)[number]

/** GitHub's new-issue URL has a length limit; keep the message well under it. */
const MAX_MESSAGE = 1500

/**
 * Feedback becomes a GitHub issue (labelled "feedback") on the site's repo,
 * using the form in .github/ISSUE_TEMPLATE/feedback.yml. GitHub emails the
 * repo owner about new issues, so no server or third-party service is needed.
 */
function issueUrl(kind: Kind, message: string) {
  const summary = message.trim().split('\n')[0].slice(0, 60)
  const params = new URLSearchParams({
    template: 'feedback.yml',
    title: `[${kind}] ${summary}`,
    kind,
    message: message.trim().slice(0, MAX_MESSAGE),
    page: window.location.href,
  })
  return `https://github.com/${REPO}/issues/new?${params}`
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>StringTheory</span>
      <span aria-hidden="true">·</span>
      <FeedbackButton />
    </footer>
  )
}

function FeedbackButton() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<Kind>('Idea')
  const [message, setMessage] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const id = useId()

  // Close on Escape or a click outside, and hand focus back to the button.
  useEffect(() => {
    if (!open) return
    const close = () => {
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    panelRef.current?.querySelector('textarea')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    window.open(issueUrl(kind, message), '_blank', 'noopener')
    setMessage('')
    setOpen(false)
  }

  return (
    <div className="feedback">
      <button
        ref={buttonRef}
        type="button"
        className="feedback__toggle"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((o) => !o)}
      >
        {t('feedback.button')}
      </button>

      {open && (
        <div ref={panelRef} id={`${id}-panel`} className="feedback__panel" role="dialog" aria-labelledby={`${id}-title`}>
          <form onSubmit={submit}>
            <p id={`${id}-title`} className="feedback__title">
              {t('feedback.title')}
            </p>

            <div className="segmented" role="radiogroup" aria-label={t('feedback.kindAria')}>
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={kind === k}
                  className={`segmented__option${kind === k ? ' is-active' : ''}`}
                  onClick={() => setKind(k)}
                >
                  {t(`feedback.${k}`)}
                </button>
              ))}
            </div>

            <label className="field">
              <span className="visually-hidden">{t('feedback.label')}</span>
              <textarea
                rows={4}
                maxLength={MAX_MESSAGE}
                placeholder={t('feedback.placeholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="button button--primary" disabled={!message.trim()}>
              {t('feedback.submit')}
            </button>
            <p className="feedback__note">{t('feedback.note')}</p>
          </form>
        </div>
      )}
    </div>
  )
}
