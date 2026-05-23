"use client";

import { useEffect, useRef, useState } from "react";
import type {
  CheckBalanceResult,
  RedeemForVisitResult,
  ViewYearRecapResult,
} from "@/lib/tools/loyaltyTools";
import { Markdown } from "@/components/Markdown";
import { Telemetry, type TelemetrySnapshot } from "@/components/Telemetry";

type LoyaltyResult =
  | CheckBalanceResult
  | RedeemForVisitResult
  | ViewYearRecapResult;

type ToolStatus = "running" | "done";

type Item =
  | { kind: "text"; role: "user" | "assistant"; content: string }
  | {
      kind: "tool";
      id: string;
      name: string;
      status: ToolStatus;
      result?: LoyaltyResult;
    };

interface LoyaltyChatProps {
  greeting?: string;
  starters?: string[];
  initialMessage?: string;
}

const DEFAULT_GREETING =
  "Welcome back, Sigríður. I can pull your Insider balance, project a points redemption, or run a year recap — what's on your mind?";

const DEFAULT_STARTERS = [
  "My balance",
  "What's a tier away?",
  "Year recap for 2026",
];

function toolLabel(name: string): string {
  if (name === "check_balance") return "Pulling your Insider balance…";
  if (name === "redeem_for_visit") return "Projecting the redemption…";
  if (name === "view_year_recap") return "Compiling your year…";
  return "Working…";
}

