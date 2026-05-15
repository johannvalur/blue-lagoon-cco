"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACCENT_BORDER_LEFT,
  ACCENT_DOT_BG,
  ACCENT_TEXT,
} from "@/lib/data/orgChart";
import type { RequestHumanResult } from "@/lib/tools/missionTools";

export interface HitlDecision {
  tool_use_id: string;
  verdict: "approve" | "reject" | "redirect";
  comment?: string;
}

interface HitlApprovalCardProps {
  request: RequestHumanResult;
  onDecide: (decision: HitlDecision) => void;
  onDismiss: () => void;
}

function verdictFromLabel(label: string): HitlDecision["verdict"] {
  const l = label.toLowerCase();
  if (l.includes("approve")) return "approve";
  if (l.includes("reject") || l.includes("block") || l.includes("deny"))
    return "reject";
  return "redirect";
}

export function HitlApprovalCard({
  request,
  onDecide,
  onDismiss,
}: HitlApprovalCardProps) {
  const [comment, setComment] = useState("");
  const submitted = useRef(false);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    window.addEventListener("keydown", onKey);
    firstButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  function decide(label: string) {
    if (submitted.current) return;
    submitted.current = true;
    onDecide({
      tool_use_id: request.toolUseId,
      verdict: verdictFromLabel(label),
      comment: comment.trim() || label,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hitl-card-title"
    >
      <div
        className="absolute inset-0 bg-bluelagoon-midnight/30 backdrop-blur-sm"
        onClick={onDismiss}
      />
      <div
        className={`relative w-full max-w-lg rounded-2xl bg-bluelagoon-paper p-6 shadow-2xl border-l-4 ${ACCENT_BORDER_LEFT[request.ownerAccent]}`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`pulse-soft mt-1.5 h-2 w-2 flex-none rounded-full ${ACCENT_DOT_BG[request.ownerAccent]}`}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Decision needed
            </p>
            <h2
              id="hitl-card-title"
              className="mt-1 font-loft text-xl font-bold text-bluelagoon-midnight"
            >
              {request.ownerName}
            </h2>
            {request.ownerRole && (
              <p className={`text-xs ${ACCENT_TEXT[request.ownerAccent]}`}>
                {request.ownerRole}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-bluelagoon-ink">
          {request.question}
        </p>

        <label className="mt-4 block">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Comment (optional)
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="Add context, conditions, or a redirect…"
            className="mt-1 w-full resize-none rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-sm text-bluelagoon-ink placeholder-bluelagoon-muted/80 outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {request.options.map((opt, i) => {
            const verdict = verdictFromLabel(opt);
            const cls =
              verdict === "approve"
                ? "btn-primary"
                : verdict === "reject"
                  ? "rounded-full border border-bluelagoon-fiery/60 bg-bluelagoon-fiery/10 px-4 py-2 text-sm font-semibold text-bluelagoon-fiery transition hover:bg-bluelagoon-fiery/20"
                  : "btn-secondary px-4 py-2 text-sm font-semibold";
            return (
              <button
                key={opt}
                ref={i === 0 ? firstButtonRef : null}
                type="button"
                onClick={() => decide(opt)}
                className={
                  verdict === "approve"
                    ? `${cls} px-5 py-2 text-sm font-semibold`
                    : cls
                }
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
