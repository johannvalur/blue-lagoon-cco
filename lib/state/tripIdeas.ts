// localStorage-backed trip-idea persistence for Blue Lagoon.
// Mirrors lib/state/trips.ts. Trip ideas are pre-booking — they describe a
// shareable plan covering flights, hotels, cars, and packages.

import type { SaveTripIdeaPayload } from "@/lib/tools/bookingTools";

export type TripIdea = SaveTripIdeaPayload;

const STORAGE_KEY = "bluelagoon-lite:trip-ideas:v1";
const CHANGE_EVENT = "tripIdeas:changed";
const MAX_ENCODED_LENGTH = 3072;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read(): TripIdea[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TripIdea[];
  } catch {
    return [];
  }
}

function write(ideas: TripIdea[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore quota / private-mode failures — demo only
  }
}

export function saveTripIdea(idea: TripIdea): void {
  if (!isBrowser()) return;
  const all = read();
  const idx = all.findIndex((t) => t.id === idea.id);
  if (idx >= 0) {
    all[idx] = idea;
  } else {
    all.unshift(idea);
  }
  write(all);
}

export function getTripIdeas(): TripIdea[] {
  return read();
}

export function getTripIdea(id: string): TripIdea | null {
  return read().find((t) => t.id === id) ?? null;
}

export function removeTripIdea(id: string): void {
  if (!isBrowser()) return;
  const all = read().filter((t) => t.id !== id);
  write(all);
}

// ---- base64url codec --------------------------------------------------
// Server (Node) and client (browser) both use the same algorithm. The
// encoded value is the URL path segment after /customer/trip/.

export function encodeTripIdea(idea: TripIdea): string | null {
  try {
    const json = JSON.stringify(idea);
    const b64 = isBrowser()
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, "utf8").toString("base64");
    const url = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    if (url.length > MAX_ENCODED_LENGTH) return null;
    return url;
  } catch {
    return null;
  }
}

export function decodeTripIdea(token: string): TripIdea | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    // Restore padding
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const json = isBrowser()
      ? decodeURIComponent(escape(atob(b64 + pad)))
      : Buffer.from(b64 + pad, "base64").toString("utf8");
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.id !== "string" || typeof parsed.title !== "string")
      return null;
    return parsed as TripIdea;
  } catch {
    return null;
  }
}

export const TRIP_IDEAS_CHANGE_EVENT = CHANGE_EVENT;
