import Link from "next/link";
import { TripChat } from "@/components/trip/TripChat";
import { SavedTripsStrip } from "@/components/trip/SavedTripsStrip";
import { TripStatusCard } from "@/components/TripStatusCard";
import { UpgradeOffer } from "@/components/UpgradeOffer";
import {
  TRAVELER_TRIP,
  FOG_DISRUPTION,
} from "@/lib/data/customer/tripScenario";
import { AVAILABLE_UPGRADE } from "@/lib/data/customer/upgrades";

interface CustomerHomeProps {
  searchParams: Promise<{
    q?: string | string[];
    scenario?: string | string[];
    push?: string | string[];
    demo?: string | string[];
  }>;
}

const DEFAULT_STARTERS = [
  "Iceland in February — photography and hot springs, leaving from London, total budget €1,500.",
  "Long weekend in Lisbon for two — design hotels, late September.",
  "New York with a 2-night stopover in Reykjavík on the way home.",
  "Ring Road self-drive in July, two adults, mid-tier hotels.",
  "Family of four to Tenerife for winter sun, kids 8 and 11.",
  "Flight + hotel package under €1,000 — surprise me.",
];

const DISRUPTION_STARTERS = [
  "What does each option actually look like for me?",
  "If I rebook to FI619, do I keep my Saga seat?",
  "How long does the credit option give me to rebook?",
  "Just book me onto FI619 — what happens next?",
];

const accountShortcuts = [
  { href: "/customer/trips", label: "My trips" },
  { href: "/customer/status", label: "Status" },
  { href: "/customer/loyalty", label: "Saga Club" },
  { href: "/customer/check-in/IC2X4F8K", label: "Check-in" },
];

function pickFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CustomerHome({
  searchParams,
}: CustomerHomeProps) {
  const params = await searchParams;
  const q = pickFirst(params.q);
  const scenario = pickFirst(params.scenario);
  const push = pickFirst(params.push);
  const demo = pickFirst(params.demo);
  const disrupted = scenario === "disruption";
  const proactivePush = disrupted && push === "1";
  const fromDemo = demo === "1";

  const recommended = FOG_DISRUPTION.options.find((o) => o.recommended);
  const greeting = proactivePush
    ? `Heads up — ${TRAVELER_TRIP.flight} to ${TRAVELER_TRIP.destinationName} tomorrow is at risk. ${FOG_DISRUPTION.causeDetail} I've ranked three options for you on the right. The middle one (${recommended?.label}) keeps your Saga cabin and adds about 3 hours to your day — that's what I'd take. Your call.`
    : undefined;
  const initialMessage =
    disrupted && !proactivePush
      ? `I just got a notification about ${TRAVELER_TRIP.flight} — what's going on?`
      : q;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl border border-bluelagoon-line bg-gradient-to-b from-bluelagoon-cloud to-bluelagoon-paper p-4 sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-bluelagoon-aurora/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-bluelagoon-bright/10 blur-3xl"
        />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bluelagoon-muted">
            <span className="text-bluelagoon-midnight">Concierge</span>
            {disrupted && (
              <>
                <span className="text-bluelagoon-line"> · </span>
                <span className="text-bluelagoon-fiery">
                  {proactivePush ? "proactive push" : "disruption mode"}
                </span>
              </>
            )}
          </p>

          {(proactivePush || (disrupted && fromDemo)) && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-bluelagoon-line bg-bluelagoon-cloud/70 px-4 py-2.5 text-xs text-bluelagoon-ink/80">
              <span
                aria-hidden
                className="pulse-soft h-1.5 w-1.5 flex-none rounded-full bg-bluelagoon-fiery"
              />
              <span>
                <span className="font-semibold text-bluelagoon-midnight">
                  Same fog event you just saw in ops.
                </span>{" "}
                Ninety seconds after the duty controller approved the recovery
                plan, the agent reaches out to the traveller — before they
                notice the delay.
              </span>
            </div>
          )}

          <div
            className={
              disrupted
                ? "mt-4 grid min-h-[600px] grid-cols-1 gap-4 md:grid-cols-3"
                : "mt-4"
            }
          >
            <div
              key={disrupted ? "disruption" : "booking"}
              className={`surface-fade flex min-h-[600px] flex-col ${disrupted ? "md:col-span-2" : ""}`}
            >
              <TripChat
                surface="trip"
                apiPath="/api/chat/customer"
                initialMessage={initialMessage}
                greeting={greeting}
                starters={disrupted ? DISRUPTION_STARTERS : DEFAULT_STARTERS}
                emptyHeadline={
                  disrupted
                    ? "Trip companion"
                    : "Where would you like to go?"
                }
                emptySubhead={
                  disrupted
                    ? "The same agent that booked the trip stays with you. KEF fog has put your flight at risk."
                    : "Tell me the trip. Flights, hotels, a rental car, a package — one conversation, one shareable plan."
                }
                accent={disrupted ? "fiery" : "bright"}
                placeholder={
                  disrupted
                    ? "Ask about your options, or pick one."
                    : "Tell me where to next."
                }
                fill
              />
            </div>
            {disrupted && (
              <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto md:col-span-1">
                <TripStatusCard
                  trip={TRAVELER_TRIP}
                  disruption={FOG_DISRUPTION}
                />
                <UpgradeOffer offer={AVAILABLE_UPGRADE} />
                {!proactivePush && !fromDemo && (
                  <p className="text-xs text-bluelagoon-muted">
                    Mirrors the airline view in{" "}
                    <a
                      href="/internal/ops"
                      className="underline decoration-bluelagoon-line underline-offset-2 hover:text-bluelagoon-midnight"
                    >
                      Operations Control Center
                    </a>
                    . Same fog event, the other side of the conversation.
                  </p>
                )}
              </aside>
            )}
          </div>
        </div>
      </section>

      {!disrupted && <SavedTripsStrip />}

      {!disrupted && (
        <section className="flex flex-none flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-bluelagoon-muted">
            Account
          </span>
          {accountShortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-3.5 py-1.5 text-sm font-medium text-bluelagoon-ink/85 transition hover:border-bluelagoon-midnight hover:text-bluelagoon-midnight"
            >
              {s.label}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
