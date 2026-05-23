export type AccentColor =
  | "crisp"
  | "boreal"
  | "golden"
  | "fiery"
  | "volcanic"
  | "lilac"
  | "aurora";

export type AgentKind = "ai" | "hitl" | "human";

export interface AgentMetrics {
  decisionsToday: number;
  successRatePct: number;
  p50LatencyMs: number;
  sparkline24h: number[];
}

export interface AgentDecision {
  time: string;
  action: string;
  outcome: string;
}

export interface Agent {
  name: string;
  role: string;
  kind: AgentKind;
  now: string;
  done: string;
  metrics: AgentMetrics;
  recentDecisions: AgentDecision[];
  owner: string;
  escalation: string;
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  accent: AccentColor;
  agents: Agent[];
}

export const ORG_METRICS = {
  agentsOnline: 22,
  decisionsPerHour: 184,
  humansInLoop: "Every loop",
} as const;

export const ACCENT_BORDER_LEFT: Record<AccentColor, string> = {
  crisp: "border-l-bluelagoon-crisp",
  boreal: "border-l-bluelagoon-boreal",
  golden: "border-l-bluelagoon-golden",
  fiery: "border-l-bluelagoon-fiery",
  volcanic: "border-l-bluelagoon-volcanic",
  lilac: "border-l-bluelagoon-lilac",
  aurora: "border-l-bluelagoon-aurora",
};

export const ACCENT_DOT_BG: Record<AccentColor, string> = {
  crisp: "bg-bluelagoon-crisp",
  boreal: "bg-bluelagoon-boreal",
  golden: "bg-bluelagoon-golden",
  fiery: "bg-bluelagoon-fiery",
  volcanic: "bg-bluelagoon-volcanic",
  lilac: "bg-bluelagoon-lilac",
  aurora: "bg-bluelagoon-aurora",
};

export const ACCENT_TEXT: Record<AccentColor, string> = {
  crisp: "text-bluelagoon-crisp",
  boreal: "text-bluelagoon-boreal",
  golden: "text-bluelagoon-golden",
  fiery: "text-bluelagoon-fiery",
  volcanic: "text-bluelagoon-volcanic",
  lilac: "text-bluelagoon-lilac",
  aurora: "text-bluelagoon-aurora",
};

export const KIND_LABEL: Record<AgentKind, string> = {
  ai: "AI",
  hitl: "HITL",
  human: "Human",
};

const SHAPE = {
  morningBank: [
    2, 3, 4, 6, 11, 18, 26, 24, 19, 14, 12, 11, 10, 9, 9, 9, 8, 8, 7, 6, 5, 4, 3, 3,
  ],
  longHaulWave: [
    14, 12, 11, 10, 9, 8, 7, 7, 8, 10, 13, 16, 19, 21, 22, 22, 21, 19, 17, 16, 16, 15, 15, 14,
  ],
  bimodal: [
    3, 4, 6, 9, 14, 18, 21, 18, 12, 9, 8, 9, 11, 13, 16, 19, 22, 24, 21, 16, 11, 8, 6, 4,
  ],
  steady: [
    11, 12, 12, 13, 13, 14, 14, 13, 13, 12, 12, 13, 13, 14, 14, 14, 13, 13, 12, 12, 11, 11, 11, 11,
  ],
  rampUp: [
    2, 2, 3, 4, 4, 5, 6, 7, 9, 11, 13, 15, 17, 18, 20, 21, 22, 22, 21, 19, 17, 14, 11, 8,
  ],
  spike: [
    1, 1, 2, 2, 3, 3, 4, 5, 4, 3, 4, 6, 11, 22, 18, 9, 6, 5, 4, 4, 3, 3, 2, 2,
  ],
} as const;

