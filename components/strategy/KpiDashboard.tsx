"use client";

import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Status = "ON TRACK" | "ATTENTION" | "OFF TARGET";

interface KpiRow {
  goal: "ATTRACT" | "CONVERT" | "RETAIN";
  kpi: string;
  target: string;
  division: string;
  owner: string;
  freq: string;
  status: Status;
}

const KPI_FRAMEWORK: KpiRow[] = [
  {
    goal: "ATTRACT",
    kpi: "Direct Website Traffic",
    target: "+20% YoY",
    division: "Marketing & Brand",
    owner: "Head of Marketing",
    freq: "Weekly",
    status: "ATTENTION",
  },
  {
    goal: "ATTRACT",
    kpi: "Campaign ROAS",
    target: "> 4.0×",
    division: "Marketing & Brand",
    owner: "Campaign & Media Manager",
    freq: "Weekly",
    status: "ATTENTION",
  },
  {
    goal: "ATTRACT",
    kpi: "B2B Pipeline Value",
    target: "ISK 250m",
    division: "Sales & Partnerships",
    owner: "Head of Sales",
    freq: "Monthly",
    status: "ON TRACK",
  },
  {
    goal: "ATTRACT",
    kpi: "Brand Consideration",
    target: "+5 pts YoY",
    division: "Marketing & Brand",
    owner: "Head of Marketing",
    freq: "Quarterly",
    status: "ATTENTION",
  },
  {
    goal: "CONVERT",
    kpi: "Website Conversion Rate",
    target: "> 3.5%",
    division: "Digital Commerce",
    owner: "CRO Specialist",
    freq: "Weekly",
    status: "OFF TARGET",
  },
  {
    goal: "CONVERT",
    kpi: "Direct Booking Share",
    target: "> 65%",
    division: "Digital Commerce",
    owner: "Head of Digital Commerce",
    freq: "Weekly",
    status: "ATTENTION",
  },
  {
    goal: "CONVERT",
    kpi: "OTA Commission Cost",
    target: "< 20%",
    division: "Sales & Partnerships",
    owner: "Channel & Distrib. Manager",
    freq: "Monthly",
    status: "OFF TARGET",
  },
  {
    goal: "CONVERT",
    kpi: "Revenue per Visit",
    target: "ISK 36,000",
    division: "Revenue & Pricing",
    owner: "Head of Revenue Mgmt.",
    freq: "Monthly",
    status: "ON TRACK",
  },
  {
    goal: "RETAIN",
    kpi: "Repeat Guest Rate",
    target: "> 15%",
    division: "Customer & Loyalty",
    owner: "Head of Customer & Loyalty",
    freq: "Monthly",
    status: "OFF TARGET",
  },
  {
    goal: "RETAIN",
    kpi: "NPS / Guest Satisfaction",
    target: "> 80",
    division: "Customer & Loyalty",
    owner: "Head of Customer & Loyalty",
    freq: "Monthly",
    status: "ATTENTION",
  },
  {
    goal: "RETAIN",
    kpi: "CRM Email Conversion",
    target: "> 4%",
    division: "Customer & Loyalty",
    owner: "CRM Manager",
    freq: "Weekly",
    status: "OFF TARGET",
  },
  {
    goal: "RETAIN",
    kpi: "Customer Lifetime Value",
    target: "ISK 120,000",
    division: "Customer & Loyalty",
    owner: "Customer Insights Analyst",
    freq: "Quarterly",
    status: "ATTENTION",
  },
];

type Tab = "framework" | "weekly" | "monthly" | "quarterly";

const TABS: { key: Tab; label: string; subtitle: string }[] = [
  { key: "framework", label: "Framework", subtitle: "12 KPIs across the funnel" },
  { key: "weekly", label: "Weekly", subtitle: "Speed · pace & leakage" },
  { key: "monthly", label: "Monthly", subtitle: "Accountability · margin & mix" },
  { key: "quarterly", label: "Quarterly", subtitle: "Strategic · ExCo review" },
];

