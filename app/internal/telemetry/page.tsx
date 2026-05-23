"use client";

import { useEffect, useState } from "react";
import {
  clearUsage,
  getUsage,
  TELEMETRY_CHANGE_EVENT,
  type AllUsage,
  type SurfaceUsage,
} from "@/lib/state/telemetry";

interface TotalsRow extends SurfaceUsage {
  surface: string;
}

// Map internal surface keys to the display labels used elsewhere in the demo.
// Falls back to the raw key if a surface isn't in the table.
const SURFACE_LABELS: Record<string, string> = {
  trip: "Visit",
  companion: "Companion",
  loyalty: "Insider",
  manage: "Manage",
  status: "Status",
  ops: "Facility ops",
  crew: "Spa floor",
};

function surfaceLabel(key: string): string {
  return SURFACE_LABELS[key] ?? key;
}

function emptyTotals(): SurfaceUsage {
  return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, turns: 0 };
}

function cacheHitPct(row: SurfaceUsage): string {
  const denom = row.input + row.cacheRead;
  if (denom <= 0) return "—";
  return `${((row.cacheRead / denom) * 100).toFixed(1)}%`;
}

function fmt(n: number): string {
  return n.toLocaleString();
}

export default function TelemetryPage() {
  const [usage, setUsage] = useState<AllUsage>({});

  useEffect(() => {
    setUsage(getUsage());
    const onChange = () => setUsage(getUsage());
    window.addEventListener(TELEMETRY_CHANGE_EVENT, onChange);
    // Also re-read on cross-tab storage events for free.
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith("bluelagoon-lite:telemetry"))
        onChange();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(TELEMETRY_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const rows: TotalsRow[] = Object.entries(usage)
    .map(([surface, v]) => ({ surface, ...v }))
    .sort((a, b) => a.surface.localeCompare(b.surface));

  const totals = rows.reduce<SurfaceUsage>((acc, r) => {
    acc.input += r.input;
    acc.output += r.output;
    acc.cacheRead += r.cacheRead;
    acc.cacheWrite += r.cacheWrite;
    acc.turns += r.turns;
    return acc;
  }, emptyTotals());

  const isEmpty = rows.length === 0;

  function onClear() {
    if (typeof window === "undefined") return;
    if (!window.confirm("Clear all telemetry for this browser?")) return;
    clearUsage();
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              <span className="text-bluelagoon-midnight">Internal</span>
              <span className="text-bluelagoon-line"> · </span>telemetry
            </p>
            <h1 className="mt-1 font-loft text-4xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-5xl">
              Token & cache telemetry
            </h1>
            <p className="mt-2 max-w-3xl text-bluelagoon-ink/85">
              Per-surface aggregate across every concierge and floor-team chat
              — this browser only, session-scoped.
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            disabled={isEmpty}
            className="rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider text-bluelagoon-midnight transition hover:bg-bluelagoon-cloud disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {isEmpty ? (
          <div className="surface-card rounded-2xl border border-dashed border-bluelagoon-line p-10 text-center text-sm text-bluelagoon-muted">
            No telemetry yet. Try the chat surfaces and come back.
          </div>
        ) : (
          <div className="surface-card rounded-2xl p-6">
            <div className="overflow-x-auto rounded-xl border border-bluelagoon-line">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-bluelagoon-mist text-xs font-semibold uppercase tracking-wider text-bluelagoon-muted">
                  <tr>
                    <th className="px-4 py-3">Surface</th>
                    <th className="px-4 py-3 text-right">Turns</th>
                    <th className="px-4 py-3 text-right">Input</th>
                    <th className="px-4 py-3 text-right">Output</th>
                    <th className="px-4 py-3 text-right">Cache read</th>
                    <th className="px-4 py-3 text-right">Cache write</th>
                    <th className="px-4 py-3 text-right">Cache hit rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bluelagoon-line">
                  {rows.map((r) => (
                    <tr
                      key={r.surface}
                      className="bg-bluelagoon-paper hover:bg-bluelagoon-cloud"
                    >
                      <td className="px-4 py-3 font-semibold text-bluelagoon-midnight">
                        {surfaceLabel(r.surface)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-bluelagoon-ink/85">
                        {fmt(r.turns)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-bluelagoon-ink/85">
                        {fmt(r.input)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-bluelagoon-ink/85">
                        {fmt(r.output)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-bluelagoon-ink/85">
                        {fmt(r.cacheRead)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-bluelagoon-ink/85">
                        {fmt(r.cacheWrite)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-bluelagoon-ink/85">
                        {cacheHitPct(r)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-bluelagoon-mist/60 text-xs font-semibold uppercase tracking-wider text-bluelagoon-midnight">
                  <tr>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {fmt(totals.turns)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {fmt(totals.input)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {fmt(totals.output)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {fmt(totals.cacheRead)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {fmt(totals.cacheWrite)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {cacheHitPct(totals)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
