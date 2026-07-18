import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const JUDGE_COOKIE_NAME = '__Host-choice_atlas_judge'
export const JUDGE_SESSION_TTL_MS = 4 * 60 * 60 * 1000

export interface JudgeAccessConfig {
  accessCodeHash: string
  sessionSecret: string
}

export interface JudgeAccessState {
  configured: boolean
  authorized: boolean
}

export function hashJudgeAccessCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

function equalValues(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export function verifyJudgeAccessCode(code: string, config: JudgeAccessConfig): boolean {
  return equalValues(hashJudgeAccessCode(code), config.accessCodeHash.toLowerCase())
}

function signSession(expiresAt: number, secret: string): string {
  return createHmac('sha256', secret).update(`choice-atlas-judge:${expiresAt}`).digest('base64url')
}

export function createJudgeSession(secret: string, now = Date.now(), ttlMs = JUDGE_SESSION_TTL_MS) {
  const expiresAt = now + ttlMs
  return { value: `${expiresAt}.${signSession(expiresAt, secret)}`, expiresAt }
}

export function verifyJudgeSession(value: string | undefined, secret: string, now = Date.now()): boolean {
  if (!value) return false
  const [expiresText, signature, ...extra] = value.split('.')
  if (extra.length || !expiresText || !signature || !/^\d+$/.test(expiresText)) return false
  const expiresAt = Number(expiresText)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false
  return equalValues(signature, signSession(expiresAt, secret))
}

function getCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie')
  if (!header) return undefined
  return header.split(';').map((value) => value.trim()).find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1)
}

export function readJudgeAccessConfig(env: NodeJS.ProcessEnv = process.env): JudgeAccessConfig | undefined {
  const accessCodeHash = env.JUDGE_ACCESS_CODE_HASH?.trim().toLowerCase()
  const sessionSecret = env.JUDGE_SESSION_SECRET?.trim()
  if (!accessCodeHash || !/^[a-f0-9]{64}$/.test(accessCodeHash) || !sessionSecret || sessionSecret.length < 32) return undefined
  return { accessCodeHash, sessionSecret }
}

export function readJudgeAccess(request: Request, config = readJudgeAccessConfig(), now = Date.now()): JudgeAccessState {
  if (!config) return { configured: false, authorized: false }
  return {
    configured: true,
    authorized: verifyJudgeSession(getCookie(request, JUDGE_COOKIE_NAME), config.sessionSecret, now),
  }
}
