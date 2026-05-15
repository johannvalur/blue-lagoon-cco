"use client";

import { useMemo, useState } from "react";
import { StatusChat } from "@/components/StatusChat";
import { SCENARIO } from "@/lib/data/internal/opsScenario";
import type { DisruptedFlight } from "@/lib/data/internal/opsScenario";

type LookupResult =
  | { kind: "delayed"; flight: DisruptedFlight; newEtd: string }
  | { kind: "ontime"; flightNumber: string }
  | { kind: "unknown"; flightNumber: string }
  | { kind: "empty" };

// Customer-facing recovery times for the fog event. These mirror what the
// status agent uses in the system prompt so the UI card and the chat agree.
const FOG_RECOVERY_ETD: Record<string, string> = {
  FI631: "0925z",
  FI617: "0950z",
  FI603: "1005z",
  FI609: "1030z",
};

function normaliseFlightNumber(raw: string): string {
  const trimmed = raw.trim().toUpperCase().replace(/\s+/g, "");
  // Accept "FI631", "fi 631", or "631" — coerce to the FI### form.
  if (/^\d+$/.test(trimmed)) return `FI${trimmed}`;
  return trimmed;
}

function lookup(rawFlight: string): LookupResult {
  if (!rawFlight.trim()) return { kind: "empty" };
  const flightNumber = normaliseFlightNumber(rawFlight);

  const hit = SCENARIO.disruptedFlights.find((f) => f.flight === flightNumber);
  if (hit) {
    return {
      kind: "delayed",
      flight: hit,
      newEtd: FOG_RECOVERY_ETD[hit.flight] ?? "TBC",
    };
  }

  // FI followed by digits — looks like a real Blue Lagoon flight; default to on time.
  if (/^FI\d{2,4}$/.test(flightNumber)) {
    return { kind: "ontime", flightNumber };
  }

  return { kind: "unknown", flightNumber };
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function StatusPage() {
  const [flightInput, setFlightInput] = useState("");
  const [dateInput, setDateInput] = useState(todayIso());
  const [submitted, setSubmitted] = useState<{
    flight: string;
    date: string;
  } | null>(null);

  const result = useMemo<LookupResult>(() => {
    if (!submitted) return { kind: "empty" };
    return lookup(submitted.flight);
  }, [submitted]);

  const seedContext = useMemo<string | undefined>(() => {
    if (!submitted) return undefined;
    if (result.kind === "delayed") {
      const f = result.flight;
      return `Context for this conversation: I just looked up flight ${f.flight} (${f.origin}→${f.destination}) for ${submitted.date}. The status page is showing me it's delayed — scheduled ${f.schedDep}, projected new ETD ${result.newEtd}. Please answer my next question with that flight in mind.`;
    }
    if (result.kind === "ontime") {
      return `Context for this conversation: I just looked up flight ${result.flightNumber} for ${submitted.date}. The status page is showing it as on time. Please answer my next question with that flight in mind.`;
    }
    if (result.kind === "unknown") {
      return `Context for this conversation: I tried to look up "${submitted.flight}" for ${submitted.date}, but the status page didn't recognise the flight number.`;
    }
    return undefined;
  }, [result, submitted]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!flightInput.trim()) return;
    setSubmitted({ flight: flightInput, date: dateInput });
  }

  function onClear() {
    setSubmitted(null);
    setFlightInput("");
  }

  return (
    <>
      <div className="space-y-8">
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            <span className="text-bluelagoon-midnight">Customer journey</span>
            <span className="text-bluelagoon-line"> · </span>flight status
          </p>
          <h1 className="mt-1 font-loft text-3xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-4xl">
            How&rsquo;s my flight?
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bluelagoon-ink/85">
            Look up your flight to see live status and your options. The same
            agent that helps the ops desk recover from the disruption is the
            one answering you here — just from the other side of the desk.
          </p>
        </section>

        <section className="surface-card rounded-2xl p-6">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="status-flight"
                className="block text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted"
              >
                Flight number
              </label>
              <input
                id="status-flight"
                value={flightInput}
                onChange={(e) => setFlightInput(e.target.value)}
                placeholder="e.g. FI631"
                autoComplete="off"
                spellCheck={false}
                className="mt-1 w-full rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-ink placeholder-bluelagoon-muted/80 outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
              />
            </div>
            <div className="sm:w-44">
              <label
                htmlFor="status-date"
                className="block text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted"
              >
                Date
              </label>
              <input
                id="status-date"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-ink outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
              />
            </div>
            <button
              type="submit"
              className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Check status
            </button>
            {submitted && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-5 py-3 text-sm font-semibold text-bluelagoon-ink transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist"
              >
                Clear
              </button>
            )}
          </form>

          {submitted && (
            <div className="mt-5">
              <StatusCard result={result} />
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-loft text-lg font-bold text-bluelagoon-midnight">
            Ask anything about your flight
          </h2>
          <StatusChat
            seedContext={seedContext}
            greeting={
              result.kind === "delayed"
                ? `Yes — ${result.flight.flight} ${result.flight.origin}→${result.flight.destination} is delayed today. New projected departure ${result.newEtd}, due to dense fog at KEF. Want me to walk through your options?`
                : "Hi — what's your flight number? I'll pull the latest status and walk you through your options."
            }
            starters={
              result.kind === "delayed"
                ? [
                    `What are my options for ${result.flight.flight}?`,
                    "Am I owed compensation under EU261?",
                    "Can I get rebooked on a later flight today?",
                    "Do I get a hotel and meals if I miss my connection?",
                  ]
                : [
                    "Is my flight delayed today?",
                    "What happens if my flight is cancelled?",
                    "What are my rights under EU261?",
                  ]
            }
          />
        </section>
      </div>
    </>
  );
}

function StatusCard({ result }: { result: LookupResult }) {
  if (result.kind === "empty") return null;

  if (result.kind === "delayed") {
    const f = result.flight;
    return (
      <div className="rounded-2xl border border-bluelagoon-fiery/40 bg-bluelagoon-fiery/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-bluelagoon-fiery px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-snow">
                Delayed
              </span>
              <span className="font-loft text-xl font-bold text-bluelagoon-midnight">
                {f.flight}
              </span>
              <span className="text-sm text-bluelagoon-muted">
                {f.type} · {f.registration}
              </span>
            </div>
            <p className="mt-2 font-loft text-2xl font-bold text-bluelagoon-midnight">
              {f.origin} → {f.destination}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Scheduled departure
            </dt>
            <dd className="mt-1 font-mono text-bluelagoon-ink line-through decoration-bluelagoon-muted/60">
              {f.schedDep}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              New ETD
            </dt>
            <dd className="mt-1 font-mono font-semibold text-bluelagoon-fiery">
              {result.newEtd}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Reason
            </dt>
            <dd className="mt-1 text-bluelagoon-ink">
              Dense fog at KEF, clearing by 0820z
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-bluelagoon-muted">
          Weather-driven delays are treated as extraordinary circumstances
          under EU261 — care obligations (meals, hotel, rebooking) apply, cash
          compensation generally does not. Ask below for the specifics on
          your situation.
        </p>
      </div>
    );
  }

  if (result.kind === "ontime") {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-bluelagoon-volcanic px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-midnight">
            On time
          </span>
          <span className="font-loft text-xl font-bold text-bluelagoon-midnight">
            {result.flightNumber}
          </span>
        </div>
        <p className="mt-2 text-sm text-bluelagoon-ink/85">
          As far as we can see, {result.flightNumber} is operating on time.
          We&rsquo;ll surface anything that changes here.
        </p>
      </div>
    );
  }

  // unknown
  return (
    <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-5">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-bluelagoon-line bg-bluelagoon-mist px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
          No info
        </span>
        <span className="font-loft text-xl font-bold text-bluelagoon-midnight">
          {result.flightNumber}
        </span>
      </div>
      <p className="mt-2 text-sm text-bluelagoon-ink/85">
        We don&rsquo;t have info on that flight. Double-check the number, or
        ask the agent below — they can help track it down.
      </p>
    </div>
  );
}
