import {
  createJudgeSession,
  JUDGE_COOKIE_NAME,
  JUDGE_SESSION_TTL_MS,
  readJudgeAccess,
  readJudgeAccessConfig,
  verifyJudgeAccessCode,
  type JudgeAccessConfig,
} from '../server/lib/judgeAccess.js'
import { publicDemoEnabled } from './atlas.js'

const responseHeaders = { 'cache-control': 'no-store' }

function json(body: unknown, status = 200, headers?: Record<string, string>) {
  return Response.json(body, { status, headers: { ...responseHeaders, ...headers } })
}

function sessionCookie(value: string): string {
  return `${JUDGE_COOKIE_NAME}=${value}; Path=/; Max-Age=${JUDGE_SESSION_TTL_MS / 1000}; HttpOnly; Secure; SameSite=Lax`
}

async function readCode(request: Request): Promise<string | undefined> {
  try {
    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || !('code' in body) || typeof body.code !== 'string') return undefined
    const code = body.code.trim()
    return code.length >= 8 && code.length <= 128 ? code : undefined
  } catch {
    return undefined
  }
}

export async function handleJudgeAccessRequest(request: Request, config = readJudgeAccessConfig(), publicDemo = publicDemoEnabled()): Promise<Response> {
  if (request.method === 'GET') return json({ authorized: publicDemo || readJudgeAccess(request, config).authorized })
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
  if (publicDemo) return json({ authorized: true })
  if (!config) return json({ error: 'Live judge access is not configured.' }, 503)

  const code = await readCode(request)
  if (!code || !verifyJudgeAccessCode(code, config)) return json({ error: 'Judge access could not be verified.' }, 401)

  const session = createJudgeSession(config.sessionSecret)
  return json({ authorized: true }, 200, { 'set-cookie': sessionCookie(session.value) })
}

export async function GET(request: Request): Promise<Response> {
  return handleJudgeAccessRequest(request)
}

export async function POST(request: Request): Promise<Response> {
  return handleJudgeAccessRequest(request)
}
