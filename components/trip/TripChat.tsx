"use client";

import { useEffect, useRef, useState } from "react";
import type { Surface } from "@/lib/anthropic";
import type {
  SearchFlightsResult,
  HoldBookingResult,
  SaveTripIdeaResult,
} from "@/lib/tools/bookingTools";
import type {
  SearchHotelsResult,
  SearchCarsResult,
  SearchPackagesResult,
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
  | SearchFlightsResult
  | SearchHotelsResult
  | SearchCarsResult
  | SearchPackagesResult
  | HoldBookingResult
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
    case "search_flights":
      return "Searching flights…";
    case "search_hotels":
      return "Combing hotels…";
    case "search_cars":
      return "Lining up rental cars…";
    case "search_packages":
      return "Looking at Blue Lagoon Holidays packages…";
    case "hold_booking":
      return "Holding the booking…";
    case "save_trip_idea":
      return "Saving the trip idea…";
    default:
      return "Working…";
  }
}

function isoPlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
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
  placeholder = "Tell me where to next, or ask to add a hotel, car, or stopover.",
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
      if (name === "hold_booking") {
        const r = result as HoldBookingResult;
        const fareClass = (r.fare_class.charAt(0).toUpperCase() +
          r.fare_class.slice(1)) as FareClass;
        saveTrip({
          ref: r.booking_ref,
          dest: { iata: r.destination_iata, city: r.destination },
          depart: r.depart_date,
          return: r.return_date || null,
          fareClass,
          pax: r.travelers,
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

  function holdOption(
    option: SearchFlightsResult["options"][number],
    fareClass: "light" | "standard" | "flex" | "saga",
  ) {
    const depart = isoPlusDays(14);
    const ret = isoPlusDays(19);
    const synthetic = `Hold the ${option.destination} option, ${depart} to ${ret}, ${fareClass} class, 1 traveller(s).`;
    send(synthetic);
  }

  function addHotel(hotel: SearchHotelsResult["hotels"][number]) {
    send(`Add ${hotel.name} (${hotel.cityIata}, ${hotel.area}) to my trip.`);
  }

  function addCar(car: SearchCarsResult["cars"][number]) {
    send(`Add a ${car.name} for the rental car.`);
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

  return (
    <div
      className={`surface-card flex flex-col overflow-hidden rounded-2xl ${
        fill ? "min-h-0 flex-1" : "h-[calc(100vh-12rem)] min-h-[520px]"
      }`}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-bluelagoon-cloud/60 p-6"
      >
        {emptyHeadline && (items.length === 0 || (items.length === 1 && items[0].kind === "text" && items[0].role === "assistant")) && (
          <div className="mb-5">
            <h2 className="font-loft text-3xl font-extrabold leading-tight tracking-tight text-bluelagoon-midnight md:text-4xl">
              {emptyHeadline}
            </h2>
            {emptySubhead && (
              <p className="mt-2 max-w-2xl text-sm text-bluelagoon-ink/85">
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

            if (it.name === "search_flights") {
              const r = it.result as SearchFlightsResult;
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-full">
                    {r.legs && r.legs.length > 0 ? (
                      <FlightLegList result={r} />
                    ) : (
                      <FlightDiscoveryResults
                        result={r}
                        onHold={holdOption}
                      />
                    )}
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
            if (it.name === "search_cars") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-full">
                    <CarResults
                      result={it.result as SearchCarsResult}
                      onAdd={addCar}
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
            if (it.name === "hold_booking") {
              return (
                <div key={i} className="message-in flex justify-start">
                  <div className="w-full max-w-md">
                    <BookingConfirmation
                      result={it.result as HoldBookingResult}
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

          {starters.length > 0 &&
            (items.length === 0 ||
              (items.length === 1 &&
                items[0].kind === "text" &&
                items[0].role === "assistant")) && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bluelagoon-muted">
                  Try
                </p>
                <div className="flex flex-wrap gap-2">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-3 py-1.5 text-left text-xs text-bluelagoon-ink/85 transition hover:border-bluelagoon-midnight hover:text-bluelagoon-midnight"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
        {error && (
          <div className="mt-4 rounded-xl border border-bluelagoon-fiery/60 bg-bluelagoon-fiery/10 px-4 py-3 text-sm text-bluelagoon-fiery">
            {error}
          </div>
        )}
      </div>
      <div className="border-t border-bluelagoon-line bg-bluelagoon-paper p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-ink placeholder-bluelagoon-muted/80 outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
            disabled={streaming}
          />
          <button
            onClick={() => send(input)}
            disabled={streaming || !input.trim()}
            className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold"
          >
            {streaming ? "…" : "Send"}
          </button>
        </div>
        <div className="mt-2 flex justify-end">
          <Telemetry snapshot={telemetry} surface={surface} />
        </div>
      </div>
    </div>
  );
}
