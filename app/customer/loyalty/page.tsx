import { LoyaltyChat } from "@/components/LoyaltyChat";

const TIERS = [
  { tier: "Bronze", spend: "€0–€1,500 / yr", perks: "Earn miles · priority waitlist" },
  { tier: "Silver", spend: "€1,500–€4,000 / yr", perks: "Free seat selection · 1 lounge pass" },
  { tier: "Gold", spend: "€4,000–€8,000 / yr", perks: "Lounge access · priority boarding" },
  { tier: "Platinum", spend: "€8,000+ / yr", perks: "Saga lounge · upgrades · companion fares" },
];

const RELATIONSHIP_SIGNALS = [
  { icon: "✈️", label: "Trips taken", note: "Counts the journey, not just the spend." },
  { icon: "💬", label: "Recommendations followed", note: "Did our suggestion become your trip?" },
  { icon: "👥", label: "Friends referred", note: "First-timers count double in their first year." },
  { icon: "🌿", label: "Low-impact route choices", note: "Direct over connecting, off-peak over peak." },
];

export default function LoyaltyPage() {
  return (
    <>
      <div className="space-y-10">
        <section className="pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Saga Club · concept
          </p>
          <h1 className="mt-2 font-loft text-4xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-5xl">
            Loyalty, redesigned.
          </h1>
          <p className="mt-3 max-w-2xl text-bluelagoon-ink/85">
            Less a points scheme; more a long-running relationship.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="surface-card rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Today
            </p>
            <h2 className="mt-2 font-loft text-2xl font-bold text-bluelagoon-midnight">
              Tier ladder, by revenue.
            </h2>
            <p className="mt-2 text-sm text-bluelagoon-ink/85">
              Bronze → Silver → Gold → Platinum. The ladder you climb by
              spending more on flights.
            </p>
            <ul className="mt-5">
              {TIERS.map((t) => (
                <li
                  key={t.tier}
                  className="flex items-baseline justify-between gap-3 border-b border-bluelagoon-line py-3 last:border-b-0"
                >
                  <div>
                    <div className="font-loft text-sm font-bold text-bluelagoon-midnight">
                      {t.tier}
                    </div>
                    <div className="text-[11px] text-bluelagoon-muted">{t.spend}</div>
                  </div>
                  <div className="max-w-[55%] text-right text-xs text-bluelagoon-ink/85">
                    {t.perks}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-lilac p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-lilac">
              The bet
            </p>
            <h2 className="mt-2 font-loft text-2xl font-bold text-bluelagoon-midnight">
              Tier credit, by relationship.
            </h2>
            <p className="mt-2 text-sm text-bluelagoon-ink/85">
              Spend stays one signal among several. AI also reads the shape of
              the relationship — and weights it.
            </p>
            <ul className="mt-5 space-y-4">
              {RELATIONSHIP_SIGNALS.map((s) => (
                <li key={s.label} className="flex gap-3">
                  <span className="text-xl leading-none" aria-hidden>
                    {s.icon}
                  </span>
                  <div>
                    <div className="font-loft text-sm font-bold text-bluelagoon-midnight">
                      {s.label}
                    </div>
                    <div className="text-xs text-bluelagoon-ink/85">
                      {s.note}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="font-loft text-2xl font-bold text-bluelagoon-midnight md:text-3xl">
              Talk to your Saga concierge
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Anna J. · Saga 4321 · Gold
            </p>
          </div>
          <LoyaltyChat />
        </section>
      </div>
    </>
  );
}
