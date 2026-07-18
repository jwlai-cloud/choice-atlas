import { parseAtlasInput, parseFutureMap, type AtlasInput, type FutureMap } from './futureMap'

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export class AtlasClientError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'AtlasClientError'
  }
}

export async function requestFutureMap(input: AtlasInput, fetcher: Fetcher = fetch): Promise<FutureMap> {
  const validatedInput = parseAtlasInput(input)
  const response = await fetcher('/api/atlas', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(validatedInput),
  })
  const body: unknown = await response.json()

  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
      ? body.error
      : 'Live mapping could not be completed.'
    throw new AtlasClientError(message, response.status)
  }

  return parseFutureMap(body)
}
