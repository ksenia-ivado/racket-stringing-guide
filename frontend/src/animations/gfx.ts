/** Logical resolution of the pixel screen. The canvas is scaled up with CSS. */
export const W = 96
export const H = 54

/** 0 = background, 1 = dim, 2 = mid, 3 = bright phosphor. */
export type Shade = 0 | 1 | 2 | 3

const PALETTE = ['#020b04', '#0f5224', '#22b24c', '#5cff8d']

/** A tiny 3x5 pixel font, just the glyphs the scenes need. */
const FONT: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '1': ['.#.', '##.', '.#.', '.#.', '###'],
  '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '.##', '..#', '###'],
  '4': ['#.#', '#.#', '###', '..#', '..#'],
  '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'],
  '7': ['###', '..#', '..#', '.#.', '.#.'],
  '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'],
  B: ['##.', '#.#', '##.', '#.#', '##.'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'],
  K: ['#.#', '##.', '#..', '##.', '#.#'],
  L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#.#', '###', '###', '#.#', '#.#'],
  N: ['##.', '#.#', '#.#', '#.#', '#.#'],
  O: ['###', '#.#', '#.#', '#.#', '###'],
}

export class Gfx {
  ctx: CanvasRenderingContext2D
  /** Translation applied to every pixel drawn. */
  ox = 0
  oy = 0

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  clear() {
    this.ox = 0
    this.oy = 0
    this.ctx.fillStyle = PALETTE[0]
    this.ctx.fillRect(0, 0, W, H)
  }

  px(x: number, y: number, s: Shade) {
    if (!s) return
    const ix = Math.round(x + this.ox)
    const iy = Math.round(y + this.oy)
    if (ix < 0 || iy < 0 || ix >= W || iy >= H) return
    this.ctx.fillStyle = PALETTE[s]
    this.ctx.fillRect(ix, iy, 1, 1)
  }

  rect(x: number, y: number, w: number, h: number, s: Shade) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, s)
  }

  /** Bresenham line between rounded endpoints. */
  line(x0: number, y0: number, x1: number, y1: number, s: Shade) {
    let x = Math.round(x0)
    let y = Math.round(y0)
    const xe = Math.round(x1)
    const ye = Math.round(y1)
    const dx = Math.abs(xe - x)
    const dy = -Math.abs(ye - y)
    const sx = x < xe ? 1 : -1
    const sy = y < ye ? 1 : -1
    let err = dx + dy
    for (;;) {
      this.px(x, y, s)
      if (x === xe && y === ye) break
      const e2 = 2 * err
      if (e2 >= dy) {
        err += dy
        x += sx
      }
      if (e2 <= dx) {
        err += dx
        y += sy
      }
    }
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, s: Shade) {
    const n = Math.max(8, Math.ceil((rx + ry) * 4))
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      this.px(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, s)
    }
  }

  disc(cx: number, cy: number, r: number, s: Shade) {
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r + r * 0.8) this.px(cx + dx, cy + dy, s)
  }

  /** Rows of '.' (transparent) and '1'-'3' (shades). */
  sprite(rows: string[], x: number, y: number) {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const c = row[i]
        if (c !== '.') this.px(x + i, y + j, Number(c) as Shade)
      }
    })
  }

  text(str: string, x: number, y: number, s: Shade) {
    ;[...str.toUpperCase()].forEach((ch, n) => {
      FONT[ch]?.forEach((row, j) => {
        for (let i = 0; i < 3; i++) if (row[i] === '#') this.px(x + n * 4 + i, y + j, s)
      })
    })
  }
}
