import { LoyaltyChat } from "@/components/LoyaltyChat";

const TIERS = [
  {
    tier: "Friend",
    spend: "€0–€500 / yr",
    perks: "Earn points · 10% off skincare",
  },
  {
    tier: "Insider",
    spend: "€500–€1,500 / yr",
    perks: "Priority arrival window · 1 treatment upgrade",
  },
  {
    tier: "Ambassador",
    spend: "€1,500–€4,000 / yr",
    perks: "Signature tier on entry · Lava priority · early-hours access",
  },
  {
    tier: "Patron",
    spend: "€4,000+ / yr",
    perks: "Retreat Spa entry · private guide · suite upgrades",
  },
];

const RELATIONSHIP_SIGNALS = [
  {
    icon: "·",
    label: "Visits made",
    note: "Counts the day itself, not just the spend on it.",
  },
  {
    icon: "·",
    label: "Recommendations followed",
    note: "Did our suggested treatment or arrival window become your visit?",
  },
  {
    icon: "·",
    label: "Friends introduced",
    note: "First-timers count double on their first visit.",
  },
  {
    icon: "·",
    label: "Quiet-hour preferences",
    note: "Early or late slots, mid-week visits, low-season weeks.",
  },
];

export default function LoyaltyPage() {
  return (
    <>
      <div className="space-y-10">
        <section className="pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Insider · concept
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
              Tier ladder, by spend.
            </h2>
            <p className="mt-2 text-sm text-bluelagoon-ink/85">
              Friend → Insider → Ambassador → Patron. The ladder you climb by
              visiting more often and going deeper.
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
                  <span
                    className="text-xl leading-none text-bluelagoon-muted"
                    aria-hidden
                  >
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
              Talk to your Insider concierge
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Sigríður Margrét Oddsdóttir · BL 0001 314 · Ambassador
            </p>
          </div>
          <LoyaltyChat />
        </section>
      </div>
    </>
  );
}
