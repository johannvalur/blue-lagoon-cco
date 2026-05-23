"use client";

import Image from "next/image";
import { useState } from "react";

interface Role {
  title: string;
  scope: string;
}

interface Department {
  key: string;
  short: string;
  full: string;
  tagline: string;
  scope: string;
  accountability: string;
  roles: Role[];
}

// Ordered by customer journey: Attract → Acquire → Price → Convert → Retain
const DEPARTMENTS: Department[] = [
  {
    key: "marketing",
    short: "Marketing",
    full: "Marketing & Brand",
    tagline: "Campaigns · PR · Content",
    scope:
      "Brand architecture across Blue Lagoon, Retreat, Skin Science, Kerlingarfjöll & future properties · Campaigns & media · PR & communications · Content & storytelling · International & domestic positioning · Reputation & destination marketing.",
    accountability:
      "Ensures brand portfolio coherence as new properties and products are added.",
    roles: [
      {
        title: "Head of Marketing & Brand",
        scope: "Brand strategy, campaigns & team leadership.",
      },
      {
        title: "Brand",
        scope: "Brand & consistency across all properties.",
      },
      {
        title: "Campaign & Media",
        scope: "Paid & organic campaigns across markets.",
      },
      {
        title: "PR & Communications",
        scope: "Media relations & reputation management.",
      },
      {
        title: "Content Lead",
        scope: "Storytelling & editorial direction across channels.",
      },
      {
        title: "Marketing",
        scope: "Demand generation in priority markets.",
      },
    ],
  },
  {
    key: "sales",
    short: "Sales",
    full: "Sales, Retail & Partnerships",
    tagline: "B2B · B2C · B2A",
    scope:
      "Travel trade & tour operators · Corporate & groups · Luxury travel advisors · Strategic partnerships · Retail & wholesale for Skin Science · Commercial development of new markets.",
    accountability:
      "Accountable for generating commercial revenue across all direct and indirect channels.",
    roles: [
      {
        title: "Head of Sales",
        scope: "Sales strategy, team performance & senior client relationships.",
      },
      {
        title: "Trade & Tour Operator",
        scope: "Travel trade & international tour operator relationships.",
      },
      {
        title: "Corporate & Groups",
        scope: "Corporate accounts, group bookings & event revenue.",
      },
      {
        title: "Partnerships",
        scope: "Luxury advisor & strategic commercial partnerships.",
      },
      {
        title: "Skin Science",
        scope: "Wholesale, retail & distribution for Skin Science.",
      },
    ],
  },
  {
    key: "revenue",
    short: "Revenue",
    full: "Revenue Mgmt. & Pricing",
    tagline: "Pricing · Forecasting · Yield",
    scope:
      "Dynamic pricing · Yield management · Demand forecasting · Capacity monetisation · Package pricing · Channel profitability & strategy · Revenue reporting · Commercial performance analytics.",
    accountability:
      "Decides pricing, packaging, market prioritisation & channel strategy.",
    roles: [
      {
        title: "Head of Revenue",
        scope: "Pricing strategy, yield decisions & revenue reporting.",
      },
      {
        title: "Revenue Manager(s)",
        scope: "Day-to-day pricing & availability per property.",
      },
      {
        title: "Demand & Forecasting",
        scope: "Demand modelling, capacity & scenario planning.",
      },
      {
        title: "Channel & Distribution",
        scope: "Channel mix, OTA relationships & profitability.",
      },
      {
        title: "Commercial Performance",
        scope: "KPI tracking, reporting & commercial insights.",
      },
    ],
  },
  {
    key: "digital",
    short: "Digital",
    full: "Digital Commerce & Products",
    tagline: "Website · Booking · Conversion · Analytics",
    scope:
      "Website & booking journey · E-commerce for Skin Science · Direct booking growth · Conversion rate optimisation · Marketing automation · Digital product roadmap · Data & tracking development.",
    accountability:
      "Accountable for direct digital growth and reduced dependency on third-party channels.",
    roles: [
      {
        title: "Head of Digital Commerce",
        scope: "Direct digital revenue & booking journey ownership.",
      },
      {
        title: "E-commerce",
        scope: "Online store, booking flow & conversion optimisation.",
      },
      {
        title: "Product Manager",
        scope: "Digital product roadmap & feature prioritisation.",
      },
      {
        title: "CRO Specialist",
        scope: "Website & funnel testing & optimisation.",
      },
      {
        title: "Data & AI",
        scope: "Tracking, dashboards, data & artificial intelligence.",
      },
    ],
  },
  {
    key: "customer",
    short: "Customer",
    full: "Customer & Loyalty",
    tagline: "Segmentation · CRM · CLV · Loyalty",
    scope:
      "CRM strategy · Customer segmentation · Lifecycle marketing · Loyalty / membership model · Guest database · Personalisation · Repeat visitation · Cross-sell between Lagoon, Retreat, Skin Science & future properties.",
    accountability:
      "Owns the customer relationship before, during and after the visit.",
    roles: [
      {
        title: "Head of Customer & Loyalty",
        scope: "CRM strategy, loyalty vision & guest data governance.",
      },
      {
        title: "CRM",
        scope: "Platform, segmentation & campaign execution.",
      },
      {
        title: "Loyalty Program",
        scope: "Membership model, benefits & retention mechanics.",
      },
      {
        title: "Lifecycle Marketing",
        scope: "Automated guest journeys from pre-arrival to post-visit.",
      },
      {
        title: "Customer Insights",
        scope: "Guest behaviour, preferences & lifetime value.",
      },
    ],
  },
];

