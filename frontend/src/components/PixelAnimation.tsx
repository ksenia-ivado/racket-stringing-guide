import { useEffect, useRef, type CSSProperties } from 'react'
import { Gfx, H, RES, S, W } from '../animations/gfx'
import type { Scene } from '../animations/racket'
import { useLang, useT } from '../i18n'
import { useUnits } from '../units'

interface Props {
  scene: Scene
  /** Text typed after the terminal prompt. */
  command: string
  /** Accessible description of the animation. */
  label: string
}

const FPS = 10

/** A green-phosphor terminal screen that loops a pixel animation. */
export function PixelAnimation({ scene, command, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const metric = useUnits() === 'metric'
  const lang = useLang()
  const t = useT()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const g = new Gfx(ctx)
    g.lang = lang
    const render = (frame: number) => {
      g.clear()
      scene.draw(g, frame % scene.loop, { metric })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(scene.still)
      return
    }

    // Only animate while on screen; the knots page has several of these.
    let visible = true
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(canvas)

    let raf = 0
    let last = -1
    const start = performance.now()
    const tick = (now: number) => {
      const frame = Math.floor(((now - start) / 1000) * FPS)
      if (frame !== last && visible) {
        last = frame
        render(frame)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [scene, metric, lang])

  return (
    <figure className="crt">
      <div className="crt__screen">
        <canvas
          ref={canvasRef}
          width={W * S * RES}
          height={H * S * RES}
          className="crt__canvas"
          role="img"
          aria-label={t('anim.aria', { label })}
        />
      </div>
      <figcaption className="crt__caption" aria-hidden="true">
        <span className="crt__prompt">C:\RACKET&gt;</span>
        <span key={command} className="crt__type" style={{ '--n': command.length } as CSSProperties}>
          {command}
        </span>
        <span className="crt__cursor" />
      </figcaption>
    </figure>
  )
}