export const ORG_CHART: Department[] = [
  {
    id: "spa-operations",
    name: "Spa Operations",
    tagline: "The lagoon floor, daily capacity, safety in the water.",
    accent: "crisp",
    agents: [
      {
        name: "Spa Floor Lead",
        role: "Capacity & floor flow owner",
        kind: "human",
        now: "Holding 12:00 wave at 240 guests; staging 16:00 release with Reception.",
        done: "Closed yesterday with 92% capacity utilised, zero safety incidents.",
        metrics: {
          decisionsToday: 36,
          successRatePct: 100,
          p50LatencyMs: 180000,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "11:48", action: "Released 14:00 wave 220→240", outcome: "Held inside capacity" },
          { time: "10:22", action: "Closed outdoor pool 30 min for skim", outcome: "Resumed clear water" },
          { time: "09:11", action: "Re-staffed in-water station 3", outcome: "Lifeguard coverage restored" },
          { time: "07:40", action: "Approved overnight cycle restart", outcome: "Opened on time" },
        ],
        owner: "Reports to Director of Spa Operations",
        escalation: "Escalates to Director of Spa Operations",
      },
      {
        name: "Lagoon Safety Lead",
        role: "In-water safety & lifeguard rota",
        kind: "hitl",
        now: "Watching station-3 sight-line — temporary glare from low sun, adding spotter.",
        done: "Closed shift with 4 minor assists, 0 incidents; rotated lifeguard breaks on time.",
        metrics: {
          decisionsToday: 18,
          successRatePct: 99,
          p50LatencyMs: 22000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:32", action: "Added spotter station 3", outcome: "Sight-line restored" },
          { time: "10:48", action: "Rotated lifeguards 4→5", outcome: "Within fatigue policy" },
          { time: "09:22", action: "Closed slip-risk patch at exit B", outcome: "Re-opened after dry" },
          { time: "08:01", action: "Approved early opening", outcome: "Day started clean" },
        ],
        owner: "Owned by Spa Operations",
        escalation: "Escalates to Spa Floor Lead",
      },
      {
        name: "Mask Bar Supervisor",
        role: "In-water mask bar throughput",
        kind: "ai",
        now: "Cueing silica masks for the 13:00 wave; pre-mixing algae batch for 15:00 demand.",
        done: "Served 612 masks yesterday; cut median wait from 4 min to 2 min 10 s.",
        metrics: {
          decisionsToday: 612,
          successRatePct: 96,
          p50LatencyMs: 720,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "11:55", action: "Pre-mixed algae batch for 15:00", outcome: "Held median wait <3 min" },
          { time: "10:33", action: "Re-staffed mask bar position 2", outcome: "Throughput +18%" },
          { time: "09:14", action: "Swapped mineral inventory tray", outcome: "Stock holds to 17:00" },
          { time: "07:58", action: "Opened bar with full mineral stock", outcome: "On time" },
        ],
        owner: "Owned by Spa Operations",
        escalation: "Escalates to Spa Floor Lead",
      },
    ],
  },
  {
    id: "hotel-operations",
    name: "Hotel Operations",
    tagline: "Silica and the Retreat — front of house, housekeeping, butler service.",
    accent: "boreal",
    agents: [
      {
        name: "Silica Front Lead",
        role: "Silica Hotel front of house",
        kind: "human",
        now: "Sequencing late check-out for 4 guests with afternoon spa booking.",
        done: "Closed last night with 34 of 35 rooms occupied, 0 reception incidents.",
        metrics: {
          decisionsToday: 22,
          successRatePct: 100,
          p50LatencyMs: 220000,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "11:20", action: "Approved 4 late check-outs to 16:00", outcome: "Aligned with spa wave" },
          { time: "10:02", action: "Re-routed early arrival to Lava lunch", outcome: "Guest stayed on-site" },
          { time: "08:55", action: "Cleared night-audit variance", outcome: "Books balanced" },
          { time: "07:30", action: "Opened front desk on shift change", outcome: "On time" },
        ],
        owner: "Reports to Director of Hotel Operations",
        escalation: "Escalates to Director of Hotel Operations",
      },
      {
        name: "Retreat Front Lead",
        role: "Retreat front of house & butler",
        kind: "human",
        now: "Coordinating butler rota for 8 arriving suites; flagged 1 dietary request to Moss.",
        done: "62 of 62 suites turned by 15:00; signature ritual booking 92% attached.",
        metrics: {
          decisionsToday: 28,
          successRatePct: 100,
          p50LatencyMs: 260000,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "11:42", action: "Routed gluten-free request to Moss", outcome: "Menu adjusted before arrival" },
          { time: "10:55", action: "Re-paired butler to suite 211", outcome: "Guest preference matched" },
          { time: "09:30", action: "Approved private lagoon entrance for 12:00", outcome: "Guest party walked direct" },
          { time: "07:48", action: "Cleared night turn-downs", outcome: "All 62 suites refreshed" },
        ],
        owner: "Reports to Director of Hotel Operations",
        escalation: "Escalates to Director of Hotel Operations",
      },
      {
        name: "Housekeeping Lead",
        role: "Room turn & linen choreography",
        kind: "ai",
        now: "Sequencing 38 mid-stay refreshes between waves; staging fresh robes for 14:00.",
        done: "Turned 97 rooms across both hotels in the morning bank; 0 re-cleans flagged.",
        metrics: {
          decisionsToday: 412,
          successRatePct: 95,
          p50LatencyMs: 520,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "11:33", action: "Pulled forward robe restock floor 2", outcome: "Caught 14:00 wave" },
          { time: "10:18", action: "Re-sequenced suite 214 → 218", outcome: "Aligned with butler" },
          { time: "08:42", action: "Flagged linen short-ship Retreat", outcome: "Reserve stock pulled" },
          { time: "07:05", action: "Closed overnight turn batch (62)", outcome: "All ready by check-in" },
        ],
        owner: "Owned by Hotel Operations",
        escalation: "Escalates to Silica or Retreat Front Lead",
      },
    ],
  },
  {
    id: "therapy-wellness",
    name: "Therapy & Wellness",
    tagline: "Treatment programme, therapist roster, signature rituals.",
    accent: "lilac",
    agents: [
      {
        name: "Wellness Lead",
        role: "Treatment programme owner",
        kind: "human",
        now: "Reviewing summer programme — adding 2 in-water massage slots per day.",
        done: "Signed off therapist training cycle; 14 therapists currency-current.",
        metrics: {
          decisionsToday: 14,
          successRatePct: 100,
          p50LatencyMs: 360000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:18", action: "Approved 2 extra in-water slots/day", outcome: "Capacity raised June" },
          { time: "10:02", action: "Signed Senior Therapist promotion", outcome: "Effective Monday" },
          { time: "08:48", action: "Cleared signature ritual menu refresh", outcome: "Published to bookings" },
          { time: "07:20", action: "Approved overnight rota for July", outcome: "Published 8 days early" },
        ],
        owner: "Reports to Director of Therapy & Wellness",
        escalation: "Escalates to Director of Therapy & Wellness",
      },
      {
        name: "Treatment Scheduling",
        role: "Therapist roster & room allocation",
        kind: "ai",
        now: "Balancing 9 in-water and 12 dry-room slots through the afternoon; 3 holds open.",
        done: "Cleared yesterday's roster with 0 conflicts; treatment-room utilisation 84%.",
        metrics: {
          decisionsToday: 184,
          successRatePct: 93,
          p50LatencyMs: 940,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "11:40", action: "Paired in-water slot 14:30 to Senior Therapist", outcome: "Booking confirmed" },
          { time: "10:22", action: "Held 2 dry rooms for Retreat butler", outcome: "Same-day requests served" },
          { time: "09:08", action: "Re-sequenced therapist breaks", outcome: "Coverage held" },
          { time: "07:48", action: "Released morning rota v.3", outcome: "All 14 therapists on schedule" },
        ],
        owner: "Owned by Therapy & Wellness",
        escalation: "Escalates to Wellness Lead",
      },
      {
        name: "Senior Therapist",
        role: "Signature ritual delivery",
        kind: "hitl",
        now: "Delivering Blue Lagoon Ritual in suite — silica, algae, mineral sequence.",
        done: "Completed 6 signature rituals yesterday; guest NPS +71 vs property average.",
        metrics: {
          decisionsToday: 6,
          successRatePct: 100,
          p50LatencyMs: 5400000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:00", action: "Started 90-min ritual suite 214", outcome: "In progress" },
          { time: "09:30", action: "Closed 60-min mineral facial", outcome: "Guest re-booked for next day" },
          { time: "08:12", action: "Briefed junior therapist on algae mask cure time", outcome: "Knowledge transfer" },
          { time: "07:00", action: "Set up dry room 2 for the day", outcome: "Ready before first guest" },
        ],
        owner: "Owned by Therapy & Wellness",
        escalation: "Escalates to Wellness Lead",
      },
    ],
  },
  {
    id: "food-and-beverage",
    name: "F&B",
    tagline: "Lava, Moss, Spa Restaurant, Café — every plate and pour.",
    accent: "fiery",
    agents: [
      {
        name: "Lava Chef de Cuisine",
        role: "Lava main dining",
        kind: "human",
        now: "Plating lunch service for 84 covers; running cod special on a pre-mise.",
        done: "Closed dinner last night with 142 covers, cover-cost on target.",
        metrics: {
          decisionsToday: 18,
          successRatePct: 100,
          p50LatencyMs: 420000,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "11:38", action: "Pre-mised cod special × 30", outcome: "Service flow held" },
          { time: "10:14", action: "Pushed lamb tasting to dinner", outcome: "Inventory aligned" },
          { time: "08:52", action: "Closed brunch sitting (62)", outcome: "On cover-cost" },
          { time: "07:20", action: "Approved supplier swap — lambs from south", outcome: "Quality holds" },
        ],
        owner: "Reports to F&B Director",
        escalation: "Escalates to F&B Director",
      },
      {
        name: "Moss Chef",
        role: "Moss tasting-menu kitchen",
        kind: "human",
        now: "Building tonight's 7-course tasting; sourcing fresh dulse for course 3.",
        done: "Held two Michelin-level services this week; guest re-book rate 38%.",
        metrics: {
          decisionsToday: 10,
          successRatePct: 100,
          p50LatencyMs: 540000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:50", action: "Locked tonight's tasting (7 courses)", outcome: "Send to FOH" },
          { time: "10:08", action: "Swapped dulse supplier — fresher delivery", outcome: "Approved" },
          { time: "08:30", action: "Closed yesterday's service review", outcome: "0 complaints, 4 raves" },
          { time: "07:00", action: "Set up prep stations day shift", outcome: "Ready at 11:00" },
        ],
        owner: "Reports to F&B Director",
        escalation: "Escalates to F&B Director",
      },
      {
        name: "Spa Restaurant Manager",
        role: "Robe-accessible casual dining",
        kind: "ai",
        now: "Sequencing 38 robe diners with the 14:00 wave; pre-staging smoothies and bowls.",
        done: "Served 312 covers yesterday with median ticket 11 min; bar attach 64%.",
        metrics: {
          decisionsToday: 312,
          successRatePct: 94,
          p50LatencyMs: 680,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "11:55", action: "Pre-staged green smoothies × 24", outcome: "Median ticket 9 min" },
          { time: "10:42", action: "Released robe table 12", outcome: "Guests seated within 2 min" },
          { time: "08:50", action: "Re-balanced floor — 2 servers to bar", outcome: "Attach +6 pts" },
          { time: "07:18", action: "Opened restaurant on time", outcome: "First cover at 07:25" },
        ],
        owner: "Owned by F&B",
        escalation: "Escalates to F&B Director",
      },
    ],
  },
  {
    id: "skincare-retail",
    name: "Skincare & Retail",
    tagline: "Silica, Mineral, Algae lines — in-spa retail, online store, gift cards.",
    accent: "golden",
    agents: [
      {
        name: "Product Lead",
        role: "Skincare line owner",
        kind: "human",
        now: "Reviewing formulation update for the Mineral line moisturiser; lab returning by Friday.",
        done: "Approved Q3 product calendar; Algae line refresh shipped to stores.",
        metrics: {
          decisionsToday: 8,
          successRatePct: 100,
          p50LatencyMs: 1200000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:08", action: "Routed Mineral formulation to lab", outcome: "Awaiting result" },
          { time: "09:42", action: "Signed Algae refresh launch", outcome: "Shipped to stores" },
          { time: "08:00", action: "Cleared Q3 product calendar", outcome: "Published internally" },
          { time: "06:48", action: "Approved gift-card design refresh", outcome: "To print" },
        ],
        owner: "Reports to Director of Skincare & Retail",
        escalation: "Escalates to Director of Skincare & Retail",
      },
      {
        name: "Retail Floor Manager",
        role: "In-spa retail floor",
        kind: "ai",
        now: "Re-faced silica display after the 11:00 wave; staging gift bundles for afternoon.",
        done: "Closed yesterday with €18,420 retail revenue; attach to spa visit 41%.",
        metrics: {
          decisionsToday: 96,
          successRatePct: 95,
          p50LatencyMs: 460,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "11:48", action: "Re-faced silica display", outcome: "Featured SKU sell-through +12%" },
          { time: "10:22", action: "Re-stocked mineral toner", outcome: "Held to 18:00" },
          { time: "08:50", action: "Staged gift bundles × 24", outcome: "Sold 14 by 12:00" },
          { time: "07:20", action: "Opened retail floor", outcome: "First sale 07:32" },
        ],
        owner: "Owned by Skincare & Retail",
        escalation: "Escalates to Product Lead",
      },
      {
        name: "eCommerce Lead",
        role: "Online store & gift cards",
        kind: "ai",
        now: "Watching 38 active carts; A/B testing the new Mineral set hero on the home page.",
        done: "Yesterday: €24,140 online revenue; gift-card share 28% of basket.",
        metrics: {
          decisionsToday: 184,
          successRatePct: 92,
          p50LatencyMs: 1100,
          sparkline24h: [...SHAPE.longHaulWave],
        },
        recentDecisions: [
          { time: "11:36", action: "Promoted Mineral set hero", outcome: "Add-to-cart +18%" },
          { time: "10:08", action: "Closed losing A/B arm (banner)", outcome: "Reverted control" },
          { time: "08:22", action: "Re-priced gift-card bundle", outcome: "Attach +4 pts" },
          { time: "06:55", action: "Synced inventory with retail floor", outcome: "0 oversells" },
        ],
        owner: "Owned by Skincare & Retail",
        escalation: "Escalates to Product Lead",
      },
    ],
  },
  {
    id: "guest-experience",
    name: "Guest Experience",
    tagline: "Concierge, member services, reservations, transfers.",
    accent: "aurora",
    agents: [
      {
        name: "Member Services Lead",
        role: "Insider programme owner",
        kind: "human",
        now: "Reviewing 14 Insider tier upgrades; approving one comp ritual for a long-time member.",
        done: "Closed week with Insider retention 94%; 12 new Inner-Circle members.",
        metrics: {
          decisionsToday: 22,
          successRatePct: 100,
          p50LatencyMs: 540000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:22", action: "Approved comp ritual — Inner-Circle member", outcome: "Guest delighted" },
          { time: "10:08", action: "Cleared 14 tier upgrades", outcome: "Auto-notified members" },
          { time: "08:32", action: "Signed Q3 member benefit refresh", outcome: "Published to portal" },
          { time: "07:00", action: "Re-routed a private-event request", outcome: "Handed to Events" },
        ],
        owner: "Reports to Director of Guest Experience",
        escalation: "Escalates to Director of Guest Experience",
      },
      {
        name: "Concierge",
        role: "Reservations & on-site guidance",
        kind: "ai",
        now: "Helping 31 active guest conversations; 8 closing same-day reservations.",
        done: "Resolved 412 enquiries yesterday; 4 routed to human for visa-stay edge cases.",
        metrics: {
          decisionsToday: 412,
          successRatePct: 91,
          p50LatencyMs: 1240,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "11:48", action: "Closed couples package booking", outcome: "€640 booked + transfer" },
          { time: "10:32", action: "Routed visa-stay edge case", outcome: "Member Services picked up" },
          { time: "09:18", action: "Up-sold Retreat upgrade", outcome: "Guest accepted +€420" },
          { time: "07:42", action: "Surfaced transfer offer", outcome: "14 guests booked" },
        ],
        owner: "Owned by Guest Experience",
        escalation: "Escalates to Member Services Lead",
      },
      {
        name: "Transfer Coordinator",
        role: "Reykjavík–Grindavík transport",
        kind: "ai",
        now: "Sequencing 22 inbound transfers from Reykjavík for the 14:00 wave; 1 weather-delayed.",
        done: "Coordinated 84 transfers yesterday; 0 missed-connection complaints.",
        metrics: {
          decisionsToday: 84,
          successRatePct: 96,
          p50LatencyMs: 820,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "11:52", action: "Routed late guest to 14:30 shuttle", outcome: "Caught wave" },
          { time: "10:14", action: "Re-paired KEF airport pickup", outcome: "Guest party of 5 united" },
          { time: "08:30", action: "Held 09:00 shuttle for 2 stragglers", outcome: "All boarded" },
          { time: "07:00", action: "Confirmed driver pool for the day", outcome: "All shifts covered" },
        ],
        owner: "Owned by Guest Experience",
        escalation: "Escalates to Member Services Lead",
      },
    ],
  },
  {
    id: "geothermal-engineering",
    name: "Geothermal & Facility Engineering",
    tagline: "Pumps, water chemistry, silica cycle, energy, grounds.",
    accent: "volcanic",
    agents: [
      {
        name: "Predictive Maintenance",
        role: "CycleMon telemetry anomaly detection",
        kind: "ai",
        now: "Watching 24 CycleMon streams; vibration trending up on silica filtration Pump 2 of 4.",
        done: "Caught Pump 2 bearing wear 4 days ahead of likely failure; flagged Defects Triage.",
        metrics: {
          decisionsToday: 218,
          successRatePct: 92,
          p50LatencyMs: 780,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:42", action: "Flagged Pump 2 bearing trend", outcome: "Routed to Defects Triage" },
          { time: "10:18", action: "Cleared geothermal well 3 vib alert", outcome: "Within trend" },
          { time: "08:50", action: "Raised silica RPM drift Pump 4", outcome: "Within tolerance" },
          { time: "03:22", action: "Closed 14 overnight stream alerts", outcome: "All within limits" },
        ],
        owner: "Owned by Geothermal & Facility Engineering",
        escalation: "Escalates to Defects Triage, then Lead Engineer",
      },
      {
        name: "Defects Triage",
        role: "Open work-order ranking",
        kind: "ai",
        now: "Reviewing Pump 2 trend; reading water-chemistry context; deciding 'schedule' vs 'watch'.",
        done: "Cleared 9 open work orders this week; 0 carried beyond a full cycle.",
        metrics: {
          decisionsToday: 9,
          successRatePct: 96,
          p50LatencyMs: 1100,
          sparkline24h: [...SHAPE.rampUp],
        },
        recentDecisions: [
          { time: "11:45", action: "Routed Pump 2 trend → schedule, not watch", outcome: "Handed to Service Planner" },
          { time: "10:02", action: "Closed Spa Restaurant freezer ticket", outcome: "Within SLA" },
          { time: "08:40", action: "Carried Retreat balcony rail defect", outcome: "Workaround logged" },
          { time: "06:18", action: "Routed lobby HVAC alert", outcome: "Slot booked tonight" },
        ],
        owner: "Owned by Geothermal & Facility Engineering",
        escalation: "Escalates to Lead Engineer",
      },
      {
        name: "Service Planner",
        role: "Maintenance window scheduling",
        kind: "ai",
        now: "Sizing windows for Pump 2 swap — overnight slot Tue 23:00 → Thu 07:00 minimises capacity hit.",
        done: "Scheduled 6 maintenance windows this month; 0 daytime capacity reductions.",
        metrics: {
          decisionsToday: 14,
          successRatePct: 94,
          p50LatencyMs: 1640,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:48", action: "Proposed Pump 2 window Tue 23:00 → Thu 07:00", outcome: "Pending Spa Floor Lead" },
          { time: "10:30", action: "Released geothermal well 1 from window", outcome: "Returned to service" },
          { time: "08:55", action: "Re-sequenced HVAC slot Spa Restaurant", outcome: "Done overnight, no impact" },
          { time: "06:00", action: "Closed weekly window plan v.18", outcome: "Published to ops" },
        ],
        owner: "Owned by Geothermal & Facility Engineering",
        escalation: "Escalates to Lead Engineer",
      },
      {
        name: "Lead Engineer",
        role: "Sign-off authority for work orders",
        kind: "human",
        now: "Reviewing Pump 2 work-order package — bearing kit on hand, crew briefed.",
        done: "Signed 4 work orders this week; 0 unscheduled stoppages on the cycle.",
        metrics: {
          decisionsToday: 4,
          successRatePct: 100,
          p50LatencyMs: 360000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "11:50", action: "Reviewing Pump 2 work order", outcome: "Awaiting sign-off" },
          { time: "10:18", action: "Signed Retreat balcony rail repair", outcome: "Scheduled overnight" },
          { time: "08:40", action: "Held lobby HVAC for additional reading", outcome: "Crew re-tasked" },
          { time: "06:30", action: "Released geothermal well 1 to service", outcome: "Back on cycle" },
        ],
        owner: "Reports to Director of Engineering",
        escalation: "Escalates to Director of Engineering",
      },
    ],
  },
];
