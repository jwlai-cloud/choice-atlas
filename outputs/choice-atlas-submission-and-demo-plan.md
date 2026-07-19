# Choice Atlas — submission and demo plan

## Verified production state

- Live app: <https://choice-atlas-lac.vercel.app/>
- The judge gate loads and the configured test code unlocks a signed browser session.
- A real GPT-5.6 map completed in production for: “Continue leading the Perth team” versus “Join the Berlin studio.”
- The live result was labelled **Live GPT-5.6 map**, rendered the evidence landscape, and supported landmark detail interaction.
- Browser console: no errors or warnings observed.
- Observed cold live-map time: approximately 47 seconds. Record a pre-warmed completed result rather than waiting through this in the final cut.
- The post-map experience is now a four-part briefing: **Ground**, **Tension**, **Fieldwork**, then the full **Landscape**. A local browser pass verified each stage, its mobile layout, and a clean console.
- The repeated-landmark edge case is fixed: if a live response has no shared unknown, the map omits that optional marker rather than repeating another unknown.
- The intake now offers three curated, editable quick starts—**Stay or move**, **Lead or make**, and **Build or return**—alongside free-form routes. During a live request, an explicit cartography progress state cycles through ground, tension, and unknowns rather than leaving a generic loading button.

## Devpost story draft

# Choice Atlas

**An uncertainty cartographer for meaningful two-option dilemmas—showing the shape of a choice without pretending to know its answer.**

## Inspiration

Some decisions are too human to reduce to a pros-and-cons list: stay and lead the team you know, or move for a role that may change your work and life. In those moments, people do not need another system confidently choosing for them. They need help separating what is already true, what they are assuming, what remains unknowable, and what question would make the next step clearer.

## What it does

Choice Atlas turns exactly two possible routes, up to three priorities, and a time horizon into one explorable decision landscape.

1. A person names the two routes and the values that matter locally.
2. GPT-5.6 acts as an uncertainty cartographer and returns structured knowns, assumptions, unknowns, trade-offs, investigation questions, and a “Not yet” field test.
3. The interface first reveals one useful lens at a time—known ground, a single trade-off, then a next question—before opening the complete field.
4. The full landscape renders solid marks for knowns, translucent marks for assumptions, and fog for unknowns.

The differentiator is deliberate restraint: Choice Atlas does not predict a future or recommend a route. It makes future possibilities and uncertainty visible as reference material for the person who must live with the choice.

## How we built it

- **Experience:** React + Vite with an animated, responsive four-stage decision briefing, a keyboard-accessible SVG landscape, and reduced-motion support.
- **AI boundary:** OpenAI Responses API with **GPT-5.6** and Zod structured output.
- **Safety contract:** a strict `FutureMap` schema accepts only the requested categories and rejects undeclared recommendation-like output; server validation also checks that returned routes match the original request.
- **Deployment:** Vercel serves the client and two serverless functions.
- **Judge access:** a manually entered code is compared server-side using a SHA-256 hash, then exchanged for a four-hour signed `Secure`, `HttpOnly`, `SameSite=Lax` cookie. The code is never put in a URL or browser storage.

## Challenges we ran into

- Structured model output needed to be compatible with OpenAI’s schema requirements while preserving the product’s stricter internal rule of exactly two distinct routes. We separated the model-facing array schema from the internal tuple validation boundary.
- A live model can be slow or unavailable during a demo. The app keeps a clearly labelled illustrative preset as a reliability path rather than pretending it is personalised analysis.
- Model output must be useful without becoming advice. The prompt, schema, and UI all reinforce “map uncertainty; do not choose.”

## Accomplishments we’re proud of

- **31 automated tests** covering the contract, model boundary, server endpoints, judge session, browser client behaviour, and landscape placement.
- **One verified production live mapping** through the complete judge-gate → GPT-5.6 → validated visual-map path.
- A real interactive landscape instead of a chat transcript or two answer screens.

## What we learned

The most responsible AI interaction for a personal dilemma may be one that reduces false certainty rather than maximising confidence. Structured output and runtime validation are not only engineering hygiene here—they preserve the product’s ethical boundary.

## What’s next

- Improve visual placement when a live response has uneven evidence categories.
- Add user-controlled follow-up evidence capture without storing private dilemmas by default.
- Add evaluation cases for no-recommendation language and evidence-category coverage.

## Built with

OpenAI API, GPT-5.6, OpenAI Responses API, React, Vite, TypeScript, Zod, Vercel, SVG, Vitest.

