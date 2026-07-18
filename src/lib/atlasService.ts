import { parseAtlasInput, parseFutureMap, type AtlasInput, type FutureMap } from './futureMap'

export type MapRequester = (input: AtlasInput) => Promise<unknown>

/**
 * Provider-independent safety boundary: no unvalidated request or model output
 * can cross from a server integration into the user-facing map.
 */
export async function generateFutureMap(input: unknown, requestMap: MapRequester): Promise<FutureMap> {
  const validatedInput = parseAtlasInput(input)
  const modelOutput = await requestMap(validatedInput)
  return parseFutureMap(modelOutput)
}
