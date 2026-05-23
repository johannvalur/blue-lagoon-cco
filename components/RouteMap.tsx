"use client";

// Was an Atlantic route map for airline ops. Now renders a simple
// "where you'll be" map of the Blue Lagoon site: the main lagoon, the
// two hotels, the three restaurants, the mask bar. The component still
// accepts the old props for back-compat with OpsDashboard until that
// surface is rewritten by its agent — they're ignored here.

export interface RouteMapProps {
  // Vestigial — kept so OpsDashboard's existing call site still compiles.
  disruptedFlights?: Array<{
    flight: string;
    origin: string;
    destination: string;
  }>;
  recoveryPlan?: {
    swaps: Array<{
      flight: string;
      newAircraft?: string;
      rebookFlight?: string;
    }>;
  };
}

interface MapPoint {
  id: string;
  label: string;
  x: number; // 0-100, percent of viewBox width
  y: number; // 0-100
  kind: "lagoon" | "hotel" | "dining" | "spa";
  accent?: boolean;
}

const POINTS: MapPoint[] = [
  // Main lagoon — the centrepiece, slightly off-centre to give the
  // surrounding amenities room to breathe.
  {
    id: "lagoon",
    label: "Main lagoon",
    x: 48,
    y: 50,
    kind: "lagoon",
    accent: true,
  },
  {
    id: "mask-bar",
    label: "Mask bar",
    x: 55,
    y: 44,
    kind: "spa",
  },
  // On-site hotels
  {
    id: "silica",
    label: "Silica Hotel",
    x: 22,
    y: 26,
    kind: "hotel",
  },
  {
    id: "retreat",
    label: "The Retreat",
    x: 70,
    y: 30,
    kind: "hotel",
  },
  // Restaurants
  {
    id: "lava",
    label: "Lava",
    x: 38,
    y: 70,
    kind: "dining",
  },
  {
    id: "moss",
    label: "Moss",
    x: 75,
    y: 38,
    kind: "dining",
  },
  {
    id: "spa-restaurant",
    label: "Spa Restaurant",
    x: 28,
    y: 58,
    kind: "dining",
  },
];

const COLORS = {
  lagoon: "#7CC7E8",
  lagoonStroke: "#3FA0CC",
  hotel: "#001b71",
  dining: "#E59A3A",
  spa: "#7B5BBA",
  text: "#001b71",
  muted: "#6B7593",
  paper: "#F6F8FC",
};

export function RouteMap(_props: RouteMapProps) {
  return (
    <svg
      viewBox="0 0 600 360"
      className="h-auto w-full"
      role="img"
      aria-label="Blue Lagoon site map"
    >
      <rect x={0} y={0} width={600} height={360} fill={COLORS.paper} />

      {/* The lagoon — an organic blue shape under the markers. */}
      <g>
        <path
          d="M 180 130
             C 220 90, 320 100, 380 130
             C 440 160, 460 220, 410 250
             C 360 280, 280 280, 220 260
             C 160 240, 140 170, 180 130 Z"
          fill={COLORS.lagoon}
          fillOpacity={0.55}
          stroke={COLORS.lagoonStroke}
          strokeWidth={1.5}
        />
        {/* Inner highlight, suggesting steam / shallow areas */}
        <path
          d="M 240 150
             C 270 130, 340 140, 370 170
             C 400 200, 380 220, 340 220
             C 280 220, 230 200, 240 150 Z"
          fill="white"
          fillOpacity={0.25}
        />
      </g>

      {/* Lava-stone fringe — a few darker patches at the edge */}
      <g fill="#A4A8B1" fillOpacity={0.35}>
        <ellipse cx={150} cy={210} rx={32} ry={18} />
        <ellipse cx={450} cy={120} rx={28} ry={14} />
        <ellipse cx={440} cy={290} rx={36} ry={16} />
        <ellipse cx={160} cy={120} rx={22} ry={12} />
      </g>

      {/* Markers */}
      <g>
        {POINTS.map((pt) => {
          const cx = (pt.x / 100) * 600;
          const cy = (pt.y / 100) * 360;
          const fill =
            pt.kind === "lagoon"
              ? COLORS.lagoonStroke
              : pt.kind === "hotel"
                ? COLORS.hotel
                : pt.kind === "dining"
                  ? COLORS.dining
                  : COLORS.spa;
          const r = pt.kind === "lagoon" ? 7 : 5;
          return (
            <g key={pt.id}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={cx + (pt.x > 50 ? 10 : -10)}
                y={cy + (pt.y > 50 ? 18 : -10)}
                textAnchor={pt.x > 50 ? "start" : "end"}
                fill={COLORS.text}
                fontSize={pt.kind === "lagoon" ? 13 : 11}
                fontWeight={pt.kind === "lagoon" ? 700 : 600}
                className="font-loft"
              >
                {pt.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Legend */}
      <g transform="translate(20, 320)" fontSize={11} fill={COLORS.muted}>
        <circle cx={6} cy={0} r={4} fill={COLORS.hotel} />
        <text x={16} y={3}>
          Hotels
        </text>
        <circle cx={90} cy={0} r={4} fill={COLORS.dining} />
        <text x={100} y={3}>
          Dining
        </text>
        <circle cx={170} cy={0} r={4} fill={COLORS.spa} />
        <text x={180} y={3}>
          Treatments
        </text>
      </g>
    </svg>
  );
}
