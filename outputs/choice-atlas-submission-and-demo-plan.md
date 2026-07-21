# Choice Atlas — submission and demo plan

## Verified production state

Verified on 2026-07-19 (Australia/Perth). Reconfirm the live path immediately before final recording.

- Live app: <https://choice-atlas-lac.vercel.app/>
- The judge gate loads and the configured test code unlocks a signed browser session.
- A real GPT-5.6 map completed in production for: “Continue leading the Perth team” versus “Join the Berlin studio.”
- The live result was labelled **Live GPT-5.6 map**, rendered the evidence landscape, and supported landmark detail interaction.
- Browser console: no errors or warnings observed.
- Observed cold live-map time: approximately 47 seconds. Record a pre-warmed completed result rather than waiting through this in the final cut.
- The post-map experience is now a four-part briefing: **Ground**, **Tension**, **Fieldwork**, then the full **Landscape**. Ground leads with an animated, data-driven decision-weather visual—two route currents, a central tension, fogged unknowns, and priority-sensitive emphasis—rather than a text report. A local browser pass verified each stage, its mobile layout, and a clean console.
- The repeated-landmark edge case is fixed: if a live response has no shared unknown, the map omits that optional marker rather than repeating another unknown.
- The intake now offers three curated, editable quick starts—**Stay or move**, **Lead or make**, and **Build or return**—alongside free-form routes. During a live request, an explicit cartography progress state cycles through ground, tension, and unknowns rather than leaving a generic loading button.

## Devpost story draft

### Choice Atlas

**An uncertainty cartographer for meaningful two-option dilemmas—showing the shape of a choice without pretending to know its answer.**

#### Inspiration

Some decisions are too human to reduce to a pros-and-cons list: stay and lead the team you know, or move for a role that may change your work and life. In those moments, people do not need another system confidently choosing for them. They need help separating what is already true, what they are assuming, what remains unknowable, and what question would make the next step clearer.

#### What it does

Choice Atlas turns exactly two possible routes, up to three priorities, and a time horizon into one explorable decision landscape.

1. A person names the two routes and the values that matter locally.
2. GPT-5.6 runs live on those exact inputs—real-time inference for that specific dilemma, not a canned template—and, acting as an uncertainty cartographer, returns structured knowns, assumptions, unknowns, trade-offs, investigation questions, and a “Not yet” field test.
3. The interface first reveals one useful lens at a time—known ground, a single trade-off, then a next question—before opening the complete field.
4. The full landscape renders solid marks for knowns, translucent marks for assumptions, and fog for unknowns.

The differentiator is deliberate restraint: Choice Atlas does not predict a future or recommend a route. It makes future possibilities and uncertainty visible as reference material for the person who must live with the choice.

#### How we built it

- **Experience:** React + Vite with an animated, responsive four-stage decision briefing, a keyboard-accessible SVG landscape, and reduced-motion support.
- **AI boundary:** OpenAI Responses API with **GPT-5.6** and Zod structured output.
- **Safety contract:** a strict `FutureMap` schema accepts only the requested categories and rejects undeclared recommendation-like output; server validation also checks that returned routes match the original request.
- **Deployment:** Vercel serves the client and two serverless functions.
- **Judge access:** a manually entered code is compared server-side using a SHA-256 hash, then exchanged for a four-hour signed `Secure`, `HttpOnly`, `SameSite=Lax` cookie. The code is never put in a URL or browser storage.

#### Challenges we ran into

- Structured model output needed to be compatible with OpenAI’s schema requirements while preserving the product’s stricter internal rule of exactly two distinct routes. We separated the model-facing array schema from the internal tuple validation boundary.
- A live model can be slow or unavailable during a demo. The app keeps a clearly labelled illustrative preset as a reliability path rather than pretending it is personalised analysis.
- Model output must be useful without becoming advice. The prompt, schema, and UI all reinforce “map uncertainty; do not choose.”

#### Accomplishments we’re proud of

