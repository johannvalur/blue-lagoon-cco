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
    caption: "1/4 — Conversational booking",
    action: "navigate",
    route:
      "/customer?q=Warm%20long%20weekend%20in%20late%20February%2C%205%20days%20from%20KEF.",
  },
  {
    caption: "1/4 — Holding the top option",
    action: "click",
    selector: '[data-demo-hold="first"]',
  },
  {
    caption: "2/4 — Trip companion",
    action: "navigate",
    route: "/customer?scenario=disruption&push=1",
  },
  {
    caption: "3/4 — Disruption · ops command center",
    action: "navigate",
    route: "/internal/ops",
  },
  {
    caption: "4/4 — Org · the airline as agents",
    action: "navigate",
    route: "/org",
  },
  {
    caption: "4/4 — Org · agent detail",
    action: "click",
    selector: '[data-demo-org-agent="first"]',
  },
  {
    caption: "End",
    action: "navigate",
    route: "/concept",
  },
];

export const FALLBACK_RESPONSES: Record<string, string> = {
  "/customer?scenario=disruption":
    "Heads up — FI617 to Boston tomorrow is at risk. KEF visibility dropped below CAT II minima at 0540z; forecast clears 0820z. Three options on the right. The middle one (rebook to FI619 at 1100z) keeps your Saga cabin and adds about 3 hours to your day — that's what I'd take.",
  "/customer?q=":
    "Tenerife — late February is its sweet spot, around 5.5h direct from KEF, from €249 economy. Want me to look at dates around 22–27 February?",
  "/internal/ops":
    "Recovery options:\n\n1. **Swap TF-ISK to FI631**: aircraft available from 0830z. ~90 min delay, JFK slot preserved.\n2. **Cancel FI603 (YYZ), rebook via Air Canada**: minimises crew exposure. EU261 cost ~€89,000.\n3. **Hold all four for fog clear at 0820z**: clean recovery; cascades to 1000z European wave.\n\n**Recommendation:** Option 1 for FI631 + Option 3 for the other three.",
};
