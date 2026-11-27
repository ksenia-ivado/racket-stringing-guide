import type { Gfx, Shade } from './gfx'
import {
  MAIN_Y,
  clampMark,
  drawBed,
  drawFrame,
  ease,
  frameEdgeX,
  gripperH,
  label,
  mainSpan,
  seg,
  tensionText,
  tieOff,
  type Scene,
} from './racket'

type Pt = [number, number]

const lerp = (a: Pt, b: Pt, q: number): Pt => [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q]

/** The outside of the frame, seen close up, with grommet holes. */
function frameBand(g: Gfx, y: number, holes: number[]) {
  g.rect(0, y, 96, 5, 1)
  g.line(0, y, 96, y, 2, 2)
  for (const x of holes) {
    g.clearRect(x - 1.3, y, 2.6, 2.4)
    g.line(x - 1.6, y + 2.4, x + 1.6, y + 2.4, 2)
  }
}

/* ---------- Knots tied around the anchor ---------- */

const ANCHOR_Y = 33

/** Frame, grommets and the anchor: the string already running along the outside of the frame. */
function anchorScene(g: Gfx, name = 'anchor') {
  frameBand(g, 36, [24, 52, 72])
  g.line(24, 37, 24, ANCHOR_Y, 2, 3)
  g.line(24, ANCHOR_Y, 72, ANCHOR_Y, 2, 3)
  g.line(72, ANCHOR_Y, 72, 37, 2, 3)
  g.text(name, 66, 27.5, 2, 3.2, 'center')
}

/** Squeeze a loose knot path towards its centre, keeping the start (the hole) and moving the tail. */
function tighten(path: Pt[], cx: number, tail: Pt): Pt[] {
  return path.map(([x, y], i) =>
    i === 0 ? [x, y] : i === path.length - 1 ? tail : [cx + (x - cx) * 0.42, ANCHOR_Y + (y - ANCHOR_Y) * 0.32],
  )
}

/**
 * Draw a knot along `path`, `p` of the way along, eased towards `tight` by `q`.
 * `under` lists segments (by start index) that pass behind the anchor.
 */
function knotPath(g: Gfx, path: Pt[], tight: Pt[], under: number[], p: number, q: number, t: number, pulling: boolean) {
  const pts = path.map((pt, i) => lerp(pt, tight[i], q))
  g.polyline(pts, p, 3, 3)
  // Put the anchor back on top where the string goes underneath it
  for (const i of under) {
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    const xi = ax + ((bx - ax) * (ANCHOR_Y - ay)) / (by - ay)
    g.clearRect(xi - 1.6, ANCHOR_Y - 0.67, 3.2, 1.7)
    g.line(xi - 1.6, ANCHOR_Y, xi + 1.6, ANCHOR_Y, 2, 3)
  }
  if (pulling && t % 2 === 0) {
    const [x, y] = pts[pts.length - 1]
    g.line(x, y, x - 2, y - 0.5, 3, 2)
    g.line(x, y, x - 0.5, y - 2, 3, 2)
  }
}

/** Double half hitch: out of the hole, two half hitches, then the tail. */
const HITCH: Pt[] = [
  [52, 36],
  [52, 22],
  [46, 17],
  [42.5, 25],
  [43.5, 37.5],
  [48, 38.5],
  [49.5, 30],
  [45.5, 23],
  [38, 17],
  [34.5, 25],
  [35.5, 37.5],
  [40, 38.5],
  [41.5, 30],
  [37.5, 23],
  [22, 8],
]
const HITCH_TIGHT = tighten(HITCH, 44, [30, 19])

const doubleHalfHitch: Scene = {
  loop: 100,
  still: 90,
  draw(g, t) {
    anchorScene(g)
    knotPath(g, HITCH, HITCH_TIGHT, [3, 9], seg(t, 4, 58), ease(seg(t, 62, 74)), t, t >= 62 && t < 76)
    label(g, t < 32 ? '1st half hitch' : t < 60 ? '2nd half hitch' : t < 76 ? 'Pull tight' : 'Double half hitch')
  },
}

/**
 * Parnell knot: a half hitch with its loop left open, then around the anchor
 * again and up through that first loop from underneath.
 */
