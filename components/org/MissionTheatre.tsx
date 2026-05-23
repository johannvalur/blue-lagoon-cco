"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrgExplorer } from "@/components/OrgExplorer";
import {
  ORG_CHART,
  ORG_METRICS,
  ACCENT_TEXT,
  ACCENT_BORDER_LEFT,
  ACCENT_DOT_BG,
  type AccentColor,
} from "@/lib/data/orgChart";
import { MissionComposer } from "./MissionComposer";
import {
  MissionOverlay,
  type OverlayActiveAgent,
  type OverlayArc,
} from "./MissionOverlay";
import { HitlApprovalCard, type HitlDecision } from "./HitlApprovalCard";
import { readNdjsonStream } from "@/lib/util/ndjsonStream";
import type {
  ActivateAgentResult,
  HandoffResult,
  RequestHumanResult,
  CompleteMissionResult,
} from "@/lib/tools/missionTools";
import {
  FALLBACK_MISSION,
  type FallbackEvent,
} from "@/lib/data/missionFallback";

type Status = "idle" | "streaming" | "paused" | "done" | "error";

type MissionEvent =
  | { id: string; at: number; kind: "activate"; data: ActivateAgentResult }
  | { id: string; at: number; kind: "handoff"; data: HandoffResult }
  | { id: string; at: number; kind: "request_human"; data: RequestHumanResult }
  | { id: string; at: number; kind: "complete"; data: CompleteMissionResult };

const HALO_MS = 3500;
const ARC_MS = 2200;
const HUMAN_HALO_MS = 60_000;

const LIVE_EXAMPLES = [
  "Pump 2 of the silica filtration cycle is showing elevated vibration — plan the swap.",
  "A coach of 38 walk-in guests just arrived unannounced — fit them into today's waves.",
  "The Mineral line moisturiser is selling out of stores 9 days before reorder. What now?",
];

interface WireEvent {
  type?: string;
  name?: string;
  tool_use_id?: string;
  result?: unknown;
  paused?: boolean;
  transcript?: unknown;
  missionId?: string;
  error?: string;
}

