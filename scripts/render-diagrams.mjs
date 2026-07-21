// Renders the four submission diagrams as 1920x1080 PNGs (retina) via headless Chromium.
// Run:  node scripts/render-diagrams.mjs   (playwright already installed in this repo)
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "outputs/gallery";
const TMP = "outputs/gallery/_tmp";
mkdirSync(TMP, { recursive: true });

const SHARED = `
*{box-sizing:border-box;margin:0;padding:0}
:root{
 --bg:#e7e1d6;--ink:#22302b;--sub:#5f6c62;--panel:#f2ede3;--pline:#d9d0bf;
 --client:#6f8390;--server:#5f7a5c;--safety:#c19a3d;--runtime:#b4552d;--codex:#375044;--blue:#3d5a6b;
}
body{width:1920px;height:1080px;background:var(--bg);color:var(--ink);
 font-family:Georgia,"Times New Roman",serif;padding:64px 84px;position:relative;overflow:hidden}
.mono{font-family:ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase}
.eyebrow{font-family:ui-monospace,Menlo,monospace;letter-spacing:.24em;text-transform:uppercase;
 font-size:15px;color:var(--runtime)}
h1{font-size:44px;font-weight:600;letter-spacing:-.01em;line-height:1.05;margin-top:14px}
.head .sub{color:var(--sub);font-size:21px;margin-top:12px;font-style:italic}
.flow{display:flex;align-items:stretch;margin-top:44px}
.stage{flex:1;display:flex;flex-direction:column;gap:16px}
.stage>.lab{font-family:ui-monospace,Menlo,monospace;font-size:14px;letter-spacing:.16em;
 text-transform:uppercase;color:var(--sub);padding-left:2px}
.arrow{display:flex;align-items:center;justify-content:center;color:var(--runtime);font-size:44px;width:70px;flex:none}
.card{background:var(--panel);border:1px solid var(--pline);border-left:6px solid var(--ac,#999);
 border-radius:12px;padding:18px 20px}
.card .k{font-family:ui-monospace,Menlo,monospace;font-size:12.5px;letter-spacing:.12em;
 text-transform:uppercase;color:var(--ac,#999)}
.card h3{font-size:22px;font-weight:600;margin:5px 0 4px}
.card p{font-size:16.5px;color:var(--sub);line-height:1.34}
.band{margin-top:34px;background:#efe8dc;border:1px solid var(--pline);border-radius:12px;
 padding:18px 24px;display:flex;gap:34px;align-items:center;font-size:17px;color:var(--ink)}
.band b{color:var(--runtime)}
.legend{position:absolute;left:84px;bottom:44px;display:flex;gap:26px;font-size:14px;color:var(--sub)}
.legend span{display:flex;align-items:center;gap:9px;font-family:ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;font-size:12.5px}
.dot{width:13px;height:13px;border-radius:3px;display:inline-block}
`;

