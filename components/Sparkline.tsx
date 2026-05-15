import { ACCENT_TEXT, type AccentColor } from "@/lib/data/orgChart";

interface SparklineProps {
  values: number[];
  accent: AccentColor;
  width?: number;
  height?: number;
  ariaLabel?: string;
}

export function Sparkline({
  values,
  accent,
  width = 220,
  height = 44,
  ariaLabel,
}: SparklineProps) {
  if (values.length === 0) return null;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const padX = 2;
  const padY = 3;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = values
    .map((v, i) => {
      const x = padX + (i * innerW) / Math.max(values.length - 1, 1);
      const y = padY + innerH - ((v - min) / span) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints =
    `${padX},${padY + innerH} ` + points + ` ${padX + innerW},${padY + innerH}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel ?? "24-hour activity sparkline"}
      className={`${ACCENT_TEXT[accent]} overflow-visible`}
    >
      <polyline
        points={areaPoints}
        fill="currentColor"
        stroke="none"
        opacity={0.18}
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
