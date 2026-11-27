import { H, type Gfx, type Shade } from './gfx'
import { CX, CY, RX, RY, clampMark, ease, label, mainsRun, seg, tensionText, type Scene } from './racket'
import { sceneFor } from './scenes'

/* ---------- Helpers ---------- */

/** A vertical strip of frame on the left with a grommet hole at y. */
function frameSide(g: Gfx, y: number) {
  g.rect(8, 0, 4, H, 1)
  g.line(12, 0, 12, H, 2, 2)
  g.clearRect(8, y - 1.2, 4, 2.4)
}

/** A horizontal strip of frame with grommet holes. */
function frameBand(g: Gfx, y: number, holes: number[], holeWidth = 2.6) {
  g.rect(0, y, 96, 5, 1)
  g.line(0, y, 96, y, 2, 2)
  for (const x of holes) g.clearRect(x - holeWidth / 2, y, holeWidth, 2.4)
}

function arrow(g: Gfx, x: number, y: number, dir: 'left' | 'right' | 'up' | 'down', s: Shade = 3) {
  const d = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[dir]
  const [dx, dy] = d
  g.line(x, y, x - dx * 1.5 - dy * 1.5, y - dy * 1.5 - dx * 1.5, s, 2)
  g.line(x, y, x - dx * 1.5 + dy * 1.5, y - dy * 1.5 + dx * 1.5, s, 2)
}

/* ---------- Machine ---------- */

const stringingMachine: Scene = {
  loop: 84,
  still: 62,
  draw(g, t, o) {
    // Turntable under the racket
    g.ellipse(CX, CY, RX + 6, RY + 6, 1, 2)
    mainsRun(g, t, o, [7, 8, 6, 9, 5, 10], [], 5, 5, 12)
    // Side and throat supports holding the frame
    g.rect(CX - 2.5, CY - RY - 3.2, 5, 2.6, 2)
    g.rect(CX - 2.5, CY + RY + 0.8, 5, 2.6, 2)
    g.rect(70, CY - 5.5, 4, 3, 2)
    g.rect(70, CY + 2.6, 4, 3, 2)
    if (t >= 72) label(g, 'Mount, pull, clamp')
  },
}

const tensionHead: Scene = {
  loop: 70,
  still: 30,
  draw(g, t, o) {
    const Y = CY
    frameSide(g, Y)
    const closed = seg(t, 6, 12) * (1 - seg(t, 46, 52))
    const pull = ease(seg(t, 14, 34)) * (1 - ease(seg(t, 52, 62)))
    const gx = 58 + pull * 8
    const tight = t >= 14 && t < 46
    g.line(12, Y, gx + 16, Y, tight ? 3 : 2, 2)
    // Head body and jaws
    g.rect(gx, Y - 9, 20, 18, 1)
    g.line(gx, Y - 9, gx + 20, Y - 9, 2)
    g.line(gx, Y + 9, gx + 20, Y + 9, 2)
    g.rect(gx + 4, Y - 1.4 - 2.6 - 4 * (1 - closed), 12, 2.6, 3)
    g.rect(gx + 4, Y + 1.4 + 4 * (1 - closed), 12, 2.6, 3)
    // Spring to the machine
    const end = 94
    const start = gx + 20
    for (let i = 0; i < 8; i++) {
      const x0 = start + ((end - start) * i) / 8
      const x1 = start + ((end - start) * (i + 1)) / 8
      g.line(x0, Y + (i % 2 ? 3 : -3), x1, Y + (i % 2 ? -3 : 3), 2)
    }
    if (t >= 40 && t < 66) clampMark(g, 16, Y)
    if (tight) {
      if (t < 34 && t % 2 === 0) arrow(g, gx - 3, Y - 5, 'right')
      tensionText(g, pull * 55, o)
    } else {
      label(g, t < 14 ? 'Grip the string' : 'Clamp, then release')
    }
  },
}