## Try it out

- Live demo: <https://choice-atlas-lac.vercel.app/>
- Source: <https://github.com/jwlai-cloud/choice-atlas>
- Judge code: provide separately in Devpost’s private judge-instructions field.

## Two-minute demo storyboard and narration

| Time | On screen | Narration | Edit direction |
|---|---|---|---|
| 0:00–0:12 | Title and the hero line: “Don’t force a verdict. Learn the shape of the choice.” | “When a choice could change your life, a confident answer can be the least helpful thing. Choice Atlas helps you see the shape of uncertainty before you decide.” | Quiet fade in; hold the editorial typography. |
| 0:12–0:32 | Choose the **Stay or move** quick start, then edit one route to prove it is not a canned demo. Select priorities and one-year horizon. | “Start from a meaningful dilemma, or make the fork your own. Choice Atlas always keeps exactly two routes, the values that matter, and a time horizon in view.” | Cursor selects the quick start, then edits a few words. Never show the judge code. |
| 0:32–0:44 | Brief unlocked live-demo state, Map button, then the cartography progress sequence. | “For the live demo, GPT-5.6 maps the field through a protected server-side session. While it works, the interface tells you what it is doing: reading the ground, finding the tension, and protecting the unknowns.” | Use an already-unlocked clean session; record one progress beat, then cut to the completed response. |
| 0:44–1:10 | Completed **Ground** briefing labelled “Live GPT-5.6 map,” then switch to **Tension**. | “Instead of a verdict, GPT-5.6 returns a structured map. We begin with what is known, then bring one trade-off into focus—without pretending either route wins.” | Cut past the cold model wait. Let the Ground-to-Tension transition carry the visual change. |
| 1:10–1:32 | Switch to **Fieldwork**, reveal one question and “Not yet,” then open the full Landscape. | “Next, Choice Atlas shows the question most likely to change the map. The third route is ‘Not yet’: a reversible field test, not a disguised recommendation. Only then do we open the full field—solid knowns, translucent assumptions, and fogged unknowns.” | Move one stage at a time; slow zoom only after the complete field appears. |
| 1:32–1:50 | Architecture graphic: person → secure judge session → GPT-5.6 structured response → Zod FutureMap → landscape. | “Under the surface, the model is constrained by a FutureMap contract. The Vercel function validates every response and rejects recommendation-shaped output before the browser renders anything.” | Static diagram with a gentle pan across the five stages. |
| 1:50–2:05 | Proof card: 29 tests, live production mapping, no recommendation boundary. | “We tested the contract, gate, client, and server in 29 automated tests, then verified the full live path in production.” | Large, readable numbers; hold for two seconds. |
| 2:05–2:18 | Hero / live URL / final line. | “Choice Atlas does not decide a life for you. It gives you a better map for the decision you still own.” | Fade to project name, live link, and Devpost call to action. |

## Capture and edit plan

1. **Browser Use for clean proof and stills.** Use the in-app browser to create a dedicated, notification-free session; pre-unlock it; capture the hero, intake, live-map, focused-signal, trade-offs, and Not yet frames. Browser Use is ideal for verifying the UI, inspecting the live label, and taking repeatable screenshots. It does not provide a video-recording API in this session.
2. **Screen recording for motion.** Record only the browser window in a clean dedicated profile or via the operating system’s screen recorder. The footage will show typed routes and priority selection, then cut from the Map click to the completed live map so judges do not wait through the observed cold request. Do not record the access-code entry, Vercel dashboard, or any secret.
3. **Architecture card.** Build a compact SVG/Mermaid-style graphic from the five-stage sequence above—not a generic AI diagram.
4. **Edit.** Normalize clips to 1280×720 at 30 fps; use short fades, a slow zoom on the map legend, and readable captions. Watch once muted to ensure the visual narrative stands on its own.
5. **Voice-over.** This Mac has the locally installed `Karen (Premium)` English-Australian voice. After the narration is approved, generate a clean voice track and normalize it:

   ```bash
   say -v "Karen (Premium)" -r 178 -f demo-voiceover.txt -o choice-atlas-voiceover.aiff
   ffmpeg -i choice-atlas-voiceover.aiff -af "loudnorm=I=-16:LRA=11:TP=-1.5" choice-atlas-voiceover.m4a
   ```

   Then mix it beneath the finished video with FFmpeg, using a low-level ambient bed only if it does not compete with the narration.
