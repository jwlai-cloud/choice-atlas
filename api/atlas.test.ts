import { describe, expect, it, vi } from 'vitest'
import { demoBypassEnabled, handleAtlasRequest, type AccessChecker } from './atlas'
import { presetFutureMap } from '../src/lib/futureMap'
import { LiveMappingConfigurationError } from '../server/lib/openaiRequester'

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

const allowed: AccessChecker = () => ({ configured: true, authorized: true })

describe('handleAtlasRequest', () => {
  it('allows the capture bypass only with an explicit future expiry, including production', () => {
    expect(demoBypassEnabled({ CHOICE_ATLAS_DEMO_BYPASS: 'true', CHOICE_ATLAS_DEMO_BYPASS_EXPIRES_AT: '2026-07-20T15:00:00.000Z' }, new Date('2026-07-20T14:00:00.000Z'))).toBe(true)
    expect(demoBypassEnabled({ CHOICE_ATLAS_DEMO_BYPASS: 'true', CHOICE_ATLAS_DEMO_BYPASS_EXPIRES_AT: '2026-07-20T13:00:00.000Z' }, new Date('2026-07-20T14:00:00.000Z'))).toBe(false)
    expect(demoBypassEnabled({ CHOICE_ATLAS_DEMO_BYPASS: 'true' }, new Date('2026-07-20T14:00:00.000Z'))).toBe(false)
  })

  it('returns a validated live map for valid input', async () => {
    const requestMap = vi.fn().mockResolvedValue({ ...presetFutureMap, input })

    const response = await handleAtlasRequest(request(input), requestMap, allowed)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ version: '1.0', input })
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('rejects a malformed decision before contacting the model', async () => {
    const requestMap = vi.fn()

    const response = await handleAtlasRequest(request({ ...input, options: ['Same', 'Same'] }), requestMap, allowed)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Enter two distinct, non-empty routes.' })
    expect(requestMap).not.toHaveBeenCalled()
  })

  it('reports an unavailable live service without exposing internal errors', async () => {
    const response = await handleAtlasRequest(request(input), async () => { throw new LiveMappingConfigurationError() }, allowed)

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: 'Live mapping is not configured.' })
  })

  it('logs a provider failure server-side while keeping the response safe', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      const response = await handleAtlasRequest(request(input), async () => { throw new Error('Structured output schema rejected') }, allowed)

      expect(response.status).toBe(502)
      await expect(response.json()).resolves.toEqual({ error: 'Live mapping could not return a valid uncertainty map. Try again or use the preset.' })
      expect(errorSpy).toHaveBeenCalledWith('Choice Atlas live mapping failed', expect.objectContaining({
        name: 'Error',
        message: 'Structured output schema rejected',
        stack: expect.any(String),
      }))
    } finally {
      errorSpy.mockRestore()
    }
  })

  it('blocks the live model before parsing input when judge access is not authorized', async () => {
    const requestMap = vi.fn()
    const response = await handleAtlasRequest(request(input), requestMap, () => ({ configured: true, authorized: false }))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Enter the judge access code to use live mapping.' })
    expect(requestMap).not.toHaveBeenCalled()
  })

  it('permits a temporary demo bypass only when explicitly enabled for a preview deployment', async () => {
    const requestMap = vi.fn().mockResolvedValue({ ...presetFutureMap, input })

    const response = await handleAtlasRequest(request(input), requestMap, () => ({ configured: true, authorized: false }), true)

    expect(response.status).toBe(200)
    expect(requestMap).toHaveBeenCalledOnce()
  })
})
