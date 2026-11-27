import { HEAD_PARNELL, type Source } from './sources'

export type { Source } from './sources'

export interface Technique {
  id: string
  kind: 'knot' | 'technique'
  title: string
  summary: string
  instructions: string[]
  tips?: string[]
  /** Where the content comes from. Shown quietly at the bottom of each entry. */
  sources: Source[]
}

const HOLABIRD_FRICTION: Source = {
  title: 'Holabird Sports: Can pulling cross strings through too quickly damage a racquet?',
  url: 'https://www.holabirdsports.com/blogs/news/ask-the-stringer-can-pulling-cross-strings-through-too-quickly-damage-a-racquet',
}

/** Measurements are written as {{metric|imperial}}; see fmt() in src/units.ts. */
export const techniques: Technique[] = [
  {
    id: 'double-half-hitch',
    kind: 'knot',
    title: 'Double half hitch',
    summary: 'The most common tie-off knot: two half hitches around the anchor string.',
    instructions: [
      'Bring the string out through the tie-off hole, leaving about {{20 cm|8 in}} of tail.',
      'Find the anchor: the string already running along the outside of the frame next to the hole.',
      'Pass the tail under the anchor and back over it, then through the loop you just made. That is one half hitch.',
      'Tie a second half hitch the same way, on the same anchor, right next to the first.',
      'Pull the knot tight against the frame with pliers, then trim the tail to about {{6 mm|¼ in}}.',
    ],
    tips: ['Keep tension on the string while you tie. A loose knot lets the last string go slack.'],
    sources: [
      { title: 'Wikipedia: Two half-hitches', url: 'https://en.wikipedia.org/wiki/Two_half-hitches' },
    ],
  },
  {
    id: 'parnell-knot',
    kind: 'knot',
    title: 'Parnell knot',
    summary: 'A compact tie-off knot, devised by master stringer Richard Parnell, that protects the anchor string.',
    instructions: [
      'Lock the turntable so the racket cannot move.',
      'Bring the string out through the tie-off hole and take it around the anchor string.',
      'Make a half hitch around the anchor, but leave a small loop instead of pulling it tight.',
      'Make a second half hitch through that loop: around the anchor again and up through the loop from underneath.',
      'Pull it tight with a starting clamp on the tail, so the string outside the frame is tight too. Release the clamp base first, then the clamp.',
      'Cut the tail short. With polyester, flatten the end with the back of the cutters; natural gut does not need it.',
    ],
    tips: [
      'What matters is that the end finishes through the first loop you made. If it does, the knot holds.',
      'Leave the tag end lying straight along the string it is tied to, so every knot looks the same.',
      'HEAD calls it one of the two most used knots in professional stringing, and one of the two official knots at Wimbledon. For the exact hand movements, watch Richard Parnell tie it himself.',
    ],
    sources: [
      HEAD_PARNELL,
      {
        title: 'Tennisnerd: Interview with Richard Parnell',
        url: 'https://www.tennisnerd.net/tennisinstruction/interview-with-richard-parnell/15342',
      },
      { title: 'Richard Parnell: video tutorials', url: 'http://www.parnellknot.com/video-tutorials/' },
      { title: 'Talk Tennis forum: Parnell knot', url: 'https://tt.tennis-warehouse.com/index.php?threads/parnell-knot.751797/' },
    ],
  },
  {
    id: 'starting-knot',
    kind: 'knot',
    title: 'Starting knot',
    summary: 'A bulky knot at the start of the crosses that will not pull back through the grommet.',
    instructions: [
      'Bring the start of the cross string out through the first cross hole, leaving about {{20 cm|8 in}} of tail.',
      'Loop the end twice around the neighbouring main, holding the loops open with a finger.',
      'Thread the end back through the double loop.',
      'Pull it tight from both sides so the knot is as compact and bulky as possible. Tensioning the first cross tightens it further.',
      'Trim the tail to about {{6 mm|¼ in}}.',
    ],
    tips: [
      'With slippery strings or large grommet holes, loop it one extra time for more bulk.',
      'Or skip the knot: hold the first cross with a starting clamp, tension a few crosses, then tie a normal tie-off knot at the start. HEAD recommends this, so every knot can be a Parnell knot.',
    ],
    sources: [
      {
        title: 'Holabird Sports: How can I stop my starting knot pulling back through the grommet?',
        url: 'https://www.holabirdsports.com/blogs/news/ask-the-stringer-how-can-i-stop-my-cross-string-starting-knot-from-pulling-back-through-the-grommet',
      },
      HEAD_PARNELL,
      {
        title: 'WonderHowTo: Start crosses with a starting knot',
        url: 'https://tennis-lessons.wonderhowto.com/how-to/start-crosses-tennis-racket-with-starting-knot-243998',
      },
    ],
  },
  {
    id: 'weave-one-ahead',
    kind: 'technique',
    title: 'Weave one ahead',
    summary: 'Weave the next cross before you tension the current one.',
    instructions: [
      'Weave the next cross in the opposite pattern to the last one, leaving a loop long enough to pull tension on.',
      'Only then tension the previous cross, clamp it, and release the clamp before it.',
      'Repeat: there is always one woven but untensioned cross ahead of the one you pull.',
    ],
    tips: ['It cuts friction between the strings and makes the crosses easier to weave.'],
    sources: [HOLABIRD_FRICTION],
  },
  {
    id: 'pull-slack',
    kind: 'technique',
    title: 'Pull the slack in a wide U',
    summary: 'Pull each cross through without dragging it across the mains.',
    instructions: [
      'After weaving a cross, push it into a wide U across the string bed with your other hand.',
      'Hold it there while you pull the slack through.',
      'Only then put it in the tension head, which should add tension, not drag string through.',
    ],
    tips: [
      'Dragging a cross straight across the mains causes friction burn: it notches the mains and shortens the life of the string job.',
      'With stiff polyester, a piece of tape on the fingertip that holds the U saves your skin.',
    ],
    sources: [HOLABIRD_FRICTION],
  },
  {
    id: 'tie-off-tension',
    kind: 'technique',
    title: 'Extra tension at tie-offs',
    summary: 'Add some tension to the last string before you tie it off.',
    instructions: [
      'When you reach the last main or the last cross, raise the tension. About 10% is common: at {{25 kg|55 lb}} that is about {{27.5 kg|60 lb}}.',
      'Tension and clamp the string as usual.',
      'Tie it off with a Parnell knot or a double half hitch, using a starting clamp to pull the knot tight.',
    ],
    tips: [
      'Knots lose some tension as they seat, and the extra makes up for it. Advice varies: HEAD recommends 20%, so the last strings are as tight as possible.',
    ],
    sources: [
      {
        title: 'PlayTennis: How to string a tennis racket',
        url: 'https://playtennis.sg/online-tennis-education/how-to-string-a-tennis-racket',
      },
      HEAD_PARNELL,
    ],
  },
]