function StatusPill({ status }: { status: Status }) {
  const className =
    status === "ON TRACK"
      ? "bg-emerald-600 text-white"
      : status === "ATTENTION"
        ? "bg-amber-400 text-amber-900"
        : "bg-red-500 text-white";
  return (
    <span
      className={`font-accent inline-flex items-center gap-1 px-2 py-0.5 text-[12px] font-semibold uppercase tracking-[0.16em] ${className}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status === "ON TRACK"
        ? "On track"
        : status === "ATTENTION"
          ? "Attention"
          : "Off target"}
    </span>
  );
}

function KpiTile({
  label,
  value,
  status,
  target,
}: {
  label: string;
  value: string;
  status: Status;
  target: string;
}) {
  return (
    <div className="surface-card p-5">
      <p className="font-accent text-[12px] uppercase tracking-[0.18em] text-bluelagoon-muted">
        {label}
      </p>
      <p className="mt-4 font-loft text-3xl font-bold leading-none tracking-tight text-bluelagoon-midnight">
        {value}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <StatusPill status={status} />
        <p className="text-[12px] text-bluelagoon-muted">{target}</p>
      </div>
    </div>
  );
}

function FrameworkView() {
  const grouped = {
    ATTRACT: KPI_FRAMEWORK.filter((r) => r.goal === "ATTRACT"),
    CONVERT: KPI_FRAMEWORK.filter((r) => r.goal === "CONVERT"),
    RETAIN: KPI_FRAMEWORK.filter((r) => r.goal === "RETAIN"),
  };
  return (
    <div className="surface-fade flex flex-col">
      {(Object.keys(grouped) as Array<keyof typeof grouped>).map((goal) => (
        <div key={goal} className="border-t border-bluelagoon-line first:border-t-0">
          <div className="px-1 pb-3 pt-6">
            <p className="font-accent text-[12px] font-bold uppercase tracking-[0.22em] text-bluelagoon-moss-600">
              {goal}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-[16px]">
              <colgroup>
                <col className="w-[26%]" />
                <col className="w-[11%]" />
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[10%]" />
                <col className="w-[13%]" />
              </colgroup>
              <thead>
                <tr className="border-y border-bluelagoon-line text-left text-[12px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-muted">
                  <th className="px-3 py-3 font-semibold">KPI</th>
                  <th className="px-3 py-3 font-semibold">Target</th>
                  <th className="px-3 py-3 font-semibold">Division</th>
                  <th className="px-3 py-3 font-semibold">Owner</th>
                  <th className="px-3 py-3 font-semibold">Freq.</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {grouped[goal].map((row) => (
                  <tr
                    key={row.kpi}
                    className="border-b border-bluelagoon-line/60 hover:bg-bluelagoon-water-100"
                  >
                    <td className="px-3 py-3 font-loft text-[16px] font-semibold tracking-tight text-bluelagoon-midnight">
                      {row.kpi}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-bluelagoon-ink">
                      {row.target}
                    </td>
                    <td className="px-3 py-3 text-bluelagoon-ink/80">
                      {row.division}
                    </td>
                    <td className="px-3 py-3 text-bluelagoon-ink/80">
                      {row.owner}
                    </td>
                    <td className="px-3 py-3 text-bluelagoon-muted">{row.freq}</td>
                    <td className="px-3 py-3">
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <p className="mt-6 text-xs text-bluelagoon-muted">
        Hypothetical assumptions for illustration.
      </p>
    </div>
  );
}

function WeeklyView() {
  const funnel = [
    { kpi: "Direct traffic", actual: "+14%", target: "+20%", status: "ATTENTION" as Status },
    { kpi: "Campaign ROAS", actual: "3.8x", target: "4.0x", status: "ATTENTION" as Status },
    { kpi: "Website CVR", actual: "3.1%", target: "3.5%", status: "OFF TARGET" as Status },
    { kpi: "Direct share", actual: "61%", target: "65%", status: "ATTENTION" as Status },
    { kpi: "CRM conversion", actual: "3.2%", target: "4.0%", status: "OFF TARGET" as Status },
  ];
  const actions = [
    {
      issue: "Website conversion below threshold",
      owner: "Digital Commerce",
      next: "Launch booking-flow A/B test",
      due: "Fri",
    },
    {
      issue: "ROAS under 4.0x",
      owner: "Marketing",
      next: "Reallocate budget to top ad sets",
      due: "Mon",
    },
    {
      issue: "CRM email conversion soft",
      owner: "Customer & Loyalty",
      next: "Refresh abandoned-booking flow",
      due: "Next wk",
    },
    {
      issue: "Direct share below target",
      owner: "Digital Commerce",
      next: "Member-price push on landing",
      due: "Wed",
    },
  ];
  const takeaways = [
    "Conversion and CRM activation are below threshold.",
    "Media spend requires ROAS-based reallocation.",
    "Weekly owners accountable to variance closure.",
  ];
  return (
    <div className="surface-fade flex flex-col gap-8">
      <header className="grid items-end gap-4 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
            Weekly review · Speed
          </p>
          <h3 className="mt-3 font-loft text-2xl font-bold tracking-tight text-bluelagoon-midnight">
            Weekly Commercial Control Tower
          </h3>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-bluelagoon-ink/75">
            Pace, leakage, and immediate interventions across high-frequency
            commercial levers.
          </p>
        </div>
        <p className="md:col-span-5 md:text-right text-xs text-bluelagoon-muted">
          Hypothetical demonstration data
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiTile
          label="Direct website traffic"
          value="+14%"
          status="ATTENTION"
          target="Target +20% YoY"
        />
        <KpiTile
          label="Campaign ROAS"
          value="3.8x"
          status="ATTENTION"
          target="Target > 4.0x"
        />
        <KpiTile
          label="Website conversion"
          value="3.1%"
          status="OFF TARGET"
          target="Target > 3.5%"
        />
        <KpiTile
          label="Direct booking share"
          value="61%"
          status="ATTENTION"
          target="Target > 65%"
        />
        <KpiTile
          label="CRM email conversion"
          value="3.2%"
          status="OFF TARGET"
          target="Target > 4%"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="surface-card p-6">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            Weekly funnel leakage
          </p>
          <h4 className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-midnight">
            Actual vs target across demand, conversion, owned channels
          </h4>
          <table className="mt-4 w-full text-[16px]">
            <thead>
              <tr className="border-b border-bluelagoon-line text-left text-[12px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-muted">
                <th className="py-2 font-semibold">KPI</th>
                <th className="py-2 font-semibold">Actual</th>
                <th className="py-2 font-semibold">Target</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {funnel.map((f) => (
                <tr
                  key={f.kpi}
                  className="border-b border-bluelagoon-line/60"
                >
                  <td className="py-2.5 font-loft font-semibold tracking-tight text-bluelagoon-midnight">
                    {f.kpi}
                  </td>
                  <td className="py-2.5 tabular-nums text-bluelagoon-ink">
                    {f.actual}
                  </td>
                  <td className="py-2.5 tabular-nums text-bluelagoon-muted">
                    {f.target}
                  </td>
                  <td className="py-2.5">
                    <StatusPill status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="surface-card p-6">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            Action tracker
          </p>
          <h4 className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-midnight">
            Immediate ownership and intervention cadence
          </h4>
          <ol className="mt-4 flex flex-col">
            {actions.map((a, i) => (
              <li
                key={a.issue}
                className={`grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-3 text-[16px] ${
                  i === 0
                    ? "border-t border-bluelagoon-line"
                    : "border-t border-bluelagoon-line/60"
                }`}
              >
                <p className="font-loft font-semibold tracking-tight text-bluelagoon-midnight">
                  {a.issue}
                </p>
                <span className="font-accent self-start bg-bluelagoon-water-200 px-2 py-0.5 text-[12px] uppercase tracking-[0.16em] text-bluelagoon-blue-700">
                  Due {a.due}
                </span>
                <p className="col-span-2 text-bluelagoon-ink/80">
                  <span className="text-bluelagoon-muted">{a.owner}</span>
                  <span className="mx-2 text-bluelagoon-muted/50">·</span>
                  {a.next}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="border border-bluelagoon-midnight bg-bluelagoon-midnight p-6 text-bluelagoon-snow md:p-8">
        <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/65">
          Weekly CCO takeaway
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {takeaways.map((t) => (
            <li
              key={t}
              className="border-l-2 border-bluelagoon-moss-400 pl-4 text-[16px] leading-relaxed text-bluelagoon-snow/90"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function MonthlyView() {
  const heatmap = [
    { goal: "ATTRACT", kpi: "B2B pipeline", actual: "ISK 268m", status: "ON TRACK" as Status },
    { goal: "CONVERT", kpi: "OTA cost", actual: "23.5%", status: "OFF TARGET" as Status },
    { goal: "CONVERT", kpi: "Rev / visit", actual: "ISK 38.2k", status: "ON TRACK" as Status },
    { goal: "RETAIN", kpi: "Repeat guest", actual: "12.8%", status: "OFF TARGET" as Status },
    { goal: "RETAIN", kpi: "NPS / satisfaction", actual: "76", status: "ATTENTION" as Status },
  ];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const channels = [
    { name: "Direct", color: "bg-bluelagoon-moss-600", values: [220, 235, 248, 260, 275, 282] },
    { name: "OTA / intermediated", color: "bg-bluelagoon-blue-500", values: [110, 118, 124, 132, 140, 148] },
    { name: "B2B / partners", color: "bg-bluelagoon-water-500", values: [40, 45, 52, 58, 64, 70] },
  ];
  const max = Math.max(...channels.flatMap((c) => c.values));
  const priorities = [
    "Reduce OTA commission leakage",
    "Lift website CVR and revenue per visit",
    "Rebuild repeat-stay engine through CRM and loyalty",
  ];
  return (
    <div className="surface-fade flex flex-col gap-8">
      <header className="grid items-end gap-4 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
            Monthly review · Accountability
          </p>
          <h3 className="mt-3 font-loft text-2xl font-bold tracking-tight text-bluelagoon-midnight">
            Monthly Commercial Management Tower
          </h3>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-bluelagoon-ink/75">
            Revenue quality, channel profitability, and management
            accountability by commercial goal.
          </p>
        </div>
        <p className="md:col-span-5 md:text-right text-xs text-bluelagoon-muted">
          Hypothetical demonstration data
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiTile
          label="Total revenues"
          value="ISK 428m"
          status="ON TRACK"
          target="+14.2% MoM"
        />
        <KpiTile
          label="B2B pipeline"
          value="ISK 268m"
          status="ON TRACK"
          target="Target ISK 250m"
        />
        <KpiTile
          label="OTA commission"
          value="23.5%"
          status="OFF TARGET"
          target="Target < 20%"
        />
        <KpiTile
          label="Revenue per visit"
          value="ISK 38.2k"
          status="ON TRACK"
          target="Target ISK 36k"
        />
        <KpiTile
          label="Repeat guest rate"
          value="12.8%"
          status="OFF TARGET"
          target="Target > 15%"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <section className="surface-card md:col-span-7 p-6">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            Revenue &amp; margin mix by channel
          </p>
          <h4 className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-midnight">
            Direct growth vs intermediary cost exposure · ISK m
          </h4>
          <div className="mt-6 grid grid-cols-6 items-end gap-3 text-[12px]">
            {months.map((m, i) => (
              <div key={m} className="flex flex-col items-stretch gap-1">
                <div className="flex h-44 items-end gap-1">
                  {channels.map((c) => {
                    const h = (c.values[i] / max) * 100;
                    return (
                      <div
                        key={c.name}
                        className={`${c.color} flex-1`}
                        style={{ height: `${h}%` }}
                        aria-label={`${m} ${c.name} ${c.values[i]}m`}
                      />
                    );
                  })}
                </div>
                <span className="text-center font-semibold uppercase tracking-[0.18em] text-bluelagoon-muted">
                  {m}
                </span>
              </div>
            ))}
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-bluelagoon-muted">
            {channels.map((c) => (
              <li key={c.name} className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 ${c.color}`} />
                {c.name}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-bluelagoon-line pt-4 text-[16px] leading-relaxed text-bluelagoon-ink/80">
            <span className="font-loft font-semibold text-bluelagoon-midnight">
              Insight ·
            </span>{" "}
            Revenue is growing, but OTA commission cost is eroding net
            contribution.
          </p>
        </section>

        <section className="surface-card md:col-span-5 p-6">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            Commercial KPI heatmap
          </p>
          <h4 className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-midnight">
            Monthly accountability across Attract, Convert, Retain
          </h4>
          <ol className="mt-4 flex flex-col">
            {heatmap.map((row, i) => (
              <li
                key={row.kpi}
                className={`grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 py-3 text-[16px] ${
                  i === 0
                    ? "border-t border-bluelagoon-line"
                    : "border-t border-bluelagoon-line/60"
                }`}
              >
                <span className="font-accent text-[12px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-moss-600">
                  {row.goal}
                </span>
                <div>
                  <p className="font-loft font-semibold tracking-tight text-bluelagoon-midnight">
                    {row.kpi}
                  </p>
                  <p className="text-bluelagoon-muted">{row.actual}</p>
                </div>
                <StatusPill status={row.status} />
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="border border-bluelagoon-midnight bg-bluelagoon-midnight p-6 text-bluelagoon-snow md:p-8">
        <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/65">
          Monthly management priorities
        </p>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {priorities.map((p, i) => (
            <li
              key={p}
              className="grid grid-cols-[2rem_1fr] items-start gap-3 text-[16px] leading-relaxed text-bluelagoon-snow/90"
            >
              <span className="font-loft text-lg font-bold tabular-nums tracking-tight text-bluelagoon-moss-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              {p}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function QuarterlyView() {
  const trajectory = [
    { kpi: "Brand consideration", value: "48%", status: "ATTENTION" as Status },
    { kpi: "Direct revenue share", value: "61%", status: "ATTENTION" as Status },
    { kpi: "CLV", value: "ISK 112k", status: "ATTENTION" as Status },
    { kpi: "Commercial efficiency", value: "4.8x", status: "ON TRACK" as Status },
  ];
  const questions = [
    {
      q: "Are we creating brand-led demand?",
      a: "Fund brand where it improves direct demand and consideration.",
    },
    {
      q: "Are customers becoming more valuable?",
      a: "Accelerate loyalty, lifecycle and repeat-visit economics.",
    },
    {
      q: "Are we reducing intermediary dependency?",
      a: "Protect direct pricing and shift distribution mix.",
    },
    {
      q: "Is growth becoming more efficient?",
      a: "Reallocate spend by ROAS and contribution margin.",
    },
  ];
  const bets = [
    "Direct-channel growth sprint",
    "Loyalty and repeat-stay acceleration",
    "B2B pipeline development",
    "Brand consideration investment",
  ];
  return (
    <div className="surface-fade flex flex-col gap-8">
      <header className="grid items-end gap-4 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
            Quarterly review · Strategic
          </p>
          <h3 className="mt-3 font-loft text-2xl font-bold tracking-tight text-bluelagoon-midnight">
            Quarterly Strategic ExCo Review
          </h3>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-bluelagoon-ink/75">
            Brand, customer economics, channel strategy, and
            resource-allocation choices for the next quarter.
          </p>
        </div>
        <p className="md:col-span-5 md:text-right text-xs text-bluelagoon-muted">
          Hypothetical demonstration data
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiTile
          label="Brand consideration"
          value="+3 pts"
          status="ATTENTION"
          target="Target +5 pts YoY"
        />
        <KpiTile
          label="Customer lifetime value"
          value="ISK 112k"
          status="ATTENTION"
          target="Target ISK 120k"
        />
        <KpiTile
          label="Direct revenue share"
          value="61%"
          status="ATTENTION"
          target="Target > 65%"
        />
        <KpiTile
          label="Commercial efficiency"
          value="4.8x"
          status="ON TRACK"
          target="Improve QoQ"
        />
        <KpiTile
          label="B2B pipeline value"
          value="ISK 268m"
          status="ON TRACK"
          target="Target ISK 250m"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <section className="surface-card md:col-span-5 p-6">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            Strategic trajectory
          </p>
          <h4 className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-midnight">
            Four-quarter direction of the commercial engine
          </h4>
          <ol className="mt-4 flex flex-col">
            {trajectory.map((t, i) => (
              <li
                key={t.kpi}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 text-[16px] ${
                  i === 0
                    ? "border-t border-bluelagoon-line"
                    : "border-t border-bluelagoon-line/60"
                }`}
              >
                <p className="font-loft font-semibold tracking-tight text-bluelagoon-midnight">
                  {t.kpi}
                </p>
                <span className="font-loft text-lg font-bold tabular-nums tracking-tight text-bluelagoon-midnight">
                  {t.value}
                </span>
                <StatusPill status={t.status} />
              </li>
            ))}
          </ol>
        </section>

        <section className="surface-card md:col-span-7 p-6">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
            CEO-level strategic choices
          </p>
          <h4 className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-midnight">
            Questions the cadence should enable — not just report
          </h4>
          <ol className="mt-4 flex flex-col">
            {questions.map((q, i) => (
              <li
                key={q.q}
                className={`grid gap-2 py-4 text-[16px] md:grid-cols-[1fr_1fr] md:gap-6 ${
                  i === 0
                    ? "border-t border-bluelagoon-line"
                    : "border-t border-bluelagoon-line/60"
                }`}
              >
                <p className="font-loft font-semibold tracking-tight text-bluelagoon-midnight">
                  {q.q}
                </p>
                <p className="leading-relaxed text-bluelagoon-ink/80">
                  {q.a}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="border border-bluelagoon-midnight bg-bluelagoon-midnight p-6 text-bluelagoon-snow md:p-8">
        <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/65">
          Next-quarter strategic bets
        </p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bets.map((b, i) => (
            <li
              key={b}
              className="grid grid-cols-[2rem_1fr] items-start gap-3 text-[16px] leading-relaxed text-bluelagoon-snow/90"
            >
              <span className="font-loft text-lg font-bold tabular-nums tracking-tight text-bluelagoon-moss-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              {b}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export function KpiDashboard() {
  const [tab, setTab] = useState<Tab>("framework");

  return (
    <section
      id="kpis"
      className="scroll-mt-24 border-b border-bluelagoon-line bg-bluelagoon-water-100"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        {/* Chapter intro */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
              <span className="tabular-nums">04</span>
              <span className="ml-3 text-bluelagoon-muted/80">
                KPIs &amp; Control Towers
              </span>
            </p>
            <h2 className="mt-4 max-w-2xl font-loft text-[2rem] font-bold leading-[1.1] tracking-tight text-bluelagoon-midnight md:text-[2.5rem]">
              Measure the full customer lifecycle.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-bluelagoon-ink/75">
              Commercial KPIs measure how effectively we attract demand,
              convert that demand into profitable revenue, and retain
              customers through loyalty, satisfaction, and repeat
              engagement.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={`${BASE}/strategy/kpis.png`}
                alt="Kerlingarfjöll geothermal landscape"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div
          role="tablist"
          className="mt-10 grid gap-2 border border-bluelagoon-line bg-bluelagoon-paper p-2 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TABS.map((t) => {
            const isActive = t.key === tab;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(t.key)}
                className={`flex flex-col items-start gap-1 px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-bluelagoon-midnight text-bluelagoon-snow"
                    : "bg-transparent text-bluelagoon-ink hover:bg-bluelagoon-water-200"
                }`}
              >
                <span
                  className={`font-loft text-base font-bold tracking-tight ${
                    isActive
                      ? "text-bluelagoon-snow"
                      : "text-bluelagoon-midnight"
                  }`}
                >
                  {t.label}
                </span>
                <span
                  className={`text-[12px] ${
                    isActive
                      ? "text-bluelagoon-snow/70"
                      : "text-bluelagoon-muted"
                  }`}
                >
                  {t.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active view */}
        <div className="mt-10">
          {tab === "framework" && <FrameworkView />}
          {tab === "weekly" && <WeeklyView />}
          {tab === "monthly" && <MonthlyView />}
          {tab === "quarterly" && <QuarterlyView />}
        </div>
      </div>
    </section>
  );
}
