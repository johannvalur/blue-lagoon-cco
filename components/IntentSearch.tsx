"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const examples = [
  "Half-day with an in-water massage next Thursday.",
  "Aurora overnight at Silica for two, mid-November.",
  "Couples ritual on a Saturday, late afternoon.",
  "Check my Insider balance.",
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
    <div className="surface-card p-6 md:p-7">
      <div className="font-accent flex flex-wrap items-center gap-2 border-b border-bluelagoon-line pb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-bluelagoon-muted">
        <button className="bg-bluelagoon-blue-500 px-3 py-1 text-white">
          Conversational
        </button>
        <span className="text-bluelagoon-line">·</span>
        <span className="line-through opacity-60">Date &amp; tier</span>
        <span className="text-bluelagoon-line">·</span>
        <span className="line-through opacity-60">Add-ons</span>
        <span className="text-bluelagoon-line">·</span>
        <span className="line-through opacity-60">Hotel night</span>
        <span className="ml-auto bg-bluelagoon-water-200 px-2.5 py-1 text-[10px] text-bluelagoon-blue-500">
          Replaces the booking form
        </span>
      </div>

      <label className="font-accent mt-6 block text-xs font-medium uppercase tracking-[0.14em] text-bluelagoon-blue-500">
        What kind of visit?
      </label>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-stretch">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          aria-label="Describe your visit"
          placeholder="Tell us what you want — date, mood, treatments, or nothing of the sort."
          className="flex-1 resize-none border border-bluelagoon-line bg-bluelagoon-paper px-4 py-3 text-base font-light text-bluelagoon-ink outline-none transition focus:border-bluelagoon-blue-500 focus:ring-1 focus:ring-bluelagoon-blue-500/30"
        />
        <button
          onClick={() => submit(value)}
          disabled={!value.trim()}
          className="btn-bright inline-flex items-center justify-center px-6 py-3 text-sm md:w-44"
        >
          Plan my visit →
        </button>
      </div>

      <div className="mt-6">
        <p className="font-accent text-[10px] font-medium uppercase tracking-[0.18em] text-bluelagoon-muted">
          Or try one of these
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => submit(e)}
              className="border border-bluelagoon-line bg-bluelagoon-water-100 px-3 py-1.5 text-xs font-light text-bluelagoon-ink transition hover:border-bluelagoon-blue-500 hover:bg-bluelagoon-water-200"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
