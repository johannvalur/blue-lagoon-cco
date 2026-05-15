# Blue Lagoon, AI-first

A clickable prototype + strategy doc exploring what an AI-first Blue Lagoon could look like. Internal concept exploration; styled to the Blue Lagoon brand guide (Midnight Blue + Snow palette, Manrope as a stand-in for the proprietary Loft typeface).

## What's in here

- **Strategy doc** — `strategy/CONCEPT.md`. ~3,500 words, executive-readable. The thesis, the four pillars, the operating model, a 36-month roadmap, an honest accounting of risks. Also rendered in-app at `/concept`.
- **Prototype** — Next.js 15 app split into a customer side and an internal side, both backed by real Claude API calls.
  - `/` — Marketing landing with "Run the demo (90s)" guided tour
  - `/customer` — Section landing with conversational `IntentSearch` hero
    - `/customer/book` — Tool-use booking concierge (`search_flights` + `hold_booking` agent loop)
    - `/customer/companion` — Trip companion (live)
    - `/customer/companion?scenario=disruption` — Same surface, but reaches out before the traveller notices a fog event has put their flight at risk. Mirrors `/internal/ops` from the traveller's side.
    - `/customer/loyalty` — Saga Club AI redesign mockup
  - `/internal` — Section landing for ops + crew
    - `/internal/ops` — IROPS scenario with live North Atlantic route map and AI-generated recovery plan
    - `/internal/crew` — Crew SOP copilot, grounded in a synthetic OM-A excerpt
  - `/concept` — Strategy doc rendered inline

## Running it

Requires Node 20+ and an Anthropic API key.

```bash
# 1. Install (once)
npm install

# 2. Add your Anthropic key
cp .env.example .env.local
# then edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# 3. Run the dev server
npm run dev

# Open http://localhost:3000
```

Without an API key, the chat surfaces return a clear "missing key" error rather than crashing — every static surface still works. The guided demo also has an offline mode (`?demo=fallback` or the "Run in offline mode" button on the homepage) that uses canned responses.

## Architecture notes

- **Models:** `claude-opus-4-7` for booking, companion, ops; `claude-haiku-4-5-20251001` for the crew copilot (low-latency, grounded lookups). Defined in `lib/anthropic.ts`.
- **Tool use:** The booking surface uses `client.beta.messages.toolRunner` with two Zod-defined tools (`search_flights`, `hold_booking`) in `lib/tools/bookingTools.ts`. Tool results stream alongside text deltas as NDJSON events that `BookingChat` parses to render structured cards inline.
- **Prompt caching:** Each surface's system prompt is sent with `cache_control: { type: "ephemeral" }` so repeated requests within a session pay the cache-read price. The `Telemetry` pill below each chat input shows the live cache hit % for the session.
- **Streaming:** Two endpoints — `/api/chat/customer` (booking + companion) and `/api/chat/internal` (ops + crew) — both delegate to `app/api/chat/_handler.ts`. The booking surface branches to a tool-runner loop; everything else uses `client.messages.stream`.
- **Markdown:** Assistant responses render through `components/Markdown.tsx` (react-markdown + remark-gfm), so lists, tables, code, and blockquotes from Claude appear properly formatted.
- **Demo mode:** A single client component (`components/DemoOverlay.tsx`) advances through `lib/demoScript.ts` on a timer, propagating `?demo=1` (or `?demo=fallback`) across navigations so the overlay survives every step.
- **Shared scenario:** the disruption that the ops dashboard recovers from (`lib/data/internal/opsScenario.ts`) is the same fog event the trip companion handles for the traveller (`lib/data/customer/tripScenario.ts` imports the affected flight from the ops file so they can't drift).
- **No real backend, no auth, no payments.** All booking, scenario, and crew data is hand-curated in `lib/data/`.

## File layout

```
strategy/CONCEPT.md            — strategy doc

app/
  layout.tsx, page.tsx         — marketing landing (/)
  customer/
    layout.tsx, page.tsx       — customer Nav + section landing
    book/page.tsx              — tool-use booking concierge
    companion/page.tsx         — trip companion (+ ?scenario=disruption)
    loyalty/page.tsx           — Saga loyalty mockup
  internal/
    layout.tsx, page.tsx       — internal Nav + section landing
    ops/page.tsx               — Operations Control Center
    crew/page.tsx              — crew copilot
  concept/page.tsx             — renders strategy/CONCEPT.md
  api/chat/
    _handler.ts                — shared streaming + tool-runner handler
    customer/route.ts          — booking + companion endpoint
    internal/route.ts          — ops + crew endpoint

components/
  BookingChat.tsx              — tool-use chat for /customer/book
  BookingResults.tsx           — destination cards + booking confirmation
  Chat.tsx                     — text chat for companion + crew
  OpsDashboard.tsx             — IROPS scenario UI with route map
  RouteMap.tsx                 — North Atlantic SVG with disruption + recovery arcs
  TripStatusCard.tsx           — at-risk flight card (disruption mode)
  UpgradeOffer.tsx             — Saga upgrade sidebar artefact
  DemoOverlay.tsx              — guided tour overlay
  IntentSearch.tsx             — conversational search hero
  Markdown.tsx                 — react-markdown wrapper
  Telemetry.tsx                — tokens / cache hit % / latency pill
  Hero.tsx, PillarCard.tsx, Nav.tsx, BrandMark.tsx, SagaPreview.tsx

lib/
  anthropic.ts                 — SDK client + model + surface types
  prompts/
    customer/{booking,companion}.ts
    internal/{ops,crew}.ts
  tools/bookingTools.ts        — Zod tools for the booking surface
  data/
    customer/{routes,fares,tripScenario,upgrades}.ts
    internal/{opsScenario,crewSOP,airportCoords}.ts
  demoScript.ts                — guided-demo steps + offline-mode canned responses
```

## Verification

```bash
npx tsc --noEmit   # zero errors
npm run build      # 12 routes
```

## Out of scope

- Real fare/schedule integration, authentication, payments, persistence.
- Mobile-native apps. Web responsive only (and the responsive pass on the new components is light — worth a closer look before a hackathon demo).
- Localization beyond English (Icelandic noted as future work in the strategy doc).
