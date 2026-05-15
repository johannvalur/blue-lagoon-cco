"use client";

import { useEffect, useRef, useState } from "react";

type Toggle = {
  key: "largeText" | "highContrast" | "reduceMotion" | "underlineLinks";
  label: string;
  hint: string;
  bodyClass: string;
};

const TOGGLES: Toggle[] = [
  {
    key: "largeText",
    label: "Larger text",
    hint: "Increase base font size by ~12%.",
    bodyClass: "a11y-large-text",
  },
  {
    key: "highContrast",
    label: "High contrast",
    hint: "Boost text contrast against backgrounds.",
    bodyClass: "a11y-high-contrast",
  },
  {
    key: "reduceMotion",
    label: "Reduce motion",
    hint: "Suppress non-essential animations.",
    bodyClass: "a11y-reduce-motion",
  },
  {
    key: "underlineLinks",
    label: "Underline links",
    hint: "Always underline links in body copy.",
    bodyClass: "a11y-underline-links",
  },
];

const STORAGE_KEY = "bluelagoon-a11y";

type State = Record<Toggle["key"], boolean>;
const DEFAULT_STATE: State = {
  largeText: false,
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
};

function applyToBody(state: State) {
  if (typeof document === "undefined") return;
  for (const t of TOGGLES) {
    document.documentElement.classList.toggle(t.bodyClass, state[t.key]);
  }
}

export function AccessibilityMenu() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = { ...DEFAULT_STATE, ...JSON.parse(raw) } as State;
        setState(parsed);
        applyToBody(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(key: Toggle["key"]) {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      applyToBody(next);
      return next;
    });
  }

  function reset() {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    applyToBody(DEFAULT_STATE);
  }

  if (!hydrated) {
    return (
      <div className="h-8 w-8 rounded-full bg-bluelagoon-mist/60" aria-hidden />
    );
  }

  const anyOn = Object.values(state).some(Boolean);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Accessibility settings"
        aria-expanded={open}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-bluelagoon-ink/85 transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm9 5.2a1 1 0 0 1-.7 1.22l-5.3 1.36V13l2.07 7.42a1 1 0 0 1-1.93.54L13.5 14.5h-3l-1.64 6.46a1 1 0 0 1-1.93-.54L9 13V9.78L3.7 8.42A1 1 0 0 1 4.2 6.5l5.8 1.5h4l5.8-1.5a1 1 0 0 1 1.22.7Z" />
        </svg>
        {anyOn && (
          <span
            aria-hidden
            className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-bluelagoon-aurora"
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Accessibility settings"
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper shadow-xl"
        >
          <div className="flex items-baseline justify-between border-b border-bluelagoon-line px-4 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-muted">
              Accessibility
            </p>
            {anyOn && (
              <button
                type="button"
                onClick={reset}
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-midnight/80 transition hover:text-bluelagoon-midnight"
              >
                Reset
              </button>
            )}
          </div>
          <ul className="py-1">
            {TOGGLES.map((t) => {
              const on = state[t.key];
              return (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => toggle(t.key)}
                    role="menuitemcheckbox"
                    aria-checked={on}
                    className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition hover:bg-bluelagoon-mist/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-bluelagoon-midnight">
                        {t.label}
                      </p>
                      <p className="mt-0.5 text-xs text-bluelagoon-ink/70">
                        {t.hint}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className={`mt-0.5 inline-flex h-5 w-9 flex-none items-center rounded-full p-0.5 transition ${
                        on ? "bg-bluelagoon-midnight" : "bg-bluelagoon-line"
                      }`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full bg-bluelagoon-paper shadow-sm transition-transform ${
                          on ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
