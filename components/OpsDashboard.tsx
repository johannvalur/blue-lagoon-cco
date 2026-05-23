"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EVENTS,
  MAINTENANCE_DISRUPTION_OPS,
  type DisruptedSlot,
  type OpsEvent,
  type Severity,
} from "@/lib/data/internal/opsScenario";

type Status = "idle" | "streaming" | "done" | "error";

const SEVERITY_DOT: Record<Severity, string> = {
  broken: "bg-bluelagoon-fiery",
  "at-risk": "bg-bluelagoon-golden",
  stable: "bg-bluelagoon-muted",
};

const SEVERITY_LABEL: Record<Severity, string> = {
  broken: "Broken",
  "at-risk": "At-risk",
  stable: "Stable",
};

const SEVERITY_PILL: Record<Severity, string> = {
  broken: "bg-bluelagoon-fiery/10 text-bluelagoon-fiery",
  "at-risk": "bg-bluelagoon-golden/10 text-bluelagoon-midnight",
  stable: "bg-bluelagoon-mist text-bluelagoon-muted",
};

const ROLE_LABEL: Record<string, string> = {
  therapist: "Therapist",
  lifeguard: "Lifeguard",
  "hotel-front": "Hotel front",
  "f&b": "F&B",
};

const RESOURCE_LABEL: Record<string, string> = {
  "treatment-room": "Treatment room",
  "indoor-pool-slot": "Indoor warm pool",
  "lava-seating": "Lava seating",
  "shuttle-seat": "Shuttle seat",
};

function eventSeverity(e: OpsEvent): Severity {
  return e.severity ?? "stable";
}

