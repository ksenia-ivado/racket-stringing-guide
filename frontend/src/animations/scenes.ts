import { H, type Gfx, type Shade } from './gfx'
import {
  BRX,
  BRY,
  CROSS_X,
  CX,
  CY,
  MAIN_Y,
  RX,
  RY,
  clampMark,
  crossSpan,
  crossesRun,
  drawBed,
  drawFrame,
  ease,
  frameEdgeX,
  frameEdgeY,
  gripperV,
  knot,
  mainSpan,
  mainsRun,
  norm,
  seg,
  snipX,
  tensionText,
  tieOff,
  type Scene,
} from './racket'

export type { Scene } from './racket'

/* ---------- Tools for the first step (each fits a 10x13 box) ---------- */

type Tool = (g: Gfx, x: number, y: number) => void

const coil: Tool = (g, x, y) => {
  g.ellipse(x + 5, y + 7.5, 5, 5, 3, 2)
  g.ellipse(x + 5, y + 7.5, 3.3, 3.3, 2, 2)
  g.ellipse(x + 5, y + 7.5, 1.8, 1.8, 2)
  g.line(x + 9, y + 10.5, x + 11, y + 13, 3)
}

const cutters: Tool = (g, x, y) => {
  g.line(x + 3, y, x + 6.5, y + 5, 3, 2)
  g.line(x + 7, y, x + 3.5, y + 5, 3, 2)
  g.disc(x + 5, y + 4, 0.7, 3)
  g.ellipse(x + 3, y + 9.5, 2, 3.3, 2, 2)
  g.ellipse(x + 7, y + 9.5, 2, 3.3, 2, 2)
}

const awl: Tool = (g, x, y) => {
  g.line(x + 5, y, x + 5, y + 6, 3, 2)
  g.rect(x + 3.3, y + 6, 3.4, 7, 2)
  for (let i = 0; i < 3; i++) g.line(x + 3.5, y + 7.5 + i * 2, x + 6.5, y + 7.5 + i * 2, 1)
}

const pliers: Tool = (g, x, y) => {
  g.line(x + 4.5, y, x + 4.5, y + 5, 3, 2)
  g.line(x + 5.7, y, x + 5.7, y + 5, 3, 2)
  g.disc(x + 5.1, y + 5.5, 0.9, 3)
  g.line(x + 4.6, y + 6.3, x + 2, y + 13, 2, 3)
  g.line(x + 5.6, y + 6.3, x + 8.2, y + 13, 2, 3)
}

const tape: Tool = (g, x, y) => {
  g.line(x, y + 4, x + 8, y + 4, 3, 2)
  g.line(x, y + 12.6, x + 8, y + 12.6, 3, 2)
  g.line(x, y + 4, x, y + 12.6, 3, 2)
  g.line(x + 8, y + 4, x + 8, y + 12.6, 3, 2)
  g.ellipse(x + 4, y + 8.3, 2, 2, 2, 2)
  g.line(x + 8.5, y + 11.8, x + 12.5, y + 11.8, 3, 2)
  for (let i = 0; i < 3; i++) g.line(x + 9.5 + i * 1.3, y + 11, x + 9.5 + i * 1.3, y + 10.4, 2)
}

const TOOLS: Tool[] = [coil, cutters, awl, pliers, tape]

function corners(g: Gfx, x0: number, y0: number, x1: number, y1: number) {
  for (const [x, y, dx, dy] of [
    [x0, y0, 1, 1],
    [x1, y0, -1, 1],
    [x0, y1, 1, -1],
    [x1, y1, -1, -1],
  ]) {
    g.line(x, y, x + dx * 2, y, 3, 2)
    g.line(x, y, x, y + dy * 2, 3, 2)
  }
}

/* ---------- Step scenes ---------- */

