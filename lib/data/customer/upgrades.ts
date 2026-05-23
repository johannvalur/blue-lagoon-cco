// Tier-upgrade offers for an existing booking. If a guest is holding a
// Premium ticket and the in-water massage they want is busy, we surface the
// Signature tier (private changing + a 30-min massage included) as a
// material upgrade. This file is the canonical source of tier-upgrade copy.

import type { EntryTierId } from "@/lib/data/customer/fares";

export interface UpgradeOffer {
  id: string;
  currentTier: EntryTierId;
  suggestedTier: EntryTierId;
  // The delta the guest pays, in EUR. We label it priceEUR to match the
  // UpgradeOffer component's expectations.
  priceEUR: number;
  inclusions: string[];
  context: string;
  // Carried over so older UpgradeOffer renderers still compile. Both fields
  // hold human-readable tier names.
  fromFareClass: string;
  toFareClass: string;
}

// Demo guest is on a Premium ticket for the disruption afternoon. Offering
// Signature as the lowest-friction upgrade — private changing, less crowd,
// and a 30-minute massage included.
export const AVAILABLE_UPGRADE: UpgradeOffer = {
  id: "upgrade-premium-to-signature",
  currentTier: "premium",
  suggestedTier: "signature",
  priceEUR: 90,
  fromFareClass: "Premium",
  toFareClass: "Signature",
  inclusions: [
    "Private changing suite (skip the busy lockers)",
    "Bathrobe and sandals to keep",
    "Included 30-minute in-water massage",
    "Skincare amenities by Blue Lagoon",
  ],
  context:
    "The afternoon outdoor lagoon is capacity-restricted. Signature gives you private changing, a robe, and an included massage — quieter for €90 more.",
};
