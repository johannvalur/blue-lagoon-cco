"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LoginModal } from "./LoginModal";

type InsiderTier =
  | "Insider Friend"
  | "Insider"
  | "Ambassador"
  | "Patron";

interface User {
  name: string;
  tier: InsiderTier;
  initials: string;
  memberNumber: string;
  photoUrl?: string;
  points: number;
  ytdEUR: number;
  // EUR away from the next tier — 0 (or null) means we're at the top.
  toNextTierEUR: number;
  nextTier: InsiderTier | null;
}

const DEMO_USER: User = {
  name: "Jóhann Valur",
  tier: "Ambassador",
  initials: "JV",
  memberNumber: "BL 0001 314",
  photoUrl:
    "https://media.licdn.com/dms/image/v2/C4D03AQGNlujztYgbSQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1625526644013?e=1781136000&v=beta&t=HQRo_PWj-iIh8F-q2Ddi6r6dNmJmTcF3GUu6cyG5RFA",
  points: 18_250,
  ytdEUR: 2_640,
  toNextTierEUR: 2_360,
  nextTier: "Patron",
};

const STORAGE_KEY = "bluelagoon-user-v2";
const LEGACY_STORAGE_KEYS = ["bluelagoon-user"];

// Tier accents — re-mapped from the prior Saga colours. Patron gets lilac
// (the old Platinum slot), Ambassador keeps golden, Insider takes the cool
// crisp tone, Insider Friend uses aurora as the entry signal.
const TIER_THEME: Record<
  InsiderTier,
  { ring: string; chip: string; dot: string; glow: string }
