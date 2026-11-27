export interface Technique {
  id: string
  kind: 'knot' | 'technique'
  title: string
  summary: string
  instructions: string[]
  tips?: string[]
}

/** Measurements are written as {{metric|imperial}}; see fmt() in src/units.ts. */
export const techniques: Technique[] = [
  {
    id: 'double-half-hitch',
    kind: 'knot',
    title: 'Double half hitch',
    summary: 'The standard tie-off knot: two half hitches around the anchor string.',
    instructions: [
      'Bring the string out through the tie-off hole, leaving about {{20 cm|8 in}} of tail.',
      'Find the anchor: the string already running along the outside of the frame next to the hole.',
      'Pass the tail under the anchor and back over it, then through the loop you just made. That is one half hitch.',
      'Tie a second half hitch the same way, on the same anchor, right next to the first.',
      'Pull the knot tight against the frame with pliers, then trim the tail to about {{6 mm|¼ in}}.',
    ],
    tips: ['Keep tension on the string while you tie. A loose knot lets the last string go slack.'],
  },
  {
    id: 'starting-knot',
    kind: 'knot',
    title: 'Starting knot (jumbo knot)',
    summary: 'A bulky knot at the start of the crosses that cannot pull back through the grommet.',
    instructions: [
      'Cut a scrap of string about {{10 cm|4 in}} long.',
      'Bring the start of the cross string out through the first cross hole.',
      'Tie a double half hitch around the scrap, close to the frame.',
      'Pull it tight and trim the scrap ends to about {{6 mm|¼ in}}.',
      'Pull on the string from inside the frame. The knot seats against the grommet and holds.',
    ],
    tips: [
      'If you have a starting clamp, you can use it outside the frame to hold the first cross instead, then tie a normal knot later.',
    ],
  },
  {
    id: 'weave-one-ahead',
    kind: 'technique',
    title: 'Weave one ahead',
    summary: 'Weave the next cross before you tension the current one.',
    instructions: [
      'Weave the next cross in the opposite pattern to the last one.',
      'Only then tension the previous cross, clamp it, and release the clamp before it.',
      'Repeat: there is always one woven but untensioned cross ahead of the one you pull.',
    ],
    tips: ['The cross ahead holds the mains in line, so pulling the one behind it does not drag them out of place.'],
  },
  {
    id: 'pull-slack',
    kind: 'technique',
    title: 'Pull the slack by hand',
    summary: 'Pull the string through slowly and straight before the tension head takes over.',
    instructions: [
      'After feeding a string, pull all the slack through by hand.',
      'Pull slowly, in a straight line, without sawing the string back and forth.',
      'Only then put it in the tension head. The head should add tension, not drag string through.',
    ],
    tips: [
      'Dragging a long cross quickly over the mains causes friction burn: heat and small nicks that weaken the mains, especially with polyester.',
    ],
  },
  {
    id: 'tie-off-tension',
    kind: 'technique',
    title: 'Extra tension at tie-offs',
    summary: 'Add about 10% to the last string before you tie it off.',
    instructions: [
      'When you reach the last main or the last cross, raise the tension by about 10%. At {{25 kg|55 lb}} that is about {{27.5 kg|60 lb}}.',
      'Tension and clamp the string as usual.',
      'Tie it off with a double half hitch.',
    ],
    tips: ['Knots lose some tension as they seat. The extra 10% makes up for it, so the last string matches the rest.'],
  },
]
