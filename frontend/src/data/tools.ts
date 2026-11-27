import type { Source } from './techniques'

export interface Tool {
  id: string
  name: string
  group: 'Machine' | 'Hand tools' | 'Supplies'
  /** Phrases in the guide's text that link here (lower case unless an acronym). */
  aliases: string[]
  /** One line; also the hover text on links. */
  summary: string
  details: string[]
  tips?: string[]
  /** Needed for every job, or nice to have. */
  essential: boolean
  sources?: Source[]
}

const HOLABIRD_START: Source = {
  title: 'Holabird Sports: How can I stop my starting knot pulling back through the grommet?',
  url: 'https://www.holabirdsports.com/blogs/news/ask-the-stringer-how-can-i-stop-my-cross-string-starting-knot-from-pulling-back-through-the-grommet',
}
const PLAYTENNIS: Source = {
  title: 'PlayTennis: How to string a tennis racket',
  url: 'https://playtennis.sg/online-tennis-education/how-to-string-a-tennis-racket',
}

/** Measurements are written as {{metric|imperial}}; see fmt() in src/units.ts. */
export const tools: Tool[] = [
  {
    id: 'stringing-machine',
    name: 'Stringing machine',
    group: 'Machine',
    aliases: ['stringing machine', 'machine'],
    summary: 'Holds the racket still and pulls each string to an exact tension.',
    details: [
      'Every machine has three parts: mounting supports that hold the frame, clamps that hold strings at tension, and a tension head that does the pulling.',
      'Machines differ mostly in how they pull. A drop-weight machine uses a weighted bar that you level by hand. A crank (lockout) machine pulls with a spring and locks once it reaches the tension. An electronic constant-pull machine keeps pulling as the string stretches, which is the most consistent.',
    ],
    tips: ['Check the tension setting before every job. It is the easiest thing to get wrong.'],
    essential: true,
  },
  {
    id: 'tension-head',
    name: 'Tension head',
    group: 'Machine',
    aliases: ['tension head'],
    summary: 'The part of the machine that grips a string and pulls it to tension.',
    details: [
      'You feed the string into its gripper, pull the tension, clamp the string, then release the head.',
      'It should only add tension. Pull the slack through by hand first, so the head is not dragging string across the mains.',
    ],
    essential: true,
  },
  {
    id: 'mounting-supports',
    name: 'Mounting supports',
    group: 'Machine',
    aliases: ['mounting supports', 'mounting support', 'supports', 'side supports', 'head support', 'throat support'],
    summary: 'Hold the frame at the head, throat and sides so it keeps its shape under tension.',
    details: [
      'Two-point systems hold the head and throat; six-point systems add supports at the sides. More points spread the load on the frame more evenly.',
      'Supports should touch the frame firmly without squeezing it.',
    ],
    essential: true,
  },
  {
    id: 'clamps',
    name: 'Clamps',
    group: 'Machine',
    aliases: ['clamps', 'clamp', 'fixed clamps', 'flying clamps'],
    summary: 'Hold a string at tension after the tension head lets go.',
    details: [
      'Fixed clamps are mounted on the machine and lock onto a single string. Flying clamps are not attached to anything and hold two neighbouring strings together.',
      'Clamp close to the frame. The further the clamp is from the frame, the more tension is lost when it releases.',
    ],
    tips: ['Never release the tension head before the clamp is set.'],
    essential: true,
  },
  {
    id: 'starting-clamp',
    name: 'Starting clamp',
    group: 'Hand tools',
    aliases: ['starting clamp', 'starting clamps'],
    summary: 'A small separate clamp that holds a string outside the frame.',
    details: [
      'Used to start the crosses without a starting knot, to back up a clamp that slips, and to hold the last string while you tie it off.',
    ],
    essential: false,
    sources: [HOLABIRD_START, PLAYTENNIS],
  },
  {
    id: 'awl',
    name: 'Awl',
    group: 'Hand tools',
    aliases: ['awl'],
    summary: 'A pointed tool for opening blocked grommets and making room for a string.',
    details: [
      'Push it gently through a grommet hole that is already holding a string, to make space for the second one.',
      'Also handy for lifting a main when a tight cross is hard to weave.',
    ],
    tips: ['Go gently. Forcing an awl can split a grommet or nick a string.'],
    essential: false,
  },
  {
    id: 'cutters',
    name: 'String cutters',
    group: 'Hand tools',
    aliases: ['string cutters', 'flush cutters', 'cutters'],
    summary: 'Sharp cutters for cutting string to length and trimming knots.',
    details: [
      'Cut each end at a sharp angle so it feeds through the grommets.',
      'Flush cutters trim knot tails close and clean.',
    ],
    essential: true,
  },
  {
    id: 'pliers',
    name: 'Needle-nose pliers',
    group: 'Hand tools',
    aliases: ['needle-nose pliers', 'pliers'],
    summary: 'For pulling knots tight and gripping string in tight spots.',
    details: ['Grip the tail of the knot, not the string you are keeping, so you do not crush it.'],
    essential: true,
  },
  {
    id: 'tape-measure',
    name: 'Tape measure',
    group: 'Hand tools',
    aliases: ['tape measure'],
    summary: 'For measuring the mains and crosses before you cut.',
    details: ['Measure twice. A piece that is too short cannot be fixed.'],
    essential: true,
  },
  {
    id: 'string-set',
    name: 'String sets and reels',
    group: 'Supplies',
    aliases: ['set of string', 'reel', 'reels'],
    summary: 'Sold in single sets for one racket, or reels for many.',
    details: [
      'A set is about {{12 m|40 ft}}, enough for one racket. Reels (often {{200 m|660 ft}}) are cheaper per job if you string often.',
      'A hybrid set has a different string for the mains and the crosses.',
    ],
    essential: true,
  },
]
