# CLAUDE.md

Guidance for Claude working in this repo. The [README](README.md) has the
product pitch and the strategy doc summary; this file captures what's needed
to make changes without re-deriving the wiring each time.

> **Heads up — README drift.** The README is partially out of date. The
> booking surface was renamed `trip`, several new routes/surfaces exist, and
> the tools use `betaTool` (JSON schema) not Zod. Trust this file over the
> README's "Architecture notes" and "File layout" sections.

## Stack

- Next.js 15 (app router, React 19, Node runtime), Tailwind v4, TypeScript strict.
- One dependency for AI: `@anthropic-ai/sdk`. No Zod, no other state libs.
- Path alias: `@/*` → repo root.
- No backend, no DB, no auth — all "data" is hand-curated under `lib/data/`,
  client persistence is `localStorage`.

## Commands

```bash
npm install
cp .env.example .env.local      # set ANTHROPIC_API_KEY
npm run dev                     # localhost:3000
npm run typecheck               # tsc --noEmit
npm run build                   # production build (verify before declaring done)
```

There is no test suite and no linter wired up. "Verification" = typecheck +
build clean.

## Routes (current)

Pages:
- `/` — landing
- `/concept` — renders `strategy/CONCEPT.md`
- `/org` — org explorer (uses `lib/data/orgChart.ts`)
- `/customer`, `/customer/chat`, `/customer/companion`, `/customer/loyalty`,
  `/customer/status`, `/customer/trips`, `/customer/trip/[id]`,
  `/customer/manage/[ref]`, `/customer/check-in/[ref]`
- `/internal`, `/internal/ops`, `/internal/crew`, `/internal/telemetry`

Redirects (`next.config.ts`): `/customer/book` and `/customer/stopover` →
`/customer/chat` (permanent).

API (all NDJSON streaming, all `runtime = "nodejs"` + `dynamic = "force-dynamic"`):
- `POST /api/chat/customer` — surfaces: `trip`, `companion`
- `POST /api/chat/internal` — surfaces: `ops`, `crew`
- `POST /api/chat/loyalty` — bespoke (own tools, no shared handler)
- `POST /api/chat/manage`  — bespoke; body requires `context: { ref, fareClass }`
- `POST /api/chat/status`  — bespoke; system prompt rebuilt per request via
  `buildStatusSystemPrompt()` so the disruption briefing stays fresh

## Surface map

| Surface     | Endpoint                | Prompt                            | Tools                                                   | Model |
|-------------|-------------------------|-----------------------------------|---------------------------------------------------------|-------|
| `trip`      | `/api/chat/customer`    | `lib/prompts/customer/trip.ts`    | flights, hotels, cars, packages, hold_booking, save_trip_idea | Opus  |
| `companion` | `/api/chat/customer`    | `lib/prompts/customer/companion.ts` | none                                                  | Opus  |
| `ops`       | `/api/chat/internal`    | `lib/prompts/internal/ops.ts`     | none                                                    | Opus  |
| `crew`      | `/api/chat/internal`    | `lib/prompts/internal/crew.ts`    | none                                                    | Haiku |
| loyalty     | `/api/chat/loyalty`     | `lib/prompts/customer/loyalty.ts` | check_balance, redeem_for_flight, view_year_recap       | Opus  |
| manage      | `/api/chat/manage`      | `lib/prompts/customer/manage.ts`  | change_dates, cancel_booking (need `ManageContext`)     | Opus  |
| status      | `/api/chat/status`      | `lib/prompts/customer/status.ts`  | none (rebuilt per request)                              | Opus  |

Models live in [lib/anthropic.ts](lib/anthropic.ts):
- `MODEL_OPUS = "claude-opus-4-7"`
- `MODEL_HAIKU = "claude-haiku-4-5-20251001"`

The `Surface` union (`trip | companion | ops | crew`) is the only one routed
through `_handler.ts`. `loyalty`, `manage`, `status` are separate route files.

## Conventions worth knowing

