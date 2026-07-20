# Choice Atlas — Devpost submission draft

## Project basics

- **Name:** Choice Atlas
- **Tagline:** A visual uncertainty map for the life decision you still own.
- **Track:** Apps for Your Life
- **Repository:** https://github.com/jwlai-cloud/choice-atlas
- **Live demo:** https://choice-atlas-lac.vercel.app/
- **Video:** Add the final public YouTube URL before submitting.

## Description

### Inspiration

Family decisions rarely behave like a pros-and-cons list. Staying, moving, leading, building, or waiting can change work, belonging, money, and the texture of an ordinary week at the same time. A confident AI answer can be the least helpful thing in that moment. We wanted a calmer tool: one that helps a family see what is solid, assumed, and genuinely unknown before they decide together.

### What it does

Choice Atlas turns exactly two routes, up to three priorities, and a time horizon into one interactive decision landscape.

1. A person starts from an editable dilemma or a quick-start scenario.
2. GPT-5.6 acts as an uncertainty cartographer: it returns structured knowns, assumptions, unknowns, trade-offs, investigation questions, and a “Not yet” field test.
3. The experience reveals the map in stages—Ground, Tension, Fieldwork, then Landscape—so the first read is visual rather than a wall of text.
4. Solid marks represent known ground, porous marks represent assumptions, and fog represents what the model cannot honestly claim.

Choice Atlas is intentionally a map, not a verdict. It does not predict outcomes, rank routes, or tell a person what to do.

### How we built it

The product is React + Vite on Vercel, with a responsive SVG/canvas-like editorial decision field and reduced-motion support. A Vercel serverless function holds `OPENAI_API_KEY` and calls the OpenAI Responses API with GPT-5.6 structured output. The response is parsed against a Zod `FutureMap` schema and revalidated against the original input before it can render.

GPT-5.6 is the runtime uncertainty cartographer. A successful response is visibly labelled **Live GPT-5.6 map**; the deterministic fallback is visibly labelled **Illustrative preset**.

Codex was our build collaborator throughout the project. It accelerated the translation of the brief into a test-driven FutureMap contract and judge-session boundary; the staged decision briefing and decision-weather visual system; the Vercel integration and safe fallback; automated tests, type-checks, builds, browser checks, architecture graphics, demo storyboard, and PR-based delivery. Key decisions made with Codex were to preserve exactly two routes, disallow recommendation-shaped output in the schema, validate model output server-side, and render uncertainty visually before presenting detail. Codex does not make runtime decisions for visitors.

### Challenges we ran into

Structured model output needs to be useful without quietly turning into advice. We separated the model-facing JSON schema from the stricter internal validation boundary, rejected undeclared fields including recommendations, and added an input-integrity check after the model response. We also had to design for live model latency: the product keeps a clearly labelled illustrative preset rather than pretending every result is live.

### Accomplishments we’re proud of

- 37 automated tests across the data contract, model boundary, Vercel endpoints, judge session, browser client, and demo scenarios.
- A verified production path from protected access → GPT-5.6 → validated FutureMap → interactive visual field.
- One coherent decision landscape rather than two answer screens or a chatbot transcript.

### What we learned

The most responsible use of AI in a meaningful personal dilemma may be to reduce false certainty, not maximise confidence. Structured output and runtime validation are product choices as much as engineering choices: they keep the product honest about what it knows.

### What’s next

- Let people capture follow-up evidence without storing private dilemmas by default.
- Add evaluation cases for no-recommendation language and category coverage.
- Improve visual placement for unusually uneven live evidence.

### Built with

GPT-5.6, OpenAI Responses API, Codex, React, Vite, TypeScript, Zod, Vercel, SVG, Vitest.

## Private judge instructions

Live demo: https://choice-atlas-lac.vercel.app/

Enter the private Judge Access Code supplied in the submission form, then choose a quick-start dilemma or edit both routes and click **Map the uncertainty**. A successful result reads **Live GPT-5.6 map**. If the code gate is temporarily bypassed for a recording, remove `CHOICE_ATLAS_DEMO_BYPASS` and redeploy before sharing this instruction with judges.

## Remaining Devpost fields to provide manually

1. Final public YouTube video URL (required).
2. Submitter type: Individual, Team of Individuals, or Organization (required).
3. Country of residence (required).
4. `/feedback` Codex Session ID (required; retrieve it from the Codex session containing the majority of the implementation work).
5. Private Judge Access Code.
