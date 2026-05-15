"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export type PolicyKey =
  | "privacy"
  | "sitemap"
  | "terms"
  | "cookies"
  | "cookie-settings";

interface PolicyModalProps {
  open: boolean;
  policy: PolicyKey | null;
  onClose: () => void;
}

const TITLES: Record<PolicyKey, string> = {
  privacy: "Privacy policy",
  sitemap: "Sitemap",
  terms: "Terms and conditions",
  cookies: "Cookie policy",
  "cookie-settings": "Cookie settings",
};

export function PolicyModal({ open, policy, onClose }: PolicyModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => setPortalReady(true), []);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const prevActive = document.activeElement as HTMLElement | null;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    const focusId = window.setTimeout(
      () => closeRef.current?.focus({ preventScroll: true }),
      60,
    );
    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      window.clearTimeout(focusId);
      prevActive?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const all = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const usable = Array.from(all).filter(
          (el) => !el.hasAttribute("disabled"),
        );
        if (usable.length === 0) return;
        const first = usable[0];
        const last = usable[usable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!portalReady) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-8 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-bluelagoon-midnight/40 backdrop-blur-[2px] transition-opacity duration-200 ease-out motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={open && policy ? titleId : undefined}
        className={`relative flex max-h-[min(40rem,calc(100vh-4rem))] w-full max-w-[34rem] flex-col overflow-hidden rounded-xl border border-bluelagoon-line bg-bluelagoon-paper shadow-[0_30px_80px_-30px_rgba(0,19,77,0.45)] transition-all duration-200 ease-out motion-reduce:transition-none ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div aria-hidden className="flex h-1.5 shrink-0">
          <span className="flex-1 bg-bluelagoon-fiery" />
          <span className="flex-1 bg-bluelagoon-crisp" />
          <span className="flex-1 bg-bluelagoon-aurora" />
          <span className="flex-1 bg-bluelagoon-golden" />
        </div>

        <div className="relative shrink-0 px-7 pb-4 pt-6">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-bluelagoon-muted transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight/20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M2 2 L12 12 M12 2 L2 12" />
            </svg>
          </button>

          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-bluelagoon-muted">
            Concept site · synthetic data
          </p>
          <h2
            id={titleId}
            className="mt-1.5 font-loft text-[24px] font-extrabold leading-[1.1] tracking-tight text-bluelagoon-midnight"
          >
            {policy ? TITLES[policy] : ""}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-6 text-[14px] leading-relaxed text-bluelagoon-ink/80">
          {policy === "privacy" && <PrivacyContent />}
          {policy === "terms" && <TermsContent />}
          {policy === "cookies" && <CookiesContent />}
          {policy === "cookie-settings" && (
            <CookieSettingsContent onClose={onClose} />
          )}
          {policy === "sitemap" && <SitemapContent onClose={onClose} />}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-5 font-loft text-[12px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-midnight first:mt-0">
      {children}
    </h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>;
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-semibold text-bluelagoon-midnight transition hover:underline"
    >
      {children}
    </a>
  );
}

function PrivacyContent() {
  return (
    <>
      <H3>What this site is</H3>
      <Para>
        A concept-exploration prototype, not a production service. No
        identifying personal data is collected, no accounts are created, and
        no payment information is processed.
      </Para>
      <H3>What we send</H3>
      <Para>
        Chat surfaces forward the prompts you type to Anthropic&apos;s Claude
        API to generate replies. Those prompts are not stored on this site
        and are not associated with any identity.
      </Para>
      <H3>Cookies & storage</H3>
      <Para>
        This site does not set tracking cookies. See the cookie policy for
        details.
      </Para>
      <H3>Production policy</H3>
      <Para>
        For the policy that governs the real Blue Lagoon service, see{" "}
        <ExternalLink href="https://www.bluelagoon.com/support/legal/privacy-policy/">
          bluelagoon.com
        </ExternalLink>
        .
      </Para>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <H3>Evaluation only</H3>
      <Para>
        This site is provided for evaluation. Nothing on it constitutes an
        offer, booking, contract, or commitment by Blue Lagoon. Itineraries,
        prices, schedules, and confirmations shown here are synthetic and
        have no operational effect.
      </Para>
      <H3>Acceptable use</H3>
      <Para>
        Use the site to explore and assess the concept. Do not enter real
        identifying information or rely on it for actual travel planning.
      </Para>
      <H3>No warranty</H3>
      <Para>
        The site is provided &quot;as is&quot; without warranties of any
        kind. AI-generated responses may be inaccurate or incomplete.
      </Para>
      <H3>Production terms</H3>
      <Para>
        For terms governing the real Blue Lagoon service, see{" "}
        <ExternalLink href="https://www.bluelagoon.com/support/legal/">
          bluelagoon.com
        </ExternalLink>
        .
      </Para>
    </>
  );
}

function CookiesContent() {
  return (
    <>
      <H3>What we set</H3>
      <Para>
        This concept site does not set tracking, analytics, or advertising
        cookies. Strictly necessary cookies for core functionality (e.g.
        keeping the offline-demo flag set within a session) may be used.
      </Para>
      <H3>Categories</H3>
      <ul className="mt-2 space-y-1.5">
        <li>
          <strong className="text-bluelagoon-ink">Strictly necessary</strong>{" "}
          — required for the site to function. Always on.
        </li>
        <li>
          <strong className="text-bluelagoon-ink">Analytics</strong> — none
          set on this concept site.
        </li>
        <li>
          <strong className="text-bluelagoon-ink">Marketing</strong> — none
          set on this concept site.
        </li>
        <li>
          <strong className="text-bluelagoon-ink">Personalization</strong> —
          none set on this concept site.
        </li>
      </ul>
      <H3>Manage your choices</H3>
      <Para>
        Open <em>Cookie settings</em> from the footer to review categories.
      </Para>
    </>
  );
}

const COOKIE_CATEGORIES = [
  {
    key: "necessary",
    label: "Strictly necessary",
    description: "Required for the site to function. Cannot be disabled.",
    locked: true,
    default: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description:
      "Help us understand how visitors use the concept (none set today).",
    locked: false,
    default: false,
  },
  {
    key: "marketing",
    label: "Marketing",
    description:
      "Used to show relevant offers across services (none set today).",
    locked: false,
    default: false,
  },
  {
    key: "personalization",
    label: "Personalization",
    description:
      "Remember your preferences across sessions (none set today).",
    locked: false,
    default: false,
  },
] as const;

function CookieSettingsContent({ onClose }: { onClose: () => void }) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(COOKIE_CATEGORIES.map((c) => [c.key, c.default])),
  );
  const [saved, setSaved] = useState(false);

  function toggle(key: string) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  }

  function save() {
    setSaved(true);
    window.setTimeout(() => onClose(), 800);
  }

  return (
    <>
      <Para>
        Choose which cookie categories the site may use. Strictly necessary
        cookies are always on.
      </Para>
      <ul className="mt-4 space-y-2.5">
        {COOKIE_CATEGORIES.map((cat) => {
          const on = prefs[cat.key];
          return (
            <li
              key={cat.key}
              className="flex items-start gap-4 rounded-lg border border-bluelagoon-line bg-bluelagoon-cloud/40 px-4 py-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-bluelagoon-ink">
                  {cat.label}
                </p>
                <p className="mt-0.5 text-[13px] text-bluelagoon-muted">
                  {cat.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={`${cat.label} cookies`}
                disabled={cat.locked}
                onClick={() => !cat.locked && toggle(cat.key)}
                className={`relative mt-1 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                  on ? "bg-bluelagoon-midnight" : "bg-bluelagoon-line"
                } ${cat.locked ? "cursor-not-allowed opacity-70" : "hover:opacity-90"}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
                    on ? "translate-x-[18px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex items-center justify-end gap-3">
        {saved ? (
          <span
            role="status"
            className="text-[12px] font-semibold text-bluelagoon-volcanic"
          >
            Preferences saved
          </span>
        ) : null}
        <button
          type="button"
          onClick={save}
          className="btn-primary inline-flex items-center justify-center px-5 py-2 text-sm font-semibold"
        >
          Save preferences
        </button>
      </div>
    </>
  );
}