> = {
  Ambassador: {
    ring: "ring-bluelagoon-golden/60",
    chip: "border-bluelagoon-golden/40 bg-bluelagoon-golden/15 text-bluelagoon-golden",
    dot: "bg-bluelagoon-golden",
    glow: "from-bluelagoon-golden/25",
  },
  Insider: {
    ring: "ring-bluelagoon-crisp/60",
    chip: "border-bluelagoon-crisp/40 bg-bluelagoon-crisp/10 text-bluelagoon-crisp",
    dot: "bg-bluelagoon-crisp",
    glow: "from-bluelagoon-crisp/20",
  },
  Patron: {
    ring: "ring-bluelagoon-lilac/60",
    chip: "border-bluelagoon-lilac/40 bg-bluelagoon-lilac/10 text-bluelagoon-lilac",
    dot: "bg-bluelagoon-lilac",
    glow: "from-bluelagoon-lilac/25",
  },
  "Insider Friend": {
    ring: "ring-bluelagoon-aurora/60",
    chip: "border-bluelagoon-aurora/40 bg-bluelagoon-aurora/10 text-bluelagoon-aurora",
    dot: "bg-bluelagoon-aurora",
    glow: "from-bluelagoon-aurora/20",
  },
};

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load on mount.
  useEffect(() => {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      // Pull-forward from any legacy key, then drop it.
      if (!raw) {
        for (const legacy of LEGACY_STORAGE_KEYS) {
          const legacyRaw = localStorage.getItem(legacy);
          if (legacyRaw) {
            raw = legacyRaw;
          }
          localStorage.removeItem(legacy);
        }
      }
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<User>;
        // Identity fields (name, initials, photo, tier, member number) are
        // canonical from DEMO_USER — the localStorage entry just signals
        // "signed in". Only points / YTD spend are user-mutable.
        const refreshed: User = {
          ...DEMO_USER,
          points: parsed.points ?? DEMO_USER.points,
          ytdEUR: parsed.ytdEUR ?? DEMO_USER.ytdEUR,
        };
        setUser(refreshed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Close popover on outside click or Escape.
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

  function signIn() {
    setUser(DEMO_USER);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    } catch {
      // ignore
    }
  }

  function signOut() {
    setUser(null);
    setOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  // Render a stable shell pre-hydration to avoid layout shift / mismatch.
  if (!hydrated) {
    return (
      <div className="h-8 w-20 rounded-full bg-bluelagoon-mist/60" aria-hidden />
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setLoginOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-3.5 py-1.5 text-sm font-medium text-bluelagoon-midnight transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist"
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
            <path d="M20 21a8 8 0 1 0-16 0" />
            <circle cx="12" cy="8" r="5" />
          </svg>
          Sign in
        </button>
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSignIn={signIn}
        />
      </>
    );
  }

  const theme = TIER_THEME[user.tier];

  return (
    <>
      <div ref={wrapperRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={`Account · ${user.name}`}
          aria-expanded={open}
          className="group inline-flex items-center gap-2 rounded-full border border-bluelagoon-line bg-bluelagoon-paper py-1 pl-1 pr-3 text-sm font-medium text-bluelagoon-midnight transition hover:border-bluelagoon-midnight"
        >
          <span
            className={`relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-bluelagoon-midnight text-[11px] font-bold text-bluelagoon-snow ring-2 ring-offset-1 ring-offset-bluelagoon-paper ${theme.ring}`}
          >
            {user.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              user.initials
            )}
          </span>
          <svg
            className={`hidden text-bluelagoon-muted transition md:inline ${
              open ? "rotate-180" : ""
            }`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="menu-pop absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper shadow-xl"
          >
            <div className="relative overflow-hidden bg-bluelagoon-paper px-5 py-5 text-bluelagoon-ink">
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${theme.glow} via-transparent to-transparent opacity-70 blur-2xl`}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-bluelagoon-line"
              />

              <div className="relative flex items-center gap-3">
                <span
                  className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-bluelagoon-mist text-sm font-bold text-bluelagoon-midnight ring-2 ring-offset-2 ring-offset-bluelagoon-paper ${theme.ring}`}
                >
                  {user.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    user.initials
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold tracking-tight text-bluelagoon-midnight">
                    {user.name}
                  </p>
                  <p className="font-mono text-[11px] tracking-[0.12em] text-bluelagoon-muted">
                    {user.memberNumber}
                  </p>
                </div>
              </div>

              <div
                className={`relative mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.chip}`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${theme.dot} pulse-soft`}
                />
                {user.tier}
              </div>

              <div className="relative mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-bluelagoon-line bg-bluelagoon-line">
                <div className="bg-bluelagoon-paper px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-bluelagoon-muted">
                    Lagoon points
                  </p>
                  <p className="mt-0.5 text-base font-semibold tabular-nums text-bluelagoon-midnight">
                    {user.points.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="bg-bluelagoon-paper px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-bluelagoon-muted">
                    YTD spend
                  </p>
                  <p className="mt-0.5 text-base font-semibold tabular-nums text-bluelagoon-midnight">
                    €{user.ytdEUR.toLocaleString("en-US")}
                  </p>
                </div>
              </div>

              {user.nextTier && user.toNextTierEUR > 0 && (
                <p className="relative mt-3 text-[11px] text-bluelagoon-muted">
                  €{user.toNextTierEUR.toLocaleString("en-US")} to {user.nextTier}
                </p>
              )}
            </div>

            <ul className="py-1.5 text-sm">
              <li>
                <Link
                  href="/customer/loyalty"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-5 py-2.5 text-bluelagoon-ink/85 transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight focus-visible:bg-bluelagoon-mist focus-visible:text-bluelagoon-midnight focus-visible:outline-none"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="flex-none text-bluelagoon-muted transition group-hover:text-bluelagoon-midnight"
                  >
                    <path d="M12 2L2 9l10 13 10-13z" />
                    <path d="M2 9h20" />
                  </svg>
                  <span className="flex-1">Insider hub</span>
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
                    className="flex-none text-bluelagoon-muted transition group-hover:translate-x-0.5 group-hover:text-bluelagoon-midnight"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/customer/trips"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-5 py-2.5 text-bluelagoon-ink/85 transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight focus-visible:bg-bluelagoon-mist focus-visible:text-bluelagoon-midnight focus-visible:outline-none"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="flex-none text-bluelagoon-muted transition group-hover:text-bluelagoon-midnight"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M8 2v4M16 2v4" />
                    <path d="M3 9h18" />
                  </svg>
                  <span className="flex-1">My visits</span>
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
                    className="flex-none text-bluelagoon-muted transition group-hover:translate-x-0.5 group-hover:text-bluelagoon-midnight"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/customer/status"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-5 py-2.5 text-bluelagoon-ink/85 transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight focus-visible:bg-bluelagoon-mist focus-visible:text-bluelagoon-midnight focus-visible:outline-none"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="flex-none text-bluelagoon-muted transition group-hover:text-bluelagoon-midnight"
                  >
                    <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span className="flex-1">Today at the lagoon</span>
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
                    className="flex-none text-bluelagoon-muted transition group-hover:translate-x-0.5 group-hover:text-bluelagoon-midnight"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/customer/loyalty"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-5 py-2.5 text-bluelagoon-ink/85 transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight focus-visible:bg-bluelagoon-mist focus-visible:text-bluelagoon-midnight focus-visible:outline-none"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="flex-none text-bluelagoon-muted transition group-hover:text-bluelagoon-midnight"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                    <path d="M6 15h3M15 15h3" />
                  </svg>
                  <span className="flex-1">Transactions</span>
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
                    className="flex-none text-bluelagoon-muted transition group-hover:translate-x-0.5 group-hover:text-bluelagoon-midnight"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/customer/loyalty"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-5 py-2.5 text-bluelagoon-ink/85 transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight focus-visible:bg-bluelagoon-mist focus-visible:text-bluelagoon-midnight focus-visible:outline-none"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="flex-none text-bluelagoon-muted transition group-hover:text-bluelagoon-midnight"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span className="flex-1">Settings</span>
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
                    className="flex-none text-bluelagoon-muted transition group-hover:translate-x-0.5 group-hover:text-bluelagoon-midnight"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </Link>
              </li>
            </ul>

            <div className="border-t border-bluelagoon-line">
              <button
                onClick={signOut}
                className="group flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-bluelagoon-muted transition hover:bg-bluelagoon-fiery/5 hover:text-bluelagoon-fiery focus-visible:bg-bluelagoon-fiery/5 focus-visible:text-bluelagoon-fiery focus-visible:outline-none"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="flex-none"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignIn={signIn}
      />
    </>
  );
}