const page1 = `
<div class="head">
 <div class="eyebrow">System Architecture</div>
 <h1>The guarded path from a human dilemma to a validated live map</h1>
</div>
<div class="flow">
 <div class="stage">
  <div class="lab">Browser · React + Vite</div>
  <div class="card" style="--ac:var(--client)"><div class="k">App.tsx</div><h3>Decision landscape</h3><p>Intake, staged briefing, SVG map, fallback state.</p></div>
  <div class="card" style="--ac:var(--client)"><div class="k">judgeAccessClient.ts</div><h3>Unlock</h3><p>Exchanges a typed code for a session. Never stores or URL-encodes it.</p></div>
  <div class="card" style="--ac:var(--client)"><div class="k">atlasClient.ts</div><h3>Map request</h3><p>POST /api/atlas; parses + surfaces safe errors.</p></div>
 </div>
 <div class="arrow">&rarr;</div>
 <div class="stage">
  <div class="lab">Vercel serverless</div>
  <div class="card" style="--ac:var(--server)"><div class="k">api/judge-access.ts</div><h3>Judge gate</h3><p>SHA-256 timing-safe check &rarr; 4h signed <span class="mono" style="font-size:13px">__Host</span> HttpOnly cookie.</p></div>
  <div class="card" style="--ac:var(--server)"><div class="k">api/atlas.ts</div><h3>Cookie-gated endpoint</h3><p>Requires the session before any input is parsed or GPT is reached.</p></div>
 </div>
 <div class="arrow">&rarr;</div>
 <div class="stage">
  <div class="lab">Safety boundary · server-only</div>
  <div class="card" style="--ac:var(--safety)"><div class="k">futureMap.ts · Zod</div><h3>FutureMap contract</h3><p>Strict schema — rejects any recommendation-shaped field.</p></div>
  <div class="card" style="--ac:var(--safety)"><div class="k">atlasService.ts</div><h3>Validate in &amp; out</h3><p>Checks the returned input matches the original request.</p></div>
 </div>
 <div class="arrow">&rarr;</div>
 <div class="stage">
  <div class="lab">External model</div>
  <div class="card" style="--ac:var(--runtime);background:#f6 e9 e2;background:#f7ebe4"><div class="k">OpenAI Responses API</div><h3>GPT&#8209;5.6 &mdash; live</h3><p>Structured-output inference on the user's two routes, per request. Returns knowns, assumptions, unknowns, trade-offs, questions, "Not yet".</p></div>
  <div class="card" style="--ac:var(--runtime)"><div class="k">Result</div><h3>Live GPT-5.6 map</h3><p>Only validated output renders — else a labelled Illustrative preset.</p></div>
 </div>
</div>
<div class="band">
 <div><b>Stateless.</b> No database, no dilemma storage, no background analysis.</div>
 <div><b>Server-only secrets.</b> OPENAI_API_KEY · JUDGE_ACCESS_CODE_HASH · JUDGE_SESSION_SECRET (never VITE_).</div>
</div>
<div class="legend">
 <span><i class="dot" style="background:var(--client)"></i>Client</span>
 <span><i class="dot" style="background:var(--server)"></i>Serverless</span>
 <span><i class="dot" style="background:var(--safety)"></i>Validation</span>
 <span><i class="dot" style="background:var(--runtime)"></i>GPT-5.6 runtime</span>
</div>
`;

const page2 = `
<div class="head">
 <div class="eyebrow">Sequence &middot; one live request end to end</div>
 <h1>Handshake: judge session &rarr; GPT-5.6 &rarr; validated map</h1>
</div>
<div style="display:flex;gap:26px;margin-top:34px">
 <div style="flex:1">
  <div class="lab mono" style="font-size:14px;color:var(--sub);margin-bottom:14px">Unlock &middot; once per browser</div>
  <div class="seq">
   <div class="step"><span class="n">1</span><div><b>Person</b> enters the private judge code.</div></div>
   <div class="step"><span class="n">2</span><div><b>Browser</b> &rarr; POST <span class="c">/api/judge-access</span> <span class="mono2">{code}</span></div></div>
   <div class="step"><span class="n">3</span><div><b>Server</b> compares SHA-256 (timing-safe) &rarr; sets 4h signed <span class="mono2">__Host</span> HttpOnly Secure cookie.</div></div>
  </div>
 </div>
 <div style="flex:1.3">
  <div class="lab mono" style="font-size:14px;color:var(--sub);margin-bottom:14px">Map &middot; every request</div>
  <div class="seq">
   <div class="step"><span class="n">4</span><div><b>Person</b> types two routes + up to three priorities + a horizon, clicks <i>Map</i>.</div></div>
   <div class="step"><span class="n">5</span><div><b>Browser</b> &rarr; POST <span class="c">/api/atlas</span> (cookie required).</div></div>
   <div class="step"><span class="n">6</span><div><b>Endpoint</b> checks the cookie, validates input against the Zod contract.</div></div>
   <div class="step run"><span class="n">7</span><div>&rarr; <b>OpenAI Responses API</b>, model <b>gpt-5.6</b>, structured output — <b>live inference</b> on those exact routes.</div></div>
   <div class="step run"><span class="n">8</span><div><b>GPT-5.6</b> returns a FutureMap: knowns, assumptions, unknowns, trade-offs, questions, "Not yet".</div></div>
   <div class="step"><span class="n">9</span><div><b>Validation</b> re-parses the FutureMap + confirms the echoed input matches.</div></div>
   <div class="step"><span class="n">10</span><div>&rarr; render <b>Live GPT-5.6 map</b> (or a labelled Illustrative preset on any failure).</div></div>
  </div>
 </div>
</div>
<div class="legend"><span><i class="dot" style="background:var(--runtime)"></i>GPT-5.6 live step</span></div>
<style>
.seq{display:flex;flex-direction:column;gap:12px}
.step{display:flex;gap:16px;align-items:flex-start;background:var(--panel);border:1px solid var(--pline);
 border-radius:11px;padding:14px 18px;font-size:18px;line-height:1.32}
.step.run{border-left:6px solid var(--runtime);background:#f7ebe4}
.step .n{font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#fff;background:var(--ink);
 width:34px;height:34px;flex:none;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
.step.run .n{background:var(--runtime)}
.step b{font-weight:600}.step .c{font-family:ui-monospace,Menlo,monospace;font-size:15px;color:var(--codex)}
.mono2{font-family:ui-monospace,Menlo,monospace;font-size:15px}
</style>
`;

