# Architecture

## One-paragraph summary

Choice Atlas is a Vite + React decision landscape with a small Vercel serverless boundary for live GPT-5.6 mapping. A person enters exactly two routes, up to three priorities, and a horizon. The browser asks `POST /api/atlas` for a structured map; the server holds the API key, calls the OpenAI Responses API, and validates the result before it reaches the UI. If that live path is unavailable, the UI shows a plainly labelled illustrative preset rather than inventing personalised analysis.

## Components

- `src/App.tsx` owns intake, loading, map-source, focus, and fallback state, then renders one shared SVG landscape.
- `src/lib/futureMap.ts` contains the Zod input/output schemas, TypeScript types, and deterministic preset. The schema rejects extra fields such as a recommendation.
- `src/lib/atlasClient.ts` is the browser-facing `fetch` wrapper for `/api/atlas`; it parses responses and surfaces safe errors.
- `server/lib/atlasService.ts` is the provider-independent boundary. It validates input, validates model output, and checks that returned input matches the original request.
- `server/lib/openaiRequester.ts` is server-only. It uses the OpenAI SDK Responses API with GPT-5.6 and Zod structured output; it reads `OPENAI_API_KEY` only from the server environment.
- `api/atlas.ts` is the Vercel `POST /api/atlas` function. It turns malformed input into `400`, absent configuration into `503`, and invalid/provider output into `502` without disclosing secrets.
- `server/routes/atlas.ts` remains a compatibility facade for server consumers and delegates to the same validated service.
- `src/styles.css` provides the responsive editorial presentation and reduced-motion fallback. It contains no model logic.

## Data flow

```text
Person's two routes + priorities + horizon
                 |
                 v
 React intake -> atlasClient -> POST /api/atlas (Vercel Function)
                                      |
                                      v
  OpenAI Responses API + GPT-5.6 structured outputs (server key only)
                                      |
                                      v
      Zod FutureMap validation + original-input integrity check
                                      |
                         +------------+------------+
                         |                         |
                         v                         v
              Live GPT-5.6 map          labelled illustrative fallback
                         \                         /
                          v                       v
                        one explorable decision landscape
```

## Deployment topology

Vercel detects the Vite application and serves `dist` as the client build. It also deploys `api/atlas.ts` as a Node serverless function. `OPENAI_API_KEY` is configured in Vercel project environment variables for Preview/Production and must never be a `VITE_` variable. No `vercel.json` is needed for this single function and SPA because the UI has no client-side route rewrite requirement.

## Contract and safety rules

- Input is exactly two distinct, non-empty route labels, up to three distinct priorities, and one allowed horizon.
- `FutureMap` has only framing, evidence, trade-offs, questions, `notYet`, and limitations. Its strict Zod schema rejects undeclared recommendation-like fields.
- The system instructions forbid choosing, ranking, optimising, predicting, or using directive language.
- The UI exposes the source: live GPT map versus illustrative preset fallback.
- A model response is not trusted because it claimed structured output; the service validates it at runtime before rendering.

## Known limitations / non-goals

- A model cannot determine which life choice is right; Choice Atlas is deliberately a map of uncertainty, not a decision-maker.
- Live GPT behavior still requires a deployed Vercel project with an `OPENAI_API_KEY`; local `npm run dev` demonstrates the UI fallback only.
- The fallback content is static and illustrative. It must not be represented as fresh model analysis.
- The product does not store dilemmas, use a database, or perform background analysis.
