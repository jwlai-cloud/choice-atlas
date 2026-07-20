# Choice Atlas

A judge-ready Build Week prototype for meaningful two-option decisions. Choice Atlas asks GPT-5.6 to act as an *uncertainty cartographer*: it classifies what is known, assumed, and unknown without predicting an outcome or recommending a choice.

## OpenAI Build Week evidence

Choice Atlas uses the two required OpenAI technologies in different, inspectable roles:

- **GPT-5.6 powers the working product.** A judge-authorized request reaches the server-only [Responses API requester](server/lib/openaiRequester.ts), which calls `gpt-5.6` with structured output. The response is parsed and revalidated against the strict [FutureMap contract](src/lib/futureMap.ts) before the React UI can render it. The UI labels successful output **Live GPT-5.6 map**; the deterministic fallback never masquerades as live analysis.
- **Codex accelerated the build and verification workflow.** It was used to translate the brief into the test-driven contract, implement the visual experience and Vercel security boundary, run checks, produce the architecture/demo artifacts, and deliver via protected `dev` → `main` pull requests. Codex is not part of the visitor’s runtime decision analysis.

See the concise [Build Week evidence record](docs/BUILD_WEEK_EVIDENCE.md), the [architecture graphic](outputs/choice-atlas-architecture.png), and the [final 1080p demo](outputs/video/choice-atlas-build-week-demo-1080p.mp4). The final video’s narration explicitly names both GPT-5.6’s runtime role and Codex’s build role.

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
5. Point to `src/lib/futureMap.ts` for the validated `FutureMap` data contract and `api/atlas.ts` for the server-side endpoint. GPT-5.6 returns only validated knowns, assumptions, unknowns, tensions, questions, and not-yet—not a recommendation. Close with the in-product **Build Week evidence** section: it distinguishes the live GPT-5.6 runtime from Codex’s implementation and verification role.

## Live GPT mapping

The deployed app sends the two options, priorities, and horizon to `POST /api/atlas`. That Vercel function holds `OPENAI_API_KEY`, calls the OpenAI Responses API with GPT-5.6 structured outputs, validates the returned `FutureMap`, and only then returns it to the browser. The key is never exposed to client code.

Live mapping is deliberately judge-gated. A judge enters an access code in the interface—not in a URL—and the server exchanges it for a four-hour signed, `Secure`, `HttpOnly`, `SameSite=Lax` cookie. The access code itself never enters browser history, referrers, analytics URLs, or client storage. The server stores only its SHA-256 hash in environment configuration. Without a valid session, `POST /api/atlas` returns `401` before parsing the request or calling GPT; the illustrative preset remains fully explorable.

If the service is unavailable or the output fails validation, the interface keeps working with a clearly labelled illustrative preset. That is a reliability path, not a claim that the preset is personalised.

### Temporary recording bypass (Preview or Production)

For a private screen-recording session, Vercel Preview or Production may set `CHOICE_ATLAS_DEMO_BYPASS=true`. The server bypasses the gate while the variable is present. Remove it and redeploy immediately after recording; do not share the un-gated URL.

## Deploy on Vercel

1. Import this GitHub repository in Vercel and select the `dev` branch for a preview deployment (merge the PR to deploy `main` in production).
2. Create a high-entropy code to give judges and two server-only values. Keep the first output private; hash it locally before adding it to Vercel:

   ```bash
   openssl rand -base64 24
   printf %s 'paste-the-code-you-will-give-judges' | shasum -a 256
   openssl rand -base64 32
   ```

3. In **Project Settings → Environment Variables**, add these variables for **Preview and Production**: `OPENAI_API_KEY`, `JUDGE_ACCESS_CODE_HASH` (only the 64-character digest at the start of the `shasum` output), and `JUDGE_SESSION_SECRET` (the final random output). Never prefix them with `VITE_` and never commit them.
4. Deploy. Vercel builds the Vite client into `dist` and exposes `api/atlas.ts` and `api/judge-access.ts` as server-side functions.
5. On the deployment URL, enter the judge code in **Live demo access**, then enter two distinct routes and press **Map the uncertainty**. A live success labels the map “Live GPT-5.6 mapping”; an outage or missing configuration shows “Illustrative preset fallback”.

Use [`.env.example`](.env.example) as the local variable-name reference. For a fully local serverless test, use the Vercel CLI with that variable configured; the regular Vite dev server deliberately has no API key or model endpoint.

## Deliberate limitation

The map is a structured reading aid, not a decision engine. It cannot forecast personal outcomes, evaluate private facts it was not given, or tell someone which path to take. The final “Not yet” path is deliberately a question-generating field test, not a disguised recommendation.

## Branch policy

Work on `dev` and open pull requests into `main`. The repository's `main` protection requires a pull request, and its GitHub Action rejects pull requests that do not originate from `dev`.

## Project structure

- `src/App.tsx` — accessible interactive prototype and SVG landscape
- `src/styles.css` — responsive editorial visual system and reduced-motion support
- `src/lib/futureMap.ts` — Zod-validated FutureMap contract + illustrative fallback
- `server/lib/atlasService.ts` — provider-independent validation boundary
- `server/lib/openaiRequester.ts` — server-only GPT-5.6 structured-output requester
- `api/atlas.ts` — Vercel `POST /api/atlas` function
- `src/lib/atlasClient.ts` — browser request/fallback error boundary
- `api/judge-access.ts` + `server/lib/judgeAccess.ts` — code exchange and signed judge-session boundary
