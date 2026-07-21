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

This lands hardest on young people facing their first high-stakes forks—take the job in another city or stay near the people they love, commit to the startup or return to steady work. The fear of “choosing wrong” is heavy, and the usual help makes it heavier: a confident answer that ignores their life, or a pros-and-cons list that flattens it.

The benefit is a calmer, clearer decision. Choice Atlas separates what you already know from what you are only assuming and what genuinely cannot be known yet—so the fog that fuels second-guessing shrinks, the single most useful next question becomes obvious, and the choice stays yours. You are not told what to do; you get to decide with more confidence and less regret. And because the map is generated live for your exact situation, the clarity is about *your* decision, not a generic template.

### What it does

Choice Atlas turns exactly two routes, up to three priorities, and a time horizon into one interactive decision landscape.

1. A person starts from an editable dilemma or a quick-start scenario.
2. GPT-5.6 runs live on those exact inputs—real-time inference for that specific dilemma, generated fresh each time, not a canned template—acting as an uncertainty cartographer: it returns structured knowns, assumptions, unknowns, trade-offs, investigation questions, and a “Not yet” field test.
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

- 38 automated tests across the data contract, model boundary, server endpoints, public-demo and judge-session modes, browser client, and demo scenarios.
- A verified production path where a **live** GPT-5.6 call on the user's own two routes flows through protected access → validated FutureMap → interactive visual field—demonstrated live on custom routes in the demo video.
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

Enter the private Judge Access Code supplied in the submission form, then edit both routes to any real two-way dilemma of your own — or start from a quick-start — and click **Map the uncertainty**. A successful result reads **Live GPT-5.6 map**. Because you can type your own routes, the result is visibly generated live for that exact input rather than served from a preset.

## Remaining Devpost fields to provide manually

1. Final public YouTube video URL (required).
2. Submitter type: Individual, Team of Individuals, or Organization (required).
3. Country of residence (required).
4. `/feedback` Codex Session ID (required; retrieve it from the Codex session containing the majority of the implementation work).
5. Private Judge Access Code.
