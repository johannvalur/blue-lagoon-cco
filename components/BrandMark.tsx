interface BrandMarkProps {
  height?: number;
  variant?: "navy" | "white";
  className?: string;
}

const LOGO_RATIO = 481 / 85.79;

export function BrandMark({
  height = 32,
  variant = "navy",
  className,
}: BrandMarkProps) {
  const width = Math.round(LOGO_RATIO * height);
  const color =
    variant === "white" ? "#ffffff" : "var(--color-bluelagoon-midnight)";
  return (
    <span
      role="img"
      aria-label="Blue Lagoon"
      className={`inline-block ${className ?? ""}`}
      style={{
        width,
        height,
        backgroundColor: color,
        WebkitMaskImage: "url(/bluelagoon-logo.svg)",
        maskImage: "url(/bluelagoon-logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
