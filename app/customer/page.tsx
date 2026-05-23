import Link from "next/link";
import { TripChat } from "@/components/trip/TripChat";
import { SavedTripsStrip } from "@/components/trip/SavedTripsStrip";
import { TripStatusCard } from "@/components/TripStatusCard";
import { UpgradeOffer } from "@/components/UpgradeOffer";
import {
  BOOKED_VISIT,
  MAINTENANCE_DISRUPTION,
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
  "A quiet half-day at the lagoon for two on Saturday afternoon — Premium tier.",
  "Signature with the algae mask and an in-water massage, sometime next week.",
  "Overnight at Silica Hotel with dinner at Lava, arriving around 16:00.",
  "Retreat Spa for an anniversary — what does the full ritual look like?",
  "Family of four (kids 10 and 13) — what works on a winter afternoon?",
  "Quietest arrival time tomorrow, no add-ons, just Comfort entry.",
];

const DISRUPTION_STARTERS = [
  "What does each option actually look like for me?",
  "If I shift to 19:00, do I keep my Silica room?",
  "How long do I have to decide?",
  "Just move me to 13:00 — what changes?",
];

const accountShortcuts = [
  { href: "/customer/trips", label: "My visits" },
  { href: "/customer/status", label: "Today's status" },
  { href: "/customer/loyalty", label: "Insider" },
  { href: `/customer/check-in/${BOOKED_VISIT.ref}`, label: "Arrival pass" },
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

  const recommended = MAINTENANCE_DISRUPTION.recoveryOptions.find(
    (o) => o.recommended,
  );
  const greeting = proactivePush
    ? `Heads up, Sigríður — your ${BOOKED_VISIT.arrivalWindow} arrival today is affected by ${MAINTENANCE_DISRUPTION.cause.toLowerCase()}. ${MAINTENANCE_DISRUPTION.causeDetail} I've ranked options for you on the right. The one I'd take (${recommended?.label}) keeps your time and gives you a complimentary upgrade to Signature — quieter changing, robe, and your massage stays put. Your call.`
    : undefined;
  const initialMessage =
    disrupted && !proactivePush
      ? `I just got a notification about my ${BOOKED_VISIT.arrivalWindow} arrival — what's going on?`
      : q;

  if (disrupted) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <section className="relative overflow-hidden border border-bluelagoon-line bg-gradient-to-b from-bluelagoon-water-200 to-bluelagoon-paper p-4 sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-bluelagoon-water-400/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-bluelagoon-moss-300/20 blur-3xl"
          />

          <div className="relative">
            <p className="font-accent text-[11px] font-medium uppercase tracking-[0.18em] text-bluelagoon-muted">
              <span className="text-bluelagoon-blue-500">Concierge</span>
              <span className="text-bluelagoon-line"> · </span>
              <span className="text-bluelagoon-moss-600">
                {proactivePush ? "proactive notice" : "maintenance mode"}
              </span>
            </p>

            {(proactivePush || fromDemo) && (
              <div className="mt-3 flex items-center gap-3 border border-bluelagoon-line bg-bluelagoon-water-200 px-4 py-2.5 text-xs text-bluelagoon-ink">
                <span
                  aria-hidden
                  className="pulse-soft h-1.5 w-1.5 flex-none rounded-full bg-bluelagoon-moss-600"
                />
                <span>
                  <span className="font-medium text-bluelagoon-blue-500">
                    Same maintenance event you just saw in facility ops.
                  </span>{" "}
                  Ninety seconds after the duty manager approved the recovery
                  plan, the agent reaches out to the guest — before they notice
                  the squeeze on outdoor capacity.
                </span>
              </div>
            )}

            <div className="mt-4 grid min-h-[600px] grid-cols-1 gap-4 md:grid-cols-3">
              <div className="surface-fade flex min-h-[600px] flex-col md:col-span-2">
                <TripChat
                  surface="trip"
                  apiPath="/api/chat/customer"
                  initialMessage={initialMessage}
                  greeting={greeting}
                  starters={DISRUPTION_STARTERS}
                  emptyHeadline="Visit companion"
                  emptySubhead="The same concierge that holds your reservation stays with you. Geothermal pump maintenance is squeezing the outdoor lagoon this afternoon — here are your options."
                  accent="fiery"
                  placeholder="Ask about your options, or pick one."
                  fill
                />
              </div>
              <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto md:col-span-1">
                <TripStatusCard
                  trip={BOOKED_VISIT}
                  disruption={MAINTENANCE_DISRUPTION}
                />
                <UpgradeOffer offer={AVAILABLE_UPGRADE} />
                {!proactivePush && !fromDemo && (
                  <p className="text-xs text-bluelagoon-muted">
                    Mirrors the facility view in{" "}
                    <a
                      href="/internal/ops"
                      className="underline decoration-bluelagoon-line underline-offset-2 hover:text-bluelagoon-midnight"
                    >
                      facility ops
                    </a>
                    . Same pump maintenance, the other side of the
                    conversation.
                  </p>
                )}
              </aside>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="surface-fade flex min-h-[640px] flex-1 flex-col">
        <TripChat
          surface="trip"
          apiPath="/api/chat/customer"
          initialMessage={initialMessage}
          starters={DEFAULT_STARTERS}
          emptyHeadline="Welcome back, Sigríður."
          emptySubhead="Ambassador · BL 0001 314. Plan a visit, layer on treatments, or pick up where we left off."
          accent="bright"
          placeholder="Tell me what kind of visit you're after."
          fill
        />
      </section>

      <SavedTripsStrip />

      <section className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-bluelagoon-muted">
        {accountShortcuts.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="transition hover:text-bluelagoon-midnight"
          >
            {s.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
