import { generateFutureMap } from '../lib/atlasService.js'
import { createLiveOpenAIRequester } from '../lib/openaiRequester.js'
import type { AtlasInput, FutureMap } from '../../src/lib/futureMap.js'

/**
 * Compatibility facade for server consumers. Vercel serves the active POST endpoint
 * from api/atlas.ts; both paths use the same validated generation boundary.
 */
export async function createFutureMap(input: AtlasInput): Promise<FutureMap> {
  return generateFutureMap(input, createLiveOpenAIRequester())
}
