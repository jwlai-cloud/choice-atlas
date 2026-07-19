import { describe, expect, it } from 'vitest'
import { buildLandscapeLandmarks, itemForOption } from './briefing'
import { presetFutureMap } from './futureMap'

describe('briefing helpers', () => {
  it('finds route-specific evidence before using a neutral fallback', () => {
    expect(itemForOption(presetFutureMap.knowns, 'a')?.id).toBe('team')
    expect(itemForOption(presetFutureMap.knowns, 'b')?.id).toBe('offer')
  })

  it('does not repeat an unknown landmark when no shared unknown exists', () => {
    const map = {
      ...presetFutureMap,
      unknowns: [{ ...presetFutureMap.unknowns[0], option: 'b' as const }],
    }

    const landmarks = buildLandscapeLandmarks(map)
    expect(landmarks.find((landmark) => landmark.slot === 'home-landmark')).toBeUndefined()
    expect(new Set(landmarks.map((landmark) => landmark.item.id)).size).toBe(landmarks.length)
  })
})