const clamps: Scene = {
  loop: 80,
  still: 30,
  draw(g, t) {
    const ys = [15, CY, 39]
    frameSide(g, CY)
    const gripOff = ease(seg(t, 30, 38)) * 12
    // Middle main: tensioned by the head on the right, then held by the clamp
    for (const y of ys) g.line(12, y, 96, y, y === CY && t >= 6 ? 3 : 2, 2)
    if (t < 40) {
      g.rect(86 + gripOff, CY - 3, 6, 6, 2)
      if (t < 30 && t % 2 === 0) arrow(g, 84, CY - 5, 'right')
    }
    // Fixed clamp jaws close on the middle string
    const close = seg(t, 18, 24)
    const jx = 24
    g.rect(jx, CY - 1.4 - 3 - 3 * (1 - close), 6, 3, 3)
    g.rect(jx, CY + 1.4 + 3 * (1 - close), 6, 3, 3)
    g.line(jx + 3, CY - 4.4 - 3 * (1 - close), jx + 3, 2, 1, 2)
    // Flying clamp: holds two neighbouring strings to each other
    if (t >= 44) {
      const fly = ease(seg(t, 44, 52))
      const fx = 60 - (1 - fly) * 30
      g.rect(fx - 2, ys[0] - 2, 4, ys[1] - ys[0] + 4, 1)
      g.rect(fx - 3, ys[0] - 1.6, 6, 3.2, 3)
      g.rect(fx - 3, ys[1] - 1.6, 6, 3.2, 3)
    }
    label(g, t < 30 ? 'Fixed clamp closes' : t < 44 ? 'Tension held' : 'Flying clamp: two strings')
  },
}

/* ---------- Hand tools ---------- */

const startingClamp: Scene = {
  loop: 60,
  still: 40,
  draw(g, t, o) {
    const HOLE = 48
    const BAND = 30
    frameBand(g, BAND, [HOLE])
    g.text('outside', 92, 18, 1, 3.2, 'right')
    g.text('inside', 92, 44, 1, 3.2, 'right')
    const pulling = t >= 20 && t < 36
    g.line(HOLE, 54, HOLE, 8, pulling ? 3 : 2, 2)
    // Clamp slides onto the string just outside the frame and closes
    const slide = (1 - ease(seg(t, 4, 14))) * 40
    const close = seg(t, 14, 18)
    const cx = HOLE + slide
    g.rect(cx - 6, 24.5, 12, 5, 1)
    g.rect(cx - 5 - 2 * (1 - close), 25.5, 3, 3, 3)
    g.rect(cx + 2 + 2 * (1 - close), 25.5, 3, 3, 3)
    g.line(cx + 6, 27, cx + 10, 27, 2, 2)
    g.disc(cx + 11, 27, 1.2, 2)
    if (pulling) {
      if (t % 2 === 0) arrow(g, HOLE, 52, 'down')
      tensionText(g, seg(t, 20, 34) * 55, o)
    } else {
      label(g, t < 20 ? 'Clamp outside the frame' : 'Holds without a knot')
    }
  },
}

const awl: Scene = {
  loop: 64,
  still: 26,
  draw(g, t) {
    const HOLE = 48
    const BAND = 34
    const open = seg(t, 12, 20) * (1 - seg(t, 50, 58))
    frameBand(g, BAND, [HOLE], 2.6 + open * 1.6)
    // A string already in the hole
    g.line(HOLE - 0.8, 0, HOLE - 0.8, H, 2, 2)
    // Awl goes in and out
    const depth = ease(seg(t, 4, 14)) * (1 - ease(seg(t, 22, 30)))
    const tip = 24 + depth * 13
    if (t < 32) {
      g.line(HOLE + 0.8, tip - 8, HOLE + 0.8, tip, 3, 2)
      g.rect(HOLE - 1.2, tip - 15, 4, 7, 2)
      g.line(HOLE - 0.7, tip - 13, HOLE + 2.3, tip - 13, 1)
      g.line(HOLE - 0.7, tip - 10.5, HOLE + 2.3, tip - 10.5, 1)
    }
    // Then the second string fits through
    if (t >= 34) g.line(HOLE + 0.8, 0, HOLE + 0.8, H * seg(t, 34, 46), 3, 2)
    label(g, t < 32 ? 'Open the grommet' : 'Room for the second string')
  },
}

