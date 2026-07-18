type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export class JudgeAccessError extends Error {
  constructor() {
    super('Judge access could not be verified.')
    this.name = 'JudgeAccessError'
  }
}

export async function getJudgeAccessStatus(fetcher: Fetcher = fetch): Promise<boolean> {
  try {
    const response = await fetcher('/api/judge-access', { method: 'GET', credentials: 'same-origin' })
    if (!response.ok) return false
    const body: unknown = await response.json()
    return typeof body === 'object' && body !== null && 'authorized' in body && body.authorized === true
  } catch {
    return false
  }
}

export async function unlockJudgeAccess(code: string, fetcher: Fetcher = fetch): Promise<void> {
  const response = await fetcher('/api/judge-access', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  if (!response.ok) throw new JudgeAccessError()
}
