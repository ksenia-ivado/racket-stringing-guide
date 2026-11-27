import { useEffect, useRef, type CSSProperties } from 'react'
import { Gfx, H, W } from '../animations/gfx'
import { sceneFor } from '../animations/scenes'

interface Props {
  stepId: string
  title: string
  number: number
}

const FPS = 10

/** An 8-bit, green-phosphor terminal screen that loops an animation for one step. */
export function PixelAnimation({ stepId, title, number }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const g = new Gfx(ctx)
    const scene = sceneFor(stepId)
    const render = (frame: number) => {
      g.clear()
      scene.draw(g, frame % scene.loop)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(scene.still)
      return
    }

    let raf = 0
    let last = -1
    const start = performance.now()
    const tick = (now: number) => {
      const frame = Math.floor(((now - start) / 1000) * FPS)
      if (frame !== last) {
        last = frame
        render(frame)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stepId])

  const command = `STEP_${String(number).padStart(2, '0')}.EXE ${title}`

  return (
    <figure className="crt">
      <div className="crt__screen">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="crt__canvas"
          role="img"
          aria-label={`Animation: ${title}`}
        />
      </div>
      <figcaption className="crt__caption" aria-hidden="true">
        <span className="crt__prompt">C:\RACKET&gt;</span>
        <span key={stepId} className="crt__type" style={{ '--n': command.length } as CSSProperties}>
          {command}
        </span>
        <span className="crt__cursor" />
      </figcaption>
    </figure>
  )
}
