"use client";

import Link from "next/link";
import { useState } from "react";
import type { SaveTripIdeaResult } from "@/lib/tools/bookingTools";
import { saveTripIdea, type TripIdea } from "@/lib/state/tripIdeas";

interface TripIdeaCardProps {
  result?: SaveTripIdeaResult;
  idea?: TripIdea;
  sharePath?: string;
  readOnly?: boolean;
}

const TIER_LABEL: Record<string, string> = {
  comfort: "Comfort",
  premium: "Premium",
  signature: "Signature",
  "retreat-spa": "Retreat Spa",
};

export function TripIdeaCard({
  result,
  idea: ideaProp,
  sharePath: sharePathProp,
  readOnly = false,
}: TripIdeaCardProps) {
  const idea = (ideaProp ?? result?.payload) as TripIdea | undefined;
  const sharePath = sharePathProp ?? result?.share_path;
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!idea) return null;

  function buildShareUrl(): string | null {
    if (!sharePath) return null;
    if (typeof window === "undefined") return sharePath;
    return `${window.location.origin}${sharePath}`;
  }

  async function copyShareUrl() {
    const url = buildShareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore — fallback is the visible URL itself
    }
  }

  function saveLocally() {
    if (!idea) return;
    saveTripIdea(idea);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const totalEstimate =
    idea.totalEstimateEUR ??
    idea.legs.reduce((s, l) => s + (l.fareEUR ?? 0), 0) +
      idea.hotels.reduce((s, h) => s + h.nights * h.pricePerNightEUR, 0) +
      idea.cars.reduce((s, c) => s + c.days * c.pricePerDayEUR, 0) +
      idea.packages.reduce((s, p) => s + p.priceFromEURPerPerson, 0);

  return (
    <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-bright p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-bright">
        Visit idea {readOnly ? "· shared" : "· saved"}
      </p>
      <h2 className="mt-1 font-loft text-2xl font-bold text-bluelagoon-midnight">
        {idea.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-bluelagoon-ink/85">
        {idea.summary}
      </p>

      {idea.legs.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Plan
          </p>
          <ol className="mt-2 flex flex-wrap items-center gap-2 text-sm text-bluelagoon-ink">
            {idea.legs.map((leg, idx) => {
              const tierLabel = TIER_LABEL[leg.iata.toLowerCase()] ?? leg.iata;
              return (
                <li key={idx} className="flex items-center gap-2">
                  {idx > 0 && (
                    <span className="text-bluelagoon-muted">·</span>
                  )}
                  <span className="rounded-full bg-bluelagoon-mist/60 px-2.5 py-1 text-xs">
                    {tierLabel}
                  </span>
                  {leg.departDate ? (
                    <span className="text-xs text-bluelagoon-muted">
                      {leg.departDate}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {(idea.hotels.length > 0 ||
        idea.cars.length > 0 ||
        idea.packages.length > 0) && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {idea.hotels.length > 0 && (
            <Section title="Stay">
              {idea.hotels.map((h) => (
                <div key={h.id} className="text-sm text-bluelagoon-ink">
                  <div className="font-semibold">{h.name}</div>
                  <div className="text-xs text-bluelagoon-muted">
                    {h.nights} night{h.nights === 1 ? "" : "s"} · from €
                    {h.pricePerNightEUR}/night
                  </div>
                </div>
              ))}
            </Section>
          )}
          {idea.cars.length > 0 && (
            <Section title="Transfer">
              {idea.cars.map((c) => (
                <div key={c.id} className="text-sm text-bluelagoon-ink">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-bluelagoon-muted">
                    €{c.pricePerDayEUR}
                  </div>
                </div>
              ))}
            </Section>
          )}
          {idea.packages.length > 0 && (
            <Section title="Package">
              {idea.packages.map((p) => (
                <div key={p.id} className="text-sm text-bluelagoon-ink">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-bluelagoon-muted">
                    €{p.priceFromEURPerPerson} pp
                  </div>
                </div>
              ))}
            </Section>
          )}
        </div>
      )}

      <div className="mt-5 flex items-end justify-between border-t border-bluelagoon-line pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
            {idea.travelers} guest{idea.travelers === 1 ? "" : "s"}
          </p>
          {totalEstimate ? (
            <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
              ≈ €{Math.round(totalEstimate)}
            </p>
          ) : null}
        </div>

        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2">
            {sharePath && (
              <>
                <button
                  onClick={copyShareUrl}
                  className="rounded-xl border border-bluelagoon-midnight bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:bg-bluelagoon-midnight hover:text-bluelagoon-snow"
                >
                  {copied ? "Copied" : "Copy share link"}
                </button>
                <Link
                  href={sharePath}
                  className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight"
                >
                  Open share page
                </Link>
              </>
            )}
            <button
              onClick={saveLocally}
              className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight"
            >
              {saved ? "Saved" : "Save to my browser"}
            </button>
          </div>
        )}

        {readOnly && (
          <Link
            href={`/customer?q=${encodeURIComponent(`Plan a visit like this: ${idea.title}. ${idea.summary}`)}`}
            className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Plan a visit like this
          </Link>
        )}
      </div>

      {!readOnly && (
        <p className="mt-3 text-xs text-bluelagoon-muted">
          Demo visit idea — saved in this browser, no account required.
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-bluelagoon-line bg-bluelagoon-cloud/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {title}
      </p>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}
