import { H, type Gfx, type Shade } from './gfx'

/**
 * One looping pixel animation per step. `draw` gets the frame number within
 * the loop (the player runs at 10 frames per second). `still` is the frame
 * shown when the viewer prefers reduced motion.
 */
export interface Scene {
  loop: number
  still: number
  draw: (g: Gfx, t: number) => void
}

/* ---------- Racket geometry (head on the left, handle on the right) ---------- */

const CX = 38
const CY = 27
const RX = 24
const RY = 17
/** Radii of the area inside the frame where strings can go. */
const BRX = RX - 1.5
const BRY = RY - 1.5

/** 10 mains run along the racket; 15 crosses run across it. */
const MAIN_Y = Array.from({ length: 10 }, (_, k) => 14 + 3 * k)
const CROSS_X = Array.from({ length: 15 }, (_, j) => 17 + 3 * j)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** 0 before frame a, 1 after frame b, linear in between. */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))

const halfW = (y: number) => {
  const d = (y - CY) / BRY
  return d * d >= 1 ? 0 : BRX * Math.sqrt(1 - d * d)
}
const halfH = (x: number) => {
  const d = (x - CX) / BRX
  return d * d >= 1 ? 0 : BRY * Math.sqrt(1 - d * d)
}
const mainSpan = (k: number): [number, number] => {
  const hw = halfW(MAIN_Y[k])
  return [Math.ceil(CX - hw), Math.floor(CX + hw)]
}
const crossSpan = (j: number): [number, number] => {
  const hh = halfH(CROSS_X[j])
  return [Math.ceil(CY - hh), Math.floor(CY + hh)]
}
/** Just outside the frame, on the left (-1) or right (+1) at height y. */
const frameEdgeX = (y: number, side: -1 | 1) =>
  CX + side * (RX + 1) * Math.sqrt(Math.max(0, 1 - ((y - CY) / RY) ** 2))
/** Just outside the frame, above (-1) or below (+1) at column x. */
const frameEdgeY = (x: number, side: -1 | 1) =>
  CY + side * (RY + 1) * Math.sqrt(Math.max(0, 1 - ((x - CX) / RX) ** 2))
/** 0 at the centre of the string bed, 1 at its edge. */
const norm = (x: number, y: number) => Math.hypot((x - CX) / BRX, (y - CY) / BRY)

function drawFrame(g: Gfx, s: Shade = 3) {
  g.ellipse(CX, CY, RX, RY, s)
  g.ellipse(CX, CY, RX - 1, RY - 1, 2)
  // Throat
  g.line(59, CY - 8, 68, CY - 2, s)
  g.line(59, CY + 8, 68, CY + 2, s)
  // Handle with grip wrap, and butt cap
  g.rect(68, CY - 2, 23, 5, 2)
  for (let x = 70; x < 89; x += 4) g.line(x, CY + 2, x + 2, CY - 2, 1)
  g.rect(91, CY - 3, 2, 7, s)
}

type Kind = 'm' | 'c'

interface BedOptions {
  /** How much of each main is strung, 0..1. Default: all of it. */
  main?: (k: number) => number
  /** How much of each cross is strung, 0..1. Default: none. */
  cross?: (j: number) => number
  /** Colour of a string pixel; 0 hides it. */
  shade?: (kind: Kind, index: number, x: number, y: number) => Shade
}

/** Draw the string bed, with crosses woven over and under the mains. */
function drawBed(g: Gfx, o: BedOptions = {}) {
  const mainEnd = MAIN_Y.map((_, k) => {
    const p = o.main ? o.main(k) : 1
    const [a, b] = mainSpan(k)
    return p <= 0 ? a - 1 : a + Math.round((b - a) * p)
  })
  const crossEnd = CROSS_X.map((_, j) => {
    const p = o.cross ? o.cross(j) : 0
    const [a, b] = crossSpan(j)
    return p <= 0 ? a - 1 : a + Math.round((b - a) * p)
  })
  const shade = o.shade ?? ((kind: Kind): Shade => (kind === 'm' ? 2 : 3))

  MAIN_Y.forEach((y, k) => {
    for (let x = mainSpan(k)[0]; x <= mainEnd[k]; x++) {
      const j = CROSS_X.indexOf(x)
      const crossOnTop = j >= 0 && (k + j) % 2 === 0 && y >= crossSpan(j)[0] && y <= crossEnd[j]
      if (!crossOnTop) g.px(x, y, shade('m', k, x, y))
    }
  })
  CROSS_X.forEach((x, j) => {
    for (let y = crossSpan(j)[0]; y <= crossEnd[j]; y++) {
      const k = MAIN_Y.indexOf(y)
      const mainOnTop = k >= 0 && (k + j) % 2 === 1 && x >= mainSpan(k)[0] && x <= mainEnd[k]
      if (!mainOnTop) g.px(x, y, shade('c', j, x, y))
    }
  })
}

