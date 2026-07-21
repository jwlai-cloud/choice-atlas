# Choice Atlas — Devpost gallery (upload in this order)

All 1920×1080 (diagrams rendered at 2× / 3840×2160). First image = the gallery **cover/thumbnail**.
None show the access-code box. Images 02–04 are real frames from the **live** GPT-5.6 run on custom
routes ("Take the job offer in another city" vs "Stay near family and friends") — proof it's live, not a preset.

## Screenshots (live product)

| # | File | Caption |
|---|------|---------|
| 1 | `01-cover-hero.png` | Don't force a verdict — learn the shape of the choice. Name two routes to begin. |
| 2 | `02-live-gpt-map.png` | A **live GPT-5.6 map** of the user's own dilemma: known ground, assumptions, and honest fog — never a prediction. |
| 3 | `03-decision-briefing.png` | The map read in stages; the `Live GPT-5.6 map` label and a live trade-off ("Existing belonging versus social rebuilding"). |
| 4 | `04-fieldwork-and-evidence.png` | A live investigation question + the "Not yet" reversible path, over the "Made with Codex · Mapped with GPT-5.6" boundary. |

## Diagrams (rendered, on-brand)

| # | File | Answers |
|---|------|---------|
| 5 | `05-architecture.png` | **What are the pieces** — browser → Vercel functions → server safety boundary → GPT-5.6, with secrets/stateless callouts. |
| 6 | `06-sequence-handshake.png` | **What happens, in order** — judge unlock → cookie → /api/atlas → live GPT-5.6 → validation → map (10 steps). |
| 7 | `07-ai-topology.png` | **The two AI roles** — Codex (build time) vs GPT-5.6 (runtime), kept separate and inspectable. |
| 8 | `08-infographic.png` | **One-page summary** — problem, 5-step pipeline, headline numbers (38 / 1 / 0), tech row. |

Regenerate the diagrams with: `node scripts/render-diagrams.mjs`

Optional extra: `outputs/choice-atlas-demo-first-mobile.png` (responsive view; older build/preset content).
Not used: `choice-atlas-proof.png` (static card — superseded by image 04, avoids stale test-count text).
