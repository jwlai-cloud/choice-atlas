import { describe, expect, it } from 'vitest'
import { handleJudgeAccessRequest } from './judge-access'
import { hashJudgeAccessCode, type JudgeAccessConfig } from '../server/lib/judgeAccess'

const code = 'river-copper-field-7Yq9Vd3kpR'
const config: JudgeAccessConfig = {
  accessCodeHash: hashJudgeAccessCode(code),
  sessionSecret: 'a-reliably-long-session-secret-for-unit-tests-only',
}

function request(method: string, body?: unknown) {
  return new Request('https://choice-atlas.example/api/judge-access', {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
}

describe('handleJudgeAccessRequest', () => {
  it('exchanges a correct code for a signed HttpOnly cookie', async () => {
    const response = await handleJudgeAccessRequest(request('POST', { code }), config)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ authorized: true })
    expect(response.headers.get('set-cookie')).toMatch(/^__Host-choice_atlas_judge=/)
    expect(response.headers.get('set-cookie')).toContain('HttpOnly')
    expect(response.headers.get('set-cookie')).toContain('Secure')
  })

  it('does not disclose why an invalid code was rejected', async () => {
    const response = await handleJudgeAccessRequest(request('POST', { code: 'wrong-code' }), config)

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Judge access could not be verified.' })
  })

  it('reports an unconfigured gate without accepting a code', async () => {
    const response = await handleJudgeAccessRequest(request('POST', { code }), undefined)

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: 'Live judge access is not configured.' })
  })

  it('reports authorized without a code when public demo is enabled', async () => {
    const response = await handleJudgeAccessRequest(request('GET'), undefined, true)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ authorized: true })
  })

})