const page3 = `
<div class="head">
 <div class="eyebrow">AI Topology &middot; two roles, kept separate</div>
 <h1>Codex builds it. GPT-5.6 runs inside every request.</h1>
 <div class="sub">Two distinct AI roles — one at build time, one at runtime — made independently inspectable for judges.</div>
</div>
<div style="display:flex;gap:0;margin-top:40px;align-items:stretch">
 <div class="plane" style="--ac:var(--codex)">
  <div class="ptag">Build time</div>
  <h2>Codex <span>coding agent</span></h2>
  <ul>
   <li>Test-drove the <b>FutureMap</b> contract &amp; judge-session boundary</li>
   <li>Built the staged briefing &amp; decision-weather visual system</li>
   <li>Wired the Vercel integration &amp; safe fallback</li>
   <li>Wrote <b>38 automated tests</b>, type-checks, builds, browser checks</li>
   <li>Produced diagrams, demo, PR-based delivery</li>
  </ul>
  <div class="foot">Does <b>not</b> run in a visitor's request.</div>
 </div>
 <div class="seam"><div class="seam-l">builds</div><div class="seam-a">&rarr;</div><div class="seam-l">the app</div><div class="seam-a">&rarr;</div><div class="seam-l">runs</div></div>
 <div class="plane" style="--ac:var(--runtime)">
  <div class="ptag">Run time</div>
  <h2>GPT&#8209;5.6 <span>uncertainty cartographer</span></h2>
  <ul>
   <li>Called <b>live</b> per request via the OpenAI Responses API</li>
   <li>Reasons over the user's <b>own two routes</b>, priorities, horizon</li>
   <li>Returns a structured map: knowns · assumptions · unknowns · trade-offs · questions · "Not yet"</li>
   <li>Output is <b>Zod-validated</b> before it can render</li>
  </ul>
  <div class="foot">Maps uncertainty — <b>never predicts or recommends</b>.</div>
 </div>
</div>
<style>
.plane{flex:1;background:var(--panel);border:1px solid var(--pline);border-top:8px solid var(--ac);
 border-radius:14px;padding:30px 34px;display:flex;flex-direction:column}
.plane .ptag{font-family:ui-monospace,Menlo,monospace;letter-spacing:.2em;text-transform:uppercase;
 font-size:14px;color:var(--ac)}
.plane h2{font-size:38px;font-weight:600;margin:8px 0 20px}
.plane h2 span{font-size:19px;font-style:italic;color:var(--sub);font-weight:400}
.plane ul{list-style:none;display:flex;flex-direction:column;gap:15px}
.plane li{font-size:19px;line-height:1.34;padding-left:26px;position:relative;color:var(--ink)}
.plane li:before{content:"";position:absolute;left:0;top:9px;width:11px;height:11px;border-radius:3px;background:var(--ac)}
.plane li b{font-weight:600}
.plane .foot{margin-top:auto;padding-top:22px;font-size:19px;font-style:italic;color:var(--ink)}
.plane .foot b{color:var(--ac);font-style:normal}
.seam{width:150px;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.seam-l{font-family:ui-monospace,Menlo,monospace;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub)}
.seam-a{font-size:40px;color:var(--runtime);line-height:.7}
</style>
`;

