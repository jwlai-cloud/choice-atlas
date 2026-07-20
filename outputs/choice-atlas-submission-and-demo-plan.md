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
2. GPT-5.6 acts as an uncertainty cartographer and returns structured knowns, assumptions, unknowns, trade-offs, investigation questions, and a “Not yet” field test.
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

## Final 2:03 demo storyboard and narration

The rendered 1080p cut is exactly 2:03, leaving a 57-second margin below the three-minute limit. It is available at `outputs/video/choice-atlas-build-week-demo-1080p.mp4`; its premium voice-over source and edit script are retained alongside it for review.

| Time | On screen | Narration | Edit direction |
|---|---|---|---|
| 0:00–0:15 | Hero: “A decision changes more than one life.” | The family benefit and problem. | Editorial fade. |
| 0:15–0:35 | Quick-start, editable two-route intake. | Start with exactly two meaningful routes. | Captioned screen proof. |
| 0:35–0:50 | Verified live GPT-5.6 map. | Ground, assumptions, and unknowns—not a prediction. | Cut around the observed cold wait. |
| 0:50–1:12 | Animated decision-weather field. | Visual first reading: route currents, tension, and fog. | Captioned visual focus. |
| 1:12–1:35 | Architecture handshake. | Protected judge session → GPT-5.6 → Zod FutureMap → visual field. | Native 1080p graphic. |
| 1:35–1:55 | Proof card. | Codex-built, 38 tests, production live map, and no-advice boundary. | High-contrast proof point. |
| 1:55–2:03 | Closing hero. | “A better map for the decision you still own.” | Gentle fade. |

## Capture and edit plan

1. **Browser Use for clean proof and stills.** Use the in-app browser to create a dedicated, notification-free session; pre-unlock it; capture the hero, intake, live-map, focused-signal, trade-offs, and Not yet frames. Browser Use is ideal for verifying the UI, inspecting the live label, and taking repeatable screenshots. It does not provide a video-recording API in this session.
2. **Screen recording for motion.** Record only the browser window in a clean dedicated profile or via the operating system’s screen recorder. The footage will show typed routes and priority selection, then cut from the Map click to the completed live map so judges do not wait through the observed cold request. Do not record the access-code entry, Vercel dashboard, or any secret.
3. **Architecture card.** Build a compact SVG/Mermaid-style graphic from the five-stage sequence above—not a generic AI diagram.
4. **Edit.** The checked-in edit is normalized to 1920×1080 at 30 fps with short fades and readable captions. Watch once muted to ensure the visual narrative stands on its own.
5. **Voice-over.** This Mac has the locally installed `Karen (Premium)` English-Australian voice. Set `VOICE` to any installed compatible macOS voice (list them with `say -v '?'`) before rendering. After the narration is approved, generate a clean voice track and normalize it:

   ```bash
   VOICE="Karen (Premium)"
   say -v "$VOICE" -r 178 -f demo-voiceover.txt -o choice-atlas-voiceover.aiff
   ffmpeg -i choice-atlas-voiceover.aiff -af "loudnorm=I=-16:LRA=11:TP=-1.5" choice-atlas-voiceover.m4a
   ```

   Then mix it beneath the finished video with FFmpeg, using a low-level ambient bed only if it does not compete with the narration.
