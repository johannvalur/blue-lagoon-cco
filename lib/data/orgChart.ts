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
  agentsOnline: 47,
  decisionsPerHour: 312,
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
    id: "flight-ops",
    name: "Flight Operations",
    tagline: "Plans, dispatches, and watches every sector across the network.",
    accent: "golden",
    agents: [
      {
        name: "Dispatch Copilot",
        role: "Flight plan drafting",
        kind: "ai",
        now: "Drafting FI631 KEF→JFK; routing south of CB activity over OZN.",
        done: "Filed 4 transatlantic plans, saved 2,140 kg fuel vs filed prior week.",
        metrics: {
          decisionsToday: 612,
          successRatePct: 94,
          p50LatencyMs: 1840,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "07:42", action: "Filed FI631 KEF→JFK release", outcome: "Approved · −1,840 kg fuel" },
          { time: "07:18", action: "Re-routed FI451 around CB cluster", outcome: "Approved · +6 min ETA" },
          { time: "06:55", action: "Drafted FI311 KEF→AMS plan", outcome: "Approved as filed" },
          { time: "06:21", action: "Proposed step-climb FL380→FL400 FI681", outcome: "Approved · −210 kg" },
        ],
        owner: "Owned by OCC Dispatch Desk",
        escalation: "Escalates to Duty Captain for release sign-off",
      },
      {
        name: "OCC Watch",
        role: "Network controller",
        kind: "hitl",
        now: "Holding TF-FIA at gate 14 — waiting on de-icing slot 0742z.",
        done: "Cleared 17 departures in the morning bank with 92% on-time push.",
        metrics: {
          decisionsToday: 88,
          successRatePct: 96,
          p50LatencyMs: 6200,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "07:38", action: "Held TF-FIA for de-ice slot", outcome: "+8 min push, kept curfew" },
          { time: "07:11", action: "Swapped tail FI453 ↔ FI455", outcome: "Recovered tech delay" },
          { time: "06:47", action: "Approved early-push FI201", outcome: "+3 min connection buffer" },
          { time: "06:09", action: "Held FI621 for 4 connecting pax", outcome: "All connections made" },
        ],
        owner: "Owned by Network Operations Control",
        escalation: "Escalates to OCC Duty Manager",
      },
      {
        name: "Fuel Optimizer",
        role: "Tankering & ETOPS reasoning",
        kind: "ai",
        now: "Re-running step climbs for FI681 KEF→SEA against latest GFS winds.",
        done: "Saved 1,340 kg average across 9 westbound Atlantic crossings.",
        metrics: {
          decisionsToday: 287,
          successRatePct: 91,
          p50LatencyMs: 2210,
          sparkline24h: [...SHAPE.longHaulWave],
        },
        recentDecisions: [
          { time: "07:31", action: "Recommended tankering 2.1 t into ANC", outcome: "Accepted · €640 saved" },
          { time: "07:02", action: "Reset ETOPS alternates FI681", outcome: "Approved" },
          { time: "06:34", action: "Step-climb proposal FI451 FL360→FL380", outcome: "Approved · −180 kg" },
          { time: "05:58", action: "Reduced contingency 5%→3% FI311", outcome: "Approved · −90 kg" },
        ],
        owner: "Owned by Fuel Efficiency cell",
        escalation: "Escalates to Dispatch Copilot for inclusion in release",
      },
      {
        name: "Duty Captain",
        role: "Final dispatch authority",
        kind: "human",
        now: "Reviewing copilot's KEF→ARN release; weather deviation in scope.",
        done: "Signed 23 release packages overnight; 0 returned for replan.",
        metrics: {
          decisionsToday: 23,
          successRatePct: 100,
          p50LatencyMs: 240000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:35", action: "Signed FI631 KEF→JFK release", outcome: "Released as filed" },
          { time: "07:09", action: "Signed FI311 KEF→AMS release", outcome: "Released" },
          { time: "06:42", action: "Returned FI221 release for re-plan", outcome: "ETOPS check requested" },
          { time: "06:11", action: "Signed FI451 KEF→LHR release", outcome: "Released" },
        ],
        owner: "Reports to Chief Pilot",
        escalation: "Escalates to Director of Flight Operations",
      },
    ],
  },
  {
    id: "ground-ops",
    name: "Ground Operations",
    tagline: "Turns aircraft, moves bags, and keeps the ramp choreographed.",
    accent: "boreal",
    agents: [
      {
        name: "Turnaround Agent",
        role: "Block-to-block sequencing",
        kind: "ai",
        now: "Watching 7 active turns at KEF; nudging cleaning crew toward stand 26.",
        done: "Shaved 4 min off mean turn; recovered 11 min from earlier ATC flow.",
        metrics: {
          decisionsToday: 1042,
          successRatePct: 92,
          p50LatencyMs: 480,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "07:39", action: "Re-sequenced cleaning team stand 26→14", outcome: "Saved 4 min" },
          { time: "07:21", action: "Pulled forward fuel slot FI453", outcome: "On-time push held" },
          { time: "06:58", action: "Flagged catering miss stand 18", outcome: "Recovery initiated" },
          { time: "06:37", action: "Released GPU stand 12 to stand 18", outcome: "Power restored" },
        ],
        owner: "Owned by Ramp Operations",
        escalation: "Escalates to Ramp Lead",
      },
      {
        name: "Bag Tracker",
        role: "End-to-end baggage telemetry",
        kind: "ai",
        now: "Tracking 2,341 bags across the morning bank; 3 short-shipped flagged.",
        done: "Caught 6 mis-routes before pushback; 2,109 bags on first attempt.",
        metrics: {
          decisionsToday: 2341,
          successRatePct: 98,
          p50LatencyMs: 320,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "07:40", action: "Flagged 3 short-ship bags FI631", outcome: "Hold-bag protocol triggered" },
          { time: "07:22", action: "Re-routed bag KEF-LHR-CDG", outcome: "Connection saved" },
          { time: "06:55", action: "Caught mis-tag bag set (12)", outcome: "Re-tagged before sort" },
          { time: "06:18", action: "Released 412 bags to FI453", outcome: "All loaded" },
        ],
        owner: "Owned by Baggage Services",
        escalation: "Escalates to Duty Baggage Manager",
      },
      {
        name: "Ramp Lead",
        role: "Stand & equipment supervisor",
        kind: "human",
        now: "Re-allocating GPU between stand 12 and 18 after generator fault.",
        done: "Closed shift with zero ground-damage events across 41 movements.",
        metrics: {
          decisionsToday: 41,
          successRatePct: 100,
          p50LatencyMs: 90000,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "07:33", action: "Re-allocated GPU stand 12→18", outcome: "Power restored" },
          { time: "07:04", action: "Held FI451 push for tug change", outcome: "+2 min, no damage" },
          { time: "06:31", action: "Cleared stand 26 for early arrival", outcome: "On-block 4 min early" },
          { time: "05:55", action: "Approved double-tow stand 8/9", outcome: "Bank protected" },
        ],
        owner: "Reports to Ground Operations Manager",
        escalation: "Escalates to Station Manager KEF",
      },
      {
        name: "Gate Allocator",
        role: "Stand assignment optimizer",
        kind: "ai",
        now: "Solving tomorrow's 89 KEF movements; 6 contact-stand swaps proposed.",
        done: "Reduced bus boardings by 18% week-on-week; held connection MCT.",
        metrics: {
          decisionsToday: 89,
          successRatePct: 95,
          p50LatencyMs: 1640,
          sparkline24h: [...SHAPE.rampUp],
        },
        recentDecisions: [
          { time: "07:28", action: "Proposed 6 contact-stand swaps", outcome: "4 accepted by ramp" },
          { time: "06:55", action: "Re-pinned FI631 to stand 24", outcome: "MCT preserved" },
          { time: "06:09", action: "Held remote stand for FI921", outcome: "Crew swap protected" },
          { time: "05:40", action: "Solved next-day 89-mvt grid", outcome: "Published 18% fewer buses" },
        ],
        owner: "Owned by Stand Planning",
        escalation: "Escalates to Duty Allocator (human)",
      },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance & Engineering",
    tagline: "Keeps the fleet airworthy, predicts failure before it grounds.",
    accent: "fiery",
    agents: [
      {
        name: "Hangar Planner",
        role: "Tail rotation scheduling",
        kind: "ai",
        now: "Proposing TF-ICE swap into A-check Tuesday to free TF-ISK for JFK rotation.",
        done: "Sequenced 6 line checks across KEF and ARN; zero AOG events this cycle.",
        metrics: {
          decisionsToday: 134,
          successRatePct: 93,
          p50LatencyMs: 2100,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:18", action: "Proposed TF-ICE → A-check Tue", outcome: "Awaiting Lead Engineer" },
          { time: "06:42", action: "Sequenced 6 line checks KEF/ARN", outcome: "Approved" },
          { time: "05:51", action: "Re-pinned TF-FIA to slot 3", outcome: "APU work absorbed" },
          { time: "04:30", action: "Released TF-ISN to service", outcome: "Returned to schedule" },
        ],
        owner: "Owned by Maintenance Control",
        escalation: "Escalates to Lead Engineer",
      },
      {
        name: "Predictive Maintenance",
        role: "Sensor-stream anomaly detection",
        kind: "ai",
        now: "Watching 41 ACMS streams; APU bearing wear trending on TF-FIA.",
        done: "Flagged TF-FIA APU 11 days ahead of MEL trigger; part on order.",
        metrics: {
          decisionsToday: 1840,
          successRatePct: 89,
          p50LatencyMs: 760,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:30", action: "Flagged TF-FIA APU bearing wear", outcome: "Part on order, MEL avoided" },
          { time: "06:54", action: "Cleared TF-ISK engine vib alert", outcome: "Within trend" },
          { time: "05:28", action: "Raised TF-ISJ wheel temp anomaly", outcome: "Routed to line crew" },
          { time: "03:15", action: "Closed 12 nightly stream alerts", outcome: "All within limits" },
        ],
        owner: "Owned by Reliability Engineering",
        escalation: "Escalates to Lead Engineer for sign-off",
      },
      {
        name: "Defects Triage",
        role: "Open MEL ranking",
        kind: "ai",
        now: "Ranking 23 open MELs by operational impact; 4 closing today.",
        done: "Cleared 7 deferred items overnight; 2 carried with workaround.",
        metrics: {
          decisionsToday: 23,
          successRatePct: 96,
          p50LatencyMs: 980,
          sparkline24h: [...SHAPE.rampUp],
        },
        recentDecisions: [
          { time: "07:12", action: "Re-ranked 23 MELs by ops impact", outcome: "4 cleared for close today" },
          { time: "06:31", action: "Carried TF-ISO seat 14C MEL", outcome: "Workaround in OM-A" },
          { time: "05:48", action: "Closed TF-FIA cabin-light defect", outcome: "Released to service" },
          { time: "04:20", action: "Routed TF-ISN gear-actuator", outcome: "Hangar slot booked" },
        ],
        owner: "Owned by Defects Desk",
        escalation: "Escalates to Lead Engineer",
      },
      {
        name: "Lead Engineer",
        role: "Sign-off authority",
        kind: "human",
        now: "Reviewing borescope imagery for TF-ISO engine #2 NAI screen finding.",
        done: "Released TF-ISN to service after gear-actuator replacement.",
        metrics: {
          decisionsToday: 18,
          successRatePct: 100,
          p50LatencyMs: 420000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:27", action: "Released TF-ISN to service", outcome: "Back on schedule" },
          { time: "06:18", action: "Held TF-ISO for borescope review", outcome: "Awaiting OEM advice" },
          { time: "05:02", action: "Signed APU bearing change plan", outcome: "Slot Tue" },
          { time: "03:14", action: "Approved TF-FIA carry-over", outcome: "Workaround documented" },
        ],
        owner: "Reports to Director of Engineering",
        escalation: "Escalates to Accountable Manager",
      },
    ],
  },
  {
    id: "revenue-management",
    name: "Revenue Management",
    tagline: "Prices seats, cargo and ancillaries — keeps RASK climbing.",
    accent: "lilac",
    agents: [
      {
        name: "Fare Optimizer",
        role: "Inventory & class rebalancing",
        kind: "ai",
        now: "Rebalancing 412 city-pairs for May–Aug; 38 changes pending controller review.",
        done: "Lifted KEF→BOS RASK 6.2% over April vs straight-line forecast.",
        metrics: {
          decisionsToday: 412,
          successRatePct: 88,
          p50LatencyMs: 3100,
          sparkline24h: [...SHAPE.longHaulWave],
        },
        recentDecisions: [
          { time: "07:14", action: "Tightened M-class KEF→BOS Jul", outcome: "Pending RM Controller" },
          { time: "06:32", action: "Opened V-class KEF→CDG Jun", outcome: "Auto-approved" },
          { time: "05:45", action: "Repriced 14 city-pairs Aug", outcome: "Pending review" },
          { time: "04:11", action: "Closed Q-class KEF→JFK weekends", outcome: "Auto-approved" },
        ],
        owner: "Owned by Revenue Management Analytics",
        escalation: "Escalates to RM Controller",
      },
      {
        name: "Demand Forecaster",
        role: "Booking-curve modelling",
        kind: "ai",
        now: "Re-scoring stopover propensity for North America summer wave.",
        done: "Sized Easter overshoot at +14k pax; routed extra capacity KEF→CDG.",
        metrics: {
          decisionsToday: 184,
          successRatePct: 90,
          p50LatencyMs: 2640,
          sparkline24h: [...SHAPE.rampUp],
        },
        recentDecisions: [
          { time: "06:58", action: "Re-scored stopover propensity NA", outcome: "Forecast +9% June" },
          { time: "05:42", action: "Lifted KEF→IAD Aug forecast", outcome: "Capacity ask drafted" },
          { time: "04:18", action: "Cut KEF→ARN Sep forecast 4%", outcome: "RM notified" },
          { time: "02:55", action: "Reconciled Easter actuals", outcome: "+14k vs plan" },
        ],
        owner: "Owned by Commercial Analytics",
        escalation: "Escalates to RM Controller",
      },
      {
        name: "Ancillary Pricer",
        role: "Seat-select & bag pricing",
        kind: "ai",
        now: "A/B-testing seat-select on EU short-haul; lifting attach 2.1pts.",
        done: "Tuned bag bundles for KEF→LHR; revenue per pax up €3.40.",
        metrics: {
          decisionsToday: 96,
          successRatePct: 92,
          p50LatencyMs: 510,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:09", action: "Stepped seat-select EU price +€2", outcome: "Attach +0.4 pts" },
          { time: "06:14", action: "Locked bag bundle KEF→LHR", outcome: "RPP +€3.40" },
          { time: "04:50", action: "Closed losing arm A/B test (lounge)", outcome: "Reverted to control" },
          { time: "03:21", action: "Opened new arm: priority-board", outcome: "Sampling 5%" },
        ],
        owner: "Owned by Ancillary Revenue",
        escalation: "Escalates to RM Controller",
      },
      {
        name: "RM Controller",
        role: "Pricing decision owner",
        kind: "human",
        now: "Approving 12 of 38 fare-class changes; querying KEF→IAD logic.",
        done: "Signed Q3 long-haul fare ladder; held floor on JFK O&D buckets.",
        metrics: {
          decisionsToday: 38,
          successRatePct: 100,
          p50LatencyMs: 540000,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "07:24", action: "Approved 12/38 fare-class changes", outcome: "26 returned with notes" },
          { time: "06:02", action: "Queried KEF→IAD M-class logic", outcome: "Awaiting analyst" },
          { time: "04:30", action: "Signed Q3 long-haul ladder", outcome: "Live" },
          { time: "03:11", action: "Held JFK O&D floor", outcome: "Override applied" },
        ],
        owner: "Reports to VP Commercial",
        escalation: "Escalates to Chief Commercial Officer",
      },
    ],
  },
  {
    id: "customer-experience",
    name: "Customer Experience",
    tagline: "Every traveller conversation, from intent to ground transport.",
    accent: "crisp",
    agents: [
      {
        name: "Booking Concierge",
        role: "Intent-to-itinerary chat",
        kind: "ai",
        now: "23 active conversations; 4 closing intent-priced fares this hour.",
        done: "Closed 142 bookings yesterday; 11 routed to human for visa edge cases.",
        metrics: {
          decisionsToday: 1284,
          successRatePct: 87,
          p50LatencyMs: 1240,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "07:36", action: "Closed family-of-4 KEF→ALC", outcome: "€1,840 booked, +1 bag" },
          { time: "07:04", action: "Routed visa edge-case to human", outcome: "Service Recovery picked up" },
          { time: "06:21", action: "Up-sold seat-select +€18", outcome: "Booking confirmed" },
          { time: "05:48", action: "Surfaced stopover offer KEF→JFK", outcome: "User accepted +2 nights" },
        ],
        owner: "Owned by Digital Channels",
        escalation: "Escalates to Service Recovery",
      },
      {
        name: "Trip Companion",
        role: "Pre-flight & ground handler",
        kind: "ai",
        now: "Helping 1,847 travellers; surfacing weather context for Boston arrivals.",
        done: "Handled 312 disruption rebookings overnight; CSAT +18pts vs IVR.",
        metrics: {
          decisionsToday: 1847,
          successRatePct: 91,
          p50LatencyMs: 980,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "07:42", action: "Re-booked 6 BOS arrivals on weather", outcome: "All within 24h" },
          { time: "07:11", action: "Surfaced gate change FI453", outcome: "All pax notified" },
          { time: "06:33", action: "Triaged 412 self-service rebooks", outcome: "94% resolved by AI" },
          { time: "05:54", action: "Pushed ground transport offer KEF", outcome: "23 accepted" },
        ],
        owner: "Owned by Customer Care",
        escalation: "Escalates to Service Recovery",
      },
      {
        name: "Saga Concierge",
        role: "Loyalty conversations",
        kind: "ai",
        now: "Re-pricing 3 award seats on FI453 for a Gold member after schedule change.",
        done: "Resolved 142 redemption queries overnight; 8 escalated to human agent.",
        metrics: {
          decisionsToday: 142,
          successRatePct: 93,
          p50LatencyMs: 1100,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:33", action: "Re-priced 3 award seats FI453", outcome: "Gold member retained" },
          { time: "06:48", action: "Approved Saga upgrade waitlist", outcome: "2 cleared at gate" },
          { time: "05:22", action: "Refunded miles on cancelled FI621", outcome: "Auto-credited" },
          { time: "04:01", action: "Routed family pool merge", outcome: "Awaiting human approval" },
        ],
        owner: "Owned by Saga Loyalty Programme",
        escalation: "Escalates to Service Recovery (Saga desk)",
      },
      {
        name: "Service Recovery",
        role: "Empowered escalation",
        kind: "human",
        now: "Issuing goodwill vouchers for 14 affected pax on FI603 cancellation.",
        done: "Recovered 7 EU261 cases below original cost estimate; closed in 24h.",
        metrics: {
          decisionsToday: 31,
          successRatePct: 97,
          p50LatencyMs: 360000,
          sparkline24h: [...SHAPE.spike],
        },
        recentDecisions: [
          { time: "07:38", action: "Issued goodwill vouchers ×14 FI603", outcome: "Avg €120, all accepted" },
          { time: "06:50", action: "Closed EU261 case batch (7)", outcome: "Below original estimate" },
          { time: "05:18", action: "Approved hotel waiver KEF→AMS", outcome: "Pax routed" },
          { time: "03:42", action: "Took visa edge-case from AI", outcome: "Resolved with consulate" },
        ],
        owner: "Reports to Customer Care Manager",
        escalation: "Escalates to VP Customer Experience",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    tagline: "Fuel hedging, contracts, cash — the airline's pulse, in numbers.",
    accent: "volcanic",
    agents: [
      {
        name: "Fuel Hedging Agent",
        role: "Jet fuel exposure modelling",
        kind: "ai",
        now: "Simulating Q3 positions across 4 curve scenarios; ICE & PLATTS basis.",
        done: "Locked 14% upside on May curve; reduced Q2 unhedged exposure to 28%.",
        metrics: {
          decisionsToday: 64,
          successRatePct: 90,
          p50LatencyMs: 4200,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:02", action: "Simulated Q3 hedge ladder", outcome: "Recommendation pending CFO" },
          { time: "05:48", action: "Locked 14% May upside", outcome: "Executed" },
          { time: "04:22", action: "Trimmed Q2 unhedged 31%→28%", outcome: "Executed" },
          { time: "02:55", action: "Re-priced PLATTS basis", outcome: "Within tolerance" },
        ],
        owner: "Owned by Treasury",
        escalation: "Escalates to CFO Office for execution",
      },
      {
        name: "Contract Copilot",
        role: "Vendor agreement review",
        kind: "ai",
        now: "Reviewing 6 vendor renewals; 3 auto-renew clauses flagged for legal.",
        done: "Saved €2.1M annualized on ground-handling rebid at 4 stations.",
        metrics: {
          decisionsToday: 14,
          successRatePct: 95,
          p50LatencyMs: 5400,
          sparkline24h: [...SHAPE.rampUp],
        },
        recentDecisions: [
          { time: "07:12", action: "Flagged 3 auto-renew clauses", outcome: "Routed to Legal" },
          { time: "05:30", action: "Drafted GH rebid summary (4 stations)", outcome: "€2.1M ann. savings" },
          { time: "04:08", action: "Compared cleaning bids ARN", outcome: "Recommended bidder B" },
          { time: "02:14", action: "Indexed 412 contract clauses", outcome: "Ready for query" },
        ],
        owner: "Owned by Procurement",
        escalation: "Escalates to Legal & CFO Office",
      },
      {
        name: "Cash Forecaster",
        role: "13-week rolling liquidity",
        kind: "ai",
        now: "Building 13-week roll; sensitivity-testing against jet-fuel +15%.",
        done: "Reconciled 1,217 ARC entries overnight; closed April books on time.",
        metrics: {
          decisionsToday: 1217,
          successRatePct: 99,
          p50LatencyMs: 380,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:00", action: "Published 13-week roll v.214", outcome: "Within covenants" },
          { time: "05:42", action: "Stress-tested fuel +15%", outcome: "Headroom −€12M, OK" },
          { time: "03:21", action: "Reconciled 1,217 ARC entries", outcome: "0 breaks" },
          { time: "01:08", action: "Closed April books", outcome: "Sent to Controller" },
        ],
        owner: "Owned by Treasury",
        escalation: "Escalates to CFO Office",
      },
      {
        name: "CFO Office",
        role: "Capital allocation",
        kind: "human",
        now: "Reviewing fleet-finance term sheet for two 737 MAX 9 in 2027.",
        done: "Closed €120M revolver renewal; 25 bps tighter than prior facility.",
        metrics: {
          decisionsToday: 6,
          successRatePct: 100,
          p50LatencyMs: 1800000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "06:40", action: "Reviewed MAX 9 term sheet", outcome: "Counter to lessor drafted" },
          { time: "04:22", action: "Closed €120M revolver", outcome: "−25 bps vs prior" },
          { time: "02:14", action: "Approved Q3 hedge ladder", outcome: "Executed by Treasury" },
          { time: "00:18", action: "Signed FY guidance update", outcome: "Released to IR" },
        ],
        owner: "Reports to Board of Directors",
        escalation: "Escalates to CEO & Audit Committee",
      },
    ],
  },
  {
    id: "people-and-culture",
    name: "People & Culture",
    tagline: "Rosters crew, hires the next captain, tracks every recurrent.",
    accent: "aurora",
    agents: [
      {
        name: "Crew Rostering Agent",
        role: "Pairing & duty optimization",
        kind: "ai",
        now: "Building July roster across 2,400 duty pairings; closing 17 fatigue-risk shifts.",
        done: "Resolved 4 illegal pairings; published June roster 9 days early.",
        metrics: {
          decisionsToday: 2400,
          successRatePct: 94,
          p50LatencyMs: 2900,
          sparkline24h: [...SHAPE.rampUp],
        },
        recentDecisions: [
          { time: "06:55", action: "Built July roster v.4", outcome: "17 fatigue flags closed" },
          { time: "04:48", action: "Resolved 4 illegal pairings", outcome: "Within FTL" },
          { time: "02:32", action: "Pre-published June roster", outcome: "+9 days vs target" },
          { time: "00:41", action: "Re-balanced LHR cabin pool", outcome: "MCT preserved" },
        ],
        owner: "Owned by Crew Planning",
        escalation: "Escalates to Crew Liaison for appeals",
      },
      {
        name: "Recruiter Copilot",
        role: "Cabin & flight crew sourcing",
        kind: "ai",
        now: "Screening 412 cabin crew applications against KEF base requirements.",
        done: "Scheduled 38 second-rounds; 6 conditional offers extended this week.",
        metrics: {
          decisionsToday: 412,
          successRatePct: 86,
          p50LatencyMs: 2100,
          sparkline24h: [...SHAPE.morningBank],
        },
        recentDecisions: [
          { time: "07:08", action: "Screened 412 cabin applicants", outcome: "78 advanced to interview" },
          { time: "05:35", action: "Drafted offer (cabin × 6)", outcome: "Awaiting hiring manager" },
          { time: "03:20", action: "Closed pilot pipeline KEF base", outcome: "On target for Q3" },
          { time: "01:08", action: "Synced ATS with HRIS", outcome: "0 mismatches" },
        ],
        owner: "Owned by Talent Acquisition",
        escalation: "Escalates to Hiring Manager",
      },
      {
        name: "Training Tracker",
        role: "Recurrent quals & expirations",
        kind: "ai",
        now: "Monitoring 73 recurrent quals; nudging 9 pilots ahead of June expiry.",
        done: "Closed 41 ground-school slots; zero pilots out-of-currency last cycle.",
        metrics: {
          decisionsToday: 73,
          successRatePct: 98,
          p50LatencyMs: 480,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:00", action: "Nudged 9 pilots Jun expiry", outcome: "All slots booked" },
          { time: "05:18", action: "Closed 41 GS slots", outcome: "0 out-of-currency" },
          { time: "03:08", action: "Re-issued LIFUS sign-offs ×3", outcome: "OPC ready" },
          { time: "00:52", action: "Synced Sim slot calendar", outcome: "0 conflicts" },
        ],
        owner: "Owned by Training Department",
        escalation: "Escalates to Head of Training",
      },
      {
        name: "Crew Liaison",
        role: "Roster appeals & welfare",
        kind: "human",
        now: "Reviewing 6 roster swap appeals; mediating cabin-crew bid for Easter.",
        done: "Closed 14 welfare cases this month; renegotiated KEF rest-facility contract.",
        metrics: {
          decisionsToday: 12,
          successRatePct: 96,
          p50LatencyMs: 1200000,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "07:18", action: "Approved 4/6 roster swaps", outcome: "Within FTL" },
          { time: "05:42", action: "Mediated Easter cabin bid", outcome: "Compromise rotation set" },
          { time: "03:31", action: "Closed welfare case #214", outcome: "Pilot back to roster" },
          { time: "01:08", action: "Re-signed KEF rest-facility", outcome: "−12% nightly rate" },
        ],
        owner: "Reports to VP People & Culture",
        escalation: "Escalates to Chief People Officer",
      },
    ],
  },
  {
    id: "network-strategy",
    name: "Network & Strategy",
    tagline: "Where we fly next, which slots we hold, which routes we kill.",
    accent: "golden",
    agents: [
      {
        name: "Route Planner",
        role: "City-pair scoring & viability",
        kind: "ai",
        now: "Scoring 11 candidate transatlantic city-pairs for S27; 3 cleared first cut.",
        done: "Model-killed 3 unprofitable winter routes; freed 1,840 block hours.",
        metrics: {
          decisionsToday: 11,
          successRatePct: 89,
          p50LatencyMs: 4800,
          sparkline24h: [...SHAPE.rampUp],
        },
        recentDecisions: [
          { time: "06:48", action: "Scored 11 candidate city-pairs S27", outcome: "3 cleared first cut" },
          { time: "04:22", action: "Killed KEF→XYZ winter (model)", outcome: "Freed 1,840 block hrs" },
          { time: "02:10", action: "Re-ran Atlantic capacity ladder", outcome: "Recommendation pending" },
          { time: "00:33", action: "Indexed 412 O&D city-pairs", outcome: "Ready for review" },
        ],
        owner: "Owned by Network Planning",
        escalation: "Escalates to Network Director",
      },
      {
        name: "Slot Negotiator",
        role: "Coordinated airport access",
        kind: "ai",
        now: "Drafting LHR S26 slot bid; 2 swap candidates with codeshare partner.",
        done: "Defended 6 KEF morning waves; held CDG arrivals against ground-stop pressure.",
        metrics: {
          decisionsToday: 23,
          successRatePct: 91,
          p50LatencyMs: 3700,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:01", action: "Drafted LHR S26 slot bid", outcome: "Pending Network Director" },
          { time: "05:14", action: "Held CDG arr 18:00 wave", outcome: "Defended against re-time" },
          { time: "03:22", action: "Proposed 2 swaps w/ partner", outcome: "Counter-offer received" },
          { time: "01:08", action: "Logged 6 KEF morning waves", outcome: "Confirmed for S26" },
        ],
        owner: "Owned by Slot Office",
        escalation: "Escalates to Network Director",
      },
      {
        name: "Codeshare Optimizer",
        role: "Partner connection design",
        kind: "ai",
        now: "Rebalancing AS connections at SEA; 14 misconnects caught for May 12.",
        done: "Lifted SEA connection load factor 2.1pts; trimmed median MCT to 58 min.",
        metrics: {
          decisionsToday: 86,
          successRatePct: 92,
          p50LatencyMs: 1900,
          sparkline24h: [...SHAPE.longHaulWave],
        },
        recentDecisions: [
          { time: "06:48", action: "Caught 14 misconnects May 12", outcome: "Re-timed 6 partner segs" },
          { time: "04:32", action: "Trimmed SEA MCT 62→58 min", outcome: "Approved" },
          { time: "02:18", action: "Re-priced codeshare bands", outcome: "Partner agrees" },
          { time: "00:08", action: "Indexed AS partner schedule", outcome: "0 mismatches" },
        ],
        owner: "Owned by Alliances",
        escalation: "Escalates to Network Director",
      },
      {
        name: "Network Director",
        role: "Strategy approval",
        kind: "human",
        now: "Reviewing 2027 fleet-deployment options across 3 base scenarios.",
        done: "Approved S26 schedule; signed off two new African gateway proposals.",
        metrics: {
          decisionsToday: 4,
          successRatePct: 100,
          p50LatencyMs: 2400000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "06:18", action: "Reviewed 2027 fleet options", outcome: "Scenario B preferred" },
          { time: "04:02", action: "Approved S26 schedule", outcome: "Released to commercial" },
          { time: "01:38", action: "Signed African gateway × 2", outcome: "Slot work begins" },
          { time: "00:11", action: "Killed marginal route LHR→KEF Q4", outcome: "Capacity redeployed" },
        ],
        owner: "Reports to Chief Commercial Officer",
        escalation: "Escalates to CEO",
      },
    ],
  },
  {
    id: "safety-compliance",
    name: "Safety & Compliance",
    tagline: "Watches the trends regulators see; surfaces what crews can't.",
    accent: "fiery",
    agents: [
      {
        name: "Safety Reporter Agent",
        role: "ASR triage & trending",
        kind: "ai",
        now: "Triaging 14 ASR submissions from last 24h; trend on cabin-altitude warnings.",
        done: "Surfaced 2 unstable-approach trends at KEF 19; routed to FDM analyst.",
        metrics: {
          decisionsToday: 14,
          successRatePct: 97,
          p50LatencyMs: 3200,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "07:08", action: "Triaged 14 ASRs (24h)", outcome: "Cabin-alt cluster flagged" },
          { time: "05:22", action: "Surfaced unstable-app trend KEF 19", outcome: "Routed to FDM" },
          { time: "03:14", action: "Closed 6 routine reports", outcome: "No further action" },
          { time: "01:01", action: "Linked 3 reports to single root", outcome: "Investigation opened" },
        ],
        owner: "Owned by Safety Management System",
        escalation: "Escalates to FDM Analyst, then Safety Manager",
      },
      {
        name: "Regulatory Tracker",
        role: "EASA / ICAO change mapping",
        kind: "ai",
        now: "Mapping ICAO Annex 19 changes against current OM-A revision.",
        done: "Updated 23 SOPs after EASA Part-CAT delta; 0 findings on last audit.",
        metrics: {
          decisionsToday: 9,
          successRatePct: 96,
          p50LatencyMs: 4600,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "06:42", action: "Mapped ICAO Annex 19 delta", outcome: "11 OM-A clauses to update" },
          { time: "04:18", action: "Updated 23 SOPs (Part-CAT)", outcome: "Published" },
          { time: "02:08", action: "Logged audit findings (0)", outcome: "Clean cycle" },
          { time: "00:24", action: "Synced regulator feed", outcome: "0 missed bulletins" },
        ],
        owner: "Owned by Compliance Monitoring",
        escalation: "Escalates to Postholder Compliance",
      },
      {
        name: "FDM Analyst",
        role: "Flight-data anomaly review",
        kind: "hitl",
        now: "Reviewing copilot-flagged exceedances on 312 sectors from yesterday.",
        done: "Closed 4 events with no further action; escalated 1 to Chief Pilot.",
        metrics: {
          decisionsToday: 312,
          successRatePct: 94,
          p50LatencyMs: 14000,
          sparkline24h: [...SHAPE.bimodal],
        },
        recentDecisions: [
          { time: "07:02", action: "Closed 4 exceedance events", outcome: "No further action" },
          { time: "05:38", action: "Escalated 1 event to Chief Pilot", outcome: "Investigation opened" },
          { time: "03:22", action: "Confirmed AI cluster (KEF 19)", outcome: "Trend recorded" },
          { time: "01:08", action: "Re-ran FDM filters Q2", outcome: "0 false positives" },
        ],
        owner: "Owned by Flight Data Monitoring",
        escalation: "Escalates to Chief Pilot",
      },
      {
        name: "Safety Manager",
        role: "Investigation owner",
        kind: "human",
        now: "Chairing weekly review; deciding scope on TF-ISJ tail-strike precursor.",
        done: "Closed Q1 investigations; published 2 lessons-learned bulletins fleet-wide.",
        metrics: {
          decisionsToday: 4,
          successRatePct: 100,
          p50LatencyMs: 2700000,
          sparkline24h: [...SHAPE.steady],
        },
        recentDecisions: [
          { time: "06:30", action: "Scoped TF-ISJ tail-strike precursor", outcome: "Investigation opened" },
          { time: "04:14", action: "Closed Q1 investigations (×3)", outcome: "Lessons published" },
          { time: "02:08", action: "Signed safety bulletin #14", outcome: "Released fleet-wide" },
          { time: "00:18", action: "Briefed Accountable Manager", outcome: "Acknowledged" },
        ],
        owner: "Reports to Accountable Manager",
        escalation: "Escalates to CEO & Authority",
      },
    ],
  },
];
