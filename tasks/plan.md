# Implementation Plan: Live Choice Atlas mapping

## Overview

Add a secure GPT-5.6-backed mapping path to the existing Vite prototype without changing the core uncertainty-first experience. The work is contract-first and test-driven: validate input and model output, expose one Vercel endpoint, connect the existing map UI, then prove the flow through unit, endpoint, and browser tests.

## Architecture decisions

- Keep the present Vite + React client; add only the Vercel function needed for server-side secrets.
- Use the OpenAI Responses API from the function, never the browser.
- Treat Zod validation as the authority between untrusted model JSON and the UI.
- Retain and label the static preset as an offline/service-failure fallback.

## Dependency graph

```text
FutureMap contract + input limits
        ↓
runtime schemas + unit tests
        ↓
OpenAI service boundary + endpoint tests
        ↓
Vercel /api/atlas function
        ↓
React request state + browser verification
```

## Task list

### Phase 1: Foundation

- [ ] Task 1: Install the test/validation/runtime dependencies and define test commands.
- [ ] Task 2: Add runtime schemas and pure validation tests for `AtlasInput` and `FutureMap`.

### Checkpoint: Foundation

- [ ] Unit tests fail before implementation, pass after it, and `npm run build` remains clean.

### Phase 2: Live service slice

- [ ] Task 3: Implement the isolated OpenAI generation service with mocked-boundary tests.
- [ ] Task 4: Implement the Vercel `POST /api/atlas` handler and endpoint tests for success, malformed input, unavailable key, and invalid provider output.

### Checkpoint: Service

- [ ] No request can return unvalidated output or a recommendation field.
- [ ] The API key is referenced only in server code.

### Phase 3: User-facing integration

- [ ] Task 5: Connect the map action to `/api/atlas`, expose accessible loading/error/fallback state, and render the live map.
- [ ] Task 6: Verify the browser flow and document Vercel environment setup and demo narrative.

### Checkpoint: Complete

- [ ] Tests, type check, production build, and browser verification pass.
- [ ] Commits are pushed to `dev`, PR checks are reviewed, and docs reflect the deployed architecture.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| GPT response is malformed | High | Strict schema, server-side parsing, truthful preset fallback |
| API key leaks into client | High | Vercel function boundary, no `VITE_` key, source review |
| API latency affects demo | Medium | Visible mapping state and deterministic fallback |
| API syntax drifts | Medium | Verify against current official OpenAI docs before implementation |

## Open questions

- Await a Codex restart to activate the installed OpenAI Docs MCP connector, then verify the exact GPT-5.6 Responses API structured-output syntax before Task 3.