export function LoyaltyChat({
  greeting = DEFAULT_GREETING,
  starters = DEFAULT_STARTERS,
  initialMessage,
}: LoyaltyChatProps) {
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
      const res = await fetch("/api/chat/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surface: "loyalty",
          messages: buildOutgoingMessages(next),
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
      const result = e.result as LoyaltyResult;
      setItems((prev) =>
        prev.map((it) =>
          it.kind === "tool" && it.id === id
            ? { ...it, status: "done", result }
            : it,
        ),
      );
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

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="surface-card flex h-[calc(100vh-12rem)] min-h-[520px] flex-col overflow-hidden rounded-2xl">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-bluelagoon-cloud/60 p-6"
      >
        {items.length <= 1 && starters.length > 0 && (
          <div className="space-y-3 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Try asking
            </p>
            <div className="flex flex-col gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-left text-sm text-bluelagoon-ink transition hover:border-bluelagoon-lilac hover:bg-bluelagoon-mist"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-4">
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
                        <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-lilac pulse-soft" />
                        Insider concierge
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

            if (it.status === "running") {
              return (
                <div key={i} className="flex justify-start">
                  <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-muted">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-lilac pulse-soft" />
                      <span>{toolLabel(it.name)}</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (it.name === "check_balance" && it.result) {
              return (
                <div key={i} className="flex justify-start">
                  <div className="w-full max-w-md">
                    <BalanceCard result={it.result as CheckBalanceResult} />
                  </div>
                </div>
              );
            }
            if (it.name === "redeem_for_visit" && it.result) {
              return (
                <div key={i} className="flex justify-start">
                  <div className="w-full max-w-md">
                    <RedemptionCard
                      result={it.result as RedeemForVisitResult}
                    />
                  </div>
                </div>
              );
            }
            if (it.name === "view_year_recap" && it.result) {
              return (
                <div key={i} className="flex justify-start">
                  <div className="w-full max-w-md">
                    <YearRecapCard
                      result={it.result as ViewYearRecapResult}
                    />
                  </div>
                </div>
              );
            }
            return null;
          })}
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
            placeholder="Ask the Insider concierge anything…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-ink placeholder-bluelagoon-muted/80 outline-none transition focus:border-bluelagoon-lilac focus:ring-2 focus:ring-bluelagoon-lilac/15"
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
          <Telemetry snapshot={telemetry} />
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ result }: { result: CheckBalanceResult }) {
  return (
    <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-lilac p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-lilac">
        Insider · {result.tier}
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <div className="font-loft text-xl font-bold text-bluelagoon-midnight">
          {result.name}
        </div>
        <div className="text-xs text-bluelagoon-muted">{result.id}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Lagoon points
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            {result.points.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            YTD spend
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            €{result.ytdEUR.toLocaleString()}
          </p>
        </div>
      </div>
      {result.nextTier && result.gapToNextTierEUR > 0 && (
        <p className="mt-3 text-xs text-bluelagoon-muted">
          €{result.gapToNextTierEUR.toLocaleString()} to {result.nextTier}.
        </p>
      )}
      {result.perks.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Tier perks
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-bluelagoon-ink">
            {result.perks.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-bluelagoon-lilac" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.vouchers.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Active vouchers
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {result.vouchers.map((v) => (
              <li
                key={v.id}
                className="flex items-baseline justify-between gap-3 text-xs text-bluelagoon-ink"
              >
                <span>{v.label}</span>
                <span className="text-bluelagoon-muted">
                  exp. {v.expiresOn}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RedemptionCard({ result }: { result: RedeemForVisitResult }) {
  const eligible = result.eligible && result.pointsRequired > 0;
  const accent = eligible
    ? "border-l-bluelagoon-volcanic"
    : "border-l-bluelagoon-fiery";
  const label = eligible ? "Redemption available" : "Not yet";
  const labelClass = eligible
    ? "text-bluelagoon-volcanic"
    : "text-bluelagoon-fiery";

  const kindCopy: Record<RedeemForVisitResult["kind"], string> = {
    entry: "Entry tier",
    hotel: "Hotel night",
    treatment: "Treatment",
    product: "Products",
  };

  return (
    <div className={`surface-card rounded-2xl border-l-4 ${accent} p-5`}>
      <p
        className={`text-xs font-semibold uppercase tracking-widest ${labelClass}`}
      >
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="font-loft text-xl font-bold text-bluelagoon-midnight">
          {result.optionLabel || "Redemption"}
        </div>
        <div className="text-xs text-bluelagoon-muted">
          {kindCopy[result.kind]}
        </div>
      </div>

      {result.pointsRequired > 0 ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                Points required
              </p>
              <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                {result.pointsRequired.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                {eligible ? "After redemption" : "Current balance"}
              </p>
              <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                {result.pointsAfter.toLocaleString()}
              </p>
            </div>
          </div>
          {result.reason && (
            <p className="mt-3 text-xs text-bluelagoon-fiery">{result.reason}</p>
          )}
        </>
      ) : (
        <>
          <p className="mt-3 text-sm text-bluelagoon-ink">
            {result.reason ?? "Couldn't price this redemption."}
          </p>
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                Try one of these
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-bluelagoon-ink">
                {result.alternatives.slice(0, 4).map((alt) => (
                  <li
                    key={alt.id}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span>{alt.label}</span>
                    <span className="text-bluelagoon-muted">
                      {alt.pointsRequired.toLocaleString()} pts
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <p className="mt-4 text-xs text-bluelagoon-muted">
        Demo projection — not a held booking.
      </p>
    </div>
  );
}

function YearRecapCard({ result }: { result: ViewYearRecapResult }) {
  return (
    <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-lilac p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-lilac">
        Year recap · {result.year}
      </p>
      <div className="mt-1 font-loft text-xl font-bold text-bluelagoon-midnight">
        Sigríður&apos;s year at Blue Lagoon
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Visits
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            {result.visitsCount}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Total
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            €{result.totalEUR.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Points
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            {result.pointsEarned.toLocaleString()}
          </p>
        </div>
      </div>
      {result.topAddons.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Top add-ons
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {result.topAddons.map((d) => (
              <span
                key={d}
                className="rounded-full bg-bluelagoon-mist/60 px-2 py-0.5 text-[11px] text-bluelagoon-ink"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mt-4 text-sm leading-snug text-bluelagoon-ink">
        {result.sustainability}
      </p>
    </div>
  );
}
