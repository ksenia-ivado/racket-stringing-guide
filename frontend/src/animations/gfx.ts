/**
 * Scenes are laid out on a 96x54 logical grid. Each logical unit is S device
 * pixels, so lines and curves are drawn at 3x detail while keeping a crisp,
 * pixel-art look (the canvas is scaled up with image-rendering: pixelated).
 */
export const W = 96
export const H = 54
export const S = 3
/**
 * The canvas backing store is RES times larger again. Pixel art is drawn in
 * RES x RES blocks (so it stays crisp), but text renders at full resolution.
 */
export const RES = 4

/** 0 = background, 1 = dim, 2 = mid, 3 = bright phosphor. */
export type Shade = 0 | 1 | 2 | 3

export interface SceneOpts {
  metric: boolean
}

/** The bright shade is the app's accent green (--accent in index.css). */
const PALETTE = ['#03100a', '#16602e', '#2fc45e', '#5cff8d']

export class Gfx {
  ctx: CanvasRenderingContext2D
  /** Translation in logical units, applied to everything drawn. */
  ox = 0
  oy = 0

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    ctx.setTransform(RES, 0, 0, RES, 0, 0)
  }

  clear() {
    this.ox = 0
    this.oy = 0
    this.ctx.fillStyle = PALETTE[0]
    this.ctx.fillRect(0, 0, W * S, H * S)
  }

  /** One device pixel at integer device coordinates. Shade 0 is skipped. */
  dpx(X: number, Y: number, s: Shade) {
    if (!s) return
    this.ctx.fillStyle = PALETTE[s]
    this.ctx.fillRect(X + Math.round(this.ox * S), Y + Math.round(this.oy * S), 1, 1)
  }

  /** Paint one device pixel with the background colour. */
  erase(X: number, Y: number) {
    this.ctx.fillStyle = PALETTE[0]
    this.ctx.fillRect(X + Math.round(this.ox * S), Y + Math.round(this.oy * S), 1, 1)
  }

  /** One device pixel at a logical coordinate. */
  px(x: number, y: number, s: Shade) {
    this.dpx(Math.round(x * S), Math.round(y * S), s)
  }

  rect(x: number, y: number, w: number, h: number, s: Shade) {
    if (!s) return
    this.ctx.fillStyle = PALETTE[s]
    this.ctx.fillRect(Math.round((x + this.ox) * S), Math.round((y + this.oy) * S), Math.round(w * S), Math.round(h * S))
  }

  clearRect(x: number, y: number, w: number, h: number) {
    this.ctx.fillStyle = PALETTE[0]
    this.ctx.fillRect(Math.round((x + this.ox) * S), Math.round((y + this.oy) * S), Math.round(w * S), Math.round(h * S))
  }

  /** Bresenham line in device space, `width` device pixels thick. */
  line(x0: number, y0: number, x1: number, y1: number, s: Shade, width = 1) {
    let X = Math.round(x0 * S)
    let Y = Math.round(y0 * S)
    const XE = Math.round(x1 * S)
    const YE = Math.round(y1 * S)
    const dx = Math.abs(XE - X)
    const dy = -Math.abs(YE - Y)
    const sx = X < XE ? 1 : -1
    const sy = Y < YE ? 1 : -1
    const steep = -dy > dx
    const off = Math.floor((width - 1) / 2)
    let err = dx + dy
    for (;;) {
      for (let o = 0; o < width; o++) {
        if (steep) this.dpx(X + o - off, Y, s)
        else this.dpx(X, Y + o - off, s)
      }
      if (X === XE && Y === YE) break
      const e2 = 2 * err
      if (e2 >= dy) {
        err += dy
        X += sx
      }
      if (e2 <= dx) {
        err += dx
        Y += sy
      }
    }
  }

  /** Part of an ellipse outline from angle a0 to a1 (radians). */
  arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, s: Shade, width = 1) {
    const n = Math.max(8, Math.ceil((rx + ry) * S * 3 * (Math.abs(a1 - a0) / (Math.PI * 2))))
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n
      for (let w = 0; w < width; w++) {
        const d = w / S
        this.px(cx + Math.cos(a) * (rx - d), cy + Math.sin(a) * (ry - d), s)
      }
    }
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, s: Shade, width = 1) {
    this.arc(cx, cy, rx, ry, 0, Math.PI * 2, s, width)
  }

  disc(cx: number, cy: number, r: number, s: Shade) {
    const R = r * S
    const CXd = cx * S
    const CYd = cy * S
    for (let Y = Math.floor(CYd - R); Y <= Math.ceil(CYd + R); Y++)
      for (let X = Math.floor(CXd - R); X <= Math.ceil(CXd + R); X++)
        if ((X - CXd) ** 2 + (Y - CYd) ** 2 <= R * R) this.dpx(X, Y, s)
  }

  /** Draw the first fraction `p` (0..1) of a polyline, measured by length. */
  polyline(pts: [number, number][], p: number, s: Shade, width = 1) {
    const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]))
    let left = lens.reduce((a, b) => a + b, 0) * Math.min(1, Math.max(0, p))
    for (let i = 0; i < lens.length && left > 0; i++) {
      const [ax, ay] = pts[i]
      const [bx, by] = pts[i + 1]
      const f = Math.min(1, left / lens[i])
      this.line(ax, ay, ax + (bx - ax) * f, ay + (by - ay) * f, s, width)
      left -= lens[i]
    }
  }

  /** Text, top-left anchored. `size` is the cap height in logical units. */
  text(str: string, x: number, y: number, s: Shade, size = 3.8, align: CanvasTextAlign = 'left') {
    const ctx = this.ctx
    ctx.font = `600 ${size * S * 1.3}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
    ctx.textBaseline = 'top'
    ctx.textAlign = align
    ctx.fillStyle = PALETTE[s]
    ctx.fillText(str, (x + this.ox) * S, (y + this.oy) * S)
  }
}
