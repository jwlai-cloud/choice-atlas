import { describe, expect, it, vi } from 'vitest'
import { handleAtlasRequest } from './atlas'
import { presetFutureMap } from '../src/lib/futureMap'

const input = {
  options: ['Keep the team role', 'Take the studio role'],
  priorities: ['Creative depth'],
  horizon: '1 year',
}

function request(body: unknown) {
  return new Request('https://choice-atlas.example/api/atlas', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('handleAtlasRequest', () => {
  it('returns a validated live map for valid input', async () => {
    const requestMap = vi.fn().mockResolvedValue({ ...presetFutureMap, input })

    const response = await handleAtlasRequest(request(input), requestMap)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ version: '1.0', input })
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('rejects a malformed decision before contacting the model', async () => {
    const requestMap = vi.fn()

    const response = await handleAtlasRequest(request({ ...input, options: ['Same', 'Same'] }), requestMap)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Enter two distinct, non-empty routes.' })
    expect(requestMap).not.toHaveBeenCalled()
  })

  it('reports an unavailable live service without exposing internal errors', async () => {
    const response = await handleAtlasRequest(request(input), async () => { throw new Error('OPENAI_API_KEY is not configured') })

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: 'Live mapping is not configured.' })
  })

  it('logs a provider failure server-side while keeping the response safe', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const response = await handleAtlasRequest(request(input), async () => { throw new Error('Structured output schema rejected') })

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({ error: 'Live mapping could not return a valid uncertainty map. Try again or use the preset.' })
    expect(errorSpy).toHaveBeenCalledWith('Choice Atlas live mapping failed', {
      name: 'Error',
      message: 'Structured output schema rejected',
    })
    errorSpy.mockRestore()
  })
})
