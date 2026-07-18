# Choice Atlas

A judge-ready Build Week prototype for meaningful two-option decisions. Choice Atlas asks GPT-5.6 to act as an *uncertainty cartographer*: it classifies what is known, assumed, and unknown without predicting an outcome or recommending a choice.

## Run it

```bash
npm install
npm run dev
```

`npm run dev` runs the Vite interface. Without the Vercel function it truthfully demonstrates the labelled illustrative fallback.

For a production check:

```bash
npm run check
npm run build
npm run preview
```

## Demo narrative (about 90 seconds)

1. Start with the proposition: **“For decisions too human to optimize.”** Enter the two real routes, select up to three priorities, and choose the horizon.
2. Click **Map the uncertainty**. The prototype uses a static preset so the experience always works without an API key; the map remains one shared field rather than presenting two competing answer screens.
3. Read the terrain: solid squares are knowns, outlined squares are assumptions, and soft fog marks unknowns. Hover or tab through landmarks to reveal their plain-language evidence note. Every selected priority changes emphasis in its relevant part of the terrain.
4. Scroll through named trade-offs and questions that could genuinely change the map. Close on **Not yet**: a field-test path that respects uncertainty instead of forcing a premature verdict.
5. Point to `src/lib/futureMap.ts` for the validated `FutureMap` data contract and `api/atlas.ts` for the server-side endpoint. GPT-5.6 returns only validated knowns, assumptions, unknowns, tensions, questions, and not-yet—not a recommendation.

## Live GPT mapping

The deployed app sends the two options, priorities, and horizon to `POST /api/atlas`. That Vercel function holds `OPENAI_API_KEY`, calls the OpenAI Responses API with GPT-5.6 structured outputs, validates the returned `FutureMap`, and only then returns it to the browser. The key is never exposed to client code.

If the service is unavailable or the output fails validation, the interface keeps working with a clearly labelled illustrative preset. That is a reliability path, not a claim that the preset is personalised.

## Deploy on Vercel

1. Import this GitHub repository in Vercel and select the `dev` branch for a preview deployment (merge the PR to deploy `main` in production).
2. In **Project Settings → Environment Variables**, add `OPENAI_API_KEY` for Preview and Production. Never prefix it with `VITE_` and never commit it.
3. Deploy. Vercel builds the Vite client into `dist` and exposes `api/atlas.ts` as the server-side `POST /api/atlas` function.
4. On the deployment URL, enter two distinct routes and press **Map the uncertainty**. A live success labels the map “Live GPT-5.6 mapping”; an outage or missing key shows “Illustrative preset fallback”.

Use [`.env.example`](.env.example) as the local variable-name reference. For a fully local serverless test, use the Vercel CLI with that variable configured; the regular Vite dev server deliberately has no API key or model endpoint.

## Deliberate limitation

The map is a structured reading aid, not a decision engine. It cannot forecast personal outcomes, evaluate private facts it was not given, or tell someone which path to take. The final “Not yet” path is deliberately a question-generating field test, not a disguised recommendation.

## Branch policy

Work on `dev` and open pull requests into `main`. The repository's `main` protection requires a pull request, and its GitHub Action rejects pull requests that do not originate from `dev`.

## Project structure

- `src/App.tsx` — accessible interactive prototype and SVG landscape
- `src/styles.css` — responsive editorial visual system and reduced-motion support
- `src/lib/futureMap.ts` — Zod-validated FutureMap contract + illustrative fallback
- `src/lib/atlasService.ts` — provider-independent validation boundary
- `src/lib/openaiRequester.ts` — server-only GPT-5.6 structured-output requester
- `api/atlas.ts` — Vercel `POST /api/atlas` function
- `src/lib/atlasClient.ts` — browser request/fallback error boundary
