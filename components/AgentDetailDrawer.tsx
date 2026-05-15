"use client";

import { useEffect, useId, useRef } from "react";
import {
  ACCENT_DOT_BG,
  ACCENT_TEXT,
  KIND_LABEL,
  type AccentColor,
  type Agent,
} from "@/lib/data/orgChart";
import { Sparkline } from "./Sparkline";

interface AgentDetailDrawerProps {
  agent: Agent | null;
  accent: AccentColor;
  departmentName: string;
  onClose: () => void;
}

function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`;
  if (ms < 3_600_000) {
    const m = Math.floor(ms / 60_000);
    const s = Math.round((ms % 60_000) / 1000);
    return s > 0 ? `${m} min ${s} s` : `${m} min`;
  }
  const h = Math.floor(ms / 3_600_000);
  const m = Math.round((ms % 3_600_000) / 60_000);
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

export function AgentDetailDrawer({
  agent,
  accent,
  departmentName,
  onClose,
}: AgentDetailDrawerProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const open = agent !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
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

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevActive?.focus?.();
    };
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close agent details"
        onClick={onClose}
        className={`absolute inset-0 bg-bluelagoon-midnight/30 backdrop-blur-[2px] transition-opacity duration-200 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={open ? titleId : undefined}
        className={`absolute inset-y-0 right-0 flex h-full w-full max-w-md transform flex-col overflow-y-auto border-l border-bluelagoon-line bg-bluelagoon-paper shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {agent && (
          <>
            <header className="flex items-start gap-4 border-b border-bluelagoon-line bg-bluelagoon-cloud px-6 py-5">
              <span
                className={`mt-2 inline-block h-2.5 w-2.5 flex-none rounded-full ${ACCENT_DOT_BG[accent]}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                  {departmentName}
                </p>
                <h2
                  id={titleId}
                  className="mt-0.5 font-loft text-2xl font-extrabold tracking-tight text-bluelagoon-midnight"
                >
                  {agent.name}
                </h2>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                    {KIND_LABEL[agent.kind]}
                  </span>
                  <span className="text-sm text-bluelagoon-ink/85">
                    {agent.role}
                  </span>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-muted transition hover:border-bluelagoon-midnight hover:text-bluelagoon-midnight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight"
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M2 2 L12 12 M12 2 L2 12" />
                </svg>
              </button>
            </header>

            <div className="flex-1 space-y-6 px-6 py-6">
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                  Now
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-bluelagoon-ink">
                  {agent.now}
                </p>
                <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                  Done
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-bluelagoon-ink/85">
                  {agent.done}
                </p>
              </section>

              <section className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-mist/40 p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                    Performance · last 24 h
                  </h3>
                  <span className="text-[11px] font-mono text-bluelagoon-muted">
                    hourly
                  </span>
                </div>
                <div className="mt-2">
                  <Sparkline
                    values={agent.metrics.sparkline24h}
                    accent={accent}
                    width={360}
                    height={56}
                    ariaLabel={`${agent.name} 24-hour activity sparkline`}
                  />
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-bluelagoon-paper px-2 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                      Decisions today
                    </dt>
                    <dd className="mt-1 font-loft text-xl font-bold tabular-nums text-bluelagoon-midnight">
                      {agent.metrics.decisionsToday.toLocaleString()}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-bluelagoon-paper px-2 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                      Success rate
                    </dt>
                    <dd
                      className={`mt-1 font-loft text-xl font-bold tabular-nums ${ACCENT_TEXT[accent]}`}
                    >
                      {agent.metrics.successRatePct}%
                    </dd>
                  </div>
                  <div className="rounded-xl bg-bluelagoon-paper px-2 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                      p50 latency
                    </dt>
                    <dd className="mt-1 font-loft text-xl font-bold tabular-nums text-bluelagoon-midnight">
                      {formatLatency(agent.metrics.p50LatencyMs)}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                  Recent decisions
                </h3>
                <ul className="mt-3 space-y-2">
                  {agent.recentDecisions.map((d) => (
                    <li
                      key={`${d.time}-${d.action}`}
                      className="flex gap-3 rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2.5"
                    >
                      <span className="font-mono text-xs tabular-nums text-bluelagoon-muted">
                        {d.time}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-bluelagoon-midnight">
                          {d.action}
                        </p>
                        <p className="text-xs text-bluelagoon-ink/85">
                          {d.outcome}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-dashed border-bluelagoon-line p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                  Ownership
                </h3>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="font-semibold text-bluelagoon-midnight">
                      Owner:
                    </dt>
                    <dd className="text-bluelagoon-ink/85">{agent.owner}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-bluelagoon-midnight">
                      Escalation:
                    </dt>
                    <dd className="text-bluelagoon-ink/85">
                      {agent.escalation}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
