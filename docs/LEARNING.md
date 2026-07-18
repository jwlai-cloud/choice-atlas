# Tech breakdown — what we used and why

## React

**What it actually does:** React renders the interface from component state. In Choice Atlas, `useState` holds the two route labels, selected priorities, horizon, and the currently focused landmark; `useMemo` finds the corresponding evidence detail.

**Why we chose it over alternatives:** It is a compact way to make the static prototype genuinely interactive while keeping all presentational logic in one small client application. See [ADR 0001](adr/0001-static-preset-before-model-integration.md) for why this interaction is not coupled to a model yet.

**The specific parts we used:** `useState`, `useMemo`, `StrictMode`, and `createRoot`.

**What surprised us / what we'd tell someone learning this for the first time:** Interactivity does not need a backend. The important boundary is to avoid letting convenient UI state masquerade as personalized analysis.

**Primary sources used while building this:**

- [React documentation](https://react.dev/learn) — component state and rendering model.
- [React `useState` reference](https://react.dev/reference/react/useState) — local interactive state.

---

## TypeScript and FutureMap

**What it actually does:** TypeScript checks the shape of the app’s data before it reaches the UI. `FutureMap` describes the result a future server route must return, and the static preset proves the UI can render that shape.

**Why we chose it over alternatives:** A shared contract reduces the chance that a later model integration quietly introduces predictions or recommendation fields the product must not expose.

**The specific parts we used:** string unions for evidence state and horizon; interfaces for `AtlasInput`, `AtlasItem`, and `FutureMap`; `tsc -b` for type checking.

**What surprised us / what we'd tell someone learning this for the first time:** Types do not validate live JSON at runtime. Before calling a model, this contract still needs a runtime schema validator and tests.

**Primary sources used while building this:**

- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — type-system concepts.
- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) — safe discriminated data handling.

---

## Vite and CSS/SVG

**What it actually does:** Vite serves the local React app during development and bundles it for static production delivery. CSS and inline SVG create the paper, contour, route, fog, and focus effects without generated imagery or a 3D asset pipeline.

**Why we chose it over alternatives:** It keeps iteration fast and the visual artifact lightweight, while preserving responsive and reduced-motion behavior.

**The specific parts we used:** the React Vite plugin, `npm run dev`, `npm run build`, CSS media queries, `prefers-reduced-motion`, SVG paths, gradients, and filters.

**What surprised us / what we'd tell someone learning this for the first time:** SVG is a strong middle ground for art-directed interaction: it stays crisp, semantic UI can sit above it, and its motion can remain meaningful instead of ornamental.

**Primary sources used while building this:**

- [Vite guide](https://vite.dev/guide/) — local development and production build workflow.
- [MDN: SVG](https://developer.mozilla.org/docs/Web/SVG) — vector graphics primitives.
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion) — accessible motion fallback.
