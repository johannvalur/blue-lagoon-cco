// Blue Lagoon operations scenario: scheduled geothermal pump maintenance
// (Pump 2 of 4 in the silica filtration cycle) extended by morning silica
// overflow handling. Outdoor lagoon capacity reduced 30% from 15:00–18:00
// today (4-hour window into peak afternoon). Indoor warm pool unaffected.
//
// The scenario backs the Ops Copilot's reasoning and the OpsDashboard's
// briefing layout. All data is hand-curated.

export type Severity = "broken" | "at-risk" | "stable";

export type SlotTier = "Comfort" | "Premium" | "Signature" | "Retreat Spa";

export type AddOnTreatment =
  | "in-water-massage-30"
  | "in-water-massage-60"
  | "in-water-massage-120"
  | "float-therapy"
  | "silica-salt-scrub"
  | "algae-mineral-wrap"
  | "couples-ritual"
  | null;

export type HotelOvernight = "Silica" | "Retreat" | null;

export interface DisruptedSlot {
  id: string;
  arrivalWindow: string;
  tier: SlotTier;
  hotelOvernight: HotelOvernight;
  addOnTreatment: AddOnTreatment;
  guestCount: number;
  severity: Severity;
  notes: string;
}

export type StaffRole =
  | "therapist"
  | "lifeguard"
  | "hotel-front"
  | "f&b";

export interface AffectedStaff {
  id: string;
  role: StaffRole;
  name: string;
  status: string;
  conflict: string;
}

export type ResourceType =
  | "treatment-room"
  | "indoor-pool-slot"
  | "lava-seating"
  | "shuttle-seat";

export interface AvailableResource {
  id: string;
  type: ResourceType;
  capacity: number;
  availableFromTime: string;
  notes: string;
}

export interface OpsEvent {
  id: string;
  t: string;
  by: string;
  action: string;
  rationale: string;
  // Optional fields kept loose so dashboards / prompts can reuse the same
  // shape for both a "briefing card" and an "audit trail" row.
  severity?: Severity;
  title?: string;
  location?: string;
  summary?: string;
  time?: string;
}

