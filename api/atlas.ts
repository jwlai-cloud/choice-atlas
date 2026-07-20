import { generateFutureMap, type MapRequester } from '../server/lib/atlasService.js'
import { createLiveOpenAIRequester, LiveMappingConfigurationError } from '../server/lib/openaiRequester.js'
import { readJudgeAccess, type JudgeAccessState } from '../server/lib/judgeAccess.js'
import { parseAtlasInput } from '../src/lib/futureMap.js'

const responseHeaders = { 'cache-control': 'no-store' }

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: responseHeaders })
}

function logMappingFailure(error: unknown) {
  const details = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { name: 'UnknownError', message: 'The provider threw a non-Error value.' }
  console.error('Choice Atlas live mapping failed', details)
}

export type AccessChecker = (request: Request) => JudgeAccessState

/** Enables an intentionally public live demo when set to the exact string "true". */
export function publicDemoEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.CHOICE_ATLAS_PUBLIC_DEMO === 'true'
}

export async function handleAtlasRequest(request: Request, requestMap?: MapRequester, accessChecker: AccessChecker = readJudgeAccess, publicDemo = publicDemoEnabled()): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  if (!publicDemo) {
    const access = accessChecker(request)
    if (!access.configured) return json({ error: 'Live judge access is not configured.' }, 503)
    if (!access.authorized) return json({ error: 'Enter the judge access code to use live mapping.' }, 401)
  }

  let input
  try {
    input = parseAtlasInput(await request.json())
  } catch {
    return json({ error: 'Enter two distinct, non-empty routes.' }, 400)
  }

  try {
    const map = await generateFutureMap(input, requestMap ?? createLiveOpenAIRequester())
    return json(map)
  } catch (error) {
    if (error instanceof LiveMappingConfigurationError) return json({ error: 'Live mapping is not configured.' }, 503)
    logMappingFailure(error)
    return json({ error: 'Live mapping could not return a valid uncertainty map. Try again or use the preset.' }, 502)
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleAtlasRequest(request)
}
