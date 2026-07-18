# Choice Atlas

A static, judge-ready Build Week prototype for meaningful two-option decisions. It maps uncertainty without predicting an outcome or recommending a choice.

## Run it

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run check
npm run build
npm run preview
```

## Demo narrative (about 90 seconds)

1. Start with the proposition: **“For decisions too human to optimize.”** Enter the two real routes, select up to three priorities, and choose the horizon.
2. Click **Map the uncertainty**. The prototype uses a static preset so the experience always works without an API key; the map remains one shared field rather than presenting two competing answer screens.
3. Read the terrain: solid squares are knowns, outlined squares are assumptions, and soft fog marks unknowns. Hover or tab through landmarks to reveal their plain-language evidence note. The first selected priority changes emphasis in the relevant part of the terrain.
4. Scroll through named trade-offs and questions that could genuinely change the map. Close on **Not yet**: a field-test path that respects uncertainty instead of forcing a premature verdict.
5. Point to `src/lib/futureMap.ts` for the typed `FutureMap` data contract and `server/routes/atlas.ts` for the server-side integration seam. The later GPT-5.6 prompt should return validated contract data only—knowns, assumptions, unknowns, tensions, questions, and not-yet—not a recommendation.

## Deliberate limitation

The present UI is a preset experience: changes to user input refresh the demo state and route labels, while the analysis data remains the carefully chosen example. This makes the Build Week demo reliable and avoids pretending a static prototype has model insight.

## Project structure

- `src/App.tsx` — accessible interactive prototype and SVG landscape
- `src/styles.css` — responsive editorial visual system and reduced-motion support
- `src/lib/futureMap.ts` — provider-agnostic client data contract + preset
- `server/routes/atlas.ts` — future server route stub; no API key or model call included