// Headline event list rendered as cards in the ops dashboard. Today the
// "selected" event is the maintenance-driven capacity reduction; the others
// are smaller-but-real ops items that fall around it.
export const EVENTS: OpsEvent[] = [
  {
    id: "pump2-maintenance",
    t: "12:00",
    by: "Facility Engineering",
    action: "Pump 2 silica filtration loop offline for scheduled maintenance",
    rationale:
      "Morning silica overflow handling extended the window. Outdoor lagoon capacity drops 30% from 15:00 to 18:00. Restored by 18:30.",
    severity: "broken",
    title: "Pump 2 maintenance — outdoor capacity 70% from 15:00–18:00",
    time: "12:00",
    location: "Geothermal plant · silica filtration loop",
    summary:
      "Scheduled maintenance on Pump 2 of 4 in the silica filtration cycle was extended by the morning silica overflow handling. Outdoor lagoon capacity reduced 30% from 15:00 to 18:00 (4h window into peak afternoon). Indoor warm pool unaffected. Spa Restaurant and Lava unaffected. Mask bar throughput halved (one of two stations on the affected outdoor side).",
  },
  {
    id: "therapist-reroster",
    t: "13:10",
    by: "Therapy & Wellness lead",
    action: "Therapist roster conflict flagged",
    rationale:
      "6 of 14 therapists are rostered for outdoor in-water sessions inside the affected window; ~80 in-water massage bookings need reassigning or shifting indoors.",
    severity: "at-risk",
    title: "Therapist allocation conflict — 6 of 14 affected",
    time: "13:10",
    location: "Therapy & Wellness ops",
    summary:
      "80 guests with in-water massage between 15:00 and 18:00. Of the 14 therapists on roster, 6 are assigned to outdoor in-water service inside the affected window. Float therapy and silica salt scrub rooms have spare capacity indoors.",
  },
  {
    id: "hotel-arrival-bunch",
    t: "13:30",
    by: "Hotel Operations",
    action: "Silica + Retreat hotel arrivals bunching at 14:30–15:30",
    rationale:
      "42 Silica + 28 Retreat check-ins inside a 60-minute band ahead of the maintenance window. Front desk staffing covers, but the lobby will visibly queue.",
    severity: "at-risk",
    title: "Hotel check-in bottleneck risk · 14:30–15:30",
    time: "13:30",
    location: "Silica + Retreat front desks",
    summary:
      "Silica (35 rooms, 32 occupied tonight) and The Retreat (62 suites, 41 occupied tonight) both peak arrival before 15:30. Concierge has offered Spa Restaurant holds for early arrivals; some can be diverted to lobby Café until 16:00.",
  },
  {
    id: "lava-pivot",
    t: "13:45",
    by: "F&B duty manager",
    action: "Lava ready to absorb early dinners",
    rationale:
      "Lava holds 12 covers for 17:00–17:45 if affected guests pivot from in-water time to an early dinner. Moss is fully committed.",
    severity: "stable",
    title: "Lava early-dinner capacity opened",
    time: "13:45",
    location: "Lava restaurant",
    summary:
      "Lava can seat up to 12 covers between 17:00 and 17:45 for guests pivoting from in-water time. Allergen flags already loaded for the holds. Moss tasting menu is full and runs 2.5 hours — not a swap target.",
  },
  {
    id: "mask-bar-redirect",
    t: "14:05",
    by: "Spa Operations",
    action: "Outdoor mask station closed; indoor station handling full demand",
    rationale:
      "Outdoor mask bar is one of two stations and is downstream of the affected outdoor loop. Indoor station throughput is being stretched 2x but holding.",
    severity: "stable",
    title: "Mask bar throughput halved on outdoor side",
    time: "14:05",
    location: "Mask Bar — outdoor station",
    summary:
      "Outdoor mask station closed for the duration of the maintenance. Indoor station picks up all silica + algae requests. Floor manager has reallocated one extra attendant to the indoor station from 15:00.",
  },
];

