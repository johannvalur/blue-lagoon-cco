// Transfers — how guests get to the Blue Lagoon. Replaces the old car-rental
// inventory wholesale; the spa isn't a self-drive product. We keep the
// `cars.ts` filename so other agents' imports don't break, but the contents
// are now Transfer records.

export type TransferPickup =
  | "reykjavik-bsi"
  | "reykjavik-door"
  | "kef-airport"
  | "self-drive";

export interface Transfer {
  id: string;
  name: string;
  pickupLocation: TransferPickup;
  pickupLabel: string;
  pricePerPersonEUR: number;
  durationMinutes: number;
  capacity: number;
  vibe: string[];
  whyShort: string;
}

export const TRANSFERS: Transfer[] = [
  {
    id: "tr-reyk-excursions",
    name: "Reykjavík Excursions shuttle",
    pickupLocation: "reykjavik-bsi",
    pickupLabel: "BSÍ bus terminal, Reykjavík",
    pricePerPersonEUR: 30,
    durationMinutes: 50,
    capacity: 60,
    vibe: ["shared", "easy", "predictable"],
    whyShort:
      "Standard coach from BSÍ to the Blue Lagoon. Departures sync to entry slots; one-way ticket includes luggage hold.",
  },
  {
    id: "tr-private-reykjavik",
    name: "Private transfer from Reykjavík",
    pickupLocation: "reykjavik-door",
    pickupLabel: "Reykjavík hotel pickup",
    pricePerPersonEUR: 180,
    durationMinutes: 50,
    capacity: 6,
    vibe: ["private", "door-to-door"],
    whyShort:
      "Private car or van from your Reykjavík hotel. Flat fare up to 6 guests — works out close to the shuttle once you're a couple.",
  },
  {
    id: "tr-kef-pickup",
    name: "KEF airport pickup",
    pickupLocation: "kef-airport",
    pickupLabel: "Keflavík International (KEF)",
    pricePerPersonEUR: 25,
    durationMinutes: 20,
    capacity: 16,
    vibe: ["airport", "layover", "luggage-friendly"],
    whyShort:
      "20 minutes from the terminal. The classic layover move — visit on the way in or out, luggage held free at reception.",
  },
  {
    id: "tr-self-drive",
    name: "Self-drive",
    pickupLocation: "self-drive",
    pickupLabel: "Your own car",
    pricePerPersonEUR: 0,
    durationMinutes: 50,
    capacity: 0,
    vibe: ["flexible", "free"],
    whyShort:
      "On-site parking is free for guests. ~50 min from Reykjavík, ~20 min from KEF. Quiet B&W signage from the highway.",
  },
];

export function transfersSummary(): string {
  return `${TRANSFERS.length} transfer options: shared shuttle from BSÍ, private door pickup from Reykjavík, KEF airport pickup, and self-drive.`;
}

// ---- Back-compat aliases ------------------------------------------------
// Old code referenced CAR_TIERS / CarTier / carTierSummary. The internal
// shape changed; we still export the same names so unrelated files don't
// break while their agents migrate.

export type CarTier = Transfer;
export const CAR_TIERS = TRANSFERS;
export const carTierSummary = transfersSummary;
export type CarTerrain = "any";
