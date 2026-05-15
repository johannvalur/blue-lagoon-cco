// localStorage-backed trip persistence for Blue Lagoon.
// Single key, SSR-safe, with a custom event so listeners can re-render.

export type FareClass = "Light" | "Standard" | "Flex" | "Saga";
export type TripStatus = "held" | "cancelled" | "checked-in";

export interface Trip {
  ref: string;
  dest: { iata: string; city: string };
  depart: string; // ISO date (yyyy-mm-dd)
  return: string | null; // ISO date or null for one-way
  fareClass: FareClass;
  pax: number;
  totalEUR: number;
  status: TripStatus;
  createdAt: string; // ISO timestamp
}

const STORAGE_KEY = "bluelagoon-lite:trips:v1";
const CHANGE_EVENT = "trips:changed";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read(): Trip[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Trip[];
  } catch {
    return [];
  }
}

function write(trips: Trip[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore quota / private mode failures — demo only
  }
}

export function saveTrip(trip: Trip): void {
  if (!isBrowser()) return;
  const all = read();
  // Replace if the ref already exists (idempotent on retries).
  const idx = all.findIndex((t) => t.ref === trip.ref);
  if (idx >= 0) {
    all[idx] = trip;
  } else {
    all.unshift(trip);
  }
  write(all);
}

export function getTrips(): Trip[] {
  return read();
}

export function getTrip(ref: string): Trip | null {
  return read().find((t) => t.ref === ref) ?? null;
}

export function updateTrip(ref: string, patch: Partial<Trip>): Trip | null {
  if (!isBrowser()) return null;
  const all = read();
  const idx = all.findIndex((t) => t.ref === ref);
  if (idx < 0) return null;
  const updated: Trip = { ...all[idx], ...patch, ref: all[idx].ref };
  all[idx] = updated;
  write(all);
  return updated;
}

export function removeTrip(ref: string): void {
  if (!isBrowser()) return;
  const all = read().filter((t) => t.ref !== ref);
  write(all);
}

export const TRIPS_CHANGE_EVENT = CHANGE_EVENT;