const CROSS_FUNCTIONAL: { name: string; scope: string }[] = [
  { name: "Finance", scope: "P&L · Real Estate · Budget · Procurement" },
  { name: "Operations", scope: "Customer Service · Facilities · Maintenance" },
  { name: "Digital & Data", scope: "Infrastructure · Development · Data" },
  { name: "Legal", scope: "Contracts · IPO · Compliance" },
  { name: "People & Culture", scope: "HR · Wellbeing · Training · Organisational Change" },
  { name: "Sustainability", scope: "Safety · Quality · R&D" },
];

const GOALS = [
  {
    label: "Attract",
    detail: "Build demand and reputation across markets and channels.",
  },
  {
    label: "Convert",
    detail: "Turn demand into profitable, owned-channel revenue.",
  },
  {
    label: "Retain",
    detail: "Keep guests coming back through loyalty and lifecycle.",
  },
];

export function StructureSection() {
  const [activeKey, setActiveKey] = useState<string>(DEPARTMENTS[0].key);
  const active = DEPARTMENTS.find((d) => d.key === activeKey) ?? DEPARTMENTS[0];

  return (
    <section
      id="structure"
      className="scroll-mt-24 border-b border-bluelagoon-line bg-bluelagoon-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        {/* Chapter intro — left text, right image */}
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
              <span className="tabular-nums">03</span>
              <span className="ml-3 text-bluelagoon-muted/80">
                Commercial Structure
              </span>
            </p>
            <h2 className="mt-6 font-loft text-[2.25rem] font-bold leading-[1.05] tracking-tight text-bluelagoon-midnight md:text-[3rem]">
              Five functions,
              <br className="hidden md:block" />{" "}
              <span className="text-bluelagoon-moss-600">
                one cohesive team.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-bluelagoon-ink/75 md:text-[17px]">
              The commercial model covers every stage of the customer
              lifecycle, from first awareness to lasting loyalty. Dedicated
              functions across the customer journey, working as one
              cohesive team.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(15,42,68,0.25)]">
              <Image
                src="/strategy/structure.png"
                alt="Guest in the Blue Lagoon at sunset"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-bluelagoon-midnight/20 via-transparent to-transparent"
              />
            </div>
          </div>
        </div>

        {/* Customer journey flow → CCO → Functions */}
        <div className="mt-20 md:mt-24">
          {/* Attract / Convert / Retain */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-1/2 top-7 hidden h-px w-[66%] -translate-x-1/2 bg-gradient-to-r from-transparent via-bluelagoon-moss-600/40 to-transparent md:block"
            />
            <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
              {GOALS.map((g, i) => (
                <li
                  key={g.label}
                  className="relative flex flex-col items-center text-center"
                >
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-bluelagoon-moss-600/30 bg-bluelagoon-paper">
                    <span className="font-loft text-base font-bold tabular-nums text-bluelagoon-moss-600">
                      0{i + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 font-loft text-lg font-bold uppercase tracking-[0.18em] text-bluelagoon-midnight">
                    {g.label}
                  </h3>
                  <p className="mt-3 max-w-xs text-[16px] leading-relaxed text-bluelagoon-ink/75">
                    {g.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Connector: goals → CCO */}
          <div className="mt-10 flex flex-col items-center">
            <div className="hidden h-8 w-px bg-bluelagoon-moss-600/40 md:block" />

            {/* CCO box — full width */}
            <div className="w-full bg-bluelagoon-midnight px-8 py-6 text-center">
              <p className="font-loft text-xl font-bold tracking-tight text-bluelagoon-snow">
                Chief Commercial Officer
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-bluelagoon-snow/50">
                Responsible for total commercial performance across the portfolio.
              </p>
            </div>

            {/* Connector: CCO → functions */}
            <div className="hidden h-8 w-px bg-bluelagoon-moss-600/40 md:block" />
          </div>
        </div>

        {/* Department tabs */}
        <div className="mt-0">
          {/* Horizontal bar + 5 ticks */}
          <div className="hidden md:block">
            <div className="h-px bg-bluelagoon-moss-600/30" />
            <div className="grid grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex h-5 justify-center">
                  <div className="w-px bg-bluelagoon-moss-600/40" />
                </div>
              ))}
            </div>
          </div>

          <ol className="mt-3 grid gap-3 md:mt-0 md:grid-cols-5">
            {DEPARTMENTS.map((d) => {
              const isActive = d.key === activeKey;
              return (
                <li key={d.key}>
                  <button
                    type="button"
                    onClick={() => setActiveKey(d.key)}
                    aria-pressed={isActive}
                    className={`flex h-full w-full flex-col border p-5 text-left transition ${
                      isActive
                        ? "border-bluelagoon-moss-600 bg-bluelagoon-moss-600 text-bluelagoon-snow"
                        : "border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-ink hover:border-bluelagoon-blue-300 hover:bg-bluelagoon-water-100"
                    }`}
                  >
                    <span
                      className={`font-loft text-[12px] font-semibold uppercase tracking-[0.22em] ${
                        isActive
                          ? "text-bluelagoon-snow/70"
                          : "text-bluelagoon-muted"
                      }`}
                    >
                      Function
                    </span>
                    <span
                      className={`mt-3 font-loft text-base font-bold leading-tight tracking-tight ${
                        isActive
                          ? "text-bluelagoon-snow"
                          : "text-bluelagoon-midnight"
                      }`}
                    >
                      {d.full}
                    </span>
                    <span
                      className={`mt-2 text-[12px] leading-snug ${
                        isActive
                          ? "text-bluelagoon-snow/75"
                          : "text-bluelagoon-muted"
                      }`}
                    >
                      {d.tagline}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Active department detail */}
          <div
            key={active.key}
            className="surface-fade mt-8 grid gap-10 border border-bluelagoon-line bg-bluelagoon-paper p-8 md:grid-cols-12 md:gap-12 md:p-12"
          >
            <div className="md:col-span-5">
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
                Scope &amp; accountability
              </p>
              <h3 className="mt-3 font-loft text-2xl font-bold leading-tight tracking-tight text-bluelagoon-midnight">
                {active.full}
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-bluelagoon-ink/80">
                {active.scope}
              </p>
              <div className="mt-6 border-t border-bluelagoon-line pt-5">
                <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
                  Key accountability
                </p>
                <p className="mt-2 font-loft text-[16px] font-semibold tracking-tight text-bluelagoon-midnight">
                  {active.accountability}
                </p>
              </div>
            </div>

            <div className="md:col-span-7">
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
                Key roles
              </p>
              <ol className="mt-4 flex flex-col">
                {active.roles.map((role, i) => (
                  <li
                    key={role.title}
                    className={`grid grid-cols-[1fr] gap-2 py-4 md:grid-cols-[14rem_1fr] md:gap-6 ${
                      i === 0
                        ? "border-t border-bluelagoon-line"
                        : "border-t border-bluelagoon-line/60"
                    }`}
                  >
                    <p className="font-loft text-[16px] font-semibold tracking-tight text-bluelagoon-midnight">
                      {role.title}
                    </p>
                    <p className="text-[16px] leading-relaxed text-bluelagoon-ink/75">
                      {role.scope}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Cross-functional partnerships */}
        <div className="mt-12">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            Key cross-functional partnerships
          </p>
          <p className="mt-2 max-w-2xl text-[16px] text-bluelagoon-muted">
            Operations assumed to cover customer engagement.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {CROSS_FUNCTIONAL.map((c) => (
              <li
                key={c.name}
                className="bg-bluelagoon-midnight p-4"
              >
                <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-snow">
                  {c.name}
                </p>
                <p className="mt-2 text-[12px] leading-snug text-bluelagoon-snow/55">
                  {c.scope}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
