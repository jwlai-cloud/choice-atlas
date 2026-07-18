import { generateFutureMap, type MapRequester } from '../server/lib/atlasService.js'
import { createLiveOpenAIRequester } from '../server/lib/openaiRequester.js'
import { readJudgeAccess, type JudgeAccessState } from '../server/lib/judgeAccess.js'
import { parseAtlasInput } from '../src/lib/futureMap.js'

const responseHeaders = { 'cache-control': 'no-store' }

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: responseHeaders })
}

function logMappingFailure(error: unknown) {
  const details = error instanceof Error
    ? { name: error.name, message: error.message }
    : { name: 'UnknownError', message: 'The provider threw a non-Error value.' }
  console.error('Choice Atlas live mapping failed', details)
}

export type AccessChecker = (request: Request) => JudgeAccessState

export async function handleAtlasRequest(request: Request, requestMap?: MapRequester, accessChecker: AccessChecker = readJudgeAccess): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  const access = accessChecker(request)
  if (!access.configured) return json({ error: 'Live judge access is not configured.' }, 503)
  if (!access.authorized) return json({ error: 'Enter the judge access code to use live mapping.' }, 401)

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
    if (error instanceof Error && error.message === 'OPENAI_API_KEY is not configured') return json({ error: 'Live mapping is not configured.' }, 503)
    logMappingFailure(error)
    return json({ error: 'Live mapping could not return a valid uncertainty map. Try again or use the preset.' }, 502)
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleAtlasRequest(request)
}
