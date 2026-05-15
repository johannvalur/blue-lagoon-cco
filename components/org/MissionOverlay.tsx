"use client";

import { useEffect, useState } from "react";
import type { AccentColor } from "@/lib/data/orgChart";

export interface OverlayActiveAgent {
  id: string;
  agentId: string;
  accent: AccentColor;
  fallbackDeptId?: string;
}

export interface OverlayArc {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  fromAccent: AccentColor;
  toAccent: AccentColor;
  fromFallbackDeptId?: string;
  toFallbackDeptId?: string;
}

interface MissionOverlayProps {
  activeAgents: OverlayActiveAgent[];
  arcs: OverlayArc[];
}

const ACCENT_HEX: Record<AccentColor, string> = {
  crisp: "#54c0e8",
  boreal: "#91f5e1",
  golden: "#ffda00",
  fiery: "#ff47b3",
  volcanic: "#50e68c",
  lilac: "#be00ff",
  aurora: "#a2f1ba",
};

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function MissionOverlay({ activeAgents, arcs }: MissionOverlayProps) {
  const [agentRects, setAgentRects] = useState<Map<string, Rect>>(new Map());
  const [deptRects, setDeptRects] = useState<Map<string, Rect>>(new Map());

  useEffect(() => {
    let raf = 0;
    function measure() {
      const aMap = new Map<string, Rect>();
      document
        .querySelectorAll<HTMLElement>("[data-agent-id]")
        .forEach((el) => {
          const id = el.getAttribute("data-agent-id");
          if (id) {
            const r = el.getBoundingClientRect();
            aMap.set(id, {
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
            });
          }
        });
      const dMap = new Map<string, Rect>();
      document
        .querySelectorAll<HTMLElement>("[data-department-id]")
        .forEach((el) => {
          const id = el.getAttribute("data-department-id");
          if (id) {
            const r = el.getBoundingClientRect();
            dMap.set(id, {
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
            });
          }
        });
      setAgentRects(aMap);
      setDeptRects(dMap);
    }
    function schedule() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    }

    measure();

    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const interval = window.setInterval(measure, 500);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(interval);
    };
  }, []);

  function lookup(
    agentId: string,
    fallbackDeptId?: string,
  ): Rect | undefined {
    return agentRects.get(agentId) ?? (fallbackDeptId ? deptRects.get(fallbackDeptId) : undefined);
  }

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
      aria-hidden
    >
      {activeAgents.map((a) => {
        const rect = lookup(a.agentId, a.fallbackDeptId);
        if (!rect) return null;
        const color = ACCENT_HEX[a.accent];
        return (
          <rect
            key={a.id}
            x={rect.left - 4}
            y={rect.top - 4}
            width={rect.width + 8}
            height={rect.height + 8}
            rx={12}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            opacity={0.9}
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          >
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </rect>
        );
      })}

      {arcs.map((arc) => {
        const from = lookup(arc.fromAgentId, arc.fromFallbackDeptId);
        const to = lookup(arc.toAgentId, arc.toFallbackDeptId);
        if (!from || !to) return null;
        const x1 = from.left + from.width / 2;
        const y1 = from.top + from.height / 2;
        const x2 = to.left + to.width / 2;
        const y2 = to.top + to.height / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = -dy / dist;
        const ny = dx / dist;
        const offset = Math.min(80, dist * 0.22);
        const cx = (x1 + x2) / 2 + nx * offset;
        const cy = (y1 + y2) / 2 + ny * offset;
        const d = `M ${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}`;
        const color = ACCENT_HEX[arc.fromAccent];
        const targetColor = ACCENT_HEX[arc.toAccent];
        return (
          <g key={arc.id}>
            <path
              d={d}
              stroke={color}
              strokeWidth={2.5}
              fill="none"
              opacity={0.7}
              strokeDasharray="6 4"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-100"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            <circle
              r={5}
              fill={targetColor}
              style={{ filter: `drop-shadow(0 0 6px ${targetColor})` }}
            >
              <animateMotion dur="1.8s" repeatCount="1" path={d} />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