export function MissionTheatre() {
  const searchParams = useSearchParams();
  // Use a dedicated param so we don't collide with the global ?demo=fallback guided tour.
  const isFallback = searchParams?.get("mission") === "fallback";

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<MissionEvent[]>([]);
  const [awaitingHuman, setAwaitingHuman] = useState<RequestHumanResult | null>(
    null,
  );
  const [cardMinimized, setCardMinimized] = useState(false);
  const [activeAgents, setActiveAgents] = useState<OverlayActiveAgent[]>([]);
  const [arcs, setArcs] = useState<OverlayArc[]>([]);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<unknown[] | null>(null);
  const [finalSummary, setFinalSummary] =
    useState<CompleteMissionResult | null>(null);

  const fallbackIdxRef = useRef(0);
  const fallbackTimerRef = useRef<number | null>(null);
  const expirationTimers = useRef<Set<number>>(new Set());

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      for (const t of expirationTimers.current) window.clearTimeout(t);
    };
  }, []);

  function addActiveAgent(active: OverlayActiveAgent, ms = HALO_MS) {
    setActiveAgents((prev) => [...prev.filter((a) => a.id !== active.id), active]);
    const t = window.setTimeout(() => {
      setActiveAgents((prev) => prev.filter((a) => a.id !== active.id));
      expirationTimers.current.delete(t);
    }, ms);
    expirationTimers.current.add(t);
  }

  function addArc(arc: OverlayArc, ms = ARC_MS) {
    setArcs((prev) => [...prev, arc]);
    const t = window.setTimeout(() => {
      setArcs((prev) => prev.filter((a) => a.id !== arc.id));
      expirationTimers.current.delete(t);
    }, ms);
    expirationTimers.current.add(t);
  }

  function scrollAgentIntoView(agentId: string, deptId?: string) {
    const el =
      document.querySelector<HTMLElement>(`[data-agent-id="${agentId}"]`) ??
      (deptId
        ? document.querySelector<HTMLElement>(`[data-department-id="${deptId}"]`)
        : null);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleWireEvent(raw: unknown) {
    if (!raw || typeof raw !== "object") return;
    const e = raw as WireEvent;

    if (e.type === "tool_result") {
      const name = e.name;
      const toolUseId = e.tool_use_id ?? "";
      const id = `${name}-${toolUseId}-${Date.now()}`;

      if (name === "activate_agent") {
        const r = e.result as ActivateAgentResult;
        addActiveAgent({
          id: `active-${toolUseId}`,
          agentId: r.agentId,
          accent: r.accent,
          fallbackDeptId: r.departmentId,
        });
        scrollAgentIntoView(r.agentId, r.departmentId);
        setEvents((prev) => [
          ...prev,
          { id, at: Date.now(), kind: "activate", data: r },
        ]);
      } else if (name === "handoff") {
        const r = e.result as HandoffResult;
        addArc({
          id: `arc-${toolUseId}`,
          fromAgentId: r.fromAgentId,
          toAgentId: r.toAgentId,
          fromAccent: r.fromAccent,
          toAccent: r.toAccent,
        });
        setEvents((prev) => [
          ...prev,
          { id, at: Date.now(), kind: "handoff", data: r },
        ]);
      } else if (name === "request_human") {
        const r = e.result as RequestHumanResult;
        setAwaitingHuman(r);
        setCardMinimized(false);
        addActiveAgent(
          {
            id: `human-${r.toolUseId}`,
            agentId: r.ownerAgentId,
            accent: r.ownerAccent,
            fallbackDeptId: r.ownerDepartmentId,
          },
          HUMAN_HALO_MS,
        );
        scrollAgentIntoView(r.ownerAgentId, r.ownerDepartmentId);
        setEvents((prev) => [
          ...prev,
          { id, at: Date.now(), kind: "request_human", data: r },
        ]);
      } else if (name === "complete_mission") {
        const r = e.result as CompleteMissionResult;
        setFinalSummary(r);
        setEvents((prev) => [
          ...prev,
          { id, at: Date.now(), kind: "complete", data: r },
        ]);
        setStatus("done");
      }
    } else if (e.type === "done") {
      if (e.paused) {
        setTranscript((e.transcript as unknown[]) ?? null);
        if (e.missionId) setMissionId(e.missionId);
        setStatus("paused");
      } else {
        setStatus((prev) => (prev === "paused" ? prev : "done"));
      }
    } else if (e.type === "error") {
      setError(e.error ?? "Unknown error.");
      setStatus("error");
    }
    // tool_use_start and text events are intentionally ignored — the rich payload arrives via tool_result.
  }

  async function startLive(prompt: string, mid: string) {
    setStatus("streaming");
    setError(null);
    const res = await fetch("/api/org/mission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "start", missionId: mid, mission: prompt }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }
    await readNdjsonStream(res, handleWireEvent);
  }

  function startFallback() {
    setStatus("streaming");
    setError(null);
    fallbackIdxRef.current = 0;
    playNextFallback();
  }

  function playNextFallback() {
    const idx = fallbackIdxRef.current;
    const list: FallbackEvent[] = FALLBACK_MISSION.events;
    if (idx >= list.length) {
      setStatus((prev) => (prev === "paused" ? prev : "done"));
      return;
    }
    const ev = list[idx];
    if (ev.type === "tool_result" && ev.name === "request_human") {
      // Halt — wait for HITL decision
      handleWireEvent(ev);
      return;
    }
    handleWireEvent(ev);
    fallbackIdxRef.current = idx + 1;
    fallbackTimerRef.current = window.setTimeout(playNextFallback, 1500);
  }

  function startMission(prompt: string) {
    if (status === "streaming" || status === "paused") return;
    setEvents([]);
    setActiveAgents([]);
    setArcs([]);
    setAwaitingHuman(null);
    setTranscript(null);
    setFinalSummary(null);
    setError(null);

    const mid = `m-${Date.now().toString(36)}`;
    setMissionId(mid);

    if (isFallback) {
      startFallback();
    } else {
      startLive(prompt, mid).catch((err) => {
        setError(err instanceof Error ? err.message : "Mission failed.");
        setStatus("error");
      });
    }
  }

  function cancelMission() {
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setStatus("idle");
    setEvents([]);
    setActiveAgents([]);
    setArcs([]);
    setAwaitingHuman(null);
    setTranscript(null);
    setFinalSummary(null);
    setError(null);
  }

  function handleHitlDecision(decision: HitlDecision) {
    const owner = awaitingHuman;
    setAwaitingHuman(null);
    setCardMinimized(false);
    if (owner) {
      setActiveAgents((prev) =>
        prev.filter((a) => a.id !== `human-${owner.toolUseId}`),
      );
    }

    if (isFallback) {
      fallbackIdxRef.current += 1;
      fallbackTimerRef.current = window.setTimeout(playNextFallback, 800);
      setStatus("streaming");
      return;
    }

    if (!transcript || !missionId) {
      setStatus("done");
      return;
    }

    setStatus("streaming");
    fetch("/api/org/mission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "resume",
        missionId,
        transcript,
        decision,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Resume failed (${res.status})`);
        return readNdjsonStream(res, handleWireEvent);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Resume failed.");
        setStatus("error");
      });
  }

  return (
    <>
      <div className="space-y-6">
        <MissionComposer
          onSubmit={startMission}
          onCancel={cancelMission}
          isStreaming={status === "streaming"}
          isPaused={status === "paused"}
          hasMission={status !== "idle"}
          examples={isFallback ? [FALLBACK_MISSION.prompt] : LIVE_EXAMPLES}
        />

        {error && (
          <div className="rounded-xl border border-bluelagoon-fiery/60 bg-bluelagoon-fiery/10 px-4 py-3 text-sm text-bluelagoon-fiery">
            {error}
          </div>
        )}

        <OrgExplorer chart={ORG_CHART} metrics={ORG_METRICS} />

        {finalSummary && <MissionSummaryBanner summary={finalSummary} />}
      </div>

      <MissionTicker events={events} status={status} />

      <MissionOverlay activeAgents={activeAgents} arcs={arcs} />

      {awaitingHuman && !cardMinimized && (
        <HitlApprovalCard
          request={awaitingHuman}
          onDecide={handleHitlDecision}
          onDismiss={() => setCardMinimized(true)}
        />
      )}

      {awaitingHuman && cardMinimized && (
        <button
          type="button"
          onClick={() => setCardMinimized(false)}
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-bluelagoon-paper px-4 py-2.5 text-sm font-semibold text-bluelagoon-midnight shadow-2xl border-l-4 ${ACCENT_BORDER_LEFT[awaitingHuman.ownerAccent]}`}
        >
          <span
            className={`pulse-soft h-2 w-2 rounded-full ${ACCENT_DOT_BG[awaitingHuman.ownerAccent]}`}
            aria-hidden
          />
          Decision pending — {awaitingHuman.ownerName}
        </button>
      )}
    </>
  );
}