**Streaming envelope (NDJSON, one JSON object per line).** All chat endpoints
emit:
- `{ type: "text", text }` — text deltas
- `{ type: "tool_use_start", id, name }` — tool-using surfaces only
- `{ type: "tool_result", tool_use_id, name, result }` — tool-using surfaces only
- `{ type: "done", usage: { input, output, cacheRead, cacheWrite } }` — last event
- `{ type: "error", error }` — terminal error

**Prompt caching.** Every `system` block uses
`cache_control: { type: "ephemeral" }`. The Telemetry pill reads cache hits
from the `done` envelope's `usage`.

**Effort flag is Opus-only.** `output_config: { effort }` is gated on
`config.model === MODEL_OPUS` (Haiku rejects it).

**Tool factory pattern.** Each tool in `lib/tools/*.ts` exports
`make<Name>Tool(onResult)` that builds a `betaTool(...)` from
`@anthropic-ai/sdk/helpers/beta/json-schema` (NOT Zod, despite what the README
says). The handler creates a per-tool result queue, passes
`(r) => queue.push(r)` as `onResult`, and after `runner.generateToolResponse()`
drains the queue by tool name to emit `tool_result` envelopes. See
`runTripToolLoop` in [app/api/chat/_handler.ts](app/api/chat/_handler.ts) as
the canonical example.

**Client persistence (`lib/state/`, all SSR-safe, all browser-only).**
- `trips.ts` — held bookings. Key: `bluelagoon-lite:trips:v1`. Event: `trips:changed`.
- `tripIdeas.ts` — pre-booking shareable ideas + base64url codec used by
  `/customer/trip/[id]`. Key: `bluelagoon-lite:trip-ideas:v1`. Event: `tripIdeas:changed`.
- `telemetry.ts` — per-surface usage aggregates surfaced at `/internal/telemetry`.
  Key: `bluelagoon-lite:telemetry:v1`. Event: `telemetry:changed`.
Listeners attach to those custom events on `window` to re-render.

**Demo mode.** `?demo=1` (live API) or `?demo=fallback` (canned, no key
needed) propagates across navigations via `DemoOverlay` + `lib/demoScript.ts`.

## How to add things

**New chat surface in the shared union (`trip|companion|ops|crew`):**
1. Add the surface name to `Surface` in `lib/anthropic.ts`.
2. Add a system-prompt file under `lib/prompts/{customer,internal}/`.
3. Add an entry to `SURFACE_CONFIG` in `app/api/chat/_handler.ts` (model, prompt,
   effort, maxTokens). If it uses tools, add a tool-loop branch like
   `runTripToolLoop` and dispatch to it from the `surface ===` switch.
4. Add the surface to the `ALLOWED` array in the matching route
   (`customer/route.ts` or `internal/route.ts`).

**New bespoke chat surface (own route, like `loyalty`/`manage`/`status`):**
Copy `app/api/chat/loyalty/route.ts` as the template — it has the cleanest
tool-loop. If no tools, copy `status/route.ts` instead.

**New tool:** Add `make<Name>Tool(onResult)` in `lib/tools/`, export the
`Result` type, then wire it into the relevant route's queue/drain logic.

## What lives where (delta from README)

The README's file layout is mostly right but missing:
- `lib/state/` — client persistence (see above)
- `lib/data/customer/{hotels,cars,packages,stopover,loyalty}.ts`
- `lib/data/orgChart.ts` — backs `/org`
- `lib/tools/{inventoryTools,loyaltyTools,manageTools}.ts`
- `lib/prompts/customer/{loyalty,manage,status}.ts`
- `components/concept/*` — concept page composition
- `components/trip/*` — `TripChat` (replaces the old `BookingChat`),
  `FlightResults`, `HotelResults`, `CarResults`, `PackageResults`,
  `TripIdeaCard`, `TripIdeaPreviewCard`, `TripSearchHero`, `SavedTripsStrip`
- Bespoke chats at top of `components/`: `LoyaltyChat`, `ManageChat`,
  `StatusChat` (each calls its own bespoke API route)
- `Footer` is mounted in the root `app/layout.tsx`

## Out of scope

Don't add: real fare/schedule integration, auth, payments, persistence beyond
localStorage, mobile-native, or i18n (Icelandic is noted as future work in the
strategy doc only).