export function OpsDashboard() {
  const S = MAINTENANCE_DISRUPTION_OPS;
  const [reasoning, setReasoning] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>(
    EVENTS[0]?.id ?? "pump2-maintenance"
  );
  const autoFiredRef = useRef(false);

  const selectedEvent = useMemo(
    () => EVENTS.find((e) => e.id === selectedEventId) ?? EVENTS[0],
    [selectedEventId]
  );

  const totals = useMemo(() => {
    const guests = S.slots.reduce((n, s) => n + s.guestCount, 0);
    const broken = S.slots.filter((s) => s.severity === "broken").length;
    const atRisk = S.slots.filter((s) => s.severity === "at-risk").length;
    const stable = S.slots.filter((s) => s.severity === "stable").length;
    return { guests, broken, atRisk, stable };
  }, [S.slots]);

  const mentionedSlotIds = useMemo(() => {
    if (!reasoning) return new Set<string>();
    return new Set(S.slots.filter((s) => reasoning.includes(s.id)).map((s) => s.id));
  }, [reasoning, S.slots]);

  // Auto-fire when arriving via the guided demo so the script flows without a
  // dead-air pause for the operator to click "Generate plan".
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (autoFiredRef.current) return;
    const demo = new URLSearchParams(window.location.search).get("demo");
    if (demo !== "1") return;
    autoFiredRef.current = true;
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate() {
    setReasoning("");
    setError(null);
    setStatus("streaming");

    try {
      const res = await fetch("/api/chat/internal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surface: "ops",
          messages: [
            {
              role: "user",
              content:
                "It's 13:45. Pump 2 maintenance is cutting outdoor capacity 30% from 15:00 to 18:00. Walk me through what's broken, at-risk, and stable, then give me 2-3 distinct recovery plans for the 240 affected guests (especially the 80 in-water massage bookings). Recommend one. I need to brief the duty manager in 5 minutes.",
            },
          ],
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === "text") {
              setReasoning((prev) => prev + event.text);
            } else if (event.type === "error") {
              setError(event.error);
            }
          } catch {
            // ignore
          }
        }
      }
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Active events · {EVENTS.length} open
            </div>
            <div className="text-xs text-bluelagoon-muted">
              Click to focus
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {EVENTS.map((event) => {
              const sev = eventSeverity(event);
              const isSelected = event.id === selectedEventId;
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedEventId(event.id)}
                    aria-pressed={isSelected}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-bluelagoon-line border-l-4 border-l-bluelagoon-golden bg-bluelagoon-paper shadow-sm"
                        : "border-bluelagoon-line bg-bluelagoon-snow hover:bg-bluelagoon-cloud"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`h-2 w-2 flex-none rounded-full ${SEVERITY_DOT[sev]} ${
                            isSelected && sev === "broken"
                              ? "animate-pulse"
                              : ""
                          }`}
                          aria-label={SEVERITY_LABEL[sev]}
                        />
                        <span className="truncate font-semibold text-bluelagoon-midnight">
                          {event.title ?? event.action}
                        </span>
                        {isSelected && (
                          <span className="ml-1 flex-none rounded-full bg-bluelagoon-midnight px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="flex-none text-xs font-semibold text-bluelagoon-midnight">
                        {event.time ?? event.t}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-bluelagoon-muted">
                      {event.location ?? event.by}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-bluelagoon-ink/85">
                      {event.summary ?? `${event.action} — ${event.rationale}`}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {selectedEvent && (
          <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-golden p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bluelagoon-midnight">
              <span
                className={`h-2 w-2 rounded-full ${SEVERITY_DOT[eventSeverity(selectedEvent)]} ${
                  eventSeverity(selectedEvent) === "broken"
                    ? "animate-pulse"
                    : ""
                }`}
              />
              Selected event briefing · {selectedEvent.time ?? selectedEvent.t}
            </div>
            <h2 className="mt-2 font-loft text-2xl font-bold text-bluelagoon-midnight">
              {selectedEvent.title ?? selectedEvent.action}
            </h2>
            <div className="mt-1 text-xs text-bluelagoon-muted">
              {selectedEvent.location ?? selectedEvent.by}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-bluelagoon-ink/85">
              {selectedEvent.summary ?? selectedEvent.rationale}
            </p>
          </div>
        )}

        <div className="surface-card rounded-2xl p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Disruption window
              </div>
              <h3 className="mt-1 font-loft text-lg font-semibold text-bluelagoon-midnight">
                Outdoor lagoon · 70% capacity · {S.windowStart}–{S.windowEnd}
              </h3>
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Restored {S.capacityRestoredAt}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 text-center">
            <div className="rounded-xl bg-bluelagoon-mist p-3">
              <div className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                {totals.guests}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-bluelagoon-muted">
                Guests in window
              </div>
            </div>
            <div className="rounded-xl bg-bluelagoon-fiery/10 p-3">
              <div className="font-loft text-2xl font-bold text-bluelagoon-fiery">
                {totals.broken}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-bluelagoon-muted">
                Broken slots
              </div>
            </div>
            <div className="rounded-xl bg-bluelagoon-golden/15 p-3">
              <div className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                {totals.atRisk}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-bluelagoon-muted">
                At-risk slots
              </div>
            </div>
            <div className="rounded-xl bg-bluelagoon-mist p-3">
              <div className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                {totals.stable}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-bluelagoon-muted">
                Stable slots
              </div>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-bluelagoon-line">
            <div className="grid grid-cols-12 text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              {["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"].map(
                (h) => (
                  <div key={h} className="px-1 py-1 text-center">
                    {h}
                  </div>
                )
              )}
            </div>
            <div className="relative h-8 bg-bluelagoon-snow">
              <div
                className="absolute inset-y-0 bg-bluelagoon-fiery/25"
                style={{
                  left: `${(3 / 12) * 100}%`,
                  width: `${(3 / 12) * 100}%`,
                }}
                aria-label="Reduced-capacity window 15:00–18:00"
              />
              <div
                className="absolute inset-y-0 border-l-2 border-l-bluelagoon-fiery"
                style={{ left: `${(3 / 12) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 border-l-2 border-l-bluelagoon-crisp"
                style={{ left: `${(6.5 / 12) * 100}%` }}
                aria-label="Capacity restored 18:30"
              />
            </div>
            <div className="flex items-center justify-between border-t border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-[11px] text-bluelagoon-ink/85">
              <span>
                <span className="mr-1 inline-block h-2 w-3 rounded-sm bg-bluelagoon-fiery/40 align-middle" />
                Outdoor 70% from {S.windowStart} to {S.windowEnd}
              </span>
              <span>
                <span className="mr-1 inline-block h-2 w-3 rounded-sm border-l-2 border-l-bluelagoon-crisp align-middle" />
                Capacity restored {S.capacityRestoredAt}
              </span>
            </div>
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-loft text-lg font-semibold text-bluelagoon-midnight">
              Affected slots ({S.slots.length})
            </h3>
            <div className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Focus · Pump 2 maintenance
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-bluelagoon-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-bluelagoon-mist text-xs font-semibold uppercase tracking-wider text-bluelagoon-muted">
                <tr>
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3">Window</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Add-on</th>
                  <th className="px-4 py-3 text-right">Guests</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bluelagoon-line">
                {S.slots.map((s: DisruptedSlot) => {
                  const mentioned = mentionedSlotIds.has(s.id);
                  return (
                    <tr
                      key={s.id}
                      className={`${
                        mentioned
                          ? "bg-bluelagoon-golden/10"
                          : "bg-bluelagoon-paper hover:bg-bluelagoon-cloud"
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-bluelagoon-midnight">
                        {s.id}
                        {s.hotelOvernight && (
                          <div className="text-xs text-bluelagoon-muted">
                            +{s.hotelOvernight} overnight
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-bluelagoon-ink/85">
                        {s.arrivalWindow}
                      </td>
                      <td className="px-4 py-3 text-bluelagoon-ink/85">
                        {s.tier}
                      </td>
                      <td className="px-4 py-3 text-bluelagoon-ink/85">
                        {s.addOnTreatment ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-bluelagoon-ink/85">
                        {s.guestCount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${SEVERITY_PILL[s.severity]}`}
                        >
                          {SEVERITY_LABEL[s.severity]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Affected staff
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                {S.staff.length} flagged
              </span>
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              {S.staff.map((p) => (
                <li key={p.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-bluelagoon-midnight">
                      {p.name}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-bluelagoon-muted">
                      {ROLE_LABEL[p.role] ?? p.role}
                    </span>
                  </div>
                  <div className="text-xs text-bluelagoon-ink/80">
                    {p.status}
                  </div>
                  <div className="mt-1 text-xs text-bluelagoon-muted">
                    {p.conflict}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Available resources
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                {S.resources.length} options
              </span>
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              {S.resources.map((r) => (
                <li key={r.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-bluelagoon-midnight">
                      {RESOURCE_LABEL[r.type] ?? r.type}
                    </span>
                    <span className="text-xs font-semibold text-bluelagoon-midnight">
                      from {r.availableFromTime}
                    </span>
                  </div>
                  <div className="text-xs text-bluelagoon-ink/80">
                    Capacity {r.capacity}
                  </div>
                  <div className="mt-1 text-xs text-bluelagoon-muted">
                    {r.notes}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="surface-card rounded-2xl p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Constraints in play
            </h4>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Focus · Pump 2 maintenance
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-bluelagoon-ink/85">
            {S.knownConstraints.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-bluelagoon-muted" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="surface-card sticky top-24 rounded-2xl border-l-4 border-l-bluelagoon-crisp p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bluelagoon-midnight">
              <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-crisp pulse-soft" />
              AI reasoning
            </div>
            <button
              onClick={generate}
              disabled={status === "streaming"}
              className="btn-primary rounded-full px-3 py-1 text-xs font-semibold"
            >
              {status === "streaming"
                ? "thinking…"
                : status === "done"
                  ? "Re-run"
                  : "Generate plan"}
            </button>
          </div>
          <div className="mt-4 max-h-[60vh] overflow-y-auto text-sm leading-relaxed text-bluelagoon-ink">
            {!reasoning && status === "idle" && (
              <p className="text-bluelagoon-muted">
                Click &ldquo;Generate plan&rdquo; to have the Ops Copilot
                analyse the maintenance disruption and propose recovery
                options.
              </p>
            )}
            {reasoning && (
              <div className="whitespace-pre-wrap text-[15px]">{reasoning}</div>
            )}
            {error && (
              <div className="mt-3 rounded-lg border border-bluelagoon-fiery/60 bg-bluelagoon-fiery/10 p-3 text-bluelagoon-fiery">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