/* ---------- Small props ---------- */

/** Tension head on the left, pulling a main. */
function gripperH(g: Gfx, y: number, xEdge: number, p: number, t: number) {
  const gx = 4 - Math.round(p * 2)
  g.line(gx + 3, y, xEdge, y, 3)
  g.rect(gx, y - 2, 3, 5, 2)
  g.px(gx + 1, y, 3)
  if (p < 1 && t % 2 === 0) {
    g.px(gx - 2, y, 3)
    g.px(gx - 1, y - 1, 3)
    g.px(gx - 1, y + 1, 3)
  }
}

/** Tension head below the racket, pulling a cross. */
function gripperV(g: Gfx, x: number, yEdge: number, p: number, t: number) {
  const gy = H - 8 + Math.round(p * 2)
  g.line(x, yEdge, x, gy - 1, 3)
  g.rect(x - 2, gy, 5, 3, 2)
  g.px(x, gy + 1, 3)
  if (p < 1 && t % 2 === 0) {
    g.px(x, gy + 4, 3)
    g.px(x - 1, gy + 3, 3)
    g.px(x + 1, gy + 3, 3)
  }
}

/** Tension readout climbing to the target. */
function tensionText(g: Gfx, p: number) {
  g.text(`${String(Math.round(p * 55)).padStart(2, '0')}LB`, 2, 2, 3)
}

function clampMark(g: Gfx, x: number, y: number) {
  g.rect(x - 1, y - 1, 3, 3, 3)
  g.px(x, y, 1)
}

function knot(g: Gfx, x: number, y: number, p: number) {
  const pts = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ]
  pts.slice(0, Math.ceil(p * pts.length)).forEach(([dx, dy]) => g.px(x + dx, y + dy, 3))
}

function snipX(g: Gfx, x: number, y: number, on: boolean) {
  if (!on) return
  for (const [dx, dy] of [
    [0, 0],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ])
    g.px(x + dx, y + dy, 3)
}

/** Tie a knot starting at frame a, then pull a tail out and trim it. */
function tieOff(g: Gfx, t: number, a: number, kx: number, ky: number, dx: number, dy: number) {
  if (t < a) return
  knot(g, kx, ky, seg(t, a, a + 9))
  if (t >= a + 9 && t < a + 16) {
    g.line(kx + dx, ky + dy, kx + dx * 5, ky + dy * 5, 3)
    if (t >= a + 12) snipX(g, kx + dx * 3, ky + dy * 3, t % 2 === 0)
  } else if (t >= a + 16) {
    g.px(kx + dx * 2, ky + dy * 2, 2)
  }
}

/**
 * Strings the mains in `order`, one every `per` frames: `draw` frames to
 * feed the string, then `pull` frames on the tension head, then a clamp.
 */
function mainsRun(g: Gfx, t: number, order: number[], base: number[], draw: number, pull: number, per: number) {
  const n = Math.floor(t / per)
  const local = t - n * per
  const cur = n < order.length ? order[n] : -1
  const progress = (k: number) => {
    if (base.includes(k)) return 1
    const i = order.indexOf(k)
    if (i < 0 || i > n) return 0
    return i < n ? 1 : seg(local, 0, draw)
  }
  drawFrame(g)
  drawBed(g, { main: progress, shade: (_kind, k) => (k === cur ? 3 : 2) })

  const pulling = cur >= 0 && local >= draw && local < draw + pull
  if (pulling) {
    const p = seg(local, draw, draw + pull - 1)
    gripperH(g, MAIN_Y[cur], mainSpan(cur)[0] - 1, p, t)
    tensionText(g, p)
  }
  const last = cur >= 0 && local >= draw + pull ? cur : n >= 1 ? order[Math.min(n, order.length) - 1] : -1
  if (last >= 0) clampMark(g, mainSpan(last)[0] + 1, MAIN_Y[last])
}

