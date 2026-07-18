# Progress log

## 2026-07-18 — live mapping implementation

### Done

- Kept the single, accessible SVG decision landscape and static preset reliability path from the initial prototype.
- Added a test-driven Zod `FutureMap` contract: input limits, strict model output, evidence-status checks, and an integrity check between request and response input.
- Added mocked tests for the OpenAI requester, service boundary, Vercel endpoint, and browser request client.
- Implemented `POST /api/atlas` as a Vercel function using GPT-5.6 structured outputs. `OPENAI_API_KEY` is read only from server code.
- Connected **Map the uncertainty** to the endpoint. It renders live output when valid and explicitly labels the deterministic fallback when unavailable.
- Verified the fallback interaction in a browser: when the Vite-only development server has no `/api/atlas`, the UI retains the map and reports the illustrative fallback accessibly.
- Ran the full unit suite, TypeScript check, production build, and whitespace check before delivery.

### Awaiting deployment verification

- The actual API call cannot be executed until Vercel has `OPENAI_API_KEY` configured. After the user deploys the `dev` preview, test a real two-route mapping and confirm the map source reads **Live GPT-5.6 mapping**.

## 2026-07-18 — judge access gate

- Added a judge-only live path: `POST /api/judge-access` verifies a code against the server-held SHA-256 hash and sets a four-hour signed, `Secure`, `HttpOnly`, `SameSite=Lax` cookie.
- `POST /api/atlas` now requires that session before it parses a request or reaches the provider; the static preset stays available without access.
- Added focused unit coverage for code verification, tampered/expired sessions, cookie attributes, endpoint blocking, and browser client behaviour. The Vercel Preview/Production environments still need `JUDGE_ACCESS_CODE_HASH` and `JUDGE_SESSION_SECRET` before this change can be exercised end-to-end.
- Push the final documentation commit to the existing `dev` → `main` pull request, then refresh automated-review/check status after the providers have had time to run.

### Non-negotiable product boundary

Choice Atlas maps evidence and uncertainty. It never ranks options, predicts outcomes, or tells someone which route to choose; “Not yet” is an evidence-gathering path, not a covert recommendation.
