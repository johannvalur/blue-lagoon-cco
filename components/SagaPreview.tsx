"use client";

import {
  INSIDER_MEMBER,
  TIER_PERKS,
  TIER_THRESHOLDS,
  gapToNextTierEUR,
  type InsiderTier,
} from "@/lib/data/customer/loyalty";

export interface SagaPreviewProps {
  // All props are optional — the card defaults to the demo member so it
  // can be dropped into a page without prop plumbing.
  name?: string;
  memberId?: string;
  tier?: InsiderTier;
  points?: number;
  ytdEUR?: number;
  // A single sentence framing what's next for this member, written by the
  // caller or generated from history. Defaults to a sensible tier-up nudge.
  recommendation?: string;
}

// Tier accents — mirrors the colour system in UserMenu so the brand stays
// consistent across surfaces.
const TIER_ACCENT: Record<
  InsiderTier,
  { bar: string; label: string; dot: string }
> = {
  Friend: {
    bar: "border-l-bluelagoon-aurora",
    label: "text-bluelagoon-aurora",
    dot: "bg-bluelagoon-aurora",
  },
  Insider: {
    bar: "border-l-bluelagoon-crisp",
    label: "text-bluelagoon-crisp",
    dot: "bg-bluelagoon-crisp",
  },
  Ambassador: {
    bar: "border-l-bluelagoon-golden",
    label: "text-bluelagoon-golden",
    dot: "bg-bluelagoon-golden",
  },
  Patron: {
    bar: "border-l-bluelagoon-lilac",
    label: "text-bluelagoon-lilac",
    dot: "bg-bluelagoon-lilac",
  },
};

function defaultRecommendation(
  tier: InsiderTier,
  ytdEUR: number,
): string {
  const { nextTier, eurToGo } = gapToNextTierEUR(tier, ytdEUR);
  if (nextTier && eurToGo > 0) {
    return `You're €${eurToGo.toLocaleString()} from ${nextTier}. One Retreat Spa day visit clears it.`;
  }
  if (tier === "Ambassador") {
    return "Use your complimentary Premium-tier upgrade on your next day visit.";
  }
  if (tier === "Patron") {
    return "Your annual complimentary Retreat Spa day visit is waiting whenever you'd like to book it.";
  }
  return "Book your next visit — your perks travel with you.";
}

export function SagaPreview({
  name = INSIDER_MEMBER.name,
  memberId = INSIDER_MEMBER.id,
  tier = INSIDER_MEMBER.tier,
  points = INSIDER_MEMBER.points,
  ytdEUR = INSIDER_MEMBER.ytdEUR,
  recommendation,
}: SagaPreviewProps) {
  const accent = TIER_ACCENT[tier];
  const reco = recommendation ?? defaultRecommendation(tier, ytdEUR);
  const { nextTier, eurToGo } = gapToNextTierEUR(tier, ytdEUR);

  // Progress fraction against the next tier threshold. Cap at 100 so the
  // bar always renders cleanly when YTD exceeds the next threshold.
  const tierFloor = TIER_THRESHOLDS[tier];
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : tierFloor;
  const denom = Math.max(1, nextThreshold - tierFloor);
  const progress = nextTier
    ? Math.min(100, Math.round(((ytdEUR - tierFloor) / denom) * 100))
    : 100;

  const headlinePerk = TIER_PERKS[tier][0];

  return (
    <div
      className={`surface-card rounded-2xl border-l-4 ${accent.bar} p-6`}
      aria-label={`Insider preview for ${name}`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-widest ${accent.label}`}
      >
        Insider · personalised
      </p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <h3 className="font-loft text-2xl font-bold text-bluelagoon-midnight">
          {name}
        </h3>
        <span className="font-mono text-[11px] tracking-[0.12em] text-bluelagoon-muted">
          {memberId}
        </span>
      </div>

      <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-bluelagoon-muted">
        <span className={`h-1 w-1 rounded-full ${accent.dot} pulse-soft`} />
        <span>{tier} tier · {headlinePerk}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Lagoon points
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            {points.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            YTD spend
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            €{ytdEUR.toLocaleString()}
          </p>
        </div>
      </div>

      {nextTier && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            <span>To {nextTier}</span>
            <span>€{eurToGo.toLocaleString()} to go</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-bluelagoon-mist">
            <div
              className={`h-full ${accent.dot}`}
              style={{ width: `${progress}%` }}
              aria-hidden
            />
          </div>
        </div>
      )}

      <p className="mt-4 text-sm italic text-bluelagoon-ink/85">{reco}</p>

      <button
        type="button"
        className="btn-primary mt-5 rounded-xl px-4 py-2 text-sm font-semibold"
      >
        Open my Insider hub
      </button>
    </div>
  );
}
