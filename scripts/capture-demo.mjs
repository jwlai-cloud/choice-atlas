// Drives the live Choice Atlas UI step by step and records a 1080p walkthrough.
// Output: outputs/video/choice-atlas-demo-v2-1080p-silent.mp4 (no audio — drop the
// ElevenLabs narration on top in an editor, or mux with the ffmpeg line printed at the end).
//
// Usage:  node scripts/capture-demo.mjs
//   URL=... to override target.  HEADED=1 to watch it drive.
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";

const URL = process.env.URL ?? "https://choice-atlas-lac.vercel.app/";
const RAW_DIR = "outputs/video/raw";
const OUT = "outputs/video/choice-atlas-demo-v2-1080p-silent.mp4";
const W = 1920, H = 1080;
const VISIBLE_MAP_ANIM_MS = 8000; // how much of the "drawing the field" animation to keep
const LABEL_TIMEOUT_MS = 90000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(RAW_DIR, { recursive: true });
for (const f of readdirSync(RAW_DIR)) rmSync(`${RAW_DIR}/${f}`, { force: true });

const browser = await chromium.launch({ headless: !process.env.HEADED });
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
  recordVideo: { dir: RAW_DIR, size: { width: W, height: H } },
});
const page = await context.newPage();
const t0 = Date.now();
const at = () => Date.now() - t0; // ms offset into the recording

// Smooth, cinematic scroll to an absolute Y (or element top with margin).
async function scrollTo(y) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "smooth" }), y);
  await sleep(900);
}
async function scrollToSel(sel, margin = 90) {
  const y = await page.evaluate(({ s, m }) => {
    const el = document.querySelector(s);
    if (!el) return 0;
    return window.scrollY + el.getBoundingClientRect().top - m;
  }, { s: sel, m: margin });
  await scrollTo(y);
}

let tReady = 0, tMapClick = 0, tLabel = 0, liveOk = false;

try {
  // --- S1 Hero (0:00–0:14) ---
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForSelector("h1", { state: "visible" });
  tReady = at();
  await sleep(9000);
  await scrollTo(120); // gentle drift
  await sleep(4000);

  // --- S2 Into the intake (0:14–0:24) ---
  await scrollToSel(".intake", 70);
  await sleep(8500);

  // --- S3 Type CUSTOM routes live (proves the map is generated, not a preset) ---
  const ra = page.locator('input[aria-label="First option"]');
  const rb = page.locator('input[aria-label="Second option"]');
  await ra.click(); await ra.fill(""); await sleep(500);
  await ra.pressSequentially("Take the job offer in another city", { delay: 45 });
  await sleep(2000);
  await rb.click(); await rb.fill(""); await sleep(500);
  await rb.pressSequentially("Stay near family and friends", { delay: 45 });
  await sleep(4000);

  // --- S4 Priorities + horizon (0:40–0:54) ---
  const fin = page.getByRole("button", { name: /Financial runway/ });
  await fin.click(); await sleep(1600);   // toggle off
  await fin.click(); await sleep(1600);   // toggle back on
  await page.getByText("3 months", { exact: true }).click(); await sleep(1600);
  await page.getByText("1 year", { exact: true }).click(); await sleep(4000);

  // --- S5 Map it live (0:54–…) ---
  await scrollToSel(".map-button", 260);
  tMapClick = at();
  await page.getByRole("button", { name: /Map the uncertainty/ }).click();
  // Poll for the live label; recording keeps rolling through the wait (trimmed later).
  try {
    await page.getByText("Live GPT-5.6 map", { exact: true }).waitFor({ state: "visible", timeout: LABEL_TIMEOUT_MS });
    liveOk = true;
  } catch {
    console.warn("WARN: live label not seen in time — continuing with whatever rendered.");
  }
  tLabel = at();

  // --- S6 Live map, first read (Ground) (~20s) ---
  await scrollToSel(".decision-briefing", 40);
  await sleep(9000);
  await scrollToSel(".decision-weather", 90);
  await sleep(9000);

  // --- S7 Tension (~16s) ---
  await page.getByRole("tab", { name: /Tension/ }).click();
  await sleep(15000);

  // --- S8 Fieldwork + "Not yet" (~18s) ---
  await page.getByRole("tab", { name: /Fieldwork/ }).click();
  await sleep(9000);
  await scrollToSel(".fieldwork-footer", 120).catch(() => {});
  await sleep(7500);

  // --- S9 Landscape + hover a signal (~22s) ---
  await page.getByRole("tab", { name: /Landscape/ }).click();
  await sleep(4000);
  await scrollToSel(".landscape", 40);
  await sleep(3000);
  const mark = page.locator(".landmark").first();
  if (await mark.count()) { await mark.hover({ force: true, timeout: 4000 }).catch(() => {}); await sleep(9000); }
  else await sleep(9000);
  await sleep(4000);

  // --- S10 How it's built (~18s) ---
  await scrollToSel(".build-week-evidence", 70);
  await sleep(10000);
  await scrollToSel("#limits", 90);
  await sleep(6500);

  // --- S11 Close (~12s) ---
  await scrollTo(0);
  await sleep(10500);
} catch (e) {
  console.warn("drive error (continuing to render):", e.message);
} finally {
  await context.close(); // finalizes the webm
  await browser.close();
}

// Locate the recorded webm.
const raw = readdirSync(RAW_DIR).filter((f) => f.endsWith(".webm")).map((f) => `${RAW_DIR}/${f}`);
if (!raw.length) throw new Error("No recording produced.");
const src = raw.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];

// Keep [tReady, tMapClick+visible] and [tLabel, end] — excises page-load blank and the cold-map wait.
const cutStart = (tMapClick + VISIBLE_MAP_ANIM_MS) / 1000;
const s1 = (tReady / 1000).toFixed(3);
const s2 = tLabel / 1000;
const doCut = s2 > cutStart + 0.5;

const vf = "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=0x1e2a27,setsar=1,fps=30,format=yuv420p";
let filter;
if (doCut) {
  filter =
    `[0:v]trim=${s1}:${cutStart.toFixed(3)},setpts=PTS-STARTPTS[a];` +
    `[0:v]trim=${s2.toFixed(3)},setpts=PTS-STARTPTS[b];` +
    `[a][b]concat=n=2:v=1[c];[c]${vf}[v]`;
} else {
  filter = `[0:v]trim=${s1},setpts=PTS-STARTPTS[c];[c]${vf}[v]`;
}

execSync(
  `ffmpeg -y -i "${src}" -filter_complex "${filter}" -map "[v]" -c:v libx264 -preset medium -crf 19 -an "${OUT}"`,
  { stdio: "inherit" },
);

const dur = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${OUT}"`).toString().trim();
console.log(`\nDONE → ${OUT}`);
console.log(`Duration: ${dur}s   live label seen: ${liveOk}   cold-wait trimmed: ${doCut}`);
console.log(`Mux narration when ready:\n  ffmpeg -y -i "${OUT}" -i outputs/YOUR_ELEVENLABS.mp3 -c:v copy -c:a aac -b:a 192k -shortest outputs/video/choice-atlas-demo-v2-1080p.mp4`);
