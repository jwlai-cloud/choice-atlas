import { describe, expect, it } from 'vitest'
import { demoScenarios, mappingMoments } from './demoScenarios'

describe('demo scenarios', () => {
  it('keeps each quick start an editable two-route dilemma', () => {
    expect(demoScenarios).toHaveLength(3)
    for (const scenario of demoScenarios) {
      expect(scenario.options).toHaveLength(2)
      expect(scenario.options[0]).not.toBe(scenario.options[1])
      expect(scenario.priorities.length).toBeGreaterThanOrEqual(1)
      expect(scenario.priorities.length).toBeLessThanOrEqual(3)
    }
  })

  it('has multiple meaningful live-mapping status messages', () => {
    expect(mappingMoments.map(([title]) => title)).toEqual(['Reading the ground', 'Finding the tension', 'Protecting the unknowns'])
  })
})
