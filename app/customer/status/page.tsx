"use client";

import { useMemo, useState } from "react";
import { StatusChat } from "@/components/StatusChat";
import {
  BOOKED_VISIT,
  MAINTENANCE_DISRUPTION,
} from "@/lib/data/customer/tripScenario";

type LookupResult =
  | { kind: "affected"; ref: string }
  | { kind: "ontime"; ref: string }
  | { kind: "unknown"; ref: string }
  | { kind: "empty" };

function normaliseRef(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

function lookup(rawRef: string): LookupResult {
  if (!rawRef.trim()) return { kind: "empty" };
  const ref = normaliseRef(rawRef);

  if (ref === BOOKED_VISIT.ref) {
    return { kind: "affected", ref };
  }

  // BL followed by alphanumerics — looks like a real reservation ref; default
  // to "on time" (unaffected by today's maintenance).
  if (/^BL[0-9A-Z]{4,10}$/.test(ref)) {
    return { kind: "ontime", ref };
  }

  return { kind: "unknown", ref };
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function StatusPage() {
  const [refInput, setRefInput] = useState("");
  const [dateInput, setDateInput] = useState(todayIso());
  const [submitted, setSubmitted] = useState<{
    ref: string;
    date: string;
  } | null>(null);

  const result = useMemo<LookupResult>(() => {
    if (!submitted) return { kind: "empty" };
    return lookup(submitted.ref);
  }, [submitted]);

  const seedContext = useMemo<string | undefined>(() => {
    if (!submitted) return undefined;
    if (result.kind === "affected") {
      return `Context for this conversation: I just looked up reservation ${result.ref} for ${submitted.date}. The status page is showing me my ${BOOKED_VISIT.arrivalWindow} arrival is affected by ${MAINTENANCE_DISRUPTION.cause.toLowerCase()} — outdoor lagoon capacity reduced 30% from ${MAINTENANCE_DISRUPTION.windowStart} to ${MAINTENANCE_DISRUPTION.windowEnd}. Please answer my next question with that reservation in mind.`;
    }
    if (result.kind === "ontime") {
      return `Context for this conversation: I just looked up reservation ${result.ref} for ${submitted.date}. The status page is showing it as unaffected. Please answer my next question with that reservation in mind.`;
    }
    if (result.kind === "unknown") {
      return `Context for this conversation: I tried to look up "${submitted.ref}" for ${submitted.date}, but the status page didn't recognise the reservation reference.`;
    }
    return undefined;
  }, [result, submitted]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!refInput.trim()) return;
    setSubmitted({ ref: refInput, date: dateInput });
  }

  function onClear() {
    setSubmitted(null);
    setRefInput("");
  }

  return (
    <>
      <div className="space-y-8">
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            <span className="text-bluelagoon-midnight">Guest journey</span>
            <span className="text-bluelagoon-line"> · </span>visit status
          </p>
          <h1 className="mt-1 font-loft text-3xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-4xl">
            How&rsquo;s my visit?
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bluelagoon-ink/85">
            Look up your reservation to see whether today&rsquo;s maintenance
            event touches it, and what your options are. The same concierge
            that&rsquo;s working with the facility ops team answers you here —
            just from the other side of the conversation.
          </p>
          <p className="mt-2 text-xs text-bluelagoon-muted">
            Try reservation <span className="font-mono">{BOOKED_VISIT.ref}</span>.
          </p>
        </section>

        <section className="surface-card rounded-2xl p-6">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="status-ref"
                className="block text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted"
              >
                Reservation reference
              </label>
              <input
                id="status-ref"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="e.g. BL2X4F8K"
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
                Visit date
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
            Ask anything about your visit
          </h2>
          <StatusChat
            seedContext={seedContext}
            greeting={
              result.kind === "affected"
                ? `Yes — your ${BOOKED_VISIT.arrivalWindow} arrival today is in the maintenance window. ${MAINTENANCE_DISRUPTION.capacityImpact} from ${MAINTENANCE_DISRUPTION.windowStart}–${MAINTENANCE_DISRUPTION.windowEnd}, indoor warm pool and Spa Restaurant unaffected. Want me to walk through your options?`
                : "Hi — what's your reservation reference? I'll check whether today's maintenance window touches your visit and walk you through your options."
            }
            starters={
              result.kind === "affected"
                ? [
                    "What are my options if I keep 15:00?",
                    "Shift earlier to 13:00 — what changes?",
                    "If I move to 19:00, do I keep my Silica room?",
                    "What's the Signature upgrade you mentioned?",
                  ]
                : [
                    "Is my visit affected today?",
                    "What happens if the lagoon is closed?",
                    "Can I reschedule for free if the spa is short-staffed?",
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

  if (result.kind === "affected") {
    return (
      <div className="rounded-2xl border border-bluelagoon-fiery/40 bg-bluelagoon-fiery/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-bluelagoon-fiery px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-snow">
                Affected
              </span>
              <span className="font-loft text-xl font-bold text-bluelagoon-midnight">
                {result.ref}
              </span>
              <span className="text-sm text-bluelagoon-muted">
                {BOOKED_VISIT.tier} · {BOOKED_VISIT.hotelName}
              </span>
            </div>
            <p className="mt-2 font-loft text-2xl font-bold text-bluelagoon-midnight">
              Arrival window {BOOKED_VISIT.arrivalWindow}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Maintenance window
            </dt>
            <dd className="mt-1 font-mono text-bluelagoon-ink">
              {MAINTENANCE_DISRUPTION.windowStart}–
              {MAINTENANCE_DISRUPTION.windowEnd}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Capacity impact
            </dt>
            <dd className="mt-1 font-semibold text-bluelagoon-fiery">
              {MAINTENANCE_DISRUPTION.capacityImpact}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Cause
            </dt>
            <dd className="mt-1 text-bluelagoon-ink">
              {MAINTENANCE_DISRUPTION.cause}, restored by{" "}
              {MAINTENANCE_DISRUPTION.windowEnd}.
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-bluelagoon-muted">
          Indoor warm pool, Spa Restaurant, and hotel rooms are unaffected.
          Outdoor capacity returns by 18:30. We can shift you earlier or later
          at no charge, upgrade you to keep your time, or reschedule the whole
          visit — ask below for the version that fits you.
        </p>
      </div>
    );
  }

  if (result.kind === "ontime") {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-bluelagoon-volcanic px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-midnight">
            Unaffected
          </span>
          <span className="font-loft text-xl font-bold text-bluelagoon-midnight">
            {result.ref}
          </span>
        </div>
        <p className="mt-2 text-sm text-bluelagoon-ink/85">
          As far as we can see, reservation {result.ref} is unaffected by
          today&rsquo;s maintenance window. We&rsquo;ll surface anything that
          changes here.
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
          {result.ref}
        </span>
      </div>
      <p className="mt-2 text-sm text-bluelagoon-ink/85">
        We don&rsquo;t have a record of that reservation. Double-check the
        reference, or ask the concierge below — they can help track it down.
      </p>
    </div>
  );
}
