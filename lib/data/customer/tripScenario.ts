// Canonical post-booking scenario for the Blue Lagoon demo.
//
// One booked visit (BL2X4F8K — Sigríður Margrét Oddsdóttir, Premium tier,
// arriving today at 15:00) and one disruption (geothermal pump maintenance
// reducing outdoor lagoon capacity 30% from 15:00–18:00). Together they
// drive the post-booking customer surfaces: manage, status, check-in.

export type EntryTier = "Comfort" | "Premium" | "Signature" | "Retreat Spa";

export type LoyaltyTier = "Friend" | "Ambassador" | "Founder";

export interface BookedVisit {
  ref: string;
  guestName: string;
  visitDate: string; // ISO yyyy-mm-dd or "today" for the demo
  arrivalWindow: string; // local 24h, e.g. "15:00"
  tier: EntryTier;
  hotelId?: "silica" | "retreat";
  hotelName?: string;
  hotelRoom?: string;
  hotelNights?: number;
  addons: string[];
  transfer?: {
    provider: string;
    departure: string;
    pickup: string;
  };
  totalEUR: number;
  loyaltyTier: LoyaltyTier;
  pointsBalance: number;
}

export const BOOKED_VISIT: BookedVisit = {
  ref: "BL2X4F8K",
  guestName: "Sigríður Margrét Oddsdóttir",
  visitDate: "today",
  arrivalWindow: "15:00",
  tier: "Premium",
  hotelId: "silica",
  hotelName: "Silica Hotel",
  hotelRoom: "207",
  hotelNights: 1,
  addons: [
    "Silica mud mask (included)",
    "Algae mask (included with Premium)",
    "30-min in-water massage at 16:15",
    "Sparkling wine + Lava reservation (included with Premium)",
  ],
  transfer: {
    provider: "Reykjavík Excursions shuttle",
    departure: "14:30",
    pickup: "BSÍ Bus Terminal, Reykjavík",
  },
  totalEUR: 310,
  loyaltyTier: "Ambassador",
  pointsBalance: 18250,
};

export interface RecoveryOption {
  id: "shift-earlier" | "shift-later" | "upgrade-stay" | "reschedule" | "refund";
  label: string;
  description: string;
  costToGuestEUR: number; // often 0 — care-led
  valueLine: string; // e.g. "complimentary upgrade", "+€30 transfer credit"
  recommended?: boolean;
}

export interface MaintenanceDisruption {
  cause: string;
  causeDetail: string;
  windowStart: string; // "15:00"
  windowEnd: string; // "18:00"
  capacityImpact: string; // "outdoor lagoon capacity reduced 30%"
  affectedAreas: string[]; // ["Outdoor lagoon"]
  affectedAreasUnaffected: string[]; // ["Indoor warm pool", "Spa Restaurant"]
  etaResolution: string; // "Maintenance complete by 18:00; outdoor capacity restored by 18:30."
  guestsAffectedApprox: number;
  treatmentsAffectedApprox: number;
  recoveryOptions: RecoveryOption[];
}

export const MAINTENANCE_DISRUPTION: MaintenanceDisruption = {
  cause: "Geothermal pump maintenance",
  causeDetail:
    "Scheduled maintenance on Pump 2 of 4 in the silica filtration cycle ran long after silica overflow handling this morning. Outdoor lagoon capacity is reduced 30% from 15:00 to 18:00.",
  windowStart: "15:00",
  windowEnd: "18:00",
  capacityImpact: "Outdoor lagoon capacity reduced 30%",
  affectedAreas: ["Outdoor lagoon"],
  affectedAreasUnaffected: [
    "Indoor warm pool",
    "Spa Restaurant",
    "Silica Hotel rooms",
    "The Retreat suites",
  ],
  etaResolution:
    "Maintenance complete by 18:00; outdoor lagoon capacity restored by 18:30.",
  guestsAffectedApprox: 240,
  treatmentsAffectedApprox: 80,
  recoveryOptions: [
    {
      id: "shift-earlier",
      label: "Shift arrival to 13:00",
      description:
        "Come in before the maintenance window. Full outdoor lagoon, full capacity. Treatment slot moved with you.",
      costToGuestEUR: 0,
      valueLine: "No change fee · complimentary",
    },
    {
      id: "shift-later",
      label: "Shift arrival to 19:00",
      description:
        "Come in after the maintenance window — outdoor capacity restored by 18:30. Evening light is its own thing.",
      costToGuestEUR: 0,
      valueLine: "No change fee · complimentary",
    },
    {
      id: "upgrade-stay",
      label: "Keep 15:00 with a Signature upgrade",
      description:
        "Stay on your time. We move you up to Signature: private changing, robe, in-water massage. Lava restaurant reservation included.",
      costToGuestEUR: 0,
      valueLine: "Complimentary upgrade from Premium to Signature",
      recommended: true,
    },
    {
      id: "reschedule",
      label: "Reschedule to tomorrow",
      description:
        "Same arrival time tomorrow. Complimentary tier upgrade and free transfer included. Silica Hotel room held at no extra charge.",
      costToGuestEUR: 0,
      valueLine: "Complimentary upgrade + free transfer",
    },
    {
      id: "refund",
      label: "Full refund",
      description:
        "Entry, hotel night, treatment, and transfer all refunded to original payment method. Two to three business days.",
      costToGuestEUR: 0,
      valueLine: "Full refund of all components",
    },
  ],
};
