import { z } from 'zod'

/** Contract for the future server-side GPT-5.6 response. It intentionally has no recommendation field. */
export const EvidenceStatusSchema = z.enum(['known', 'assumption', 'unknown'])
export type EvidenceStatus = z.infer<typeof EvidenceStatusSchema>

const TextSchema = z.string().trim().min(1).max(280)
const RouteSchema = z.string().trim().min(1).max(160)

export const AtlasInputSchema = z.object({
  options: z.tuple([RouteSchema, RouteSchema]).refine(([first, second]) => first !== second, 'Options must be distinct'),
  priorities: z.array(z.string().trim().min(1).max(64)).max(3).refine((priorities) => new Set(priorities).size === priorities.length, 'Priorities must be distinct'),
  horizon: z.enum(['3 months', '1 year', '3 years']),
}).strict()
export type AtlasInput = z.infer<typeof AtlasInputSchema>

// OpenAI Structured Outputs requires an array's `items` schema to be a single
// schema object. Keep the tuple only at the internal validation boundary.
const FutureMapResponseInputSchema = AtlasInputSchema.extend({
  options: z.array(RouteSchema).length(2),
})

export const AtlasItemSchema = z.object({
  id: z.string().trim().min(1).max(64),
  label: TextSchema,
  detail: TextSchema,
  status: EvidenceStatusSchema,
  option: z.enum(['a', 'b', 'shared']).nullable(),
  priority: z.string().trim().min(1).max(64).nullable(),
}).strict()
export type AtlasItem = z.infer<typeof AtlasItemSchema>

export const FutureMapResponseSchema = z.object({
  version: z.literal('1.0'),
  input: FutureMapResponseInputSchema,
  framing: TextSchema,
  knowns: z.array(AtlasItemSchema),
  assumptions: z.array(AtlasItemSchema),
  unknowns: z.array(AtlasItemSchema),
  tradeoffs: z.array(AtlasItemSchema),
  questionsToInvestigate: z.array(AtlasItemSchema),
  notYet: AtlasItemSchema,
  limitations: TextSchema,
}).strict()

export const FutureMapSchema = FutureMapResponseSchema.extend({ input: AtlasInputSchema }).superRefine((map, context) => {
  const expectedStatuses = [
    ['knowns', map.knowns, 'known'],
    ['assumptions', map.assumptions, 'assumption'],
    ['unknowns', map.unknowns, 'unknown'],
    ['questionsToInvestigate', map.questionsToInvestigate, 'unknown'],
  ] as const

  for (const [key, items, expectedStatus] of expectedStatuses) {
    items.forEach((item, index) => {
      if (item.status !== expectedStatus) context.addIssue({ code: 'custom', path: [key, index, 'status'], message: `${key} must contain ${expectedStatus} items` })
    })
  }
})
export type FutureMap = z.infer<typeof FutureMapSchema>

export function parseAtlasInput(input: unknown): AtlasInput {
  return AtlasInputSchema.parse(input)
}

export function parseFutureMap(map: unknown): FutureMap {
  return FutureMapSchema.parse(map)
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
  notYet: { id: 'not-yet', label: 'Not yet: choose a one-week field test', detail: 'Before choosing a route, gather one piece of lived evidence that changes the map.', status: 'unknown', option: 'shared', priority: null },
  limitations: 'This atlas organizes the information you provide. It does not know your future, predict outcomes, or recommend a choice.',
}
