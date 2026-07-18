import { describe, expect, it, vi } from 'vitest'
import type { AtlasInput } from './futureMap'
import { generateFutureMap } from './atlasService'

const input: AtlasInput = {
  options: ['Keep the team role', 'Take the studio role'],
  priorities: ['Creative depth'],
  horizon: '1 year',
}

const validMap = {
  version: '1.0',
  input,
  framing: 'Two viable routes with different conditions.',
  knowns: [{ id: 'offer', label: 'An offer exists', detail: 'The role is concrete.', status: 'known', option: 'b' }],
  assumptions: [{ id: 'fit', label: 'The work will fit', detail: 'This needs investigation.', status: 'assumption', option: 'b' }],
  unknowns: [{ id: 'day', label: 'Ordinary days', detail: 'This cannot be inferred.', status: 'unknown', option: 'b' }],
  tradeoffs: [{ id: 'tension', label: 'Continuity ↔ reinvention', detail: 'Both routes cost something.', status: 'assumption', option: 'shared' }],
  questionsToInvestigate: [{ id: 'question', label: 'Shadow a workday', detail: 'Observe the lived rhythm.', status: 'unknown', option: 'b' }],
  notYet: { id: 'not-yet', label: 'Run a field test', detail: 'Gather lived evidence.', status: 'unknown', option: 'shared' },
  limitations: 'This organizes information and does not recommend a choice.',
}

describe('generateFutureMap', () => {
  it('returns only a model response that passes the FutureMap runtime contract', async () => {
    const requestMap = vi.fn().mockResolvedValue(validMap)

    await expect(generateFutureMap(input, requestMap)).resolves.toEqual(validMap)
    expect(requestMap).toHaveBeenCalledWith(input)
  })

  it('rejects unvalidated model output instead of passing it to the UI', async () => {
    const requestMap = vi.fn().mockResolvedValue({ ...validMap, recommendation: 'Take the studio role.' })

    await expect(generateFutureMap(input, requestMap)).rejects.toThrow()
  })
})
