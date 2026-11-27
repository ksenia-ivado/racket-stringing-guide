import { H, S, type Gfx, type SceneOpts, type Shade } from './gfx'

/**
 * One looping animation. `draw` gets the frame number within the loop (the
 * player runs at 10 frames per second). `still` is the frame shown when the
 * viewer prefers reduced motion.
 */
export interface Scene {
  loop: number
  still: number
  draw: (g: Gfx, t: number, o: SceneOpts) => void
}

/* ---------- Timing ---------- */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** 0 before frame a, 1 after frame b, linear in between. */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))
export const ease = (p: number) => p * p * (3 - 2 * p)

/* ---------- Units ---------- */

export function tensionLabel(lb: number, o: SceneOpts) {
  return o.metric ? `${Math.round(lb * 0.4536 * 2) / 2} kg` : `${Math.round(lb)} lb`
}

/** Tension readout in the top-left corner. */
export function tensionText(g: Gfx, lb: number, o: SceneOpts) {
  g.text(tensionLabel(lb, o), 2, 1.5, 3)
}

/** Caption in the top-left corner. */
export function label(g: Gfx, str: string) {
  g.text(str, 2, 1.5, 3)
}

/* ---------- Racket geometry (head on the left, handle on the right) ---------- */

export const CX = 38
export const CY = 27
export const RX = 24
export const RY = 17
/** Radii of the area inside the frame where strings can go. */
export const BRX = RX - 1.6
export const BRY = RY - 1.6

/** A 16x19 pattern: 16 mains run along the racket, 19 crosses run across it. */
export const MAIN_Y = Array.from({ length: 16 }, (_, k) => CY + (k - 7.5) * 1.9)
export const CROSS_X = Array.from({ length: 19 }, (_, j) => CX + (j - 9) * 2.3)

const halfW = (y: number) => {
  const d = (y - CY) / BRY
  return d * d >= 1 ? 0 : BRX * Math.sqrt(1 - d * d)
}
const halfH = (x: number) => {
  const d = (x - CX) / BRX
  return d * d >= 1 ? 0 : BRY * Math.sqrt(1 - d * d)
}

/** Logical x-range of main k. */
export const mainSpan = (k: number): [number, number] => {
  const hw = halfW(MAIN_Y[k])
  return [CX - hw, CX + hw]
}
/** Logical y-range of cross j. */
export const crossSpan = (j: number): [number, number] => {
  const hh = halfH(CROSS_X[j])
  return [CY - hh, CY + hh]
}
/** Just outside the frame, on the left (-1) or right (+1) at height y. */
export const frameEdgeX = (y: number, side: -1 | 1) =>
  CX + side * (RX + 1) * Math.sqrt(Math.max(0, 1 - ((y - CY) / RY) ** 2))
/** Just outside the frame, above (-1) or below (+1) at column x. */
export const frameEdgeY = (x: number, side: -1 | 1) =>
  CY + side * (RY + 1) * Math.sqrt(Math.max(0, 1 - ((x - CX) / RX) ** 2))
/** 0 at the centre of the string bed, 1 at its edge. */
export const norm = (x: number, y: number) => Math.hypot((x - CX) / BRX, (y - CY) / BRY)

export function drawFrame(g: Gfx, s: Shade = 3) {
  g.ellipse(CX, CY, RX, RY, s, 3)
  g.ellipse(CX, CY, RX - 1, RY - 1, 1)
  // Throat
  g.line(59, CY - 8.2, 68, CY - 2, s, 3)
  g.line(59, CY + 8.2, 68, CY + 2, s, 3)
  // Handle with grip wrap, and butt cap
  g.rect(68, CY - 2.3, 23, 4.7, 2)
  for (let x = 69; x < 90; x += 2.5) g.line(x, CY + 2.3, x + 1.6, CY - 2.3, 1)
  g.rect(91, CY - 3, 2, 6, s)
}

type Kind = 'm' | 'c'

export interface BedOptions {
  /** How much of each main is strung, 0..1. Default: all of it. */
  main?: (k: number) => number
  /** How much of each cross is strung, 0..1. Default: none. */
  cross?: (j: number) => number
  /** Colour of a string pixel at logical (x, y); 0 hides it. */
  shade?: (kind: Kind, index: number, x: number, y: number) => Shade
}

/** Draw the string bed, with crosses woven over and under the mains. */
export function drawBed(g: Gfx, o: BedOptions = {}) {
  const shade = o.shade ?? ((kind: Kind): Shade => (kind === 'm' ? 2 : 3))
  const mains = MAIN_Y.map((y, k) => {
    const [a, b] = mainSpan(k).map((v) => v * S)
    const A = Math.ceil(a)
    const p = o.main ? o.main(k) : 1
    return { Y: Math.round(y * S), A, end: p <= 0 ? A - 1 : A + Math.round((Math.floor(b) - A) * p) }
  })
  const crosses = CROSS_X.map((x, j) => {
    const [a, b] = crossSpan(j).map((v) => v * S)
    const A = Math.ceil(a)
    const p = o.cross ? o.cross(j) : 0
    return { X: Math.round(x * S), A, end: p <= 0 ? A - 1 : A + Math.round((Math.floor(b) - A) * p) }
  })

  mains.forEach((m, k) => {
    for (let X = m.A; X <= m.end; X++) g.dpx(X, m.Y, shade('m', k, X / S, m.Y / S))
  })
  crosses.forEach((c, j) => {
    for (let Y = c.A; Y <= c.end; Y++) g.dpx(c.X, Y, shade('c', j, c.X / S, Y / S))
  })
  // Over/under: open a one-pixel gap in whichever string goes underneath.
  mains.forEach((m, k) => {
    crosses.forEach((c, j) => {
      if (c.X < m.A || c.X > m.end || m.Y < c.A || m.Y > c.end) return
      if ((k + j) % 2 === 0) {
        g.erase(c.X - 1, m.Y)
        g.erase(c.X + 1, m.Y)
      } else {
        g.erase(c.X, m.Y - 1)
        g.erase(c.X, m.Y + 1)
        g.dpx(c.X, m.Y, shade('m', k, c.X / S, m.Y / S))
      }
    })
  })
}

