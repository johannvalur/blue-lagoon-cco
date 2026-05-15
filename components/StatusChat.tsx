"use client";

import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { Telemetry, type TelemetrySnapshot } from "@/components/Telemetry";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StatusChatProps {
  placeholder?: string;
  starters?: string[];
  greeting?: string;
  seedContext?: string;
  fill?: boolean;
}

const DEFAULT_PLACEHOLDER =
  "Ask about your flight — status, options, what to do next.";

export function StatusChat({
  placeholder = DEFAULT_PLACEHOLDER,
  starters = [],
  greeting,
  seedContext,
  fill = false,
}: StatusChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    greeting ? [{ role: "assistant", content: greeting }] : [],
  );
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);

    // Build the outgoing transcript. If a seedContext is provided, prepend
    // it as a hidden first user turn so the model has the lookup framing
    // without showing it in the visible chat history.
    const visibleNext: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(visibleNext);
    setInput("");
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const seedTurn: ChatMessage[] = seedContext?.trim()
      ? [{ role: "user", content: seedContext.trim() }]
      : [];

    const outgoing: ChatMessage[] = [
      ...seedTurn,
      ...visibleNext.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const requestStartMs = performance.now();
      const res = await fetch("/api/chat/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: outgoing }),
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
                inputTokens:
                  (prev?.inputTokens ?? 0) + (event.usage?.input ?? 0),
                outputTokens:
                  (prev?.outputTokens ?? 0) + (event.usage?.output ?? 0),
                cacheReadTokens:
                  (prev?.cacheReadTokens ?? 0) +
                  (event.usage?.cacheRead ?? 0),
                cacheWriteTokens:
                  (prev?.cacheWriteTokens ?? 0) +
                  (event.usage?.cacheWrite ?? 0),
                lastLatencyMs: Math.round(latency),
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
              className={`message-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
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
                    <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-fiery pulse-soft" />
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
          <Telemetry snapshot={telemetry} />
        </div>
      </div>
    </div>
  );
}
