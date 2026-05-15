"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EVENTS, SCENARIO, type OpsEvent } from "@/lib/data/internal/opsScenario";
import { RouteMap } from "@/components/RouteMap";

type Status = "idle" | "streaming" | "done" | "error";

const SEVERITY_DOT: Record<OpsEvent["severity"], string> = {
  major: "bg-bluelagoon-fiery",
  moderate: "bg-bluelagoon-golden",
  minor: "bg-bluelagoon-muted",
};

const SEVERITY_LABEL: Record<OpsEvent["severity"], string> = {
  major: "Major",
  moderate: "Moderate",
  minor: "Minor",
};

export function OpsDashboard() {
  const [reasoning, setReasoning] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("kef-fog");
  const autoFiredRef = useRef(false);

  const selectedEvent = useMemo(
    () => EVENTS.find((e) => e.id === selectedEventId) ?? EVENTS[0],
    [selectedEventId]
  );

  const recoveryPlan = useMemo(() => {
    if (!reasoning) return undefined;
    const mentioned = new Set(reasoning.match(/FI\d{3,4}/g) ?? []);
    const swaps = SCENARIO.disruptedFlights
      .filter((f) => mentioned.has(f.flight))
      .map((f) => ({ flight: f.flight }));
    return swaps.length > 0 ? { swaps } : undefined;
  }, [reasoning]);

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
                "It's 0612z. Walk me through the situation, give me 2-3 distinct recovery options for the four disrupted westbound rotations, and recommend one. I need to brief the duty manager in 5 minutes.",
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
                          className={`h-2 w-2 flex-none rounded-full ${SEVERITY_DOT[event.severity]} ${
                            isSelected && event.severity === "major"
                              ? "animate-pulse"
                              : ""
                          }`}
                          aria-label={SEVERITY_LABEL[event.severity]}
                        />
                        <span className="truncate font-semibold text-bluelagoon-midnight">
                          {event.title}
                        </span>
                        {isSelected && (
                          <span className="ml-1 flex-none rounded-full bg-bluelagoon-midnight px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="flex-none text-xs font-semibold text-bluelagoon-midnight">
                        {event.time}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-bluelagoon-muted">
                      {event.location}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-bluelagoon-ink/85">
                      {event.summary}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-golden p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bluelagoon-midnight">
            <span
              className={`h-2 w-2 rounded-full ${SEVERITY_DOT[selectedEvent.severity]} ${
                selectedEvent.severity === "major" ? "animate-pulse" : ""
              }`}
            />
            Selected event briefing · {selectedEvent.time}
          </div>
          <h2 className="mt-2 font-loft text-2xl font-bold text-bluelagoon-midnight">
            {selectedEvent.title}
          </h2>
          <div className="mt-1 text-xs text-bluelagoon-muted">
            {selectedEvent.location}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-bluelagoon-ink/85">
            {selectedEvent.summary}
          </p>
        </div>

        <div className="surface-card rounded-2xl p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Network state
              </div>
              <h3 className="mt-1 font-loft text-lg font-semibold text-bluelagoon-midnight">
                North Atlantic
              </h3>
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Focus · KEF fog
            </div>
          </div>
          <div className="mt-4">
            <RouteMap
              disruptedFlights={SCENARIO.disruptedFlights}
              recoveryPlan={recoveryPlan}
            />
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-loft text-lg font-semibold text-bluelagoon-midnight">
              Disrupted rotations ({SCENARIO.disruptedFlights.length})
            </h3>
            <div className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Focus · KEF fog
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-bluelagoon-line">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-bluelagoon-mist text-xs font-semibold uppercase tracking-wider text-bluelagoon-muted">
                <tr>
                  <th className="px-4 py-3">Flight</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Sched</th>
                  <th className="px-4 py-3">Aircraft</th>
                  <th className="px-4 py-3 text-right">Pax (Saga)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bluelagoon-line">
                {SCENARIO.disruptedFlights.map((f) => (
                  <tr
                    key={f.flight}
                    className="bg-bluelagoon-paper hover:bg-bluelagoon-cloud"
                  >
                    <td className="px-4 py-3 font-semibold text-bluelagoon-midnight">
                      {f.flight}
                    </td>
                    <td className="px-4 py-3 text-bluelagoon-ink/85">
                      {f.origin} → {f.destination}
                    </td>
                    <td className="px-4 py-3 text-bluelagoon-ink/85">
                      {f.schedDep}
                    </td>
                    <td className="px-4 py-3 text-bluelagoon-ink/85">
                      {f.type}
                      <div className="text-xs text-bluelagoon-muted">
                        {f.registration}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-bluelagoon-ink/85">
                      {f.pax}{" "}
                      <span className="text-bluelagoon-muted">({f.saga})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Available aircraft
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Focus · KEF fog
              </span>
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              {SCENARIO.availableAircraft.map((a) => (
                <li key={a.registration}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-bluelagoon-midnight">
                      {a.registration}
                    </span>
                    <span className="text-xs font-semibold text-bluelagoon-midnight">
                      {a.availableFrom}
                    </span>
                  </div>
                  <div className="text-xs text-bluelagoon-ink/80">
                    {a.type} · {a.location}
                  </div>
                  <div className="mt-1 text-xs text-bluelagoon-muted">
                    {a.notes}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Constraints in play
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Focus · KEF fog
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-bluelagoon-ink/85">
              {SCENARIO.knownConstraints.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-bluelagoon-muted" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
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
                analyse the disruption and propose recovery options.
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
