export interface Step {
  id: string
  title: string
  summary: string
  /** Rough time estimate for this step, in minutes. */
  minutes: number
  instructions: string[]
  tips?: string[]
  warnings?: string[]
  /** Ids of entries in techniques.ts that go deeper on this step. */
  related?: string[]
}

/**
 * A two-piece string job on a standard 16x19 tennis racket.
 * Kept as static data for now; this can move behind the API later.
 */
export const steps: Step[] = [
  {
    id: 'gather-tools',
    title: 'Gather your tools',
    summary: 'Get everything within reach before you cut a single string.',
    minutes: 5,
    instructions: [
      'Stringing machine with mounting supports and two clamps (fixed or flying).',
      'A set of string: about {{12 m|40 ft}} for a two-piece job, or a hybrid set with separate mains and crosses.',
      'Sharp string cutters or flush cutters.',
      'An awl or a starting clamp, for opening blocked grommets and tensioning the first cross.',
      'Needle-nose pliers, for pulling knots tight.',
      'A tape measure, and the string pattern for your racket (from the manufacturer or a stringing database).',
    ],
    tips: [
      "Write down the racket's string pattern, tension range, and tie-off holes before you start. You will need them mid-job.",
    ],
  },
  {
    id: 'remove-old-strings',
    title: 'Cut out the old strings',
    summary: 'Release the tension evenly so the frame does not warp.',
    minutes: 5,
    instructions: [
      'Start in the centre of the string bed and cut outwards in a circular pattern.',
      'Cut a main and a cross together where they intersect, working out towards the frame.',
      'Once the tension is gone, pull the remaining string segments out of the grommets.',
    ],
    warnings: [
      'Never cut only the mains or only the crosses. Uneven release puts the frame under uneven stress and can deform or crack it.',
    ],
  },
  {
    id: 'inspect-frame',
    title: 'Inspect the frame and grommets',
    summary: 'Catch damage now, while there are no strings in the way.',
    minutes: 3,
    instructions: [
      'Look over the frame for cracks, especially around the throat and the 10 and 2 o’clock positions.',
      'Check each grommet. Split, flattened, or missing grommets will cut new strings.',
      'Replace a damaged grommet strip before you continue.',
    ],
    warnings: [
      'Do not string a cracked frame. Tension will make the crack worse and the racket may break during stringing.',
    ],
  },
  {
    id: 'mount-racket',
    title: 'Mount the racket',
    summary: 'Hold the frame firmly at the head, throat and sides.',
    minutes: 3,
    instructions: [
      'Line the racket up so the head points at the tension head.',
      'Tighten the head and throat supports until they touch the frame. Snug, not cranked.',
      'Bring the side supports in at 3 and 9 o’clock until they just touch the frame.',
      'Check that the racket does not rock when you push on it.',
    ],
    tips: [
      'If your mounts have a contact pad, centre it on the frame so it does not press on a grommet.',
    ],
  },
  {
    id: 'measure-string',
    title: 'Measure and cut the string',
    summary: 'Split the set into one length for the mains and one for the crosses.',
    minutes: 2,
    instructions: [
      'For a 16x19 pattern, measure about {{6 m|20 ft}} for the mains.',
      'Cut the rest of the set (about {{6 m|20 ft}}) for the crosses.',
      'Cut each end at a sharp angle. A pointed tip feeds through grommets much more easily.',
    ],
    tips: [
      'Denser patterns like 18x20 need about {{0.5 m|2 ft}} more on each piece. Check the manufacturer’s recommendation.',
    ],
  },
  {
    id: 'install-center-mains',
    title: 'Install the centre mains',
    summary: 'Split the mains string evenly through the two centre holes.',
    minutes: 5,
    instructions: [
      'From the head, feed both ends of the mains string through the two centre main holes.',
      'Pull them through the throat and even out the two ends so they are the same length.',
      'Put one centre main in the tension head and pull tension.',
      'Clamp it close to the throat frame, then release the tension head.',
      'Repeat for the other centre main.',
    ],
    tips: [
      'Check your tension setting on the machine before the first pull. Most rackets list a range like {{23–27 kg|50–60 lb}} inside the throat.',
    ],
  },
  {
    id: 'string-mains',
    title: 'String the remaining mains',
    summary: 'Work outwards, alternating sides, one main at a time.',
    minutes: 20,
    instructions: [
      'Feed one end into the next main hole on its side, across the head or throat.',
      'Pull through the slack, tension it, clamp it, and release the previous clamp.',
      'Switch to the other side and do the same. Keep alternating so the frame loads evenly.',
      'Follow your pattern for skipped holes at the head and throat. Some patterns finish the mains on different holes on each side.',
    ],
    tips: [
      'Pull the slack through by hand before tensioning. The tension head should only add tension, not drag string through.',
    ],
    warnings: [
      'Never leave a tensioned string unclamped. Releasing the tension head before the clamp is set loses the tension and can damage the frame.',
    ],
  },
  {
    id: 'tie-off-mains',
    related: ['double-half-hitch', 'parnell-knot', 'tie-off-tension'],
    title: 'Tie off the mains',
    summary: 'Secure each end with a knot at the designated tie-off hole.',
    minutes: 5,
    instructions: [
      'Feed the last main end out through the tie-off hole in your pattern.',
      'Tension the last main and clamp it.',
      'Tie a double half hitch (or a Parnell knot) around the anchor string, next to the grommet.',
      'Pull the knot tight with pliers, or tension the tag end lightly to seat it.',
      'Repeat for the other side, then trim the tails to about {{6 mm|¼ in}}.',
    ],
    tips: [
      'Many stringers add about 10% tension to the last string before tying off, to make up for the tension lost in the knot.',
    ],
  },
  {
    id: 'start-crosses',
    related: ['starting-knot'],
    title: 'Start the crosses',
    summary: 'Begin at the head and weave the first cross.',
    minutes: 5,
    instructions: [
      'Find the first cross hole near the head (check your pattern).',
      'Tie a starting knot on the outside of the frame, or use a starting clamp.',
      'Weave the string across the mains: over one, under the next, all the way across.',
      'Pull the slack through and tension the first cross.',
    ],
    tips: [
      'If the starting knot slips through the grommet, loop it once more for bulk, or hold the first cross with a starting clamp instead.',
    ],
  },
  {
    id: 'string-crosses',
    related: ['weave-one-ahead', 'pull-slack'],
    title: 'Weave and tension the crosses',
    summary: 'Work from the head to the throat, alternating the weave each row.',
    minutes: 25,
    instructions: [
      'Weave the next cross in the opposite pattern: under where the last one went over.',
      'Pull the slack through, tension, clamp, and release the previous clamp.',
      'Weave one cross ahead of the one you are tensioning, so the mains stay straight.',
      'Keep going until you reach the last cross hole at the throat.',
    ],
    tips: [
      'Hold each cross in a wide U across the string bed while you pull the slack through. Dragging it straight across the mains causes friction burn, which notches them.',
      'Check the weave after each row. One missed over or under means re-weaving everything after it.',
    ],
  },
  {
    id: 'tie-off-crosses',
    related: ['double-half-hitch', 'parnell-knot', 'tie-off-tension'],
    title: 'Tie off the crosses',
    summary: 'Finish the last cross with the same knot you used on the mains.',
    minutes: 3,
    instructions: [
      'Tension the last cross and clamp it.',
      'Tie a double half hitch (or a Parnell knot) around the anchor main at the tie-off hole.',
      'Seat the knot firmly with pliers.',
      'Trim the tail to about {{6 mm|¼ in}}.',
    ],
  },
  {
    id: 'finish',
    title: 'Release and finish',
    summary: 'Take the racket off the machine and check your work.',
    minutes: 5,
    instructions: [
      'Release the clamps, then loosen the side, head, and throat supports.',
      'Take the racket off the machine.',
      'Straighten the mains and crosses with your fingers so the string bed is square.',
      'Check that every grommet holds the string cleanly and that no knot is loose.',
      'Write the date, string, and tension somewhere (a tag in the throat works) so you know when to restring.',
    ],
    tips: [
      'New strings lose 10–15% of their tension in the first 24 hours. That is normal.',
    ],
  },
]

export const totalMinutes = steps.reduce((sum, step) => sum + step.minutes, 0)