// Maintenance scenario, mirrored as the canonical Ops Copilot brief. Replaces
// the old SCENARIO export (which described a KEF fog event) — same shape, new
// fields. Consumers should read `slots`, `staff`, `resources`, and `history`.
export const MAINTENANCE_DISRUPTION_OPS = {
  title: "Pump 2 maintenance — outdoor lagoon capacity 70% from 15:00–18:00",
  triggeredAt: "12:00",
  windowStart: "15:00",
  windowEnd: "18:00",
  capacityRestoredAt: "18:30",
  briefing:
    "Scheduled maintenance on Pump 2 of 4 in the silica filtration cycle ran long after the morning silica overflow handling. Outdoor lagoon capacity is reduced 30% from 15:00 to 18:00 today — a 4-hour window cutting into peak afternoon arrivals. Indoor warm pool is unaffected. Spa Restaurant and Lava are unaffected. Mask bar throughput is halved (one of two stations sits on the affected outdoor side). ~240 guests have 15:00–18:00 arrival windows. Of those, ~80 have in-water massage bookings in the same window. 6 of 14 therapists are rostered for outdoor in-water service. Maintenance completes by 18:00; outdoor capacity restored by 18:30.",
  slots: [
    {
      id: "slot-1500-comfort",
      arrivalWindow: "15:00–15:30",
      tier: "Comfort",
      hotelOvernight: null,
      addOnTreatment: null,
      guestCount: 62,
      severity: "broken",
      notes:
        "Largest single block in the disruption. Day visit only. Candidates for the 13:00 or 19:00 shift.",
    },
    {
      id: "slot-1500-premium-massage",
      arrivalWindow: "15:00–15:30",
      tier: "Premium",
      hotelOvernight: null,
      addOnTreatment: "in-water-massage-60",
      guestCount: 24,
      severity: "broken",
      notes:
        "24 in-water massage slots inside the first 30 minutes of the window — six therapists, double-booked against outdoor reduction.",
    },
    {
      id: "slot-1530-signature",
      arrivalWindow: "15:30–16:00",
      tier: "Signature",
      hotelOvernight: null,
      addOnTreatment: "silica-salt-scrub",
      guestCount: 18,
      severity: "at-risk",
      notes:
        "Signature includes private changing — can be honoured even with outdoor cut. Silica salt scrub indoor, unaffected.",
    },
    {
      id: "slot-1600-retreat-spa",
      arrivalWindow: "16:00–16:30",
      tier: "Retreat Spa",
      hotelOvernight: "Retreat",
      addOnTreatment: "couples-ritual",
      guestCount: 12,
      severity: "stable",
      notes:
        "Retreat guests use the private lagoon side — not on the affected loop. Honour as scheduled.",
    },
    {
      id: "slot-1600-premium-massage",
      arrivalWindow: "16:00–16:30",
      tier: "Premium",
      hotelOvernight: null,
      addOnTreatment: "in-water-massage-30",
      guestCount: 28,
      severity: "broken",
      notes:
        "Second wave of in-water massage. Indoor warm pool can absorb ~12 if therapists are repositioned.",
    },
    {
      id: "slot-1630-premium",
      arrivalWindow: "16:30–17:00",
      tier: "Premium",
      hotelOvernight: null,
      addOnTreatment: null,
      guestCount: 38,
      severity: "at-risk",
      notes: "No add-on. Lava early-dinner pivot viable for ~12 of these.",
    },
    {
      id: "slot-1700-silica-overnight",
      arrivalWindow: "17:00–17:30",
      tier: "Premium",
      hotelOvernight: "Silica",
      addOnTreatment: "algae-mineral-wrap",
      guestCount: 22,
      severity: "at-risk",
      notes:
        "Hotel guests — flexible to shift lagoon entry to 19:00 after check-in and dinner. Algae wrap is indoor.",
    },
    {
      id: "slot-1730-comfort",
      arrivalWindow: "17:30–18:00",
      tier: "Comfort",
      hotelOvernight: null,
      addOnTreatment: null,
      guestCount: 36,
      severity: "stable",
      notes:
        "Tail end of the window. Capacity is already restoring by 18:00 — minor wait at worst.",
    },
  ] as DisruptedSlot[],
  staff: [
    {
      id: "ther-04",
      role: "therapist",
      name: "Ásdís Þórarinsdóttir",
      status: "Rostered outdoor in-water 15:00–18:00",
      conflict:
        "4 of her 6 sessions are inside the affected window. Indoor float therapy room 2 is free 15:30–17:00.",
    },
    {
      id: "ther-07",
      role: "therapist",
      name: "Kjartan Eiríksson",
      status: "Rostered outdoor in-water 15:00–17:30",
      conflict:
        "All 3 in-water sessions affected. Swap target — willing to take indoor pool sessions instead.",
    },
    {
      id: "ther-09",
      role: "therapist",
      name: "Maria Lopez",
      status: "Rostered outdoor in-water 16:00–18:00",
      conflict:
        "2 of 3 sessions inside reduced window. Holds silica salt scrub certification — could shift to indoor scrub room.",
    },
    {
      id: "ther-11",
      role: "therapist",
      name: "Brynjar Sigurðsson",
      status: "Rostered outdoor in-water 15:30–18:00",
      conflict:
        "All 3 sessions affected. Couples ritual cert held — could anchor Retreat-side bookings instead.",
    },
    {
      id: "life-02",
      role: "lifeguard",
      name: "Hekla Jónsdóttir",
      status: "Zone B rotation 15:00–19:00",
      conflict:
        "Reduced outdoor capacity means Zone B and Zone C overlap shrinks. Consider collapsing to 3-zone rotation.",
    },
    {
      id: "life-05",
      role: "lifeguard",
      name: "Davíð Pálsson",
      status: "Zone C rotation 14:00–18:00",
      conflict:
        "Zone C is on the affected outdoor side. Re-rotate to indoor pool deck 15:00–18:00.",
    },
    {
      id: "front-03",
      role: "hotel-front",
      name: "Helga Sveinsdóttir",
      status: "Silica front desk 12:00–20:00",
      conflict:
        "Will absorb the 14:30–15:30 bunching. Concierge added a second walk-up station from 14:00.",
    },
    {
      id: "front-08",
      role: "hotel-front",
      name: "Lars Iversen",
      status: "Retreat front desk 12:00–20:00",
      conflict:
        "Retreat side unaffected by lagoon cut but takes inbound calls from the 240 outreach list. Needs +1 from the call team.",
    },
  ] as AffectedStaff[],
  resources: [
    {
      id: "indoor-pool-1530",
      type: "indoor-pool-slot",
      capacity: 24,
      availableFromTime: "15:30",
      notes: "Indoor warm pool — 24 entry slots open across 15:30–17:30. Unaffected by maintenance.",
    },
    {
      id: "indoor-pool-1700",
      type: "indoor-pool-slot",
      capacity: 18,
      availableFromTime: "17:00",
      notes: "Indoor warm pool — second band 17:00–19:00. Good fit for Silica hotel guests pushed back.",
    },
    {
      id: "treatment-room-float-2",
      type: "treatment-room",
      capacity: 6,
      availableFromTime: "15:00",
      notes: "Float therapy room 2 — 6 slots of 60 min across the afternoon. Indoor, unaffected.",
    },
    {
      id: "treatment-room-scrub",
      type: "treatment-room",
      capacity: 8,
      availableFromTime: "15:00",
      notes: "Silica salt scrub room — 8 slots of 30 min. Therapists Ásdís and Maria both certified.",
    },
    {
      id: "lava-early-dinner",
      type: "lava-seating",
      capacity: 12,
      availableFromTime: "17:00",
      notes:
        "Lava early-dinner block 17:00–17:45 — 12 covers for guests pivoting from in-water time. Allergen flags already loaded.",
    },
    {
      id: "shuttle-1900",
      type: "shuttle-seat",
      capacity: 16,
      availableFromTime: "19:00",
      notes:
        "Reykjavík BSÍ shuttle 19:00 — 16 seats free for day-visit guests shifting to the post-window slot.",
    },
  ] as AvailableResource[],
  history: EVENTS,
  recoveryOptions: [
    "Shift to 13:00 arrival (today, earlier band).",
    "Shift to 19:00 arrival (today, post-maintenance band).",
    "Keep 15:00–18:00 window with a complimentary Signature upgrade and indoor warm pool access.",
    "Reschedule to tomorrow (same tier, no fee).",
    "Refund.",
  ],
  knownConstraints: [
    "Therapist duty hours: max 9 productive hours per shift; in-water sessions count 1.25x toward the cap.",
    "Indoor warm pool design capacity: 60 concurrent guests; current baseline occupancy 35–40 in this window.",
    "Lava and Moss capacity is firm — Moss is fully booked, Lava holds 12 covers between 17:00 and 17:45.",
    "Retreat-side private lagoon does not absorb day-visit guests; tier-gating is contractual.",
    "Mask bar indoor station can sustain 2x throughput for the 3-hour window but not longer.",
    "Outreach to affected guests goes through Guest Experience, not the front desks — keep the channels separate.",
  ],
};

// Back-compat alias — older imports may still reference SCENARIO. Other agents
// own their own consumers; keeping a typed alias here means a stale import
// doesn't blow up at type-check time before the dependent slice is updated.
export const SCENARIO = MAINTENANCE_DISRUPTION_OPS;
