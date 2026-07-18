# Progress log

## 2026-07-18 — prototype baseline and interaction polish

### Done this session

- Built the static Choice Atlas React/Vite prototype with a single forked SVG decision landscape, accessible landmarks, keyboard focus, reduced-motion support, and mobile styles.
- Defined the provider-agnostic `FutureMap` contract and a static preset that separates knowns, assumptions, unknowns, trade-offs, questions, and Not yet without a recommendation field.
- Added a future server-route seam that intentionally fails until a provider and validation are configured.
- Created `main` and `dev` branches, added a GitHub pull-request source guard for `dev` → `main`, and opened the existing dev-to-main pull request.
- Refined the uncommitted UI: every selected priority now changes its map area, the priority emphasis is named accessibly, the horizon label updates, and the narrow mobile map has less landmark crowding.
- Verified the current implementation with `npm run check`, `npm run build`, `git diff --check`, and manual interaction checks.
- Checked pull request [#1](https://github.com/jwlai-cloud/choice-atlas/pull/1): the `Require dev source branch`, CodeRabbit, and Sourcery checks pass; Gemini Code Assist and Sourcery supplied no actionable review comments.
- Added this living documentation baseline and the static-demo ADR.

### In progress (not done, don't claim it is)

- Current UI and documentation changes are uncommitted on `dev`.
- The static preset remains the only data source; the future model route has no provider, schema runtime validation, or endpoint framework.

### Next (priority order)

1. Review and approve `docs/SPEC.md`; it determines whether the next milestone is model integration, further demo polish, or deployment/submission assets.
2. Commit the current interaction polish and documentation as a small, reviewable `dev` commit; push it and update the existing PR.
3. Add automated browser coverage and runtime validation before enabling any model-powered path.
4. Confirm the `main` branch protection rule treats the `dev` source guard as a required status check.

### Open questions / blocked on

- Which live-model API and hosting target are approved for the post-static demo?
- Is live data desired before judging, or is a polished deterministic prototype the intended submission scope?
- Should the current dev-to-main PR be updated now, or should this work be split into a separate documentation/polish PR?

### Changed since last entry

- There was no prior progress log. The product is now explicitly documented as a static prototype; this preserves the existing no-key decision recorded in [ADR 0001](adr/0001-static-preset-before-model-integration.md).