- **38 automated tests** covering the contract, model boundary, server endpoints, public-demo and judge-session modes, browser client behaviour, landscape placement, and demo scenarios.
- **One verified production live mapping** through the complete judge-gate → GPT-5.6 → validated visual-map path.
- A real interactive landscape instead of a chat transcript or two answer screens.

#### What we learned

The most responsible AI interaction for a personal dilemma may be one that reduces false certainty rather than maximising confidence. Structured output and runtime validation are not only engineering hygiene here—they preserve the product’s ethical boundary.

#### What’s next

- Improve visual placement when a live response has uneven evidence categories.
- Add user-controlled follow-up evidence capture without storing private dilemmas by default.
- Add evaluation cases for no-recommendation language and evidence-category coverage.

#### Built with

OpenAI API, GPT-5.6, OpenAI Responses API, React, Vite, TypeScript, Zod, Vercel, SVG, Vitest.

#### Try it out

- Live demo: <https://choice-atlas-lac.vercel.app/>
- Source: <https://github.com/jwlai-cloud/choice-atlas>
- Judge code: provide separately in Devpost’s private judge-instructions field.

## Final demo video (2:55 live UI walkthrough)

The submission cut is a live, screen-driven walkthrough at 1920×1080, running **2:55** (5 seconds under the three-minute cap). It is at `outputs/video/choice-atlas-demo-v2-1080p.mp4`; the timed narration script is `outputs/demo-script-v5.md`, and the silent master is `outputs/video/choice-atlas-demo-v2-1080p-silent.mp4`. The narration names both **Codex** (build-time coding agent) and **GPT-5.6** (live runtime model) explicitly.

Unlike a stills montage, the video drives the real deployed UI. It types **custom** routes ("Take the job offer in another city" vs "Stay near family and friends"), fires a live GPT-5.6 request, and lands on a **Live GPT-5.6 map** whose content is clearly generated for that exact input — visible proof the mapping is live, not a preset.

| Time | On screen (real UI) | Narration beat |
|---|---|---|
| 0:00–0:38 | Hero + the pain: forks in the road; advice that doesn't fit. | State the real problem in plain language. |
| 0:38–0:55 | Type two custom routes into the intake. | You supply the two real routes, in your own words. |
| 0:55–1:08 | Select priorities + time horizon. | What matters, over what horizon. |
| 1:08–1:25 | Click Map → GPT-5.6 works live (cold wait trimmed). | The model reasons on your exact routes, right now. |
| 1:25–1:45 | Live GPT-5.6 map — decision-weather first read. | Known ground, tension, and honest fog; never a prediction. |
| 1:45–2:17 | Tension → Fieldwork tabs: a trade-off, a question, "Not yet". | One piece at a time; a small reversible next step. |
| 2:17–2:37 | Landscape tab; hover a signal for its evidence note. | Explore the whole field; priorities shift emphasis. |
| 2:37–2:55 | Build-week evidence + limitation, then close. | Built with Codex; the model maps, it never decides. |

## Capture and edit pipeline

1. **Automated live capture.** `scripts/capture-demo.mjs` (Playwright) drives the deployed UI at 1920×1080 — typing, clicking, scrolling — and records the real motion, including the live GPT-5.6 response. It is deterministic and re-runnable; the long cold model call is auto-excised in post so the cut stays tight. Do not film any access-code entry, the Vercel dashboard, or any secret.
2. **Render.** The script normalizes to 1920×1080 / 30 fps and outputs a silent master.
3. **Voice-over.** Narration is generated from `outputs/demo-script-v5.md` with OpenAI `gpt-4o-mini-tts` via `npm run demo:voice` (an ElevenLabs track can be dropped in instead and swapped with the same mux step). It explicitly credits Codex and GPT-5.6.
4. **Mux and fit under the cap.** Fit the video and narration to a single target under 3:00 — video `setpts`, pitch-preserved audio `atempo` — with `loudnorm=I=-16:LRA=11:TP=-1.5`, then re-probe the final duration to confirm it is under the limit.
