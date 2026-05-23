export type DemoActionType = "navigate" | "wait" | "info" | "click";

export interface DemoStep {
  caption: string;
  action: DemoActionType;
  route?: string;
  /** CSS selector for the `click` action. */
  selector?: string;
}

export const DEMO_SCRIPT: DemoStep[] = [
  {
    caption: "1/6 — Conversational booking",
    action: "navigate",
    route:
      "/customer/chat?q=Half-day%20next%20Thursday%20with%20an%20algae%20mask%20and%20an%20in-water%20massage.",
  },
  {
    caption: "2/6 — Holding the top option",
    action: "click",
    selector: '[data-demo-hold="first"]',
  },
  {
    caption: "3/6 — Disruption · pump maintenance reduces capacity",
    action: "navigate",
    route: "/customer/status?ref=BL2X4F8K",
  },
  {
    caption: "4/6 — Care · upgrade + dinner offered",
    action: "navigate",
    route: "/customer/companion",
  },
  {
    caption: "5/6 — Internal · ops copilot reshuffles therapists",
    action: "navigate",
    route: "/internal/ops",
  },
  {
    caption: "6/6 — Org · the resort as agents",
    action: "navigate",
    route: "/org",
  },
  {
    caption: "Org · agent detail",
    action: "click",
    selector: '[data-demo-org-agent="first"]',
  },
  {
    caption: "End · read the strategy",
    action: "navigate",
    route: "/concept",
  },
];

export const FALLBACK_RESPONSES: Record<string, string> = {
  "/customer/chat?q=":
    "Next Thursday is quiet — Premium at 14:00 has good light by the lava wall. Algae mask is included with Premium; I'll add the 50-min in-water massage at 14:30. Comes to €178 for one guest. Want me to hold it for ten minutes?",
  "/customer/status":
    "Heads up — a planned geothermal pump service runs 15:00–18:00 today and cuts capacity by about 15%. Your slot is BL2X4F8K at 15:00. Three options on the right. The middle one (complimentary upgrade to Signature, push to 18:30, table at Lava added) keeps your evening clean — that's what I'd take.",
  "/customer/companion":
    "Upgrade confirmed: Signature at 18:30 with the lava-rock scrub and the Lava reservation at 20:00. Your entry pass updates automatically — open it from your visits page when you arrive.",
  "/internal/ops":
    "Recovery options for the 15:00–18:00 pump service:\n\n1. **Shift seven Premium guests to 18:30 Signature (comp)**: protects on-site spend, keeps Lava covers full. ~€840 net.\n2. **Re-allocate two therapists from Silica to lagoon-side**: covers the massage backlog, no overtime.\n3. **Pause new arrivals 15:00–16:00**: cleanest queue but cancels twelve held bookings.\n\n**Recommendation:** Option 1 for the affected guests + Option 2 for the rest of the wave.",
};
