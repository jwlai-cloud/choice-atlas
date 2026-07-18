# Tech breakdown — what we used and why

## React, Vite, CSS, and SVG

**What it does:** React holds the two options, priorities, horizon, mapping state, and focused landmark. Vite serves and bundles the client. CSS and inline SVG create the paper, route, contour, fog, and priority treatments without generated images or a 3D scene.

**Why this fit:** The project needed one explorable landscape, not a slideshow. SVG stays crisp on mobile, remains accessible when semantic controls sit over it, and supports reduced-motion treatment. Vite keeps the client artifact lean while Vercel supplies the one serverless function the live path needs.

**Useful sources:** [React state](https://react.dev/reference/react/useState), [Vite guide](https://vite.dev/guide/), [MDN SVG](https://developer.mozilla.org/docs/Web/SVG), and [reduced motion](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion).

## TypeScript, Zod, and the FutureMap contract

**What it does:** TypeScript gives the interface compile-time guidance; Zod verifies untrusted request and model JSON at runtime. `FutureMapSchema` is strict, categorises evidence by status, and has no recommendation field.

**Why this fit:** A model response is external input. A static TypeScript interface alone cannot stop malformed JSON or unrequested fields from reaching a judge-facing UI. Centralising the contract lets the static fallback, endpoint, and live map share a single shape.

**What we learned:** OpenAI's Zod structured-output helper requires object properties to be represented as required. Values that are logically optional need to be nullable in the schema instead. That surfaced immediately in a mocked request test and is now explicit for `option` and `priority`.

**Useful sources:** [Zod](https://zod.dev/), [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html), and OpenAI's [structured outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs).

## OpenAI Responses API and GPT-5.6

**What it does:** The Vercel function uses `openai.responses.parse` with `zodTextFormat`. GPT-5.6 returns a parsed value that still passes through Choice Atlas's own service validation before rendering.

**Why this fit:** Structured outputs are a better boundary for this product than free-form prose: the model can supply classifications and investigate-next questions while the product contract preserves the no-prediction/no-recommendation rule.

**What we learned:** The prompt is necessary but not sufficient. Prompt constraints steer behavior; strict runtime parsing and a source-labelled fallback contain failures when a response is missing, malformed, or unavailable.

**Useful sources:** [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) and [GPT-5.6 guidance](https://developers.openai.com/api/docs/guides/model-guidance?model=gpt-5.6).

## Vercel Functions

**What it does:** `api/atlas.ts` receives POST requests and reads `OPENAI_API_KEY` only from its server environment. Vercel serves the built client separately from this function.

**Why this fit:** It preserves the simple Vite client while moving the one secret-bearing operation off-device. It is a direct deployment target for the hackathon demo without committing a key or building a separate long-running backend.

**Useful source:** [Vercel Functions](https://vercel.com/docs/functions).
