import { describe, expect, it, vi } from 'vitest'
import type { AtlasInput } from '../../src/lib/futureMap'
import { createOpenAIRequester } from './openaiRequester'

const input: AtlasInput = {
  options: ['Keep the team role', 'Take the studio role'],
  priorities: ['Creative depth'],
  horizon: '1 year',
}

const validMap = {
  version: '1.0',
  input,
  framing: 'Two viable routes with different conditions.',
  knowns: [{ id: 'offer', label: 'An offer exists', detail: 'The role is concrete.', status: 'known', option: 'b', priority: null }],
  assumptions: [{ id: 'fit', label: 'The work will fit', detail: 'This needs investigation.', status: 'assumption', option: 'b', priority: null }],
  unknowns: [{ id: 'day', label: 'Ordinary days', detail: 'This cannot be inferred.', status: 'unknown', option: 'b', priority: null }],
  tradeoffs: [{ id: 'tension', label: 'Continuity ↔ reinvention', detail: 'Both routes cost something.', status: 'assumption', option: 'shared', priority: null }],
  questionsToInvestigate: [{ id: 'question', label: 'Shadow a workday', detail: 'Observe the lived rhythm.', status: 'unknown', option: 'b', priority: null }],
  notYet: { id: 'not-yet', label: 'Run a field test', detail: 'Gather lived evidence.', status: 'unknown', option: 'shared', priority: null },
  limitations: 'This organizes information and does not recommend a choice.',
}

describe('createOpenAIRequester', () => {
  it('asks GPT-5.6 for a structured, non-recommendation FutureMap', async () => {
    const parse = vi.fn().mockResolvedValue({ output_parsed: validMap })
    const requester = createOpenAIRequester({ responses: { parse } })

    await expect(requester(input)).resolves.toEqual(validMap)
    expect(parse).toHaveBeenCalledOnce()
    expect(parse.mock.calls[0][0]).toMatchObject({ model: 'gpt-5.6' })
    expect(JSON.stringify(parse.mock.calls[0][0])).toContain('must not recommend')
    expect(JSON.stringify(parse.mock.calls[0][0])).toContain('one known item for each route')
  })

  it('rejects a response with no parsed structured output', async () => {
    const requester = createOpenAIRequester({ responses: { parse: vi.fn().mockResolvedValue({ output_parsed: null }) } })

    await expect(requester(input)).rejects.toThrow('did not return structured map data')
  })
})
