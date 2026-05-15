"use client";

/**
 * Per-surface usage aggregates, persisted to localStorage so reviewers can
 * scan token & cache stats across the demo session from /internal/telemetry.
 *
 * Browser-only. SSR/server callers get empty reads and no-op writes.
 */

const STORAGE_KEY = "bluelagoon-lite:telemetry:v1";
const CHANGE_EVENT = "telemetry:changed";

export interface SurfaceUsage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  turns: number;
}

export type AllUsage = Record<string, SurfaceUsage>;

interface UsageDelta {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

function emptySurface(): SurfaceUsage {
  return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, turns: 0 };
}

function readRaw(): AllUsage {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    // Trust the shape — this is browser-local, single-version data.
    return parsed as AllUsage;
  } catch {
    return {};
  }
}

function writeRaw(next: AllUsage): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // Quota errors etc. — telemetry is non-essential, swallow.
  }
}

export function recordUsage(surface: string, usage: UsageDelta): void {
  if (typeof window === "undefined") return;
  if (!surface) return;
  const all = readRaw();
  const prev = all[surface] ?? emptySurface();
  all[surface] = {
    input: prev.input + (usage.input || 0),
    output: prev.output + (usage.output || 0),
    cacheRead: prev.cacheRead + (usage.cacheRead || 0),
    cacheWrite: prev.cacheWrite + (usage.cacheWrite || 0),
    turns: prev.turns + 1,
  };
  writeRaw(all);
}

export function getUsage(): AllUsage {
  return readRaw();
}

export function clearUsage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export const TELEMETRY_CHANGE_EVENT = CHANGE_EVENT;
