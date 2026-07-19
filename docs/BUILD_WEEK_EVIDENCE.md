# OpenAI Build Week evidence

Choice Atlas was built for the **Apps for your life** track. This record makes the use of GPT-5.6 and Codex independently inspectable.

## GPT-5.6 in the working product

1. `api/atlas.ts` accepts a judge-authorized `POST /api/atlas` request containing exactly two routes, up to three priorities, and a horizon.
2. `server/lib/openaiRequester.ts` calls the OpenAI **Responses API** with model `gpt-5.6`, low reasoning effort, and a strict structured-output format.
3. `src/lib/futureMap.ts` revalidates the returned `FutureMap` and rejects undeclared fields, including a recommendation field. `server/lib/atlasService.ts` also verifies the response input matches the original request.
4. Only validated output reaches `src/App.tsx`; a successful real request is visibly labelled **Live GPT-5.6 map**. A failed/unconfigured request is honestly labelled **Illustrative preset**.

The product use is intentionally limited: GPT-5.6 maps knowns, assumptions, unknowns, trade-offs, investigation questions, and a “Not yet” field test. It does not predict or recommend.

## Codex in the build workflow

Codex was used to accelerate the implementation and delivery of the product, including:

- translating the product brief into the test-driven `FutureMap` and judge-session boundaries;
- implementing the React/Vite visual briefing, responsive behaviour, and motion-aware decision weather;
- adding unit tests for contract parsing, provider/request seams, Vercel functions, client fallback, judge access, and demo scenarios;
- running type-checks, tests, production builds, and browser checks while iterating;
- creating the repository documentation, architecture/proof visuals, captioned narration, 1080p demo edit, and PR-based delivery workflow.

This is a development-workflow claim, not a claim that Codex is part of a visitor’s runtime decision analysis. GPT-5.6 is the runtime model; Codex was the coding agent used to build and verify the project.

## Judge verification path

- Run `npm test -- --run`, `npm run check`, and `npm run build`.
- Inspect `server/lib/openaiRequester.ts` for the model call and `src/lib/futureMap.ts` for the strict runtime contract.
- Open the deployed app, enter the private judge access code, map an editable two-route dilemma, and confirm the map-source label changes to **Live GPT-5.6 map**.
- See `outputs/choice-atlas-submission-and-demo-plan.md` and `outputs/video/choice-atlas-build-week-demo-1080p.mp4` for the final demo assets.