const gatherTools: Scene = {
  loop: 84,
  still: 70,
  draw(g, t) {
    g.line(2, 45, 94, 45, 2, 2)
    TOOLS.forEach((tool, i) => {
      const a = 4 + i * 8
      if (t < a) return
      const x = 7 + i * 18
      const drop = -(1 - ease(seg(t, a, a + 5))) * 34
      tool(g, x, 31 + drop)
    })
    if (t >= 48 && t % 4 < 3) {
      const x = 7 + (Math.floor((t - 48) / 7) % TOOLS.length) * 18
      corners(g, x - 2.5, 28.5, x + 13, 46.5)
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
      snipX(g, CX + Math.cos(a) * r * BRX, CY + Math.sin(a) * r * BRY, true)
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
    for (let i = 0; i < 36; i++) {
      const b = (i / 36) * Math.PI * 2
      const gx = CX + Math.cos(b) * (RX - 2.2)
      const gy = CY + Math.sin(b) * (RY - 2.2)
      g.disc(gx, gy, 0.5, t < lap && Math.hypot(gx - lx, gy - ly) < 6 ? 3 : 1)
    }
    if (t < lap) {
      g.arc(CX, CY, RX, RY, a - 0.3, a + 0.3, 3, 3)
      g.ellipse(lx, ly, 5.5, 5.5, 3, 2)
      g.line(lx + Math.cos(a) * 5.5, ly + Math.sin(a) * 5.5, lx + Math.cos(a) * 10, ly + Math.sin(a) * 10, 2, 4)
    } else if (t % 4 < 3) {
      g.text('OK', CX, CY - 3, 3, 5, 'center')
    }
  },
}

const mountRacket: Scene = {
  loop: 66,
  still: 44,
  draw(g, t) {
    const e = 1 - ease(seg(t, 0, 14))
    g.ox = -e * 80
    drawFrame(g)
    g.ox = 0
    if (t < 16) return
    const gap = 8 * (1 - ease(seg(t, 16, 30)))
    const s: Shade = t >= 30 && t < 40 && t % 4 < 2 ? 3 : 2
    // Head support
    const hx = CX - RX - 3.5 - gap
    g.line(0, CY, hx, CY, 1, 2)
    g.rect(hx, CY - 2.5, 3, 5, s)
    // Side supports
    const ty = CY - RY - 3.5 - gap
    g.line(CX, 0, CX, ty, 1, 2)
    g.rect(CX - 2.5, ty, 5, 3, s)
    const by = CY + RY + 0.8 + gap
    g.line(CX, by + 3, CX, H, 1, 2)
    g.rect(CX - 2.5, by, 5, 3, s)
    // Throat support
    g.rect(70, CY - 5.5 - gap, 4, 3, s)
    g.rect(70, CY + 2.6 + gap, 4, 3, s)
    if (t >= 40 && t % 6 < 4) g.text('OK', 93, 2, 3, 3.8, 'right')
  },
}

const measureString: Scene = {
  loop: 84,
  still: 52,
  draw(g, t, o) {
    const X0 = 9
    const X1 = 88
    const MID = 48.5
    const Y = 20
    const total = o.metric ? 12 : 40
    const unit = o.metric ? 'm' : 'ft'
    g.ellipse(4.5, Y, 3.2, 3.2, 2, 2)
    g.disc(4.5, Y, 0.8, 3)
    if (t < 36) {
      const p = seg(t, 0, 28)
      g.line(X0, Y, X0 + (X1 - X0) * p, Y, 3, 2)
      g.line(X0, 27, X1, 27, 1)
      for (let i = 0; i <= 20; i++) {
        const x = X0 + ((X1 - X0) * i) / 20
        g.line(x, 27, x, i % 5 === 0 ? 24.5 : 26, i % 5 === 0 ? 2 : 1)
      }
      g.text(`${Math.round(p * total)} ${unit}`, 93, 2, 3, 3.8, 'right')
      if (t >= 30) snipX(g, MID, Y, t % 2 === 0)
    } else {
      const q = ease(seg(t, 36, 44))
      const yl = Y - q * 8
      const yr = Y + q * 10
      // Ends cut at an angle, so they feed through grommets easily
      g.line(X0, yl, MID - 1, yl, 3, 2)
      g.line(MID - 1, yl, MID - 0.2, yl - 0.8, 3)
      g.line(MID + 1, yr, X1, yr, 3, 2)
      g.line(MID + 1, yr, MID + 0.2, yr + 0.8, 3)
      if (t >= 46) {
        const half = `${total / 2} ${unit}`
        g.text(`Mains ${half}`, 28, yl - 7, 3, 3.8, 'center')
        g.text(`Crosses ${half}`, 68, yr + 3, 3, 3.8, 'center')
      }
    }
  },
}

const installCenterMains: Scene = {
  loop: 76,
  still: 58,
  draw: (g, t, o) => mainsRun(g, t, o, [7, 8], [], 12, 12, 32),
}

const stringMains: Scene = {
  loop: 100,
  still: 40,
  // Three on one side, three on the other, then alternating (Richard Parnell's order).
  draw: (g, t, o) => mainsRun(g, t, o, [6, 5, 4, 9, 10, 11, 3, 12, 2, 13, 1, 14, 0, 15], [7, 8], 3, 3, 6),
}

const TIE_MAINS: [number, number][] = [
  [0, 4],
  [15, 28],
]

const tieOffMains: Scene = {
  loop: 60,
  still: 34,
  draw(g, t) {
    drawFrame(g)
    drawBed(g)
    for (const [k, a] of TIE_MAINS) {
      const y = MAIN_Y[k]
      const kx = frameEdgeX(y, 1) + 2
      if (t >= a) g.line(mainSpan(k)[1], y, kx, y, 3)
      tieOff(g, t, a, kx, y, 1, k === 0 ? -1 : 1)
    }
  },
}

const startCrosses: Scene = {
  loop: 66,
  still: 40,
  draw(g, t, o) {
    const x = CROSS_X[0]
    const [y0, y1] = crossSpan(0)
    const ky = frameEdgeY(x, -1) - 2
    drawFrame(g)
    knot(g, x, ky, seg(t, 0, 8))
    if (t >= 8) g.line(x, ky + 1, x, y0, 3)
    drawBed(g, { cross: (j) => (j === 0 ? seg(t, 10, 34) : 0) })
    if (t >= 36 && t < 48) {
      const p = seg(t, 36, 47)
      gripperV(g, x, y1 + 0.5, p, t)
      tensionText(g, p * 55, o)
    }
    if (t >= 48) clampMark(g, x, y1 - 1.5)
  },
}

const stringCrosses: Scene = {
  loop: 104,
  still: 50,
  draw: (g, t, o) =>
    crossesRun(
      g,
      t,
      o,
      CROSS_X.map((_, j) => j).slice(1),
      [0],
      3,
      2,
      5,
    ),
}

const tieOffCrosses: Scene = {
  loop: 56,
  still: 26,
  draw(g, t) {
    const flash = t >= 24 && t < 30 && t % 2 === 0
    drawFrame(g)
    drawBed(g, { cross: () => 1, shade: (kind) => (flash || kind === 'c' ? 3 : 2) })
    const last = CROSS_X.length - 1
    const x = CROSS_X[last]
    const ky = frameEdgeY(x, 1) + 2
    if (t >= 4) g.line(x, crossSpan(last)[1], x, ky, 3)
    tieOff(g, t, 4, x, ky, 1, 1)
  },
}

const SPARKLES = [
  [6, 6],
  [62, 5],
  [74, 47],
  [8, 47],
  [90, 16],
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
      const r = 1.2 + 5 * Math.abs(1 - 2 * seg(t, 30, 50))
      g.disc(CX, CY, r, 2)
      g.ellipse(CX, CY, r, r, 3, 2)
      g.arc(CX - r * 0.9, CY, r * 0.6, r * 0.8, -1, 1, 1)
    }
    if (t >= 40 && t < 47) g.ellipse(CX, CY, (t - 39) * 3, (t - 39) * 2, 3)
    SPARKLES.forEach(([x, y], i) => {
      if ((t + i * 3) % 10 < 3) {
        g.line(x - 1.5, y, x + 1.5, y, 3)
        g.line(x, y - 1.5, x, y + 1.5, 3)
      }
    })
    if (t >= 50 && t % 6 < 4) g.text('DONE', 93, 2, 3, 3.8, 'right')
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
