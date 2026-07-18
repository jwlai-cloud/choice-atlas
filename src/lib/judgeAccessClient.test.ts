import { describe, expect, it, vi } from 'vitest'
import { JudgeAccessError, getJudgeAccessStatus, unlockJudgeAccess } from './judgeAccessClient'

describe('judge access client', () => {
  it('checks whether a browser already holds a judge session', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ authorized: true }))

    await expect(getJudgeAccessStatus(fetcher)).resolves.toBe(true)
    expect(fetcher).toHaveBeenCalledWith('/api/judge-access', { method: 'GET', credentials: 'same-origin' })
  })

  it('posts the code without putting it in a URL', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ authorized: true }))

    await expect(unlockJudgeAccess('river-copper-field-7Yq9Vd3kpR', fetcher)).resolves.toBeUndefined()
    expect(fetcher).toHaveBeenCalledWith('/api/judge-access', expect.objectContaining({ method: 'POST' }))
    expect(String(fetcher.mock.calls[0][0])).not.toContain('river-copper')
  })

  it('keeps failed unlock details out of the interface', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ error: 'Judge access could not be verified.' }, { status: 401 }))

    await expect(unlockJudgeAccess('wrong-code', fetcher)).rejects.toBeInstanceOf(JudgeAccessError)
  })
})
