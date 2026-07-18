# 0001. Ship a static preset before model integration

Date: 2026-07-18
Status: Accepted

## Context

The Build Week prototype needs a judge-ready interaction that works without an API key while still demonstrating the intended “uncertainty cartographer” behavior. A live model dependency would add authentication, response-validation, latency, and failure-mode risk before the visual and interaction concept is proven.

## Decision

We will ship the first demo as a static, typed `FutureMap` preset and leave a server-side route seam for a later validated GPT integration.

## Alternatives considered

- Call a model directly from the browser. Rejected because it would expose credentials and make the demo dependent on network access and live model availability.
- Block the prototype until a server model route is complete. Rejected because this would delay the judge-visible interaction and make the demonstration less reliable.
- Generate recommendations from the preset. Rejected because the product brief explicitly prohibits prediction and recommendation.

## Consequences

The demo remains deterministic, key-free, and easy to review, but its analysis cannot honestly claim to be personalized. A future integration must validate an output against `FutureMap`, keep provider credentials server-side, and preserve the no-recommendation constraint.
