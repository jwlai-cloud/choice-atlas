import { generateFutureMap, type MapRequester } from '../src/lib/atlasService'
import { createLiveOpenAIRequester } from '../src/lib/openaiRequester'
import { parseAtlasInput } from '../src/lib/futureMap'

const responseHeaders = { 'cache-control': 'no-store' }

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: responseHeaders })
}

export async function handleAtlasRequest(request: Request, requestMap?: MapRequester): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

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
    return json({ error: 'Live mapping could not return a valid uncertainty map. Try again or use the preset.' }, 502)
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleAtlasRequest(request)
}
