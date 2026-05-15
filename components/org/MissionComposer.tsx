"use client";

import { useState } from "react";

interface MissionComposerProps {
  onSubmit: (mission: string) => void;
  onCancel?: () => void;
  isStreaming: boolean;
  isPaused: boolean;
  hasMission: boolean;
  examples?: string[];
}

export function MissionComposer({
  onSubmit,
  onCancel,
  isStreaming,
  isPaused,
  hasMission,
  examples = [],
}: MissionComposerProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isStreaming || isPaused) return;
    onSubmit(trimmed);
    setText("");
  }

  return (
    <section className="surface-card rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Mission control · ask the org
          </p>
          <h2 className="mt-1 font-loft text-lg font-bold text-bluelagoon-midnight">
            Give the network a mission. Watch the agents work. You decide.
          </h2>
        </div>
        {hasMission && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isStreaming}
            className="rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-bluelagoon-midnight transition hover:bg-bluelagoon-cloud disabled:opacity-50"
          >
            Reset
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="e.g. TF-FIA APU bearing wear is trending — plan the swap before it grounds the aircraft."
          className="w-full resize-none rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-sm text-bluelagoon-ink placeholder-bluelagoon-muted/80 outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
          disabled={isStreaming || isPaused}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          {examples.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setText(ex)}
                  disabled={isStreaming || isPaused}
                  className="rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-3 py-1.5 text-left text-xs text-bluelagoon-ink/85 transition hover:border-bluelagoon-midnight hover:text-bluelagoon-midnight disabled:opacity-50"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={isStreaming || isPaused || !text.trim()}
            className="btn-primary ml-auto rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            {isStreaming ? "Running…" : isPaused ? "Awaiting decision…" : "Run mission"}
          </button>
        </div>
      </form>
    </section>
  );
}
