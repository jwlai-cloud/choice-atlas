import { describe, expect, it } from 'vitest'
import { parseAtlasInput, parseFutureMap } from './futureMap'

const validInput = {
  options: ['Keep the team role', 'Take the studio role'],
  priorities: ['Creative depth', 'Belonging'],
  horizon: '1 year',
}

const validMap = {
  version: '1.0',
  input: validInput,
  framing: 'Two viable routes with different conditions.',
  knowns: [{ id: 'offer', label: 'An offer exists', detail: 'The role is concrete.', status: 'known', option: 'b' }],
  assumptions: [{ id: 'fit', label: 'The work will fit', detail: 'This needs investigation.', status: 'assumption', option: 'b' }],
  unknowns: [{ id: 'day', label: 'Ordinary days', detail: 'This cannot be inferred.', status: 'unknown', option: 'b' }],
  tradeoffs: [{ id: 'tension', label: 'Continuity ↔ reinvention', detail: 'Both routes cost something.', status: 'assumption', option: 'shared' }],
  questionsToInvestigate: [{ id: 'question', label: 'Shadow a workday', detail: 'Observe the lived rhythm.', status: 'unknown', option: 'b' }],
  notYet: { id: 'not-yet', label: 'Run a field test', detail: 'Gather lived evidence.', status: 'unknown', option: 'shared' },
  limitations: 'This organizes information and does not recommend a choice.',
}

describe('parseAtlasInput', () => {
  it('accepts exactly two distinct non-empty options and up to three priorities', () => {
    expect(parseAtlasInput(validInput)).toEqual(validInput)
  })

  it('rejects duplicate options', () => {
    expect(() => parseAtlasInput({ ...validInput, options: ['Same route', 'Same route'] })).toThrow()
  })

  it('rejects more than three priorities', () => {
    expect(() => parseAtlasInput({ ...validInput, priorities: ['One', 'Two', 'Three', 'Four'] })).toThrow()
  })
})

describe('parseFutureMap', () => {
  it('accepts a complete non-recommendation map', () => {
    expect(parseFutureMap(validMap)).toEqual(validMap)
  })

  it('rejects a recommendation field from model output', () => {
    expect(() => parseFutureMap({ ...validMap, recommendation: 'Move to Berlin.' })).toThrow()
  })

  it('rejects evidence placed in the wrong certainty category', () => {
    expect(() => parseFutureMap({ ...validMap, knowns: [{ ...validMap.knowns[0], status: 'unknown' }] })).toThrow()
  })
})
