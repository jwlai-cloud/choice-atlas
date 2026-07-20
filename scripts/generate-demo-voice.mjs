import { readFile, writeFile } from "node:fs/promises";
import OpenAI from "openai";

const envText = await readFile(".env", "utf8");
const apiKey = envText.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]
  ?.trim()
  .replace(/^['"]|['"]$/g, "");

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required in .env to generate demo narration.");
}

const input = await readFile("outputs/demo-voiceover.txt", "utf8");
const client = new OpenAI({ apiKey });
const speech = await client.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "marin",
  input,
  instructions:
    "Speak as a thoughtful, warm human product storyteller. Calm confidence, natural pauses, and gentle emphasis on human agency. Avoid sales energy, synthetic cadence, and dramatic announcer delivery.",
  response_format: "mp3",
  speed: 0.94,
});

await writeFile(
  "outputs/choice-atlas-gpt-voice.mp3",
  Buffer.from(await speech.arrayBuffer()),
);
console.log("Wrote outputs/choice-atlas-gpt-voice.mp3");
