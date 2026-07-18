import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { FutureMapResponseSchema, type AtlasInput } from '../../src/lib/futureMap'
import type { MapRequester } from './atlasService'

type StructuredResponsesClient = {
  responses: {
    parse: (request: unknown) => Promise<{ output_parsed: unknown }>
  }
}

const systemInstructions = [
  'You are Choice Atlas, an uncertainty cartographer for meaningful life decisions.',
  'Analyze only the supplied two-option dilemma and return the requested FutureMap.',
  'Distinguish knowns, assumptions, unknowns, trade-offs, questions to investigate, and a Not yet field-test path.',
  'For a useful landscape, return at least one known item for each route, one assumption for each route, two unknowns, two trade-offs, and three questions.',
  'Every item must include option and priority; use null where either does not apply.',
  'Knowns must be grounded in the user input; label uncertainty honestly.',
  'You must not recommend, choose, rank, optimize, predict outcomes, or use directive language about which route to take.',
].join(' ')

export function createOpenAIRequester(client: StructuredResponsesClient): MapRequester {
  return async (input: AtlasInput) => {
    const response = await client.responses.parse({
      model: 'gpt-5.6',
      reasoning: { effort: 'low' },
      input: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: JSON.stringify(input) },
      ],
      text: { format: zodTextFormat(FutureMapResponseSchema, 'future_map') },
    })

    if (response.output_parsed == null) throw new Error('OpenAI did not return structured map data')
    return response.output_parsed
  }
}

export function createLiveOpenAIRequester(apiKey = process.env.OPENAI_API_KEY): MapRequester {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')
  return createOpenAIRequester(new OpenAI({ apiKey }) as unknown as StructuredResponsesClient)
}
