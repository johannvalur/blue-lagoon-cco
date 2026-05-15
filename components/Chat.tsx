"use client";

import { useEffect, useRef, useState } from "react";
import type { Surface } from "@/lib/anthropic";
import { Markdown } from "@/components/Markdown";
import { Telemetry, type TelemetrySnapshot } from "@/components/Telemetry";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  surface: Surface;
  apiPath: string;
  placeholder: string;
  starters?: string[];
  greeting?: string;
  initialMessage?: string;
  accent?: "crisp" | "boreal" | "golden" | "fiery" | "volcanic" | "lilac";
  fill?: boolean;
}

const accentDot = {
  crisp: "bg-bluelagoon-crisp",
  boreal: "bg-bluelagoon-boreal",
  golden: "bg-bluelagoon-golden",
  fiery: "bg-bluelagoon-fiery",
  volcanic: "bg-bluelagoon-volcanic",
  lilac: "bg-bluelagoon-lilac",
};

export function Chat({
  surface,
  apiPath,
  placeholder,
  starters = [],
  greeting,
  initialMessage,
  accent = "crisp",
  fill = false,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    greeting ? [{ role: "assistant", content: greeting }] : [],
  );
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialFiredRef = useRef(false);
  const lastUserMessageRef = useRef<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

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

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    lastUserMessageRef.current = trimmed;
    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const requestStartMs = performance.now();
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surface,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
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
            if (event.type === "text") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + event.text,
                  };
                }
                return updated;
              });
            } else if (event.type === "done") {
              const latency = performance.now() - requestStartMs;
              setTelemetry((prev) => ({
                inputTokens: (prev?.inputTokens ?? 0) + (event.usage?.input ?? 0),
                outputTokens: (prev?.outputTokens ?? 0) + (event.usage?.output ?? 0),
                cacheReadTokens: (prev?.cacheReadTokens ?? 0) + (event.usage?.cacheRead ?? 0),
                cacheWriteTokens: (prev?.cacheWriteTokens ?? 0) + (event.usage?.cacheWrite ?? 0),
                lastLatencyMs: latency,
              }));
            } else if (event.type === "error") {
              setError(event.error);
            }
          } catch {
            // ignore malformed line
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function retry() {
    const text = lastUserMessageRef.current;
    if (!text) return;
    setError(null);
    send(text);
  }

  const isApiKeyError = error?.includes("ANTHROPIC_API_KEY") ?? false;

  return (
    <div
      className={`surface-card flex flex-col overflow-hidden rounded-2xl ${
        fill ? "min-h-0 flex-1" : "h-[calc(100vh-12rem)] min-h-[520px]"
      }`}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-bluelagoon-cloud/60 p-6">
        {messages.length === 0 && starters.length > 0 && (
          <div className="space-y-3 pt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Try asking
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
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-bluelagoon-midnight text-bluelagoon-snow"
                    : "border border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-ink"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${accentDot[accent]} pulse-soft`}
                    />
                    Blue Lagoon
                  </div>
                )}
                {m.role === "assistant" ? (
                  <div>
                    {m.content ? (
                      <Markdown>{m.content}</Markdown>
                    ) : (
                      <span className="opacity-60 italic text-bluelagoon-muted">
                        thinking…
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {m.content || (
                      <span className="opacity-60 italic text-bluelagoon-muted">
                        thinking…
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {messages.length > 0 &&
          !messages.some((m) => m.role === "user") &&
          starters.length > 0 &&
          !streaming && (
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Or try
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
          <div
            role="alert"
            className="mt-4 rounded-xl border border-bluelagoon-fiery/60 bg-bluelagoon-fiery/10 px-4 py-3 text-sm text-bluelagoon-fiery"
          >
            {isApiKeyError ? (
              <p>
                No Anthropic API key set. The static surfaces still work, or
                add{" "}
                <code className="rounded bg-bluelagoon-paper px-1 py-0.5 text-[12px]">
                  ?demo=fallback
                </code>{" "}
                to the URL to view a canned offline response.
              </p>
            ) : (
              <p>{error}</p>
            )}
            {!isApiKeyError && lastUserMessageRef.current && (
              <button
                onClick={retry}
                className="mt-2 rounded-lg border border-bluelagoon-fiery/60 bg-bluelagoon-paper px-3 py-1.5 text-xs font-semibold text-bluelagoon-fiery transition hover:bg-bluelagoon-fiery/10"
              >
                Try again
              </button>
            )}
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
        <div className="flex justify-end mt-2">
          <Telemetry snapshot={telemetry} surface={surface} />
        </div>
      </div>
    </div>
  );
}
