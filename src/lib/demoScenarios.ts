export type DemoPriority = 'Creative depth' | 'Belonging' | 'Financial runway'
export type DemoScenario = { id: string; title: string; cue: string; options: [string, string]; priorities: DemoPriority[]; horizon: '3 months' | '1 year' | '3 years' }

export const demoScenarios: DemoScenario[] = [
  { id: 'perth-berlin', title: 'Stay or move', cue: 'team continuity / studio leap', options: ['Stay in Perth and grow the team', 'Move to Berlin for the studio role'], priorities: ['Creative depth', 'Belonging', 'Financial runway'], horizon: '1 year' },
  { id: 'lead-or-make', title: 'Lead or make', cue: 'management path / craft depth', options: ['Accept the creative director role', 'Remain an independent maker'], priorities: ['Creative depth', 'Financial runway'], horizon: '3 years' },
  { id: 'build-or-return', title: 'Build or return', cue: 'founder runway / stable work', options: ['Commit to the startup for twelve months', 'Return to a stable product role'], priorities: ['Belonging', 'Financial runway'], horizon: '1 year' },
]

export const mappingMoments = [
  ['Reading the ground', 'Sorting what you know from what still needs evidence.'],
  ['Finding the tension', 'Tracing where each route asks for a different cost.'],
  ['Protecting the unknowns', 'Leaving room for what a model cannot honestly claim.'],
] as const
