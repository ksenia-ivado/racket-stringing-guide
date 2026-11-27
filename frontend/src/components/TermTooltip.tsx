import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useT, type UiKey } from '../i18n'

interface Tip {
  el: HTMLAnchorElement
  kind: string
  title: string
  hint: string
  href: string
}

const KIND_LABEL: Record<string, { label: UiKey; open: UiKey }> = {
  term: { label: 'tip.term', open: 'tip.open.term' },
  tool: { label: 'tip.tool', open: 'tip.open.tool' },
  technique: { label: 'tip.technique', open: 'tip.open.technique' },
}

const TOOLTIP_ID = 'term-tooltip'
const HIDE_DELAY = 200

/**
 * One tooltip for every cross-linked term (a.term, rendered by Linked).
 * Mouse: shows on hover, and stays open while the pointer moves onto it.
 * Keyboard: shows on focus, Escape closes it.
 * Touch: the first tap shows it; the "Open" link (or a second tap) navigates.
 */
export function TermTooltip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const tipRef = useRef<Tip | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const pointer = useRef('mouse')
  const t = useT()
  /** When the last tap or click started; focus caused by it is not keyboard focus. */
  const pressedAt = useRef(0)

  useEffect(() => {
    const termOf = (target: EventTarget | null) =>
      target instanceof Element ? (target.closest('a.term') as HTMLAnchorElement | null) : null
    const inBox = (target: EventTarget | null) => target instanceof Node && !!boxRef.current?.contains(target)

    const open = (el: HTMLAnchorElement) => {
      window.clearTimeout(timer.current)
      if (tipRef.current?.el === el) return
      tipRef.current?.el.removeAttribute('aria-describedby')
      el.setAttribute('aria-describedby', TOOLTIP_ID)
      const { kind = 'term', title = '', hint = '' } = el.dataset
      const next = { el, kind, title, hint, href: el.getAttribute('href') ?? '#' }
      tipRef.current = next
      setTip(next)
    }
    const close = () => {
      window.clearTimeout(timer.current)
      tipRef.current?.el.removeAttribute('aria-describedby')
      tipRef.current = null
      setTip(null)
    }
    const later = (fn: () => void, ms: number) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(fn, ms)
    }

    const onOver = (e: MouseEvent) => {
      if (pointer.current !== 'mouse') return
      const el = termOf(e.target)
      // No delay: the definition appears the moment the pointer lands on the term.
      if (el) open(el)
      else if (inBox(e.target)) window.clearTimeout(timer.current)
    }
    const onOut = (e: MouseEvent) => {
      if (pointer.current !== 'mouse') return
      if (termOf(e.target) || inBox(e.target)) later(close, HIDE_DELAY)
    }
    const onPointerDown = (e: PointerEvent) => {
      pointer.current = e.pointerType
      pressedAt.current = e.timeStamp
      if (!termOf(e.target) && !inBox(e.target)) close()
    }
    const onClick = (e: MouseEvent) => {
      const el = termOf(e.target)
      // On touch, the first tap explains the term instead of leaving the page.
      if (el && pointer.current !== 'mouse' && tipRef.current?.el !== el) {
        e.preventDefault()
        open(el)
      } else if (el) close()
    }
    const onFocusIn = (e: FocusEvent) => {
      // A tap also focuses the link; only keyboard focus should open the tooltip here,
      // otherwise the tap's click would find it open and navigate straight away.
      if (e.timeStamp - pressedAt.current < 800) return
      const el = termOf(e.target)
      if (el) open(el)
    }
    const onFocusOut = (e: FocusEvent) => {
      if (termOf(e.target) && !inBox(e.relatedTarget)) later(close, HIDE_DELAY)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    window.addEventListener('hashchange', close)
    return () => {
      window.clearTimeout(timer.current)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
      window.removeEventListener('hashchange', close)
    }
  }, [])

  // Place it above the term, or below when there is no room; keep it on screen.
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!tip || !box) return
    const place = () => {
      const r = tip.el.getBoundingClientRect()
      const { offsetWidth: w, offsetHeight: h } = box
      // Above the term; below only when the top of the window would cut it off.
      const above = r.top - h - 12 >= 4
      const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), window.innerWidth - w - 8)
      box.style.top = `${above ? r.top - h - 12 : r.bottom + 12}px`
      box.style.left = `${left}px`
      // The arrow points at the middle of the term, even when the box is nudged sideways.
      box.style.setProperty('--arrow-x', `${Math.min(Math.max(r.left + r.width / 2 - left, 14), w - 14)}px`)
      box.dataset.side = above ? 'above' : 'below'
    }
    place()
    window.addEventListener('scroll', place, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', place, { capture: true })
  }, [tip])

  if (!tip) return null
  const kind = KIND_LABEL[tip.kind] ?? KIND_LABEL.term
  return (
    <div ref={boxRef} id={TOOLTIP_ID} role="tooltip" className="term-tooltip">
      <p className="term-tooltip__kind">{t(kind.label)}</p>
      <p className="term-tooltip__title">{tip.title}</p>
      <p className="term-tooltip__hint">{tip.hint}</p>
      <a className="term-tooltip__open" href={tip.href}>
        {t(kind.open)} →
      </a>
    </div>
  )
}
