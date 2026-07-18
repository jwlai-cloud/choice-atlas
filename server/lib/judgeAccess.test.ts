import { describe, expect, it } from 'vitest'
import {
  createJudgeSession,
  hashJudgeAccessCode,
  readJudgeAccess,
  verifyJudgeAccessCode,
  verifyJudgeSession,
  type JudgeAccessConfig,
} from './judgeAccess'

const code = 'river-copper-field-7Yq9Vd3kpR'
const config: JudgeAccessConfig = {
  accessCodeHash: hashJudgeAccessCode(code),
  sessionSecret: 'a-reliably-long-session-secret-for-unit-tests-only',
}

describe('judge access', () => {
  it('compares a submitted access code without storing the code itself', () => {
    expect(verifyJudgeAccessCode(code, config)).toBe(true)
    expect(verifyJudgeAccessCode('not-the-judge-code', config)).toBe(false)
  })

  it('creates a short-lived signed session that cannot be forged or replayed after expiry', () => {
    const now = 1_700_000_000_000
    const session = createJudgeSession(config.sessionSecret, now, 60_000)

    expect(verifyJudgeSession(session.value, config.sessionSecret, now + 59_999)).toBe(true)
    expect(verifyJudgeSession(`${session.value}tampered`, config.sessionSecret, now + 1)).toBe(false)
    expect(verifyJudgeSession(session.value, config.sessionSecret, now + 60_001)).toBe(false)
  })

  it('requires configured credentials and a valid HttpOnly-session cookie', () => {
    const session = createJudgeSession(config.sessionSecret, 1_700_000_000_000)
    const request = new Request('https://choice-atlas.example/api/atlas', {
      headers: { cookie: `__Host-choice_atlas_judge=${session.value}` },
    })

    expect(readJudgeAccess(request, config, 1_700_000_000_100)).toEqual({ configured: true, authorized: true })
    expect(readJudgeAccess(request, undefined)).toEqual({ configured: false, authorized: false })
  })
})
