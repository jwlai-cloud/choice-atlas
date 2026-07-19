import { describe, expect, it } from 'vitest'
import { buildWeekEvidence } from './buildWeekEvidence'

describe('buildWeekEvidence', () => {
  it('makes the in-product GPT-5.6 and Codex evidence concrete and distinct', () => {
    expect(buildWeekEvidence).toHaveLength(2)
    expect(buildWeekEvidence[0]).toMatchObject({ title: 'GPT-5.6 in the product', proof: expect.stringContaining('Responses API') })
    expect(buildWeekEvidence[1]).toMatchObject({ title: 'Codex in the build', proof: expect.stringContaining('test-driven') })
  })
})
