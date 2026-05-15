"use client";

import { AIRPORT_COORDS } from "@/lib/data/internal/airportCoords";

const VIEW_W = 800;
const VIEW_H = 460;
const LON_MIN = -130;
const LON_MAX = 25;
const LAT_MIN = 28;
const LAT_MAX = 70;

function project({ lat, lng }: { lat: number; lng: number }) {
  const x = ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * VIEW_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H;
  return { x, y };
}

// Simplified coastal polygons in [lng, lat] — rough silhouettes, not cartographic.
// Each polygon is a closed ring projected at render time.
const LAND_POLYGONS: Array<Array<[number, number]>> = [
  // Iceland
  [
    [-24.5, 63.4],
    [-22.7, 63.85],
    [-21.3, 63.85],
    [-19.0, 63.45],
    [-16.5, 63.4],
    [-13.5, 64.55],
    [-14.6, 65.7],
    [-16.5, 66.5],
    [-19.0, 66.55],
    [-20.5, 66.1],
    [-22.5, 66.45],
    [-23.7, 65.9],
    [-22.4, 65.1],
    [-24.5, 64.7],
    [-24.6, 64.0],
  ],
  // Great Britain
  [
    [-5.5, 50.0],
    [-3.0, 50.7],
    [0.5, 51.4],
    [1.6, 52.6],
    [-0.2, 53.6],
    [-1.5, 54.6],
    [-3.0, 55.5],
    [-2.0, 57.5],
    [-3.5, 58.6],
    [-5.5, 58.5],
    [-5.0, 56.7],
    [-5.5, 55.0],
    [-4.5, 53.4],
    [-5.5, 51.7],
  ],
  // Ireland
  [
    [-10.4, 51.5],
    [-8.0, 51.5],
    [-6.2, 52.2],
    [-6.0, 53.4],
    [-6.2, 54.4],
    [-7.6, 55.3],
    [-9.9, 54.3],
    [-10.4, 53.4],
    [-10.0, 52.3],
  ],
  // Iberia (Spain + Portugal mainland)
  [
    [-9.5, 36.8],
    [-7.4, 37.0],
    [-5.6, 36.0],
    [-2.0, 36.7],
    [0.7, 38.7],
    [3.3, 41.9],
    [3.0, 42.4],
    [-1.4, 43.4],
    [-4.0, 43.8],
    [-7.7, 43.8],
    [-9.3, 43.0],
    [-9.5, 41.0],
    [-8.9, 38.7],
    [-9.5, 37.5],
  ],
  // France + Low Countries (continental NW Europe west part)
  [
    [-1.6, 43.4],
    [3.1, 43.0],
    [7.5, 43.7],
    [7.7, 47.5],
    [8.2, 49.0],
    [6.4, 51.0],
    [4.2, 52.4],
    [3.4, 53.5],
    [6.7, 53.6],
    [8.5, 53.7],
    [8.0, 55.5],
    [10.5, 54.4],
    [9.4, 53.8],
    [8.0, 51.6],
    [7.5, 49.5],
    [5.0, 47.5],
    [-1.5, 47.5],
    [-4.7, 48.4],
    [-1.5, 49.5],
    [1.6, 50.9],
    [-1.0, 49.4],
    [-1.6, 46.0],
  ],
  // Scandinavia (Norway + Sweden + Denmark cluster)
  [
    [8.0, 58.0],
    [10.5, 58.4],
    [11.5, 56.0],
    [12.6, 55.4],
    [12.7, 56.3],
    [16.0, 56.2],
    [18.5, 57.8],
    [17.0, 60.7],
    [18.5, 63.5],
    [22.0, 65.8],
    [24.5, 68.0],
    [22.0, 70.0],
    [18.0, 69.6],
    [14.5, 68.0],
    [12.5, 65.5],
    [10.5, 63.4],
    [7.5, 62.4],
    [5.2, 60.4],
    [5.5, 59.0],
  ],
  // NE United States + SE Canada (very rough)
  [
    [-77.5, 34.5],
    [-75.5, 35.5],
    [-74.0, 39.5],
    [-71.5, 41.0],
    [-70.0, 42.0],
    [-70.5, 43.6],
    [-66.9, 44.8],
    [-64.0, 43.6],
    [-65.5, 45.3],
    [-61.0, 45.7],
    [-59.5, 46.8],
    [-60.0, 49.0],
    [-56.0, 51.4],
    [-58.0, 53.4],
    [-64.0, 56.5],
    [-68.0, 58.0],
    [-77.0, 56.0],
    [-79.0, 52.0],
    [-79.5, 46.0],
    [-83.0, 42.0],
    [-82.0, 38.5],
    [-78.0, 35.5],
  ],
  // S Greenland tip
  [
    [-50.0, 60.0],
    [-46.0, 60.2],
    [-43.5, 60.5],
    [-42.0, 61.5],
    [-44.0, 63.5],
    [-48.0, 64.0],
    [-52.0, 63.0],
    [-53.0, 61.5],
  ],
  // West Coast North America (very rough — just enough for SEA / DEN context)
  [
    [-124.5, 40.5],
    [-122.5, 41.0],
    [-122.7, 45.5],
    [-122.8, 47.5],
    [-122.5, 48.5],
    [-124.7, 48.4],
    [-125.0, 49.5],
    [-128.0, 51.5],
    [-130.0, 54.0],
    [-129.0, 55.5],
    [-126.0, 54.0],
    [-122.0, 49.0],
    [-118.0, 49.0],
    [-110.0, 49.0],
    [-100.0, 49.0],
    [-95.0, 49.0],
    [-95.0, 45.0],
    [-104.0, 41.0],
    [-114.0, 39.0],
    [-119.0, 38.0],
    [-122.5, 38.0],
  ],
];

