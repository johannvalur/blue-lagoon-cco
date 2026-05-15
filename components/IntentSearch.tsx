"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const examples = [
  "Somewhere warm in late February, 5 days, leaving from Reykjavík.",
  "A long weekend in October — food, design, outside.",
  "New York for a Wednesday meeting, home by Friday night.",
  "Cheapest beach right now.",
];

export function IntentSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    router.push(`/customer?q=${encodeURIComponent(trimmed)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(value);
    }
  }

  return (
    <div className="surface-card rounded-2xl p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2 border-b border-bluelagoon-line pb-4 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        <button className="rounded-full bg-bluelagoon-midnight px-3 py-1 text-bluelagoon-snow">
          Conversational
        </button>
        <span className="text-bluelagoon-line">·</span>
        <span className="line-through opacity-60">Round-trip</span>
        <span className="text-bluelagoon-line">·</span>
        <span className="line-through opacity-60">One-way</span>
        <span className="text-bluelagoon-line">·</span>
        <span className="line-through opacity-60">Multi-city</span>
        <span className="ml-auto rounded-full bg-bluelagoon-mist px-2.5 py-1 text-[10px] text-bluelagoon-midnight">
          Replaces the search form
        </span>
      </div>

      <label className="mt-5 block text-sm font-semibold text-bluelagoon-midnight">
        Where would you like to go?
      </label>
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-stretch">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          aria-label="Describe your trip"
          placeholder="Tell us what you want — destination, vibe, dates, or none of the above."
          className="flex-1 resize-none rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-base text-bluelagoon-ink outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
        />
        <button
          onClick={() => submit(value)}
          disabled={!value.trim()}
          className="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold md:w-44"
        >
          Find me a trip →
        </button>
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
          Or try one of these
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => submit(e)}
              className="rounded-full border border-bluelagoon-line bg-bluelagoon-cloud px-3 py-1.5 text-xs text-bluelagoon-ink transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