const cutters: Scene = {
  loop: 54,
  still: 24,
  draw(g, t) {
    const Y = CY
    const X = 48
    const cut = t >= 18
    const apart = ease(seg(t, 18, 24)) * 3
    // The string, cut at an angle
    if (!cut) g.line(4, Y, 92, Y, 3, 2)
    else {
      g.line(4, Y, X - 1 - apart, Y, 3, 2)
      g.line(X - 1 - apart, Y, X - apart, Y - 1.2, 3)
      g.line(X + 1 + apart, Y, 92, Y, 3, 2)
      g.line(X + 1 + apart, Y, X + apart, Y + 1.2, 3)
    }
    // Cutters come down, close, and lift away
    const y = Y - 14 + ease(seg(t, 0, 10)) * 6 - ease(seg(t, 26, 34)) * 5
    const spread = 3.5 * (1 - seg(t, 12, 18)) + 0.4
    const pivot: [number, number] = [X, y]
    g.line(pivot[0], pivot[1], X - spread, y + 10, 3, 2)
    g.line(pivot[0], pivot[1], X + spread, y + 10, 3, 2)
    g.disc(pivot[0], pivot[1], 1, 3)
    g.ellipse(X - 4 - spread * 0.4, y - 6, 2.4, 4, 2, 2)
    g.ellipse(X + 4 + spread * 0.4, y - 6, 2.4, 4, 2, 2)
    if (t >= 18 && t < 22 && t % 2 === 0) {
      g.line(X - 3, Y - 3, X - 5, Y - 5, 3)
      g.line(X + 3, Y + 3, X + 5, Y + 5, 3)
    }
    label(g, t < 18 ? 'Sharp cutters' : 'Cut at an angle')
  },
}

const pliers: Scene = {
  loop: 56,
  still: 34,
  draw(g, t) {
    const AY = 33
    frameBand(g, 36, [24, 52, 72])
    g.line(24, 37, 24, AY, 2, 3)
    g.line(24, AY, 72, AY, 2, 3)
    g.line(72, AY, 72, 37, 2, 3)
    const pull = ease(seg(t, 12, 30)) * (1 - ease(seg(t, 46, 54)))
    // Knot shrinks as the tail is pulled
    const r = 2.6 - pull * 1.2
    g.line(52, 37, 50, AY + 1, 3, 3)
    g.ellipse(48, AY, r, r * 0.9, 3, 3)
    const tx = 58 + pull * 8
    const ty = 22 - pull * 6
    g.line(48 + r * 0.7, AY - r * 0.7, tx, ty, 3, 3)
    // Pliers grip the tail end
    const grip = seg(t, 6, 10)
    const jaw = 1.6 * (1 - grip) + 0.5
    g.line(tx, ty, tx + 5, ty - 5 - jaw, 3, 2)
    g.line(tx, ty, tx + 5 + jaw, ty - 5, 3, 2)
    g.line(tx + 5, ty - 5 - jaw, tx + 14, ty - 11, 2, 3)
    g.line(tx + 5 + jaw, ty - 5, tx + 15, ty - 9, 2, 3)
    if (t >= 12 && t < 30 && t % 2 === 0) arrow(g, tx - 2, ty + 2, 'right', 2)
    label(g, t < 12 ? 'Grip the tail' : t < 46 ? 'Pull the knot tight' : 'Pliers')
  },
}

/* ---------- Supplies ---------- */

const stringSet: Scene = {
  loop: 64,
  still: 46,
  draw(g, t, o) {
    const RXc = 20
    const RYc = 28
    const p = ease(seg(t, 4, 40))
    // A reel that turns as string comes off it
    const spin = p * Math.PI * 6
    g.ellipse(RXc, RYc, 12, 12, 2, 2)
    g.ellipse(RXc, RYc, 9, 9, 1, 3)
    g.ellipse(RXc, RYc, 3, 3, 3, 2)
    for (let i = 0; i < 4; i++) {
      const a = spin + (i * Math.PI) / 2
      g.line(RXc + Math.cos(a) * 3, RYc + Math.sin(a) * 3, RXc + Math.cos(a) * 10, RYc + Math.sin(a) * 10, 2)
    }
    const y = RYc - 12
    g.line(RXc, y, RXc + 4 + 68 * p, y, 3, 2)
    const total = o.metric ? 12 : 40
    g.text(`${Math.round(total * p)} ${o.metric ? 'm' : 'ft'}`, 93, 1.5, 3, 3.8, 'right')
    if (t >= 44) label(g, 'One set, one racket')
  },
}

const scenes: Record<string, Scene> = {
  'stringing-machine': stringingMachine,
  'tension-head': tensionHead,
  'mounting-supports': sceneFor('mount-racket'),
  clamps,
  'starting-clamp': startingClamp,
  awl,
  cutters,
  pliers,
  'tape-measure': sceneFor('measure-string'),
  'string-set': stringSet,
}

export const toolScene = (id: string): Scene | undefined => scenes[id]
