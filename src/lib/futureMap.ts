/** Contract for the future server-side GPT-5.6 response. It intentionally has no recommendation field. */
export type EvidenceStatus = 'known' | 'assumption' | 'unknown'

export interface AtlasInput {
  options: [string, string]
  priorities: string[]
  horizon: '3 months' | '1 year' | '3 years'
}

export interface AtlasItem {
  id: string
  label: string
  detail: string
  status: EvidenceStatus
  option?: 'a' | 'b' | 'shared'
  priority?: string
}

export interface FutureMap {
  version: '1.0'
  input: AtlasInput
  framing: string
  knowns: AtlasItem[]
  assumptions: AtlasItem[]
  unknowns: AtlasItem[]
  tradeoffs: AtlasItem[]
  questionsToInvestigate: AtlasItem[]
  notYet: AtlasItem
  limitations: string
}

export const presetFutureMap: FutureMap = {
  version: '1.0',
  input: {
    options: ['Stay in Perth and grow the team', 'Move to Berlin for the studio role'],
    priorities: ['Creative depth', 'Belonging', 'Financial runway'],
    horizon: '1 year',
  },
  framing: 'Two viable terrains, with different conditions for depth, belonging, and runway.',
  knowns: [
    { id: 'offer', label: 'The studio role exists', detail: 'A concrete offer with a six-month review.', status: 'known', option: 'b', priority: 'Creative depth' },
    { id: 'team', label: 'Your team is established', detail: 'Three direct reports and recurring client work.', status: 'known', option: 'a', priority: 'Belonging' },
    { id: 'runway', label: 'Both paths have a cost', detail: 'Moving adds setup costs; staying defers salary growth.', status: 'known', option: 'shared', priority: 'Financial runway' },
  ],
  assumptions: [
    { id: 'visibility', label: 'The Berlin role creates wider visibility', detail: 'This depends on scope, sponsorship, and the studio’s trajectory.', status: 'assumption', option: 'b', priority: 'Creative depth' },
    { id: 'community', label: 'Your current community remains available', detail: 'Closeness can change even without a move.', status: 'assumption', option: 'a', priority: 'Belonging' },
  ],
  unknowns: [
    { id: 'day', label: 'What the ordinary Tuesday feels like', detail: 'Daily energy, pace, and collaboration cannot be inferred from an offer.', status: 'unknown', option: 'b', priority: 'Creative depth' },
    { id: 'roots', label: 'Which place will feel like home', detail: 'Belonging is lived over time, not modelled from a distance.', status: 'unknown', option: 'shared', priority: 'Belonging' },
  ],
  tradeoffs: [
    { id: 't1', label: 'Continuity ↔ reinvention', detail: 'One terrain compounds local trust; the other makes room for a new practice.', status: 'assumption', option: 'shared', priority: 'Belonging' },
    { id: 't2', label: 'Stable runway ↔ concentrated learning', detail: 'Financial and creative conditions move differently across these routes.', status: 'assumption', option: 'shared', priority: 'Financial runway' },
  ],
  questionsToInvestigate: [
    { id: 'q1', label: 'Ask to shadow an ordinary studio workday.', detail: 'Notice pace, critique culture, and room for authorship.', status: 'unknown', option: 'b', priority: 'Creative depth' },
    { id: 'q2', label: 'Price the first six months in Berlin, including a buffer.', detail: 'Make the runway legible before it has to carry emotion.', status: 'unknown', option: 'b', priority: 'Financial runway' },
    { id: 'q3', label: 'Name the rituals that make Perth feel like yours.', detail: 'Distinguish a place from the relationships you would carry forward.', status: 'unknown', option: 'a', priority: 'Belonging' },
  ],
  notYet: { id: 'not-yet', label: 'Not yet: choose a one-week field test', detail: 'Before choosing a route, gather one piece of lived evidence that changes the map.', status: 'unknown', option: 'shared' },
  limitations: 'This atlas organizes the information you provide. It does not know your future, predict outcomes, or recommend a choice.',
}
