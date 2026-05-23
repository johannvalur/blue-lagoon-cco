"use client";

import { useEffect, useRef, useState } from "react";
import type { Surface } from "@/lib/anthropic";
import type {
  SearchExperiencesResult,
  HoldReservationResult,
  SaveTripIdeaResult,
} from "@/lib/tools/bookingTools";
import type {
  SearchHotelsResult,
  SearchTransfersResult,
  SearchPackagesResult,
  SearchAddonsResult,
} from "@/lib/tools/inventoryTools";
import {
  FlightDiscoveryResults,
  FlightLegList,
  BookingConfirmation,
} from "@/components/trip/FlightResults";
import { HotelResults } from "@/components/trip/HotelResults";
import { CarResults } from "@/components/trip/CarResults";
import { PackageResults } from "@/components/trip/PackageResults";
import { TripIdeaCard } from "@/components/trip/TripIdeaCard";
import { Markdown } from "@/components/Markdown";
import { Telemetry, type TelemetrySnapshot } from "@/components/Telemetry";
import { saveTrip, type FareClass } from "@/lib/state/trips";
import { saveTripIdea } from "@/lib/state/tripIdeas";
import { readNdjsonStream } from "@/lib/util/ndjsonStream";

type AnyToolResult =
  | SearchExperiencesResult
  | SearchHotelsResult
  | SearchTransfersResult
  | SearchPackagesResult
  | SearchAddonsResult
  | HoldReservationResult
  | SaveTripIdeaResult;

type ToolStatus = "running" | "done";

type Item =
  | { kind: "text"; role: "user" | "assistant"; content: string }
  | {
      kind: "tool";
      id: string;
      name: string;
      status: ToolStatus;
      result?: AnyToolResult;
    };

interface TripChatProps {
  surface: Surface;
  apiPath: string;
  initialMessage?: string;
  /** Static assistant message rendered first when the chat is empty. No API call. */
  greeting?: string;
  /** Suggested user prompts shown as chips while the transcript is empty. */
  starters?: string[];
  /** Empty-state header copy shown above the transcript when it's empty. */
  emptyHeadline?: string;
  emptySubhead?: string;
  /** Visual accent for assistant dot + tool indicator. */
  accent?: "bright" | "fiery" | "boreal";
  placeholder?: string;
  fill?: boolean;
}

const ACCENT_DOT: Record<NonNullable<TripChatProps["accent"]>, string> = {
  bright: "bg-bluelagoon-bright",
  fiery: "bg-bluelagoon-fiery",
  boreal: "bg-bluelagoon-boreal",
};

function toolLabel(name: string): string {
  switch (name) {
    case "search_experiences":
      return "Matching visit options to your brief…";
    case "search_hotels":
      return "Looking at the stays…";
    case "search_transfers":
      return "Working out how you'll get there…";
    case "search_packages":
      return "Pulling up spa packages…";
    case "search_addons":
      return "Adding up treatments and add-ons…";
    case "hold_reservation":
      return "Holding the reservation…";
    case "save_trip_idea":
      return "Saving the visit idea…";
    default:
      return "Working…";
  }
}

