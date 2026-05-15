import Image from "next/image";

interface BrandMarkProps {
  height?: number;
  variant?: "navy" | "white";
  className?: string;
}

const LOGO_RATIO = 1000 / 447;

export function BrandMark({
  height = 32,
  variant = "navy",
  className,
}: BrandMarkProps) {
  const width = Math.round(LOGO_RATIO * height);
  const filter = variant === "white" ? "brightness(0) invert(1)" : undefined;
  return (
    <Image
      src="/bluelagoon-logo.png"
      alt="Blue Lagoon"
      width={width}
      height={height}
      priority
      className={className}
      style={filter ? { filter } : undefined}
    />
  );
}
