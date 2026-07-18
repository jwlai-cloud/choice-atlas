import type { AtlasInput, FutureMap } from '../../src/lib/futureMap'

/**
 * Server-route seam for a future provider integration (e.g. POST /api/atlas).
 * Validate the JSON response against the FutureMap contract before returning it.
 * Prompt constraint: classify evidence and questions only; never forecast or recommend.
 */
export async function createFutureMap(_input: AtlasInput): Promise<FutureMap> {
  throw new Error('No model provider configured. The UI uses its static preset map in demo mode.')
}
