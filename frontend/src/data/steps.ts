import { HEAD_PARNELL, type Source } from './sources'

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
  /** Where the content comes from. Shown quietly at the bottom of the step. */
  sources?: Source[]
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
      'A starting clamp, for starting the crosses and pulling knots tight.',
      'An awl, for opening blocked grommets.',
      'Needle-nose pliers, for pulling knots tight.',
      'A tape measure, and the string pattern for your racket (from the manufacturer or a stringing database).',
    ],
    tips: [
      "Write down the racket's string pattern, tension range, and tie-off holes before you start. You will need them mid-job.",
      'Run the string through your hands to feel for flaws before you start, especially natural gut. Finding one halfway through wastes the whole job.',
    ],
    sources: [HEAD_PARNELL],
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
    summary: 'Firm at the sides, just touching at the head and throat.',
    minutes: 3,
    instructions: [
      'Put the throat in first. It makes the centre of the racket easier to find.',
      'Close the throat supports, then the head supports, so they just rest against the frame.',
      'Bring the side supports in firmly at 3 and 9 o’clock.',
      'Check that the racket does not rock when you push on it.',
    ],
    tips: [
      'Why firm sides and light ends: stringing the mains compresses the frame, and the crosses bring it back into shape. The supports should let that happen without distorting it.',
      'If your machine has a speed setting, use a slower pull for natural gut to protect it, and a faster one for monofilament strings such as polyester.',
      'If your mounts have a contact pad, centre it on the frame so it does not press on a grommet.',
    ],
    sources: [HEAD_PARNELL],
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
      'From the throat, feed both ends of the mains string through the two centre main holes and out at the head.',
      'Hold the two ends together to check they are the same length.',
      'Put one centre main in the tension head and pull tension.',
      'Clamp it close to the frame, then release the tension head.',
      'Repeat for the other centre main.',
    ],
    tips: [
      'Check your tension setting on the machine before the first pull. Most rackets list a range like {{23–27 kg|50–60 lb}} inside the throat.',
      'Set each clamp to the string’s gauge so it grips the string without crushing it.',
      'With natural gut, let the string twist the way it wants to go and follow it, rather than forcing it.',
    ],
    sources: [HEAD_PARNELL],
  },
  {
    id: 'string-mains',
    title: 'String the remaining mains',
    summary: 'Three on each side to catch up, then one at a time, alternating.',
    minutes: 20,
    instructions: [
      'Feed one end into the next main hole on its side, across the head or throat.',
      'Pull through the slack, tension it, clamp it, and release the previous clamp.',
      'String three mains on one side, then three on the other side, to catch up.',
      'After that, go one main at a time, alternating sides, so the frame deforms as evenly as possible.',
      'Follow your pattern for skipped holes at the head and throat. Some patterns finish the mains on different holes on each side.',
    ],
    tips: [
      'Hold the grommet strip in against the frame as you go. It protects the racket and the string, and soon becomes a habit.',
      'Keep the frame straight so each string runs as short as possible. The tension head then bites sooner, and the string bed ends up stiffer.',
      'Pull the slack through by hand before tensioning. The tension head should only add tension, not drag string through.',
    ],
    warnings: [
      'Never leave a tensioned string unclamped. Releasing the tension head before the clamp is set loses the tension and can damage the frame.',
    ],
    sources: [HEAD_PARNELL],
  },
  {
    id: 'tie-off-mains',
    related: ['parnell-knot', 'double-half-hitch', 'tie-off-tension'],
    title: 'Tie off the mains',
    summary: 'Secure each end with a knot at the designated tie-off hole.',
    minutes: 5,
    instructions: [
      'Feed the last main end out through the tie-off hole in your pattern.',
      'Lock the turntable so the racket cannot move.',
      'Tension the last main and clamp it.',
      'Tie a Parnell knot (or a double half hitch) around the anchor string, next to the grommet.',
      'Pull the knot tight. A starting clamp on the tail pulls up tension so the string outside the frame is tight too; pliers also work.',
      'Release the clamp base first, then the clamp.',
      'Repeat for the other side, then trim the tails short, to about {{6 mm|¼ in}}.',
    ],
    tips: [
      'Add extra tension to the last main before tying off, to make up for what the knot loses. Advice ranges from about 10% to the 20% HEAD recommends.',
      'With polyester and other monofilaments, flatten the cut end with the back of the cutters so it cannot catch a finger. Natural gut does not need it.',
      'Leave the tag end lying straight along the string it is tied to. Some tour players send a racket back if the knots are not done right.',
    ],
    sources: [HEAD_PARNELL],
  },
  {
    id: 'start-crosses',
    related: ['starting-knot'],
    title: 'Start the crosses',
    summary: 'Begin at the head and weave the first cross.',
    minutes: 5,
    instructions: [
      'Decide on the cross tension: the same as the mains, or your racket’s recommendation for crosses.',
      'Find the first cross hole near the head (check your pattern).',
      'Hold the start of the string with a starting clamp outside the frame, or tie a starting knot.',
      'Weave the string across the mains: over one, under the next, all the way across.',
      'Pull the slack through and tension the first cross.',
    ],
    tips: [
      'A starting clamp is the professional choice: both ends of the crosses can then be finished with Parnell knots, which look neater and are kinder to the string. Put a pad between the clamp and the frame so it does not mark it.',
      'Some stringers start on the third cross from the top and work up to the top first, which is a little easier on the string.',
      'If a starting knot slips through the grommet, loop it once more for bulk.',
    ],
    sources: [HEAD_PARNELL],
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
      'Keep going until you reach the last cross hole at the throat. The last few crosses are the hardest to weave.',
    ],
    tips: [
      'Hold each cross in a wide U across the string bed while you pull the slack through. Dragging it straight across the mains causes friction burn, which notches them.',
      'Keep every string as straight as possible. You will have less to adjust at the end, and a stiffer, more even string bed.',
      'There is no single best way to weave. It is worth learning two methods, since different strings and rackets suit different ones.',
      'Check the weave after each row. One missed over or under means re-weaving everything after it.',
    ],
    sources: [HEAD_PARNELL],
  },
  {
    id: 'tie-off-crosses',
    related: ['parnell-knot', 'double-half-hitch', 'tie-off-tension'],
    title: 'Tie off the crosses',
    summary: 'Finish the last cross with the same knot you used on the mains.',
    minutes: 3,
    instructions: [
      'Tension the last cross and clamp it.',
      'Tie a Parnell knot (or a double half hitch) around the anchor main at the tie-off hole, and seat it firmly.',
      'If you started the crosses with a starting clamp, tie the starting end at the head with a Parnell knot too, then tension it.',
      'Release the clamp base first, then the clamp, and trim the tails short.',
    ],
    sources: [HEAD_PARNELL],
  },
  {
    id: 'finish',
    title: 'Release and finish',
    summary: 'Take the racket off the machine and check your work.',
    minutes: 5,
    instructions: [
      'Release the clamps, then loosen the side, head, and throat supports.',
      'Take the racket off the machine. It should come out as easily as it went in: that means the frame has kept its shape.',
      'Straighten the mains and crosses with your fingers so the string bed is square.',
      'Check that every grommet holds the string cleanly and that no knot is loose.',
      'Write the date, string, and tension somewhere (a tag in the throat works) so you know when to restring.',
    ],
    tips: [
      'New strings lose 10–15% of their tension in the first 24 hours. That is normal.',
    ],
    sources: [HEAD_PARNELL],
  },
]

export const totalMinutes = steps.reduce((sum, step) => sum + step.minutes, 0)