const TIER_TO_FARE_CLASS: Record<string, FareClass> = {
  comfort: "Light",
  premium: "Standard",
  signature: "Flex",
  "retreat-spa": "Saga",
};

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function TripChat({
  surface,
  apiPath,
  initialMessage,
  greeting,
  starters = [],
  emptyHeadline,
  emptySubhead,
  accent = "bright",
  placeholder = "Tell me what you'd like — a half-day, an evening visit, an overnight at Silica.",
  fill = false,
}: TripChatProps) {
  const accentDot = ACCENT_DOT[accent];
  const [items, setItems] = useState<Item[]>(
    greeting
      ? [{ kind: "text", role: "assistant", content: greeting }]
      : [],
  );
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialFiredRef = useRef(false);
  const requestStartRef = useRef<number>(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [items, streaming]);

  // Auto-send a query handed in from the landing-page intent search.
  // Skip in offline-demo mode — DemoOverlay shows a canned response above us.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const demo = new URLSearchParams(window.location.search).get("demo");
      if (demo === "fallback") return;
    }
    if (initialMessage && !initialFiredRef.current) {
      initialFiredRef.current = true;
      send(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  function buildOutgoingMessages(
    next: Item[],
  ): { role: "user" | "assistant"; content: string }[] {
    const out: { role: "user" | "assistant"; content: string }[] = [];
    for (const it of next) {
      if (it.kind === "text") {
        if (!it.content.trim()) continue;
        out.push({ role: it.role, content: it.content });
      }
    }
    return out;
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const next: Item[] = [
      ...items,
      { kind: "text", role: "user", content: trimmed },
    ];
    setItems(next);
    setInput("");
    setStreaming(true);
    setItems((prev) => [
      ...prev,
      { kind: "text", role: "assistant", content: "" },
    ]);

    try {
      requestStartRef.current = performance.now();
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surface,
          messages: buildOutgoingMessages(next),
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Request failed (${res.status}).`);
      }

      await readNdjsonStream(res, handleEvent);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
      setItems((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (
          last &&
          last.kind === "text" &&
          last.role === "assistant" &&
          !last.content
        ) {
          updated.pop();
        }
        return updated;
      });
    } finally {
      setStreaming(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleEvent(event: unknown) {
    if (typeof event !== "object" || event === null) return;
    const e = event as { type?: string; [k: string]: unknown };

    if (e.type === "text") {
      const text = e.text as string;
      setItems((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.kind === "text" && last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: last.content + text,
          };
        } else {
          updated.push({ kind: "text", role: "assistant", content: text });
        }
        return updated;
      });
    } else if (e.type === "tool_use_start") {
      const id = e.id as string;
      const name = e.name as string;
      setItems((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (
          last &&
          last.kind === "text" &&
          last.role === "assistant" &&
          !last.content.trim()
        ) {
          updated.pop();
        }
        updated.push({ kind: "tool", id, name, status: "running" });
        return updated;
      });
    } else if (e.type === "tool_result") {
      const id = e.tool_use_id as string;
      const name = e.name as string;
      const result = e.result as AnyToolResult;
      setItems((prev) =>
        prev.map((it) =>
          it.kind === "tool" && it.id === id
            ? { ...it, status: "done", result }
            : it,
        ),
      );
      if (name === "hold_reservation") {
        const r = result as HoldReservationResult;
        const fareClass =
          TIER_TO_FARE_CLASS[r.tier_id] ?? "Standard";
        // Map the spa reservation onto the existing localStorage Trip shape so
        // the saved-trips strip / status pages keep working.
        saveTrip({
          ref: r.reservation_ref,
          dest: {
            iata: r.hotel_id ?? "BLU",
            city: r.hotel_name ?? "Blue Lagoon",
          },
          depart: r.date,
          return: null,
          fareClass,
          pax: r.guests,
          totalEUR: r.total_eur,
          status: "held",
          createdAt: new Date().toISOString(),
        });
      }
      if (name === "save_trip_idea") {
        const r = result as SaveTripIdeaResult;
        saveTripIdea(r.payload);
      }
    } else if (e.type === "done") {
      const usage = (e.usage ?? {}) as {
        input?: number;
        output?: number;
        cacheRead?: number;
        cacheWrite?: number;
      };
      const latency = performance.now() - requestStartRef.current;
      setTelemetry((prev) => ({
        inputTokens: (prev?.inputTokens ?? 0) + (usage.input ?? 0),
        outputTokens: (prev?.outputTokens ?? 0) + (usage.output ?? 0),
        cacheReadTokens:
          (prev?.cacheReadTokens ?? 0) + (usage.cacheRead ?? 0),
        cacheWriteTokens:
          (prev?.cacheWriteTokens ?? 0) + (usage.cacheWrite ?? 0),
        lastLatencyMs: Math.round(latency),
      }));
    } else if (e.type === "error") {
      setError(e.error as string);
    }
  }

  function holdTier(option: { tierId: string; name: string }) {
    const date = tomorrow();
    const synthetic = `Hold the ${option.name} entry for ${date}, arrival 14:00, 1 guest.`;
    send(synthetic);
  }

  function addHotel(hotel: SearchHotelsResult["hotels"][number]) {
    send(`Add a night at ${hotel.name} to my visit.`);
  }

  function addTransfer(tr: SearchTransfersResult["transfers"][number]) {
    send(`Use the ${tr.name} for the transfer.`);
  }

  function addPackage(pkg: SearchPackagesResult["packages"][number]) {
    send(`Lock in the "${pkg.name}" package.`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const isEmpty = items.length === 0;
  const onlyGreeting =
    items.length === 1 &&
    items[0].kind === "text" &&
    items[0].role === "assistant";
  const showEmptyState = isEmpty || onlyGreeting;
  const showCenteredHero = isEmpty;

  return (
    <div
      className={`flex flex-col overflow-hidden ${
        fill ? "min-h-0 flex-1" : "h-[calc(100vh-12rem)] min-h-[520px]"
      }`}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-bluelagoon-paper px-4 py-6 sm:px-6"
      >
        {showCenteredHero ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
            {emptyHeadline && (
              <h2 className="font-loft text-3xl font-medium tracking-tight text-bluelagoon-midnight md:text-[2.5rem] md:leading-[1.1]">
                {emptyHeadline}
              </h2>
            )}
            {emptySubhead && (
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-bluelagoon-ink/70">
                {emptySubhead}
              </p>
            )}
            {starters.length > 0 && (
              <div className="mt-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-2xl border border-bluelagoon-line bg-white px-4 py-3.5 text-left text-sm leading-relaxed text-bluelagoon-ink/85 transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-paper hover:shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {showEmptyState && emptyHeadline && (
              <div className="mb-6">
                <h2 className="font-loft text-2xl font-medium tracking-tight text-bluelagoon-midnight md:text-3xl">
                  {emptyHeadline}
                </h2>
                {emptySubhead && (
                  <p className="mt-2 max-w-2xl text-sm text-bluelagoon-ink/70">
                    {emptySubhead}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-4">
          {items.map((it, i) => {
            if (it.kind === "text") {
              return (
                <div
                  key={i}
                  className={`message-in flex ${it.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      it.role === "user"
                        ? "bg-bluelagoon-midnight font-loft text-bluelagoon-snow"
                        : "border border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-ink"
                    }`}
                  >
                    {it.role === "assistant" && (
                      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                        <span
                          className={`pulse-soft h-1.5 w-1.5 rounded-full ${accentDot}`}
                        />
                        Blue Lagoon concierge
                      </div>
                    )}
                    {it.role === "user" ? (
                      <div className="whitespace-pre-wrap">{it.content}</div>
                    ) : it.content ? (
                      <Markdown>{it.content}</Markdown>
                    ) : (
                      <span className="italic text-bluelagoon-muted opacity-60">
                        thinking…
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            if (it.status === "running") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-muted">
                    <div className="flex items-center gap-2">
                      <span
                        className={`pulse-soft h-1.5 w-1.5 rounded-full ${accentDot}`}
                      />
                      <span>{toolLabel(it.name)}</span>
                    </div>
                  </div>
                </div>
              );
            }

            // tool done — render the right card by tool name
            if (!it.result) return null;

            if (it.name === "search_experiences") {
              const r = it.result as SearchExperiencesResult;
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-full space-y-3">
                    <FlightDiscoveryResults result={r} onHold={holdTier} />
                    {r.addons && r.addons.length > 0 ? (
                      <FlightLegList result={r} />
                    ) : null}
                  </div>
                </div>
              );
            }
            if (it.name === "search_hotels") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-full">
                    <HotelResults
                      result={it.result as SearchHotelsResult}
                      onAdd={addHotel}
                    />
                  </div>
                </div>
              );
            }
            if (it.name === "search_transfers") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-full">
                    <CarResults
                      result={it.result as SearchTransfersResult}
                      onAdd={addTransfer}
                    />
                  </div>
                </div>
              );
            }
            if (it.name === "search_packages") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-full">
                    <PackageResults
                      result={it.result as SearchPackagesResult}
                      onAdd={addPackage}
                    />
                  </div>
                </div>
              );
            }
            if (it.name === "search_addons") {
              const r = it.result as SearchAddonsResult;
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-2xl">
                    <AddonResultsInline result={r} onSend={send} />
                  </div>
                </div>
              );
            }
            if (it.name === "hold_reservation") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-md">
                    <BookingConfirmation
                      result={it.result as HoldReservationResult}
                    />
                  </div>
                </div>
              );
            }
            if (it.name === "save_trip_idea") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-2xl">
                    <TripIdeaCard
                      result={it.result as SaveTripIdeaResult}
                    />
                  </div>
                </div>
              );
            }
            return null;
          })}

              {starters.length > 0 && onlyGreeting && (
                <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-2xl border border-bluelagoon-line bg-white px-4 py-3 text-left text-sm leading-relaxed text-bluelagoon-ink/85 transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-paper hover:shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-bluelagoon-fiery/60 bg-bluelagoon-fiery/10 px-4 py-3 text-sm text-bluelagoon-fiery">
            {error}
          </div>
        )}
      </div>
      <div className="bg-bluelagoon-paper px-4 pb-6 pt-2 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="group flex items-end gap-2 rounded-2xl border border-bluelagoon-line bg-white p-2 shadow-sm transition focus-within:border-bluelagoon-midnight focus-within:shadow-md">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              rows={1}
              className="flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-bluelagoon-ink placeholder-bluelagoon-muted/70 outline-none"
              disabled={streaming}
            />
            <button
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-bluelagoon-midnight text-bluelagoon-snow transition hover:bg-bluelagoon-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {streaming ? (
                <span className="block h-2 w-2 animate-pulse rounded-full bg-bluelagoon-snow" />
              ) : (
                <svg
                  aria-hidden
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <Telemetry snapshot={telemetry} surface={surface} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Small inline renderer for search_addons results — kept here rather than
// in its own file because the visual is light. Each row offers a quick
// "add" affordance that sends a natural-language follow-up to the chat.
function AddonResultsInline({
  result,
  onSend,
}: {
  result: SearchAddonsResult;
  onSend: (text: string) => void;
}) {
  if (!result.addons || result.addons.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No matching add-ons. Try widening the brief.
      </div>
    );
  }
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {result.query_summary}
      </p>
      <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-aurora p-5">
        <ul className="flex flex-col divide-y divide-bluelagoon-line">
          {result.addons.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <div className="font-semibold text-bluelagoon-midnight">
                  {a.name}
                </div>
                <div className="mt-0.5 text-xs text-bluelagoon-muted">
                  €{a.priceEUR}
                  {a.durationMin ? ` · ${a.durationMin} min` : ""}
                  {" · "}
                  {a.category}
                </div>
                <p className="mt-1 text-sm text-bluelagoon-ink">{a.why}</p>
              </div>
              <button
                onClick={() => onSend(`Add the "${a.name}" to my visit.`)}
                className="shrink-0 rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
