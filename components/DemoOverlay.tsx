"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DEMO_SCRIPT, FALLBACK_RESPONSES } from "@/lib/demoScript";

export function DemoOverlay() {
  const router = useRouter();
  const params = useSearchParams();
  const isActive =
    params?.get("demo") === "1" || params?.get("demo") === "fallback";
  const isFallback = params?.get("demo") === "fallback";
  const [step, setStep] = useState(0);

  // Run the side-effect for the current step (navigate or click).
  // Advancing is fully manual — no timers.
  useEffect(() => {
    if (!isActive) return;
    const current = DEMO_SCRIPT[step];
    if (!current) return;

    if (current.action === "navigate" && current.route) {
      const target = current.route;
      const sep = target.includes("?") ? "&" : "?";
      router.push(`${target}${sep}demo=${isFallback ? "fallback" : "1"}`);
    } else if (current.action === "click" && current.selector && !isFallback) {
      // Cards stream in async — poll until the target appears, then click once.
      const selector = current.selector;
      const interval = setInterval(() => {
        if (typeof document === "undefined") return;
        const el = document.querySelector<HTMLElement>(selector);
        if (el) {
          el.click();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isActive, step, router, isFallback]);

  // Arrow keys advance / go back. Ignored while typing in inputs.
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setStep((s) => Math.min(s + 1, DEMO_SCRIPT.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setStep((s) => Math.max(s - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive]);

  if (!isActive) return null;
  const current = DEMO_SCRIPT[step];
  const progress = (step / Math.max(1, DEMO_SCRIPT.length - 1)) * 100;
  const fallbackQuote = isFallback
    ? Object.entries(FALLBACK_RESPONSES).find(([prefix]) =>
        current.route?.startsWith(prefix),
      )?.[1]
    : null;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 border-t border-bluelagoon-line bg-bluelagoon-midnight text-bluelagoon-snow shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.4)]">
      {/* Fallback quote sits highest in the overlay, closest to the page content above it. */}
      {fallbackQuote && (
        <div className="mx-auto max-w-3xl border-b border-white/10 bg-bluelagoon-midnight-soft/40 px-4 py-3 text-sm leading-snug text-bluelagoon-snow/95 sm:px-6">
          <span className="mb-1 block text-[10px] uppercase tracking-widest text-bluelagoon-snow/60 sm:text-xs">
            Sample response (offline mode)
          </span>
          {fallbackQuote}
        </div>
      )}
      {/* Progress bar — visual separator between page content and the controls. */}
      <div className="h-0.5 bg-white/10">
        <div
          className="h-0.5 bg-bluelagoon-crisp transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Caption + controls row sits at the very bottom edge of the screen. */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-snow/70 sm:text-[11px]">
            Demo · {step + 1} / {DEMO_SCRIPT.length} · ← →
          </div>
          <div
            key={step}
            className="caption-swap truncate font-loft text-sm font-semibold"
          >
            {current.caption}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
            aria-label="Previous step"
            className="rounded-full border border-white/20 px-3 py-1 text-xs leading-none disabled:opacity-40"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setStep((s) => Math.min(s + 1, DEMO_SCRIPT.length - 1))
            }
            disabled={step === DEMO_SCRIPT.length - 1}
            aria-label="Next step"
            className="rounded-full border border-white/20 px-3 py-1 text-xs leading-none disabled:opacity-40"
          >
            ›
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined")
                window.location.assign(window.location.pathname);
            }}
            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-bluelagoon-midnight"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