function polygonToPath(ring: Array<[number, number]>) {
  const pts = ring.map(([lng, lat]) => project({ lat, lng }));
  return (
    "M " +
    pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ") +
    " Z"
  );
}

function arcPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const cx = (start.x + end.x) / 2;
  const cy = Math.min(start.y, end.y) - Math.abs(end.x - start.x) * 0.18 - 30;
  return {
    d: `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`,
    cx,
    cy,
  };
}

export interface RouteMapProps {
  disruptedFlights: Array<{
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

export function RouteMap({ disruptedFlights, recoveryPlan }: RouteMapProps) {
  const kef = AIRPORT_COORDS.KEF;
  const kefP = project(kef);

  // Graticule lines.
  const meridians: number[] = [];
  for (let lng = -120; lng <= 20; lng += 10) meridians.push(lng);
  const parallels: number[] = [];
  for (let lat = 30; lat <= 70; lat += 10) parallels.push(lat);

  // Resolve disrupted arcs (skip any unknown destinations).
  const arcs = disruptedFlights
    .map((f) => {
      const dest = AIRPORT_COORDS[f.destination];
      if (!dest) return null;
      const end = project(dest);
      const path = arcPath(kefP, end);
      return { flight: f.flight, dest: f.destination, end, ...path };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  // Recovery overlays — match swaps to disrupted arcs by flight code.
  const recoveryArcs = (recoveryPlan?.swaps ?? [])
    .map((s) => arcs.find((a) => a.flight === s.flight))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full"
      role="img"
      aria-label="North Atlantic route map"
    >
      <style>{`
        @keyframes routemap-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes routemap-fadein {
          0% { opacity: 0; }
          100% { opacity: 0.85; }
        }
        .routemap-disrupted-arc {
          animation: routemap-pulse 2s ease-in-out infinite;
        }
        .routemap-recovery-arc {
          animation: routemap-fadein 500ms ease-out forwards;
        }
      `}</style>

      {/* Backdrop */}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#f6f8fc" />

      {/* Graticule */}
      <g stroke="#e3e8f3" strokeWidth={0.5}>
        {meridians.map((lng) => {
          const top = project({ lat: LAT_MAX, lng });
          const bot = project({ lat: LAT_MIN, lng });
          return (
            <line
              key={`m-${lng}`}
              x1={top.x}
              y1={top.y}
              x2={bot.x}
              y2={bot.y}
            />
          );
        })}
        {parallels.map((lat) => {
          const left = project({ lat, lng: LON_MIN });
          const right = project({ lat, lng: LON_MAX });
          return (
            <line
              key={`p-${lat}`}
              x1={left.x}
              y1={left.y}
              x2={right.x}
              y2={right.y}
            />
          );
        })}
      </g>

      {/* Land */}
      <g fill="#dde4f1" stroke="#c5d0e6" strokeWidth={0.75}>
        {LAND_POLYGONS.map((ring, i) => (
          <path key={`land-${i}`} d={polygonToPath(ring)} />
        ))}
      </g>

      {/* Disrupted arcs */}
      <g fill="none" strokeLinecap="round">
        {arcs.map((a) => (
          <path
            key={`disrupt-${a.flight}`}
            className="routemap-disrupted-arc"
            d={a.d}
            stroke="#FF47B3"
            strokeWidth={2.5}
            aria-label={`${a.flight} KEF to ${a.dest} — disrupted`}
          />
        ))}
      </g>

      {/* Recovery overlays */}
      <g fill="none" strokeLinecap="round">
        {recoveryArcs.map((a) => (
          <path
            key={`recover-${a.flight}`}
            className="routemap-recovery-arc"
            d={a.d}
            stroke="#50E68C"
            strokeWidth={2}
            strokeDasharray="4 3"
            opacity={0.85}
            aria-label={`${a.flight} KEF to ${a.dest} — recovery plan`}
          />
        ))}
      </g>

      {/* Endpoint dots & labels */}
      <g>
        {arcs.map((a) => (
          <g key={`dot-${a.flight}`}>
            <circle cx={a.end.x} cy={a.end.y} r={4} fill="#FF47B3" />
            <text
              x={a.cx}
              y={a.cy + 4}
              textAnchor="middle"
              className="font-loft"
              fill="#001b71"
              fontSize="11"
              fontWeight="600"
            >
              {a.flight}
            </text>
            <text
              x={a.end.x}
              y={a.end.y + 16}
              textAnchor="middle"
              fill="#001b71"
              fontSize="10"
              fontWeight="600"
            >
              {a.dest}
            </text>
          </g>
        ))}
        {/* KEF dot + label, drawn last so it sits on top */}
        <circle cx={kefP.x} cy={kefP.y} r={4} fill="#001b71" />
        <text
          x={kefP.x + 8}
          y={kefP.y - 6}
          fill="#001b71"
          fontSize="11"
          fontWeight="700"
          className="font-loft"
        >
          KEF
        </text>
      </g>
    </svg>
  );
}
