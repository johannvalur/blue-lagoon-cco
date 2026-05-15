"use client";
import { useEffect, useRef } from "react";
import { recordUsage } from "@/lib/state/telemetry";
import type { Surface } from "@/lib/anthropic";

export interface TelemetrySnapshot {
  inputTokens: number;       // running sum of uncached input across the session
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  lastLatencyMs: number;
}

export function Telemetry({ snapshot, surface }: { snapshot: TelemetrySnapshot | null; surface?: Surface }) {
  const prev = useRef<TelemetrySnapshot | null>(null);
  useEffect(() => { if (!snapshot || !surface) return; const p = prev.current; prev.current = snapshot; const d = { input: snapshot.inputTokens - (p?.inputTokens ?? 0), output: snapshot.outputTokens - (p?.outputTokens ?? 0), cacheRead: snapshot.cacheReadTokens - (p?.cacheReadTokens ?? 0), cacheWrite: snapshot.cacheWriteTokens - (p?.cacheWriteTokens ?? 0) }; if (d.input || d.output || d.cacheRead || d.cacheWrite) recordUsage(surface, d); }, [snapshot, surface]);
  if (!snapshot) return null;
  const totalInputAccess = snapshot.inputTokens + snapshot.cacheReadTokens;
  const cacheHitPct = totalInputAccess > 0
    ? Math.round((snapshot.cacheReadTokens / totalInputAccess) * 100)
    : 0;
  const latency = snapshot.lastLatencyMs >= 1000
    ? `${(snapshot.lastLatencyMs / 1000).toFixed(1)}s`
    : `${snapshot.lastLatencyMs}ms`;

  return (
    <div
      title="Tokens in (uncached) · Tokens out · Cache hit % across the session · Last request latency"
      className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-bluelagoon-line bg-bluelagoon-mist/60 px-3 py-1 text-[11px] font-mono text-bluelagoon-muted sm:gap-x-3 sm:rounded-full"
    >
      <span className="whitespace-nowrap">
        <strong className="font-semibold text-bluelagoon-ink">in</strong>{" "}
        {snapshot.inputTokens.toLocaleString()}
      </span>
      <span aria-hidden className="hidden text-bluelagoon-line sm:inline">·</span>
      <span className="whitespace-nowrap">
        <strong className="font-semibold text-bluelagoon-ink">out</strong>{" "}
        {snapshot.outputTokens.toLocaleString()}
      </span>
      <span aria-hidden className="hidden text-bluelagoon-line sm:inline">·</span>
      <span className="whitespace-nowrap">
        <strong className="font-semibold text-bluelagoon-ink">cache</strong>{" "}
        {cacheHitPct}%
      </span>
      <span aria-hidden className="hidden text-bluelagoon-line sm:inline">·</span>
      <span className="whitespace-nowrap">
        <strong className="font-semibold text-bluelagoon-ink">lat</strong>{" "}
        {latency}
      </span>
    </div>
  );
}