/* ---------- Props ---------- */

/** Tension head on the left, pulling a main. */
export function gripperH(g: Gfx, y: number, xEdge: number, p: number, t: number) {
  const gx = 3.5 - p * 2
  g.line(gx + 3, y, xEdge, y, 3)
  g.rect(gx, y - 2, 3, 4, 2)
  g.line(gx + 0.7, y, gx + 2.6, y, 3, 2)
  if (p < 1 && t % 2 === 0) {
    g.line(gx - 0.8, y, gx - 2, y - 1.2, 3)
    g.line(gx - 0.8, y, gx - 2, y + 1.2, 3)
  }
}

/** Tension head below the racket, pulling a cross. */
export function gripperV(g: Gfx, x: number, yEdge: number, p: number, t: number) {
  const gy = H - 8.5 + p * 2
  g.line(x, yEdge, x, gy, 3)
  g.rect(x - 2, gy, 4, 3, 2)
  g.line(x, gy + 0.5, x, gy + 2.5, 3, 2)
  if (p < 1 && t % 2 === 0) {
    g.line(x, gy + 3.8, x - 1.2, gy + 3, 3)
    g.line(x, gy + 3.8, x + 1.2, gy + 3, 3)
  }
}

export function clampMark(g: Gfx, x: number, y: number) {
  g.rect(x - 1, y - 1, 2, 2, 3)
  g.rect(x - 0.4, y - 0.4, 0.8, 0.8, 1)
}

/** A small knot that grows as it is tied. */
export function knot(g: Gfx, x: number, y: number, p: number) {
  if (p <= 0) return
  g.arc(x, y, 1.2, 1.2, 0, Math.PI * 2 * p, 3, 2)
  if (p >= 1) g.disc(x, y, 0.8, 3)
}

export function snipX(g: Gfx, x: number, y: number, on: boolean) {
  if (!on) return
  g.line(x - 1.5, y - 1.5, x + 1.5, y + 1.5, 3, 2)
  g.line(x + 1.5, y - 1.5, x - 1.5, y + 1.5, 3, 2)
}

/** Tie a knot starting at frame a, then pull a tail out and trim it. */
export function tieOff(g: Gfx, t: number, a: number, kx: number, ky: number, dx: number, dy: number) {
  if (t < a) return
  knot(g, kx, ky, seg(t, a, a + 9))
  if (t >= a + 9 && t < a + 16) {
    g.line(kx + dx * 1.5, ky + dy * 1.5, kx + dx * 5, ky + dy * 5, 3)
    if (t >= a + 12) snipX(g, kx + dx * 3.5, ky + dy * 3.5, t % 2 === 0)
  } else if (t >= a + 16) {
    g.line(kx + dx * 1.5, ky + dy * 1.5, kx + dx * 2.2, ky + dy * 2.2, 2)
  }
}

/* ---------- Stringing sequences ---------- */

interface Run {
  cur: number
  progress: (i: number) => number
  pulling: boolean
  pull: number
  last: number
}

/** Shared timing: one string every `per` frames, fed for `draw` frames, then pulled for `pull` frames. */
function run(t: number, order: number[], base: number[], draw: number, pull: number, per: number): Run {
  const n = Math.floor(t / per)
  const local = t - n * per
  const cur = n < order.length ? order[n] : -1
  const progress = (i: number) => {
    if (base.includes(i)) return 1
    const pos = order.indexOf(i)
    if (pos < 0 || pos > n) return 0
    return pos < n ? 1 : seg(local, 0, draw)
  }
  const pulling = cur >= 0 && local >= draw && local < draw + pull
  const last = cur >= 0 && local >= draw + pull ? cur : n >= 1 ? order[Math.min(n, order.length) - 1] : -1
  return { cur, progress, pulling, pull: seg(local, draw, draw + pull - 1), last }
}

export function mainsRun(g: Gfx, t: number, o: SceneOpts, order: number[], base: number[], draw: number, pull: number, per: number) {
  const r = run(t, order, base, draw, pull, per)
  drawFrame(g)
  drawBed(g, { main: r.progress, shade: (_kind, k) => (k === r.cur ? 3 : 2) })
  if (r.pulling) {
    gripperH(g, MAIN_Y[r.cur], mainSpan(r.cur)[0] - 0.5, r.pull, t)
    tensionText(g, r.pull * 55, o)
  }
  if (r.last >= 0) clampMark(g, mainSpan(r.last)[0] + 1.5, MAIN_Y[r.last])
}

export function crossesRun(g: Gfx, t: number, o: SceneOpts, order: number[], base: number[], draw: number, pull: number, per: number) {
  const r = run(t, order, base, draw, pull, per)
  drawFrame(g)
  drawBed(g, { cross: r.progress })
  if (r.pulling) {
    gripperV(g, CROSS_X[r.cur], crossSpan(r.cur)[1] + 0.5, r.pull, t)
    tensionText(g, r.pull * 55, o)
  }
  if (r.last >= 0) clampMark(g, CROSS_X[r.last], crossSpan(r.last)[1] - 1.5)
}
