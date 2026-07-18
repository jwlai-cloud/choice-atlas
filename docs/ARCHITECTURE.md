# Architecture

## One-paragraph summary

Choice Atlas is a client-rendered React prototype for exploring a two-option life decision without forcing a verdict. The user supplies two route labels, up to three priorities, and a horizon; the UI renders a shared SVG decision landscape backed by a typed, static `FutureMap` preset. A server-side integration seam is present for a future validated model response, but no network model call occurs today.

## Components

- `src/App.tsx` owns the intake controls, selected priority and horizon state, landmark focus state, and all presentational sections. It does not generate analysis or call a model.
- `src/lib/futureMap.ts` defines `AtlasInput`, `AtlasItem`, and `FutureMap`, then exports the reliable static demo dataset. It intentionally has no recommendation field.
- `src/styles.css` provides the editorial visual system, purposeful route/fog motion, responsive breakpoints, and reduced-motion fallback. It does not contain decision logic.
- `server/routes/atlas.ts` is a server-only seam for a future `POST /api/atlas` implementation. It currently throws rather than pretending a provider is configured.
- `.github/workflows/enforce-main-source.yml` checks that pull requests targeting `main` originate from `dev`.

## Data flow

1. Person → enters exactly two route labels, selects zero to three priorities, and selects a horizon.
2. React intake controls → update local component state.
3. Person → activates “Map the uncertainty.”
4. App → confirms both labels exist, updates the static-demo status, and renders labels, priority emphasis, and horizon in the landscape.
5. App → reads `presetFutureMap` to render knowns, assumptions, unknowns, trade-offs, questions, and the Not yet field test.
6. Person → focuses or hovers a landmark; App → reveals the corresponding typed detail in the reading panel.
7. Future only: server route → accepts `AtlasInput`, calls an approved model, validates output against `FutureMap`, and returns only classification and question data.

## External dependencies

- React and React DOM provide client rendering and local state.
- Vite provides development serving and production bundling.
- TypeScript provides compile-time checking.
- Google Fonts are loaded by CSS for the current editorial type treatment.
- No model provider, database, analytics platform, or deployment host is configured.

## Deployment topology

No deployment is configured. Today the application runs locally through Vite and can be emitted as static assets with `npm run build`. A future model route requires a server-capable host and a server-side secret store; it must not be deployed as client-only code with a browser-exposed API key.

## Known limitations / non-goals

- The analysis content is a fixed illustrative preset; changing inputs updates only the user-controlled labels, priorities, and horizon.
- The map does not forecast outcomes, rank options, or recommend a choice.
- `server/routes/atlas.ts` is a stub, not an active API endpoint or response validator.
- Automated UI and contract tests have not yet been added.