function MissionTicker({
  events,
  status,
}: {
  events: MissionEvent[];
  status: Status;
}) {
  if (status === "idle" || events.length === 0) return null;
  // Show last 3 events, newest first
  const recent = events.slice(-3).reverse();

  return (
    <aside className="pointer-events-none fixed bottom-6 left-6 z-30 flex w-full max-w-sm flex-col gap-2">
      {recent.map((ev) => (
        <TickerCard key={ev.id} event={ev} />
      ))}
    </aside>
  );
}

function TickerCard({ event }: { event: MissionEvent }) {
  if (event.kind === "activate") {
    const r = event.data;
    return (
      <div
        className={`pointer-events-auto rounded-xl border-l-4 ${ACCENT_BORDER_LEFT[r.accent]} surface-card px-3 py-2.5 text-xs`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
          {r.departmentName}
        </p>
        <p
          className={`mt-0.5 font-loft text-sm font-bold text-bluelagoon-midnight`}
        >
          {r.agentName}
          <span className={`ml-2 text-[10px] ${ACCENT_TEXT[r.accent]}`}>
            {r.agentKind.toUpperCase()}
          </span>
        </p>
        <p className="mt-1 leading-snug text-bluelagoon-ink/85">{r.thinking}</p>
        <p className="mt-1 text-[11px] text-bluelagoon-muted">
          → {r.proposedAction}
        </p>
      </div>
    );
  }
  if (event.kind === "handoff") {
    const r = event.data;
    return (
      <div className="pointer-events-auto rounded-xl border border-bluelagoon-line bg-bluelagoon-cloud/90 px-3 py-2 text-xs">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
          Handoff
        </p>
        <p className="mt-0.5 text-bluelagoon-ink">
          <span className="font-semibold text-bluelagoon-midnight">
            {r.fromAgentName}
          </span>{" "}
          →{" "}
          <span className="font-semibold text-bluelagoon-midnight">
            {r.toAgentName}
          </span>
        </p>
        <p className="mt-0.5 text-[11px] text-bluelagoon-muted">{r.reason}</p>
      </div>
    );
  }
  if (event.kind === "request_human") {
    const r = event.data;
    return (
      <div
        className={`pointer-events-auto rounded-xl border-l-4 ${ACCENT_BORDER_LEFT[r.ownerAccent]} surface-card px-3 py-2.5 text-xs`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
          Awaiting decision
        </p>
        <p className="mt-0.5 font-loft text-sm font-bold text-bluelagoon-midnight">
          {r.ownerName}
        </p>
        <p className="mt-1 leading-snug text-bluelagoon-ink/85">{r.question}</p>
      </div>
    );
  }
  // complete
  const r = event.data;
  return (
    <div className="pointer-events-auto rounded-xl border border-bluelagoon-volcanic/60 bg-bluelagoon-volcanic/10 px-3 py-2.5 text-xs">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
        Mission {r.outcome}
      </p>
      <p className="mt-1 leading-snug text-bluelagoon-ink">{r.summary}</p>
    </div>
  );
}

function MissionSummaryBanner({ summary }: { summary: CompleteMissionResult }) {
  const accent: AccentColor =
    summary.outcome === "resolved"
      ? "volcanic"
      : summary.outcome === "escalated"
        ? "golden"
        : "fiery";
  return (
    <section
      className={`surface-card rounded-2xl border-l-4 ${ACCENT_BORDER_LEFT[accent]} p-5`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        Mission · {summary.outcome}
      </p>
      <h3 className="mt-1 font-loft text-lg font-bold text-bluelagoon-midnight">
        {summary.summary}
      </h3>
      <p className="mt-2 text-xs text-bluelagoon-muted">
        Agents: {summary.agentsInvolved.join(", ")}
      </p>
    </section>
  );
}