const PARNELL: Pt[] = [
  [52, 36],
  [52, 24],
  [47, 19],
  [44, 26],
  [45, 37.5],
  [49, 38],
  [50, 30],
  [47.5, 25.5],
  [41, 22],
  [38.5, 29],
  [39.5, 38],
  [44, 38.5],
  [46.5, 31],
  [46.5, 27.5],
  [34, 12],
]
const PARNELL_TIGHT = tighten(PARNELL, 46, [38, 21])
/** Where the open loop of the first half hitch sits. */
const FIRST_LOOP: Pt = [47.3, 27.8]

const parnellKnot: Scene = {
  loop: 104,
  still: 94,
  draw(g, t) {
    anchorScene(g)
    const p = 0.5 * seg(t, 4, 28) + 0.5 * seg(t, 34, 60)
    const q = ease(seg(t, 64, 76))
    // Point out the loop that the end has to come back through
    if (t >= 28 && t < 62 && t % 4 < 3) g.ellipse(FIRST_LOOP[0], FIRST_LOOP[1], 3.2, 3.2, 1, 2)
    knotPath(g, PARNELL, PARNELL_TIGHT, [3, 9], p, q, t, t >= 64 && t < 78)
    label(
      g,
      t < 30 ? 'Half hitch, loop left open' : t < 62 ? 'Around, up through the loop' : t < 78 ? 'Cinch it down' : 'Parnell knot',
    )
  },
}

/* ---------- Starting knot ---------- */

const startingKnot: Scene = {
  loop: 90,
  still: 78,
  draw(g, t, o) {
    const HOLE = 52
    anchorScene(g, 'main')

    // Cross string coming up from inside the frame, out through the hole
    g.line(HOLE, 54, HOLE, 40.6, 3, 3)
    const out = seg(t, 0, 8)
    if (t < 10) {
      g.line(HOLE, 36, HOLE, 36 - 22 * out, 3, 3)
    } else {
      g.line(HOLE, 36, 51, 28, 3, 3)
    }
    // Two loops around the main, shrinking as the knot is pulled tight
    const tight = ease(seg(t, 50, 62))
    const rx = 2 - 0.6 * tight
    const ry = 4 - 1.6 * tight
    const loops: [number, number, number][] = [
      [48.5, 10, 22],
      [44.5, 22, 34],
    ]
    for (const [x, a, b] of loops) {
      if (t < a) continue
      g.arc(x + tight * (48 - x) * 0.4, ANCHOR_Y, rx, ry, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * seg(t, a, b), 3, 3)
    }
    // Then back through the double loop and out as the tail
    if (t >= 36) {
      const k = seg(t, 36, 46)
      g.polyline(
        [
          [42, 29],
          [47, 31],
          [52, 30.5],
          [60, 24],
        ],
        k,
        3,
        3,
      )
    }

    if (t >= 50 && t < 64) {
      if (t % 2 === 0) {
        g.line(HOLE, 53, HOLE - 1.5, 51.5, 3, 2)
        g.line(HOLE, 53, HOLE + 1.5, 51.5, 3, 2)
      }
      tensionText(g, seg(t, 50, 62) * 55, o)
    } else {
      label(
        g,
        t < 10
          ? 'Out through the hole'
          : t < 36
            ? 'Loop twice around the main'
            : t < 50
              ? 'Back through the double loop'
              : 'Bulky: it cannot slip back',
      )
    }
  },
}

/* ---------- Weave one ahead ---------- */

const W_MAINS = [13, 21, 29, 37, 45]
const W_CROSSES = [14, 30, 46, 62, 78]
const W_TOP = 9
const W_BOTTOM = 49

