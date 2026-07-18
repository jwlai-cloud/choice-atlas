# 0002. Use a Vercel serverless function for live mapping

Date: 2026-07-18
Status: Accepted

## Context

The static preset proves the experience, but the hackathon submission now needs GPT-5.6 to analyze the visitor’s actual two-option dilemma. The client must not hold an OpenAI API key, and the user plans to deploy the project on Vercel.

## Decision

We will keep the Vite React client and add a Vercel serverless `POST /api/atlas` function. The function will call the OpenAI Responses API with GPT-5.6, require structured `FutureMap` output, validate it with Zod, and return it only after validation succeeds.

## Alternatives considered

- Direct browser call to OpenAI. Rejected because it would expose `OPENAI_API_KEY` and let unvalidated provider output drive the UI.
- Migrate the entire project to Next.js first. Rejected because the existing Vite client is working and Vercel Functions add the required server boundary without a presentation-layer rewrite.
- Retain the static preset only. Rejected because it cannot demonstrate the requested GPT-powered uncertainty cartographer for an actual visitor’s input.

## Consequences

The demo gains a real model-powered path while preserving the static preset as a truthful fallback. The deployment must set `OPENAI_API_KEY`, and automated tests must mock the external model boundary rather than spend API credits. The endpoint remains constrained to classification and questions—never outcomes, rankings, or recommendations.
