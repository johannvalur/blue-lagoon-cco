"use client";

import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { Telemetry, type TelemetrySnapshot } from "@/components/Telemetry";
import { getTrip, updateTrip, type FareClass } from "@/lib/state/trips";
import type {
  ChangeDatesResult,
  CancelBookingResult,
} from "@/lib/tools/manageTools";

interface ManageChatProps {
  tripRef: string;
}

type ToolStatus = "running" | "done";

type Item =
  | { kind: "text"; role: "user" | "assistant"; content: string }
  | {
      kind: "tool";
      id: string;
      name: string;
      status: ToolStatus;
      result?: ChangeDatesResult | CancelBookingResult;
    };

function toolLabel(name: string): string {
  if (name === "change_dates") return "Updating your dates…";
  if (name === "cancel_booking") return "Cancelling your booking…";
  return "Working…";
}

// Map our stored fareClass label back to the lowercase id the tools and
// FARE_RULES use.
function fareClassToId(
  fc: FareClass,
): "light" | "standard" | "flex" | "saga" {
  return fc.toLowerCase() as "light" | "standard" | "flex" | "saga";
}

export function ManageChat({ tripRef }: ManageChatProps) {
  const trip = getTrip(tripRef);

  // Hidden context seed — the model will treat this as the first user turn
  // but we render it visually as a system note (or hide it entirely).
  const seed = trip
    ? `(context: managing booking ${trip.ref} to ${trip.dest.city} (${trip.dest.iata}), depart ${trip.depart}${trip.return ? `, return ${trip.return}` : " (one-way)"}, ${trip.fareClass} class, ${trip.pax} traveller(s), held total €${trip.totalEUR})`
    : `(context: trip ${tripRef} not found)`;

  const greeting = trip
    ? `You're managing **${trip.dest.city}** (${trip.ref}). I can move your dates or cancel — what do you need?`
    : `I can't find that booking in this browser. It may have been made on another device.`;

  const [items, setItems] = useState<Item[]>([
    { kind: "text", role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestStartRef = useRef<number>(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [items, streaming]);

  function buildOutgoingMessages(
    next: Item[],
  ): { role: "user" | "assistant"; content: string }[] {
    // Inject the hidden context as the first user turn so the model knows
    // exactly what booking we're managing — without showing it in the UI.
    const out: { role: "user" | "assistant"; content: string }[] = [
      { role: "user", content: seed },
      { role: "assistant", content: greeting },
    ];
    for (const it of next) {
      if (it.kind === "text") {
        if (!it.content.trim()) continue;
        // Skip the greeting we already injected.
        if (it.role === "assistant" && it.content === greeting) continue;
        out.push({ role: it.role, content: it.content });
      }
    }
    return out;
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming || !trip) return;

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
      const res = await fetch("/api/chat/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: buildOutgoingMessages(next),
          context: {
            ref: trip.ref,
            fareClass: fareClassToId(trip.fareClass),
            totalEUR: trip.totalEUR,
          },
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            handleEvent(event);
          } catch {
            // ignore malformed line
          }
        }
      }
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
      const result = e.result as ChangeDatesResult | CancelBookingResult;

      setItems((prev) =>
        prev.map((it) =>
          it.kind === "tool" && it.id === id
            ? { ...it, status: "done", result }
            : it,
        ),
      );

      // Persist the change to localStorage so the trips list and check-in
      // page reflect reality immediately.
      if (name === "change_dates") {
        const r = result as ChangeDatesResult;
        updateTrip(tripRef, {
          depart: r.new_depart,
          return: r.new_return,
        });
      } else if (name === "cancel_booking") {
        updateTrip(tripRef, { status: "cancelled" });
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

  function onKeyDown(ev: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      send(input);
    }
  }

  const starters = trip
    ? [
        "Move my dates a week later.",
        "What's the change fee on this fare?",
        "Cancel this booking.",
      ]
    : [];

  return (
    <div className="surface-card flex h-[calc(100vh-22rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-bluelagoon-cloud/60 p-6"
      >
        <div className="space-y-4">
          {items.map((it, i) => {
            if (it.kind === "text") {
              return (
                <div
                  key={i}
                  className={`flex ${it.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      it.role === "user"
                        ? "bg-bluelagoon-midnight text-bluelagoon-snow font-loft"
                        : "border border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-ink"
                    }`}
                  >
                    {it.role === "assistant" && (
                      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-fiery pulse-soft" />
                        Manage trip
                      </div>
                    )}
                    {it.role === "user" ? (
                      <div className="whitespace-pre-wrap">{it.content}</div>
                    ) : it.content ? (
                      <Markdown>{it.content}</Markdown>
                    ) : (
                      <span className="opacity-60 italic text-bluelagoon-muted">
                        thinking…
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            // tool item
            if (it.status === "running") {
              return (
                <div key={i} className="flex justify-start">
                  <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-muted">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-fiery pulse-soft" />
                      <span>{toolLabel(it.name)}</span>
                    </div>
                  </div>
                </div>
              );
            }

            // tool done — render a compact result card
            if (it.name === "change_dates" && it.result) {
              const r = it.result as ChangeDatesResult;
              return (
                <div key={i} className="flex justify-start">
                  <div className="surface-card w-full max-w-md rounded-2xl border-l-4 border-l-bluelagoon-crisp p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-crisp">
                      Dates updated
                    </p>
                    <div className="mt-2 font-mono text-xs tracking-widest text-bluelagoon-muted">
                      {r.ref}
                    </div>
                    <div className="mt-2 text-sm text-bluelagoon-ink">
                      {r.new_depart}
                      {r.new_return ? ` → ${r.new_return}` : " (one-way)"}
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                        Change fee
                      </span>
                      <span className="font-loft text-lg font-bold text-bluelagoon-midnight">
                        {r.change_fee_eur === 0
                          ? "€0 — covered by your fare"
                          : `€${r.change_fee_eur}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            if (it.name === "cancel_booking" && it.result) {
              const r = it.result as CancelBookingResult;
              return (
                <div key={i} className="flex justify-start">
                  <div className="surface-card w-full max-w-md rounded-2xl border-l-4 border-l-bluelagoon-fiery p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-fiery">
                      Cancelled
                    </p>
                    <div className="mt-2 font-mono text-xs tracking-widest text-bluelagoon-muted">
                      {r.ref}
                    </div>
                    <div className="mt-3">
                      <span className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                        Refund
                      </span>
                      <p className="font-loft text-lg font-bold text-bluelagoon-midnight">
                        {r.refund_eur > 0
                          ? `€${r.refund_eur}`
                          : "€0 — non-refundable fare"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {!trip && (
          <div className="mt-4 rounded-xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
            Trips are stored in this browser. If you booked on another device,
            we won't see it here.
          </div>
        )}

        {trip && items.length === 1 && starters.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Try
            </p>
            <div className="flex flex-col gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-left text-sm text-bluelagoon-ink transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

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
            placeholder={
              trip ? "Move dates, cancel, ask a question…" : "No trip loaded."
            }
            rows={1}
            className="flex-1 resize-none rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-ink placeholder-bluelagoon-muted/80 outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
            disabled={streaming || !trip}
          />
          <button
            onClick={() => send(input)}
            disabled={streaming || !input.trim() || !trip}
            className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold"
          >
            {streaming ? "…" : "Send"}
          </button>
        </div>
        <div className="mt-2 flex justify-end">
          <Telemetry snapshot={telemetry} />
        </div>
      </div>
    </div>
  );
}
