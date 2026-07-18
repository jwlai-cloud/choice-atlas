import { parseAtlasInput, parseFutureMap, type AtlasInput, type FutureMap } from '../../src/lib/futureMap'

export type MapRequester = (input: AtlasInput) => Promise<unknown>

/**
 * Provider-independent safety boundary: no unvalidated request or model output
 * can cross from a server integration into the user-facing map.
 */
export async function generateFutureMap(input: unknown, requestMap: MapRequester): Promise<FutureMap> {
  const validatedInput = parseAtlasInput(input)
  const modelOutput = await requestMap(validatedInput)
  const map = parseFutureMap(modelOutput)
  if (JSON.stringify(map.input) !== JSON.stringify(validatedInput)) throw new Error('Model map input does not match the original input')
  return map
}
