# Spec: Choice Atlas live Build Week demo

Status: **Approved for implementation — 2026-07-18**

## Assumptions

1. This is a responsive, modern-browser web prototype, not a native application.
2. The Build Week brief is the source of truth: the product maps uncertainty and must never predict or recommend.
3. GPT-5.6 is the explicitly requested model target; its API key is supplied only as a Vercel server-side environment variable.
4. Live calls require a judge-entered code exchanged for a short-lived signed HttpOnly cookie; the code must never be accepted through a URL.
4. The existing `FutureMap` contract is the boundary for all model output, with runtime validation before it reaches the UI.

## Objective

Help a person explore exactly two meaningful life options with up to three priorities and a time horizon. The experience should make knowns, assumptions, unknowns, trade-offs, questions to investigate, and a “Not yet” path legible in one shared decision landscape. A judge should be able to run the prototype without an API key.

Success means a visitor can enter two labels, adjust priorities and horizon, receive a live, validated uncertainty map when the server is configured, and leave with questions rather than an AI verdict. The preset remains a clearly labelled fallback for a local or unavailable service.

## Tech stack

- React 19 + TypeScript, rendered by Vite 8
- CSS and inline SVG for the editorial landscape and motion
- Vercel serverless functions for the judge-access and OpenAI Responses API boundaries
- OpenAI SDK and Zod runtime validation

## Commands

```bash
npm install
npm run dev
npm test
npm run check
npm run build
npm run preview
```

## Project structure

```text
src/App.tsx              interactive prototype and map UI
src/lib/futureMap.ts     typed provider-agnostic data contract and preset
src/styles.css           responsive visual system and reduced-motion rules
api/atlas.ts              Vercel serverless endpoint for live map generation
api/judge-access.ts       judge-code exchange endpoint; sets a signed HttpOnly cookie
server/lib/               server-only orchestration, OpenAI requester, and their unit tests
server/routes/atlas.ts    compatibility facade for local server-side use
api/atlas.test.ts         endpoint tests; src/lib/*.test.ts covers contract and client tests
docs/                    living project documentation
.github/workflows/       pull-request source-branch guard
```

## Code style

Use TypeScript types at system boundaries and keep the UI's state local and explicit. Preserve the no-recommendation constraint in all future model-facing types and prompts.

```ts
export interface FutureMap {
  version: '1.0'
  knowns: AtlasItem[]
  assumptions: AtlasItem[]
  unknowns: AtlasItem[]
  questionsToInvestigate: AtlasItem[]
  notYet: AtlasItem
}
```

## Testing strategy

- Required before each commit: `npm test`, `npm run check`, `npm run build`, and `git diff --check`.
- Manual acceptance: desktop and narrow mobile map readability; keyboard focus on landmarks; priority and horizon controls update the map state.
- Test-first requirements: reject malformed input, reject invalid/missing model JSON, preserve the no-recommendation contract, and fall back safely when live mapping fails.
- Browser acceptance: submit a two-route dilemma through the live endpoint, show loading/error states accessibly, and render the returned map without console errors.

## Boundaries

- Always: preserve exactly two options, the explicit limitation, reduced-motion support, and no-prediction/no-recommendation behavior.
- Ask first: add telemetry, persistence, a new provider, change CI or branch policy, or deploy with a real API key.
- Never: put an API key in the client, claim static example data is personalized analysis, or return a recommendation from the future route.

## Success criteria

- The app builds and type-checks with the commands above.
- The server accepts only a valid two-option request and never exposes `OPENAI_API_KEY` to the browser.
- The server stores only a hash of the judge code and requires a valid signed session before live model work.
- GPT-5.6 returns strict `FutureMap` JSON that passes runtime validation before the UI uses it.
- If the live service is unavailable, the UI presents the preset fallback truthfully and remains usable.
- Priorities visibly apply local emphasis to each corresponding map area; the horizon label matches the selected horizon.
- Known, assumption, and unknown states are separately represented in text and visually.
- Mobile and keyboard interactions remain usable, including reduced-motion preferences.
- `FutureMap` has no prediction or recommendation field, and the server seam remains server-side.

## Open questions

1. The user will supply `OPENAI_API_KEY` in Vercel after code review and deployment; no key belongs in this repository.
2. Is the GitHub Action’s source-branch check required in the `main` protection rule, in addition to PR-only protection?
