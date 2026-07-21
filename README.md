# Choice Atlas

Choice Atlas is a visual uncertainty map for meaningful life dilemmas. A person enters exactly two routes, up to three priorities, and a horizon; the experience makes knowns, assumptions, unknowns, trade-offs, and next questions visible without pretending to know the right answer.

## How Codex and GPT-5.6 contributed

**GPT-5.6 is the runtime uncertainty cartographer.** On every request the server calls the OpenAI Responses API with `gpt-5.6` live, in real time on the user's own two routes, requests structured output, validates it against the Zod `FutureMap` contract, and only then renders the interactive decision field. It maps the supplied dilemma; it never predicts, ranks, or recommends.

**Codex was my build collaborator.** It accelerated the conversion of the product brief into the test-driven `FutureMap` boundary, React decision briefing, responsive decision-weather visual system, secure server integration, browser checks, architecture assets, demo planning, and PR-based delivery. Key product choices made during that collaboration were: keep exactly two routes, present uncertainty before prose, retain a “Not yet” path, and reject recommendation-shaped model output at runtime.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test -- --run
npm run check
npm run build
```

## Project map

- `src/App.tsx` — accessible interactive decision experience
- `src/lib/futureMap.ts` — Zod `FutureMap` contract and illustrative fallback
- `server/lib/openaiRequester.ts` — server-side GPT-5.6 structured-output request
- `api/atlas.ts` — validated map endpoint
- `docs/ARCHITECTURE.md` — system design

## Limitation

Choice Atlas is a structured reading aid, not a decision engine. It cannot forecast a person’s future or tell them which route to choose.
