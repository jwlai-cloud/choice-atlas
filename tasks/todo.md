# Live mapping tasks

## Task 1: Test and validation foundation

**Description:** Add the smallest test runner and runtime validation dependency set, with scripts that work locally and in CI.

**Acceptance criteria:**
- [x] `npm test` runs a deterministic local suite.
- [x] Production source can import the selected runtime schema package.

**Verification:**
- [ ] Run `npm test`.
- [ ] Run `npm run build`.

**Dependencies:** None

**Files likely touched:** `package.json`, `package-lock.json`, `vite.config.ts`

**Estimated scope:** Small

## Task 2: Contract validation

**Description:** Make `AtlasInput` and `FutureMap` safe at runtime before any model response reaches the UI.

**Acceptance criteria:**
- [x] Valid two-option input passes.
- [x] Empty, duplicate, or over-limit input fails.
- [x] A response containing a recommendation or malformed evidence item fails.

**Verification:**
- [ ] Run the focused contract tests and then `npm test`.

**Dependencies:** Task 1

**Files likely touched:** `src/lib/futureMap.ts`, `src/lib/futureMap.test.ts`

**Estimated scope:** Small

## Task 3: OpenAI generation service

**Description:** Create a small server-only service that calls GPT-5.6 and returns a validated `FutureMap`.

**Acceptance criteria:**
- [x] The model receives constraints that forbid prediction and recommendations.
- [x] Provider JSON is parsed and validated before return.
- [x] Provider errors are distinguishable from validation errors.

**Verification:**
- [ ] Run mocked service tests and `npm run build`.

**Dependencies:** Task 2 and current official OpenAI API documentation

**Files likely touched:** `src/lib/atlasService.ts`, `src/lib/atlasService.test.ts`, `server/routes/atlas.ts`

**Estimated scope:** Medium

## Task 4: Vercel endpoint

**Description:** Expose the validated service through a single `POST /api/atlas` function.

**Acceptance criteria:**
- [x] Valid JSON input returns a validated map.
- [x] Invalid method/input/model configuration returns a safe error status.
- [x] The endpoint never serializes provider credentials.

**Verification:**
- [ ] Run endpoint tests and `npm run build`.

**Dependencies:** Task 3

**Files likely touched:** `api/atlas.ts`, `api/atlas.test.ts`, `vercel.json`

**Estimated scope:** Small

## Task 5: Live map UI

**Description:** Make the existing map action request live data and render accessible loading, error, and fallback states.

**Acceptance criteria:**
- [x] A successful response replaces the preset content.
- [x] A failed request retains a clearly labelled preset fallback.
- [x] Repeated requests do not leave stale or inaccessible status text.

**Verification:**
- [ ] Run component tests, `npm test`, and a browser flow.

**Dependencies:** Task 4

**Files likely touched:** `src/App.tsx`, `src/App.test.tsx`, `src/styles.css`

**Estimated scope:** Medium

## Task 6: Delivery proof

**Description:** Verify the production path and update live documentation for a Vercel deployment.

**Acceptance criteria:**
- [x] README explains `OPENAI_API_KEY` setup without exposing a secret.
- [x] Architecture, learning notes, and progress log match the final state.
- [ ] PR has current commits and reviewed checks.

**Verification:**
- [ ] Run all checks and browser verification.
- [ ] Inspect PR check and review state.

**Dependencies:** Task 5

**Files likely touched:** `README.md`, `docs/ARCHITECTURE.md`, `docs/LEARNING.md`, `docs/PROGRESS.md`

**Estimated scope:** Small
