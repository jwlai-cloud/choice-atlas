import type { AtlasItem, FutureMap } from './futureMap'

type RouteSide = 'a' | 'b' | 'shared'

export type LandscapeLandmark = {
  slot: 'team-landmark' | 'community-landmark' | 'offer-landmark' | 'day-landmark' | 'home-landmark'
  side: RouteSide
  item: AtlasItem
}

type LandmarkCandidate = Omit<LandscapeLandmark, 'item'> & { item: AtlasItem | undefined }

export function itemForOption(items: AtlasItem[], option: RouteSide, allowFallback = true): AtlasItem | undefined {
  return items.find((item) => item.option === option) ?? (allowFallback ? items[0] : undefined)
}

export function buildLandscapeLandmarks(map: FutureMap): LandscapeLandmark[] {
  const candidates: LandmarkCandidate[] = [
    { slot: 'team-landmark' as const, side: 'a' as const, item: itemForOption(map.knowns, 'a') },
    { slot: 'community-landmark' as const, side: 'a' as const, item: itemForOption(map.assumptions, 'a') },
    { slot: 'offer-landmark' as const, side: 'b' as const, item: itemForOption(map.knowns, 'b') },
    { slot: 'day-landmark' as const, side: 'b' as const, item: itemForOption(map.unknowns, 'b') },
    { slot: 'home-landmark' as const, side: 'shared' as const, item: itemForOption(map.unknowns, 'shared', false) },
  ]

  const used = new Set<string>()
  return candidates.flatMap((candidate): LandscapeLandmark[] => {
    if (!candidate.item || used.has(candidate.item.id)) return []
    used.add(candidate.item.id)
    return [{ ...candidate, item: candidate.item }]
  })
}
