import type { Source } from './sources'

export type TermCategory = 'Racket' | 'Strings' | 'Stringing' | 'Matches'

export interface Term {
  id: string
  term: string
  category: TermCategory
  /**
   * Phrases in the site's text that link here. Lower case matches any case;
   * an all-caps alias (ATP) only matches as written.
   */
  aliases: string[]
  /** One or two sentences; also the hover text on links. */
  definition: string
  details?: string
  /** Ids of other terms, tools or techniques. */
  related?: string[]
}

export const TERM_CATEGORIES: TermCategory[] = ['Racket', 'Strings', 'Stringing', 'Matches']

export const glossarySources: Source[] = [
  { title: 'Wikipedia: Strings (tennis)', url: 'https://en.wikipedia.org/wiki/Strings_(tennis)' },
  { title: 'Wikipedia: Glossary of tennis terms', url: 'https://en.wikipedia.org/wiki/Glossary_of_tennis_terms' },
]

/** Measurements are written as {{metric|imperial}}; see fmt() in src/units.ts. */
export const glossary: Term[] = [
  /* ---------- Racket ---------- */
  {
    id: 'frame',
    term: 'Frame',
    category: 'Racket',
    aliases: ['frame', 'frames'],
    definition: 'The racket itself, without strings: head, throat and handle.',
    related: ['head', 'throat', 'grommets'],
  },
  {
    id: 'head',
    term: 'Head',
    category: 'Racket',
    aliases: ['head'],
    definition: 'The oval part of the frame that holds the strings. Its top end is also called the head.',
    related: ['frame', 'throat', 'string-bed'],
  },
  {
    id: 'throat',
    term: 'Throat',
    category: 'Racket',
    aliases: ['throat'],
    definition: 'Where the head meets the handle; the bottom end of the string bed.',
    related: ['head', 'frame'],
  },
  {
    id: 'grommets',
    term: 'Grommets',
    category: 'Racket',
    aliases: ['grommets', 'grommet', 'grommet strip', 'grommet holes', 'grommet hole'],
    definition: 'Plastic sleeves in the frame’s string holes that protect the strings from the frame’s edges.',
    details: 'Split, flattened or missing grommets cut new strings, so replace a worn grommet strip before stringing.',
    related: ['awl', 'frame', 'tie-off-hole'],
  },
  {
    id: 'tie-off-hole',
    term: 'Tie-off hole',
    category: 'Racket',
    aliases: ['tie-off hole', 'tie-off holes'],
    definition: 'A hole the manufacturer specifies for finishing a string with a knot.',
    details: 'Tie-off holes are usually large enough to take a knot and a second string. Check the racket’s stringing instructions.',
    related: ['tie-off', 'double-half-hitch', 'parnell-knot'],
  },

  /* ---------- Strings ---------- */
  {
    id: 'mains',
    term: 'Mains',
    category: 'Strings',
    aliases: ['mains', 'main', 'main strings', 'main string'],
    definition: 'The strings that run the length of the racket, from head to throat. They are strung first.',
    related: ['crosses', 'string-pattern', 'string-bed'],
  },
  {
    id: 'crosses',
    term: 'Crosses',
    category: 'Strings',
    aliases: ['crosses', 'cross', 'cross strings', 'cross string'],
    definition: 'The strings that run across the racket, woven over and under the mains.',
    related: ['mains', 'weave', 'weave-one-ahead'],
  },
  {
    id: 'string-bed',
    term: 'String bed',
    category: 'Strings',
    aliases: ['string bed'],
    definition: 'All the strings together: the hitting surface.',
    related: ['mains', 'crosses', 'string-pattern'],
  },
  {
    id: 'string-pattern',
    term: 'String pattern',
    category: 'Strings',
    aliases: ['string pattern', '16x19', '18x20'],
    definition: 'The number of mains and crosses. 16x19 means 16 mains and 19 crosses.',
    details:
      'Open patterns (fewer strings, like 16x19) give more spin and feel; dense patterns (like 18x20) give more control and make strings last longer. Denser patterns also need a little more string.',
    related: ['mains', 'crosses', 'skipped-holes'],
  },
  {
    id: 'anchor',
    term: 'Anchor string',
    category: 'Strings',
    aliases: ['anchor string', 'anchor main', 'anchor'],
    definition: 'The string already running along the outside of the frame next to a tie-off hole; knots are tied around it.',
    related: ['tie-off', 'double-half-hitch', 'parnell-knot'],
  },
  {
    id: 'gauge',
    term: 'Gauge',
    category: 'Strings',
    aliases: ['gauge'],
    definition: 'String thickness. Higher numbers are thinner: a 17 gauge string (about 1.25 mm) is thinner than a 16 (about 1.30 mm).',
    details: 'Thinner strings give more feel and spin but break sooner.',
    related: ['polyester', 'multifilament'],
  },
  {
    id: 'tension',
    term: 'Tension',
    category: 'Strings',
    aliases: ['tension'],
    definition: 'How tightly each string is pulled, set on the machine in pounds or kilograms.',
    details:
      'Lower tension gives more power and a softer feel; higher tension gives more control. Most rackets print a recommended range inside the throat, such as {{23–27 kg|50–60 lb}}.',
    related: ['tension-loss', 'tension-head', 'stringing-machine'],
  },
  {
    id: 'tension-loss',
    term: 'Tension loss',
    category: 'Strings',
    aliases: ['tension loss', 'tension lost', 'lose tension'],
    definition: 'Strings relax after stringing, so the bed is always a little looser than the machine setting.',
    details: 'Most of the loss happens in the first day. Knots and slow clamping lose a little more.',
    related: ['tension', 'tie-off-tension', 'polyester'],
  },
  {
    id: 'polyester',
    term: 'Polyester',
    category: 'Strings',
    aliases: ['polyester', 'poly'],
    definition: 'A stiff, durable string popular for spin. It loses tension faster and is harder on the arm.',
    related: ['multifilament', 'natural-gut', 'hybrid', 'friction-burn', 'gauge'],
  },
  {
    id: 'multifilament',
    term: 'Multifilament',
    category: 'Strings',
    aliases: ['multifilament'],
    definition: 'A soft string made of many fine fibres, closer in feel to natural gut and easier on the arm.',
    related: ['polyester', 'natural-gut', 'synthetic-gut'],
  },
  {
    id: 'synthetic-gut',
    term: 'Synthetic gut',
    category: 'Strings',
    aliases: ['synthetic gut'],
    definition: 'An inexpensive, all-round nylon string. Despite the name, it contains no gut.',
    related: ['natural-gut', 'multifilament'],
  },
  {
    id: 'natural-gut',
    term: 'Natural gut',
    category: 'Strings',
    aliases: ['natural gut'],
    definition: 'The original string, made from animal intestine. The most elastic and best at holding tension, but expensive and sensitive to moisture.',
    details: 'Check it for flaws before you start, string it at a slower machine speed, and let it twist the way it wants to go.',
    related: ['multifilament', 'hybrid'],
  },
  {
    id: 'hybrid',
    term: 'Hybrid',
    category: 'Strings',
    aliases: ['hybrid', 'hybrid set'],
    definition: 'Different strings in the mains and the crosses, such as polyester mains with natural gut crosses.',
    details: 'A hybrid is always strung two-piece.',
    related: ['two-piece', 'polyester', 'natural-gut'],
  },

  {
    id: 'monofilament',
    term: 'Monofilament',
    category: 'Strings',
    aliases: ['monofilament', 'monofilaments'],
    definition: 'A string with a single solid core, such as polyester. Its cut ends can be sharp, so flatten them after trimming.',
    related: ['polyester', 'multifilament'],
  },
  {
    id: 'string-bed-stiffness',
    term: 'String bed stiffness',
    category: 'Strings',
    aliases: ['string bed stiffness', 'stiffer'],
    definition: 'How firm the strung racket feels. Straight strings and short pulls keep it high, which gives more control.',
    related: ['string-bed', 'tension'],
  },

  /* ---------- Stringing ---------- */
  {
    id: 'turntable',
    term: 'Turntable',
    category: 'Stringing',
    aliases: ['turntable'],
    definition: 'The part of the machine the racket is mounted on. It rotates so you can reach each string; lock it while tying knots.',
    related: ['stringing-machine', 'mounting-supports'],
  },
  {
    id: 'clamp-base',
    term: 'Clamp base',
    category: 'Stringing',
    aliases: ['clamp base', 'clamp bases'],
    definition: 'What holds a fixed clamp in place on the machine. When letting go of a string, release the base first, then the clamp.',
    related: ['clamps'],
  },
  {
    id: 'two-piece',
    term: 'Two-piece stringing',
    category: 'Stringing',
    aliases: ['two-piece'],
    definition: 'The mains and crosses are strung with separate lengths of string, with four knots in total. This guide uses it.',
    related: ['one-piece', 'hybrid', 'starting-knot'],
  },
  {
    id: 'one-piece',
    term: 'One-piece stringing',
    category: 'Stringing',
    aliases: ['one-piece', 'around the world', 'ATW'],
    definition: 'Mains and crosses strung with a single length of string. "Around the world" (ATW) is a popular one-piece method.',
    related: ['two-piece'],
  },
  {
    id: 'weave',
    term: 'Weave',
    category: 'Stringing',
    aliases: ['weave', 'weaving', 'woven'],
    definition: 'Passing a cross over one main and under the next, alternating, with each cross the opposite of the one before.',
    details: 'One missed over or under means re-weaving everything after it, so check each row.',
    related: ['crosses', 'weave-one-ahead'],
  },
  {
    id: 'skipped-holes',
    term: 'Skipped holes',
    category: 'Stringing',
    aliases: ['skipped holes', 'skipped hole'],
    definition: 'Holes in the head or throat that the mains pass by, as set out in the string pattern.',
    related: ['string-pattern'],
  },
  {
    id: 'tie-off',
    term: 'Tie off',
    category: 'Stringing',
    aliases: ['tie off', 'tie-off', 'tying off', 'tie it off', 'tied off'],
    definition: 'Finishing a string with a knot around the anchor string at a tie-off hole.',
    related: ['double-half-hitch', 'parnell-knot', 'tie-off-tension', 'tie-off-hole'],
  },
  {
    id: 'half-hitch',
    term: 'Half hitch',
    category: 'Stringing',
    aliases: ['half hitch', 'half hitches'],
    definition: 'The basic loop of most tie-off knots: around the anchor and back through itself.',
    related: ['double-half-hitch', 'parnell-knot', 'anchor'],
  },
  {
    id: 'friction-burn',
    term: 'Friction burn',
    category: 'Stringing',
    aliases: ['friction burn', 'string burn'],
    definition: 'Heat damage and notches on the mains from dragging a cross across them too fast.',
    related: ['pull-slack', 'notching', 'polyester'],
  },
  {
    id: 'notching',
    term: 'Notching',
    category: 'Stringing',
    aliases: ['notching', 'notches', 'notch'],
    definition: 'Grooves worn into the mains where the crosses rub, from play or from friction burn.',
    related: ['friction-burn'],
  },
  {
    id: 'constant-pull',
    term: 'Constant pull',
    category: 'Stringing',
    aliases: ['constant-pull', 'constant pull', 'lockout'],
    definition: 'A tension head that keeps pulling while the string stretches, unlike a lockout head that stops once it reaches tension.',
    related: ['stringing-machine', 'tension-head', 'drop-weight'],
  },
  {
    id: 'drop-weight',
    term: 'Drop-weight',
    category: 'Stringing',
    aliases: ['drop-weight', 'drop weight'],
    definition: 'A simple tension mechanism: a weight on a bar that you level by hand to set the tension.',
    related: ['stringing-machine', 'constant-pull'],
  },

  /* ---------- Matches ---------- */
  {
    id: 'singles',
    term: 'Singles',
    category: 'Matches',
    aliases: ['singles'],
    definition: 'One player on each side. The live tennis page shows men’s and women’s singles only.',
    related: ['draw', 'atp', 'wta', 'tiebreak'],
  },
  {
    id: 'atp',
    term: 'ATP',
    category: 'Matches',
    aliases: ['ATP'],
    definition: 'The men’s professional tour (Association of Tennis Professionals).',
    related: ['wta', 'grand-slam', 'group-stage'],
  },
  {
    id: 'wta',
    term: 'WTA',
    category: 'Matches',
    aliases: ['WTA'],
    definition: 'The women’s professional tour (Women’s Tennis Association).',
    related: ['atp', 'grand-slam', 'group-stage'],
  },
  {
    id: 'grand-slam',
    term: 'Grand Slam',
    category: 'Matches',
    aliases: ['grand slams', 'grand slam', 'slams'],
    definition: 'The four biggest tournaments: the Australian Open, Roland Garros, Wimbledon and the US Open.',
    details: 'Men play best of five sets there. They are combined events, with men’s and women’s draws at the same time.',
    related: ['atp', 'wta', 'draw'],
  },
  {
    id: 'draw',
    term: 'Draw',
    category: 'Matches',
    aliases: ['main draw', 'draws', 'draw'],
    definition: 'The bracket of who plays whom. The main draw is the tournament proper; qualifying comes before it.',
    related: ['seed', 'qualifying', 'singles'],
  },
  {
    id: 'seed',
    term: 'Seed',
    category: 'Matches',
    aliases: ['seeded', 'seeds', 'seed'],
    definition: 'A top-ranked player placed in the draw so they cannot meet each other early. Shown as a number in brackets, like (1).',
    related: ['draw'],
  },
  {
    id: 'qualifying',
    term: 'Qualifying',
    category: 'Matches',
    aliases: ['qualifying', 'qualifiers', 'qualifier'],
    definition: 'A short tournament before the main draw; the winners (qualifiers) take the last places in it.',
    related: ['draw'],
  },
  {
    id: 'group-stage',
    term: 'Group stage',
    category: 'Matches',
    aliases: ['group stage', 'round robin'],
    definition: 'At the season-ending ATP and WTA Finals, players first play everyone in a group of four; the best two of each group reach the semifinals.',
    related: ['atp', 'wta'],
  },
  {
    id: 'tiebreak',
    term: 'Tiebreak',
    category: 'Matches',
    aliases: ['tiebreaks', 'tiebreak', 'tie-break'],
    definition: 'Decides a set at 6–6 in games: first to 7 points, winning by 2.',
    details: 'Scores show the loser’s tiebreak points in small type, so 7–6⁴ means the tiebreak finished 7–4.',
    related: ['singles'],
  },
  {
    id: 'retirement',
    term: 'Retirement',
    category: 'Matches',
    aliases: ['retirements', 'retirement', 'retired', 'retires'],
    definition: 'A player stops during a match, usually through injury, and the opponent wins. Shown as "ret" or "Retired".',
    related: ['walkover'],
  },
  {
    id: 'walkover',
    term: 'Walkover',
    category: 'Matches',
    aliases: ['walkovers', 'walkover'],
    definition: 'A player withdraws before the match starts, and the opponent goes through without playing.',
    related: ['retirement'],
  },
]