const SITEMAP: { heading: string; items: { label: string; href: string }[] }[] =
  [
    {
      heading: "Customer",
      items: [
        { label: "Home", href: "/customer" },
        { label: "Book", href: "/customer/book" },
        { label: "Companion", href: "/customer/companion" },
        { label: "Loyalty", href: "/customer/loyalty" },
        { label: "Stopover", href: "/customer/stopover" },
        { label: "Status", href: "/customer/status" },
        { label: "Trips", href: "/customer/trips" },
      ],
    },
    {
      heading: "Airline",
      items: [
        { label: "Internal hub", href: "/internal" },
        { label: "Operations", href: "/internal/ops" },
        { label: "Crew", href: "/internal/crew" },
        { label: "Telemetry", href: "/internal/telemetry" },
      ],
    },
    {
      heading: "Concept",
      items: [
        { label: "Home", href: "/" },
        { label: "Strategy doc", href: "/concept" },
        { label: "Org chart", href: "/org" },
      ],
    },
  ];

function SitemapContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Para>Every page in this concept exploration.</Para>
      <div className="mt-4 space-y-5">
        {SITEMAP.map((group) => (
          <div key={group.heading}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bluelagoon-muted">
              {group.heading}
            </h3>
            <ul className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="text-bluelagoon-midnight transition hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
