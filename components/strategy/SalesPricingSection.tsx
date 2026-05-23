"use client";

import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface Lever {
  title: string;
  detail: string;
}

interface Strategy {
  key: "sales" | "pricing";
  title: string;
  tagline: string;
  description: string;
  focusLabel: string;
  levers: Lever[];
  priorities: string[];
  impact: string[];
}

const STRATEGIES: Strategy[] = [
  {
    key: "sales",
    title: "Direct Sales Strategy",
    tagline:
      "Shift demand toward higher-margin owned channels and strategic partner relationships.",
    description:
      "Grow direct booking share, formalise strategic B2B tiers, and convert one-time guests into repeat visitors.",
    focusLabel: "Commercial focus",
    levers: [
      {
        title: "Prioritise owned channels",
        detail:
          "Reserve best availability, exclusive packages, and pre-arrival upsells for direct bookers.",
      },
      {
        title: "Tier strategic B2B partners",
        detail:
          "Formalise DMC, luxury travel advisor, and incentive tiers with preferred rates and co-marketing support.",
      },
      {
        title: "Build CRM-driven loyalty",
        detail:
          "Convert one-time guests into repeat visitors through segmented journeys and return-stay offers.",
      },
      {
        title: "Grow groups, MICE & corporate",
        detail:
          "Dedicate sales coverage with clear SLAs, tailored collateral, and quarterly pipeline reviews.",
      },
    ],
    priorities: [
      "Owned-channel conversion",
      "Partner tiering and incentives",
      "CRM activation journeys",
      "Group pipeline discipline",
    ],
    impact: [
      "Higher direct booking mix",
      "Lower OTA dependency",
      "More repeat visitation",
      "Stronger corporate pipeline",
    ],
  },
  {
    key: "pricing",
    title: "Pricing & Revenue Strategy",
    tagline:
      "Use demand-led pricing and value packaging to protect ADR and premium positioning.",
    description:
      "Deploy dynamic pricing, defend rate integrity, and use premium anchoring to drive willingness to pay.",
    focusLabel: "Operating focus",
    levers: [
      {
        title: "Deploy dynamic pricing",
        detail:
          "Use demand signals, seasonality, and time-slot yield management to optimise price and capacity.",
      },
      {
        title: "Protect rate integrity",
        detail:
          "Maintain public price parity while adding direct-only value through perks, packages, and upgrades.",
      },
      {
        title: "Increase bundle attach rate",
        detail:
          "Package spa, dining, skincare, and transport to lift ADR and reduce booking friction.",
      },
      {
        title: "Use premium anchoring",
        detail:
          "Position Retreat and Premium Comfort tiers as value anchors to increase willingness to pay.",
      },
    ],
    priorities: [
      "Demand forecasting",
      "Channel profitability",
      "Package architecture",
      "Premium tier logic",
    ],
    impact: [
      "Higher ADR",
      "Better yield by time slot",
      "Reduced price sensitivity",
      "Stronger premium tier uptake",
    ],
  },
];

export function SalesPricingSection() {
  const [key, setKey] = useState<"sales" | "pricing">("sales");
  const active = STRATEGIES.find((s) => s.key === key) ?? STRATEGIES[0];

  return (
    <section
      id="sales-pricing"
      className="scroll-mt-24 border-b border-bluelagoon-line bg-bluelagoon-water-100"
    >
      <div className="relative isolate overflow-hidden bg-bluelagoon-midnight text-bluelagoon-snow">
        <video
          src={`${BASE}/strategy/sales-pricing.mp4`}
          poster={`${BASE}/strategy/sales-pricing-poster.png`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-bluelagoon-midnight via-bluelagoon-midnight/85 to-bluelagoon-midnight/30"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
          <div className="max-w-2xl">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-snow/65">
              <span className="tabular-nums">06</span>
              <span className="ml-3 text-bluelagoon-snow/55">
                Direct Sales &amp; Pricing
              </span>
            </p>
            <h2 className="mt-4 font-loft text-[2.25rem] font-bold leading-[1.05] tracking-tight md:text-[3rem]">
              The heart of profitable commercial growth.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-bluelagoon-snow/85 md:text-lg">
              Direct sales and pricing strategy protects brand equity through
              pricing discipline, reduces intermediary dependency, and
              maximises guest value across every channel and touchpoint.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex flex-col items-center gap-4">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            Choose a strategy
          </p>
          <div
            role="tablist"
            className="grid w-full max-w-md gap-2 border border-bluelagoon-line bg-bluelagoon-paper p-2 sm:grid-cols-2"
          >
            {STRATEGIES.map((s) => {
              const isActive = s.key === key;
              return (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setKey(s.key)}
                  className={`px-4 py-3 text-left transition ${
                    isActive
                      ? "bg-bluelagoon-midnight text-bluelagoon-snow"
                      : "bg-transparent text-bluelagoon-ink hover:bg-bluelagoon-water-200"
                  }`}
                >
                  <p
                    className={`font-accent text-[12px] uppercase tracking-[0.18em] ${
                      isActive
                        ? "text-bluelagoon-snow/70"
                        : "text-bluelagoon-muted"
                    }`}
                  >
                    Strategy
                  </p>
                  <p
                    className={`mt-1 font-loft text-base font-bold tracking-tight ${
                      isActive
                        ? "text-bluelagoon-snow"
                        : "text-bluelagoon-midnight"
                    }`}
                  >
                    {s.key === "sales" ? "Direct Sales" : "Pricing & Revenue"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active strategy detail */}
        <div
          key={active.key}
          className="surface-fade mt-12 grid gap-10 border border-bluelagoon-line bg-bluelagoon-paper p-8 md:p-12 lg:grid-cols-12 lg:gap-14"
        >
          <header className="lg:col-span-4">
            <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
              {active.focusLabel}
            </p>
            <h3 className="mt-3 font-loft text-2xl font-bold leading-tight tracking-tight text-bluelagoon-midnight md:text-3xl">
              {active.title}
            </h3>
            <p className="mt-5 text-[16px] leading-relaxed text-bluelagoon-ink/80">
              {active.tagline}
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-bluelagoon-ink/70">
              {active.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-bluelagoon-line pt-6">
              <div>
                <p className="font-accent text-[12px] uppercase tracking-[0.18em] text-bluelagoon-muted">
                  Execution priorities
                </p>
                <ol className="mt-3 flex flex-col gap-1.5 text-[16px] text-bluelagoon-ink/85">
                  {active.priorities.map((p, i) => (
                    <li key={p}>
                      <span className="font-loft font-semibold tabular-nums text-bluelagoon-moss-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="ml-2">{p}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="font-accent text-[12px] uppercase tracking-[0.18em] text-bluelagoon-muted">
                  Target impact
                </p>
                <ol className="mt-3 flex flex-col gap-1.5 text-[16px] text-bluelagoon-ink/85">
                  {active.impact.map((p, i) => (
                    <li key={p}>
                      <span className="font-loft font-semibold tabular-nums text-bluelagoon-moss-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="ml-2">{p}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </header>

          <ol className="lg:col-span-8 grid gap-4 md:grid-cols-2">
            {active.levers.map((l, i) => (
              <li
                key={l.title}
                className="bg-bluelagoon-midnight p-6"
              >
                <p className="font-loft text-sm font-semibold tabular-nums tracking-tight text-bluelagoon-moss-400">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-3 font-loft text-base font-bold leading-tight tracking-tight text-bluelagoon-snow">
                  {l.title}
                </h4>
                <p className="mt-3 text-[16px] leading-relaxed text-bluelagoon-snow/70">
                  {l.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