/** Same as mainsRun, for crosses pulled from below. */
function crossesRun(g: Gfx, t: number, order: number[], base: number[], draw: number, pull: number, per: number) {
  const n = Math.floor(t / per)
  const local = t - n * per
  const cur = n < order.length ? order[n] : -1
  const progress = (j: number) => {
    if (base.includes(j)) return 1
    const i = order.indexOf(j)
    if (i < 0 || i > n) return 0
    return i < n ? 1 : seg(local, 0, draw)
  }
  drawFrame(g)
  drawBed(g, { cross: progress })

  const pulling = cur >= 0 && local >= draw && local < draw + pull
  if (pulling) {
    const p = seg(local, draw, draw + pull - 1)
    gripperV(g, CROSS_X[cur], crossSpan(cur)[1] + 1, p, t)
    tensionText(g, p)
  }
  const last = cur >= 0 && local >= draw + pull ? cur : n >= 1 ? order[Math.min(n, order.length) - 1] : -1
  if (last >= 0) clampMark(g, CROSS_X[last], crossSpan(last)[1] - 1)
}

/* ---------- Tool sprites for the first step ---------- */

type Tool = (g: Gfx, x: number, y: number) => void

const cutters: Tool = (g, x, y) =>
  g.sprite(
    [
      '..3....3..',
      '..33..33..',
      '...3333...',
      '....33....',
      '....33....',
      '...2..2...',
      '..2....2..',
      '.2......2.',
      '.2......2.',
      '.2......2.',
      '.2......2.',
      '..2....2..',
      '...2..2...',
    ],
    x,
    y,
  )

const pliers: Tool = (g, x, y) =>
  g.sprite(
    [
      '....33....',
      '....33....',
      '....33....',
      '....33....',
      '....33....',
      '...3..3...',
      '...2..2...',
      '..2....2..',
      '..2....2..',
      '.2......2.',
      '.2......2.',
      '.2......2.',
      '.2......2.',
    ],
    x,
    y,
  )

const awl: Tool = (g, x, y) =>
  g.sprite(
    [
      '....3.....',
      '....3.....',
      '....3.....',
      '....3.....',
      '....3.....',
      '....3.....',
      '...333....',
      '..22222...',
      '..21112...',
      '..22222...',
      '..21112...',
      '..22222...',
      '..21112...',
    ],
    x,
    y,
  )

const coil: Tool = (g, x, y) => {
  g.ellipse(x + 5, y + 7, 5, 5, 3)
  g.ellipse(x + 5, y + 7, 3, 3, 2)
  g.px(x + 5, y + 7, 2)
  g.line(x + 9, y + 10, x + 11, y + 12, 3)
}

const tape: Tool = (g, x, y) => {
  g.line(x, y + 4, x + 8, y + 4, 3)
  g.line(x, y + 12, x + 8, y + 12, 3)
  g.line(x, y + 4, x, y + 12, 3)
  g.line(x + 8, y + 4, x + 8, y + 12, 3)
  g.ellipse(x + 4, y + 8, 2, 2, 2)
  g.line(x + 9, y + 11, x + 12, y + 11, 3)
  g.px(x + 10, y + 10, 2)
  g.px(x + 12, y + 10, 2)
}

const TOOLS: Tool[] = [coil, cutters, awl, pliers, tape]

function corners(g: Gfx, x0: number, y0: number, x1: number, y1: number) {
  for (const [x, y, dx, dy] of [
    [x0, y0, 1, 1],
    [x1, y0, -1, 1],
    [x0, y1, 1, -1],
    [x1, y1, -1, -1],
  ]) {
    g.px(x, y, 3)
    g.px(x + dx, y, 3)
    g.px(x, y + dy, 3)
  }
}

/* ---------- Scenes ---------- */

const gatherTools: Scene = {
  loop: 84,
  still: 70,
  draw(g, t) {
    g.line(2, 44, 93, 44, 2)
    g.line(2, 45, 93, 45, 1)
    TOOLS.forEach((tool, i) => {
      const a = 4 + i * 8
      if (t < a) return
      const x = 6 + i * 18
      const drop = -Math.round((1 - seg(t, a, a + 5)) ** 2 * 32)
      tool(g, x, 31 + drop)
      if (t >= a + 5 && t < a + 7) {
        g.px(x - 2, 43, 1)
        g.px(x + 11, 43, 1)
      }
    })
    if (t >= 48 && t % 4 < 3) {
      const x = 6 + (Math.floor((t - 48) / 7) % TOOLS.length) * 18
      corners(g, x - 2, 29, x + 11, 45)
    }
  },
}

