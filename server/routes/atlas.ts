import { generateFutureMap } from '../../src/lib/atlasService'
import { createLiveOpenAIRequester } from '../../src/lib/openaiRequester'
import type { AtlasInput, FutureMap } from '../../src/lib/futureMap'

/**
 * Compatibility facade for server consumers. Vercel serves the active POST endpoint
 * from api/atlas.ts; both paths use the same validated generation boundary.
 */
export async function createFutureMap(input: AtlasInput): Promise<FutureMap> {
  return generateFutureMap(input, createLiveOpenAIRequester())
}
