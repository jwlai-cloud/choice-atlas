import { describe, expect, it, vi } from 'vitest'
import { requestFutureMap, AtlasClientError } from './atlasClient'
import { presetFutureMap } from './futureMap'

const input = {
  options: ['Keep the team role', 'Take the studio role'] as [string, string],
  priorities: ['Creative depth'],
  horizon: '1 year' as const,
}

describe('requestFutureMap', () => {
  it('posts validated input and returns a validated FutureMap', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ ...presetFutureMap, input }))

    await expect(requestFutureMap(input, fetcher)).resolves.toMatchObject({ version: '1.0', input })
    expect(fetcher).toHaveBeenCalledWith('/api/atlas', expect.objectContaining({ method: 'POST' }))
  })

  it('turns a safe server error into a typed client error', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ error: 'Live mapping is not configured.' }, { status: 503 }))

    const error = await requestFutureMap(input, fetcher).catch((reason: unknown) => reason)

    expect(error).toBeInstanceOf(AtlasClientError)
    expect(error).toMatchObject({ name: 'AtlasClientError', message: 'Live mapping is not configured.' })
  })
})