const page4 = `
<div class="head">
 <div class="eyebrow">Choice Atlas &middot; Apps for Your Life</div>
 <h1>A live-GPT map for the two-way life decision you still own</h1>
 <div class="sub">Young people face life-changing forks and can't see what each choice really means. Choice Atlas shows the shape — it never decides.</div>
</div>
<div class="pipe">
 <div class="ps"><span class="pn">1</span><b>Two routes</b><p>Type any real fork, in your words.</p></div>
 <div class="pa">&rarr;</div>
 <div class="ps"><span class="pn">2</span><b>Priorities + horizon</b><p>Up to three values; 3mo / 1yr / 3yr.</p></div>
 <div class="pa">&rarr;</div>
 <div class="ps run"><span class="pn">3</span><b>GPT-5.6, live</b><p>Real-time inference on your inputs.</p></div>
 <div class="pa">&rarr;</div>
 <div class="ps"><span class="pn">4</span><b>Validated FutureMap</b><p>Zod-checked; no recommendation.</p></div>
 <div class="pa">&rarr;</div>
 <div class="ps"><span class="pn">5</span><b>Interactive map</b><p>Known · assumed · unknown · fog.</p></div>
</div>
<div class="stats">
 <div class="stat"><div class="v">38</div><div class="l">automated tests</div></div>
 <div class="stat"><div class="v">1</div><div class="l">verified live production path</div></div>
 <div class="stat"><div class="v">0</div><div class="l">recommendations — a map, not a verdict</div></div>
</div>
<div class="tech"><span>Built with</span> GPT-5.6 &middot; OpenAI Responses API &middot; Codex &middot; React &middot; Vite &middot; TypeScript &middot; Zod &middot; Vercel &middot; SVG &middot; Vitest</div>
<style>
.pipe{display:flex;align-items:stretch;margin-top:40px}
.ps{flex:1;background:var(--panel);border:1px solid var(--pline);border-radius:12px;padding:18px 18px 20px}
.ps.run{border-left:6px solid var(--runtime);background:#f7ebe4}
.ps .pn{font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#fff;background:var(--ink);
 width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;margin-bottom:12px}
.ps.run .pn{background:var(--runtime)}
.ps b{font-size:20px;font-weight:600;display:block;margin-bottom:5px}
.ps p{font-size:15.5px;color:var(--sub);line-height:1.3}
.pa{display:flex;align-items:center;color:var(--runtime);font-size:32px;width:46px;justify-content:center;flex:none}
.stats{display:flex;gap:26px;margin-top:34px}
.stat{flex:1;background:#efe8dc;border:1px solid var(--pline);border-radius:14px;padding:26px 30px}
.stat .v{font-size:66px;font-weight:600;color:var(--runtime);line-height:1}
.stat .l{font-size:18px;color:var(--ink);margin-top:8px}
.tech{position:absolute;left:84px;right:84px;bottom:46px;font-size:17px;color:var(--sub)}
.tech span{font-family:ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.16em;font-size:13px;color:var(--runtime);margin-right:12px}
</style>
`;

const pages = [
  { name: "05-architecture.png", html: page1 },
  { name: "06-sequence-handshake.png", html: page2 },
  { name: "07-ai-topology.png", html: page3 },
  { name: "08-infographic.png", html: page4 },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
for (const p of pages) {
  const doc = `<!doctype html><html><head><meta charset="utf8"><style>${SHARED}</style></head><body>${p.html}</body></html>`;
  const f = `${TMP}/${p.name}.html`;
  writeFileSync(f, doc);
  await page.goto("file://" + process.cwd() + "/" + f, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.screenshot({ path: `${OUT}/${p.name}`, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  console.log("wrote", `${OUT}/${p.name}`);
}
await browser.close();