const removeOldStrings: Scene = {
  loop: 64,
  still: 26,
  draw(g, t) {
    const r = seg(t, 6, 46) * 1.1
    drawFrame(g)
    drawBed(g, {
      cross: () => 1,
      shade: (kind, _i, x, y) => (norm(x, y) < r ? 0 : kind === 'm' ? 2 : 3),
    })
    if (t >= 6 && t < 46) {
      const a = t * 1.1
      const sx = CX + Math.cos(a) * r * BRX
      const sy = CY + Math.sin(a) * r * BRY
      snipX(g, sx, sy, true)
      if (t % 2) {
        g.px(sx + 2, sy - 1, 2)
        g.px(sx - 2, sy + 2, 2)
      }
    }
  },
}

const inspectFrame: Scene = {
  loop: 62,
  still: 14,
  draw(g, t) {
    const lap = 44
    drawFrame(g, 2)
    const a = -Math.PI / 2 + (Math.min(t, lap) / lap) * Math.PI * 2
    const lx = CX + Math.cos(a) * RX
    const ly = CY + Math.sin(a) * RY
    // Grommets light up under the lens
    for (let i = 0; i < 28; i++) {
      const b = (i / 28) * Math.PI * 2
      const gx = CX + Math.cos(b) * (RX - 2.5)
      const gy = CY + Math.sin(b) * (RY - 2.5)
      g.px(gx, gy, t < lap && Math.hypot(gx - lx, gy - ly) < 6 ? 3 : 1)
    }
    if (t < lap) {
      for (let i = 0; i < 40; i++) {
        const b = a + (i / 40 - 0.5) * 0.6
        g.px(CX + Math.cos(b) * RX, CY + Math.sin(b) * RY, 3)
      }
      g.ellipse(lx, ly, 5, 5, 3)
      g.line(lx + Math.cos(a) * 5, ly + Math.sin(a) * 5, lx + Math.cos(a) * 9, ly + Math.sin(a) * 9, 2)
    } else if (t % 4 < 3) {
      g.text('OK', CX - 3, CY - 2, 3)
    }
  },
}

const mountRacket: Scene = {
  loop: 66,
  still: 44,
  draw(g, t) {
    const e = 1 - seg(t, 0, 14)
    g.ox = -Math.round(e * e * 80)
    drawFrame(g)
    g.ox = 0
    if (t < 16) return
    const gap = Math.round(8 * (1 - seg(t, 16, 30)))
    const s: Shade = t >= 30 && t < 40 && t % 4 < 2 ? 3 : 2
    // Head support
    const hx = CX - RX - 3 - gap
    g.line(0, CY, hx - 1, CY, 1)
    g.rect(hx, CY - 2, 3, 5, s)
    // Side supports
    const ty = CY - RY - 3 - gap
    g.line(CX, 0, CX, ty - 1, 1)
    g.rect(CX - 2, ty, 5, 3, s)
    const by = CY + RY + 1 + gap
    g.line(CX, by + 3, CX, H - 1, 1)
    g.rect(CX - 2, by, 5, 3, s)
    // Throat support
    g.rect(70, CY - 5 - gap, 4, 3, s)
    g.rect(70, CY + 3 + gap, 4, 3, s)
    if (t >= 40 && t % 6 < 4) g.text('OK', 84, 4, 3)
  },
}

const measureString: Scene = {
  loop: 84,
  still: 52,
  draw(g, t) {
    const X0 = 8
    const X1 = 88
    const MID = 48
    const Y = 20
    g.ellipse(4, Y, 3, 3, 2)
    g.px(4, Y, 3)
    if (t < 36) {
      const p = seg(t, 0, 28)
      g.line(X0, Y, X0 + Math.round((X1 - X0) * p), Y, 3)
      g.line(X0, 26, X1, 26, 1)
      for (let x = X0; x <= X1; x += 4) g.px(x, 25, 1)
      for (let x = X0; x <= X1; x += 20) g.line(x, 23, x, 25, 2)
      g.text(`${Math.round(p * 12)}M`, 70, 4, 3)
      if (t >= 30) snipX(g, MID, Y - 2, t % 2 === 0)
    } else {
      const q = seg(t, 36, 44)
      const yl = Y - Math.round(q * 8)
      const yr = Y + Math.round(q * 10)
      g.line(X0, yl, MID - 1, yl, 3)
      g.px(MID - 1, yl - 1, 2)
      g.line(MID + 1, yr, X1, yr, 3)
      g.px(MID + 1, yr + 1, 2)
      if (t >= 46) {
        g.text('6M', 24, yl - 7, 3)
        g.text('6M', 64, yr + 3, 3)
      }
    }
  },
}

const installCenterMains: Scene = {
  loop: 76,
  still: 58,
  draw: (g, t) => mainsRun(g, t, [4, 5], [], 12, 12, 32),
}