const weaveOneAhead: Scene = {
  loop: 100,
  still: 40,
  draw(g, t) {
    // woven[j], tensioned[j] in 0..1
    const woven = W_CROSSES.map((_, j) => (j === 0 ? 1 : seg(t, (j - 1) * 22, (j - 1) * 22 + 12)))
    const tensioned = W_CROSSES.map((_, j) => (j === 0 ? 1 : seg(t, j * 22 + 12, j * 22 + 20)))
    const pulling = tensioned.findIndex((p) => p > 0 && p < 1)
    const weaving = woven.findIndex((p) => p > 0 && p < 1)

    const crossX = (j: number, y: number) => W_CROSSES[j] + 1.2 * (1 - tensioned[j]) * Math.sin((y - W_TOP) * 0.45)

    for (const y of W_MAINS) g.line(0, y, 96, y, 2, 3)
    W_CROSSES.forEach((_, j) => {
      if (woven[j] <= 0) return
      const end = W_TOP + (W_BOTTOM - W_TOP) * woven[j]
      const pts: Pt[] = []
      for (let y = W_TOP; y <= end; y += 1) pts.push([crossX(j, y), y])
      pts.push([crossX(j, end), end])
      const s: Shade = j === weaving || tensioned[j] >= 1 || (j === pulling && t % 2 === 0) ? 3 : 2
      g.polyline(pts, 1, s, 3)
      // Over/under at each main
      W_MAINS.forEach((y, i) => {
        if (y > end) return
        const x = crossX(j, y)
        if ((i + j) % 2 === 0) {
          g.clearRect(x - 1.9, y - 0.34, 3.8, 1)
          g.line(x, y - 1.2, x, y + 1.2, s, 3)
        } else {
          g.clearRect(x - 0.34, y - 1.9, 1, 3.8)
          g.line(x - 1.6, y, x + 1.6, y, 2, 3)
        }
      })
    })
    if (pulling >= 0 && t % 2 === 0) {
      const x = W_CROSSES[pulling]
      g.line(x, 52.5, x - 1.5, 51, 3, 2)
      g.line(x, 52.5, x + 1.5, 51, 3, 2)
    }
    label(g, pulling >= 0 ? 'Pull the one behind' : weaving >= 0 ? 'Weave the next cross' : 'One ahead, always')
  },
}

/* ---------- Pull slack by hand ---------- */

const pullSlack: Scene = {
  loop: 84,
  still: 50,
  draw(g, t, o) {
    const Y = 27
    const X0 = 14
    const X1 = 80
    // Frame on the left, mains crossing underneath
    g.rect(9, 0, 5, 54, 1)
    g.line(14, 0, 14, 54, 2, 2)
    g.clearRect(9, Y - 1.3, 5, 2.6)
    for (let x = 26; x < 78; x += 10) g.line(x, 0, x, 54, 1, 3)

    const sag = 16 * (1 - ease(seg(t, 4, 30)))
    const pts: Pt[] = []
    for (let i = 0; i <= 40; i++) {
      const u = i / 40
      pts.push([X0 + (X1 - X0) * u, Y + sag * Math.sin(Math.PI * u)])
    }
    const tight = t >= 34
    g.polyline(pts, 1, tight ? 3 : 2, 3)
    if (t < 30 && t % 2 === 0) {
      g.line(X1 + 4, Y, X1 + 2, Y - 2, 3, 2)
      g.line(X1 + 4, Y, X1 + 2, Y + 2, 3, 2)
    }
    if (t >= 32) {
      g.rect(X1, Y - 2.5, 5, 5, 2)
      g.line(X1 + 1, Y, X1 + 4, Y, 3, 2)
    }
    if (t >= 34 && t < 56) tensionText(g, seg(t, 34, 54) * 55, o)
    else label(g, t < 32 ? 'Pull the slack in a wide U' : 'Then the head adds tension')
  },
}

/* ---------- Extra tension at tie-offs ---------- */

const tieOffTension: Scene = {
  loop: 92,
  still: 70,
  draw(g, t, o) {
    const k = 15
    const y = MAIN_Y[k]
    drawFrame(g)
    drawBed(g, { shade: (_kind, i) => (i === k ? 3 : 2) })
    const p = 0.85 * seg(t, 4, 24) + 0.15 * seg(t, 38, 50)
    if (t < 54) {
      gripperH(g, y, mainSpan(k)[0] - 0.5, p, t)
      tensionText(g, 55 * seg(t, 4, 24) + 5.5 * seg(t, 38, 50), o)
    } else {
      clampMark(g, mainSpan(k)[0] + 1.5, y)
      label(g, 'Then tie off')
    }
    if (t >= 30 && t < 54 && t % 4 < 3) g.text('+10%', 93, 1.5, 3, 3.8, 'right')
    const kx = frameEdgeX(y, 1) + 2
    if (t >= 58) g.line(mainSpan(k)[1], y, kx, y, 3)
    tieOff(g, t, 58, kx, y, 1, 1)
  },
}

const scenes: Record<string, Scene> = {
  'double-half-hitch': doubleHalfHitch,
  'parnell-knot': parnellKnot,
  'starting-knot': startingKnot,
  'weave-one-ahead': weaveOneAhead,
  'pull-slack': pullSlack,
  'tie-off-tension': tieOffTension,
}

export const techniqueScene = (id: string): Scene | undefined => scenes[id]
