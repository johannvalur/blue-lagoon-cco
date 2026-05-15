"use client";

import { useEffect, useRef, useState } from "react";

type Language = {
  code: string; // ISO 639-1 two-letter
  label: string;
  native: string;
};

const LANGUAGES: Language[] = [
  { code: "EN", label: "English", native: "English" },
  { code: "IS", label: "Icelandic", native: "Íslenska" },
  { code: "DA", label: "Danish", native: "Dansk" },
  { code: "NO", label: "Norwegian", native: "Norsk" },
  { code: "SV", label: "Swedish", native: "Svenska" },
  { code: "DE", label: "German", native: "Deutsch" },
  { code: "FR", label: "French", native: "Français" },
  { code: "ES", label: "Spanish", native: "Español" },
  { code: "IT", label: "Italian", native: "Italiano" },
  { code: "NL", label: "Dutch", native: "Nederlands" },
];

const STORAGE_KEY = "bluelagoon-locale";
const DEFAULT_CODE = "EN";

export function LanguagePicker() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        setCode(saved);
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

  function pick(next: string) {
    setCode(next);
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  // Stable shell pre-hydration — avoid layout shift / SSR mismatch.
  if (!hydrated) {
    return (
      <div
        className="h-8 w-12 rounded-full bg-bluelagoon-mist/60"
        aria-hidden
      />
    );
  }

  const current = LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Language · ${current.label}`}
        aria-expanded={open}
        className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs font-semibold text-bluelagoon-ink/85 transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
        </svg>
        <span className="tracking-wider">{current.code}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Choose language"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper shadow-xl"
        >
          <p className="border-b border-bluelagoon-line px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-muted">
            Language
          </p>
          <ul className="max-h-[60vh] overflow-y-auto py-1">
            {LANGUAGES.map((l) => {
              const active = l.code === code;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    onClick={() => pick(l.code)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition ${
                      active
                        ? "bg-bluelagoon-mist text-bluelagoon-midnight"
                        : "text-bluelagoon-ink/85 hover:bg-bluelagoon-mist/60 hover:text-bluelagoon-midnight"
                    }`}
                  >
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="w-6 flex-none font-mono text-[11px] font-semibold tracking-wider text-bluelagoon-muted">
                        {l.code}
                      </span>
                      <span className="truncate">{l.native}</span>
                    </span>
                    {active && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="flex-none text-bluelagoon-midnight"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
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