const stringMains: Scene = {
  loop: 90,
  still: 30,
  draw: (g, t) => mainsRun(g, t, [3, 6, 2, 7, 1, 8, 0, 9], [4, 5], 4, 4, 9),
}

const TIE_MAINS: [number, number][] = [
  [0, 4],
  [9, 28],
]

const tieOffMains: Scene = {
  loop: 60,
  still: 34,
  draw(g, t) {
    drawFrame(g)
    drawBed(g)
    for (const [k, a] of TIE_MAINS) {
      const y = MAIN_Y[k]
      const kx = Math.round(frameEdgeX(y, 1)) + 2
      if (t >= a) g.line(mainSpan(k)[1], y, kx, y, 3)
      tieOff(g, t, a, kx, y, 1, k === 0 ? -1 : 1)
    }
  },
}

const startCrosses: Scene = {
  loop: 66,
  still: 40,
  draw(g, t) {
    const x = CROSS_X[0]
    const [y0, y1] = crossSpan(0)
    const ky = Math.round(frameEdgeY(x, -1)) - 2
    drawFrame(g)
    knot(g, x, ky, seg(t, 0, 8))
    if (t >= 8) g.line(x, ky + 1, x, y0 - 1, 3)
    drawBed(g, { cross: (j) => (j === 0 ? seg(t, 10, 34) : 0) })
    if (t >= 36 && t < 48) {
      const p = seg(t, 36, 47)
      gripperV(g, x, y1 + 1, p, t)
      tensionText(g, p)
    }
    if (t >= 48) clampMark(g, x, y1 - 1)
  },
}

const stringCrosses: Scene = {
  loop: 96,
  still: 50,
  draw: (g, t) =>
    crossesRun(
      g,
      t,
      CROSS_X.map((_, j) => j).slice(1),
      [0],
      3,
      3,
      6,
    ),
}

const tieOffCrosses: Scene = {
  loop: 56,
  still: 26,
  draw(g, t) {
    const flash = t >= 24 && t < 30 && t % 2 === 0
    drawFrame(g)
    drawBed(g, { cross: () => 1, shade: (kind) => (flash || kind === 'c' ? 3 : 2) })
    const x = CROSS_X[CROSS_X.length - 1]
    const y1 = crossSpan(CROSS_X.length - 1)[1]
    const ky = Math.round(frameEdgeY(x, 1)) + 2
    if (t >= 4) g.line(x, y1, x, ky, 3)
    tieOff(g, t, 4, x, ky, 1, 1)
  },
}

const SPARKLES = [
  [6, 6],
  [60, 4],
  [72, 46],
  [8, 46],
  [92, 18],
]

const finish: Scene = {
  loop: 72,
  still: 18,
  draw(g, t) {
    const band = (t * 5) % 180 - 40
    drawFrame(g)
    drawBed(g, { cross: () => 1, shade: (_kind, _i, x, y) => (Math.abs(x + y - band) < 4 ? 3 : 2) })
    // A ball flies in, hits the sweet spot, and flies back out
    if (t >= 30 && t < 50) {
      const r = 1 + Math.round(5 * Math.abs(1 - 2 * seg(t, 30, 50)))
      g.disc(CX, CY, r, 2)
      g.ellipse(CX, CY, r, r, 3)
    }
    if (t >= 40 && t < 47) g.ellipse(CX, CY, (t - 39) * 3, (t - 39) * 2, 3)
    SPARKLES.forEach(([x, y], i) => {
      if ((t + i * 3) % 10 < 3) {
        g.px(x, y, 3)
        g.px(x - 1, y, 2)
        g.px(x + 1, y, 2)
        g.px(x, y - 1, 2)
        g.px(x, y + 1, 2)
      }
    })
    if (t >= 50 && t % 6 < 4) g.text('DONE', 76, 6, 3)
  },
}

const fallback: Scene = {
  loop: 1,
  still: 0,
  draw(g) {
    drawFrame(g)
    drawBed(g, { cross: () => 1 })
  },
}

const scenes: Record<string, Scene> = {
  'gather-tools': gatherTools,
  'remove-old-strings': removeOldStrings,
  'inspect-frame': inspectFrame,
  'mount-racket': mountRacket,
  'measure-string': measureString,
  'install-center-mains': installCenterMains,
  'string-mains': stringMains,
  'tie-off-mains': tieOffMains,
  'start-crosses': startCrosses,
  'string-crosses': stringCrosses,
  'tie-off-crosses': tieOffCrosses,
  finish,
}

export const sceneFor = (stepId: string): Scene => scenes[stepId] ?? fallback
