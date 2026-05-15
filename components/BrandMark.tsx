import Image from "next/image";

interface BrandMarkProps {
  height?: number;
  variant?: "navy" | "white";
  className?: string;
}

// Renders /public/bluelagoon-logo[-white].svg. For production, swap the asset
// in /public with the controlled file from Blue Lagoon's brand portal.
export function BrandMark({
  height = 22,
  variant = "navy",
  className,
}: BrandMarkProps) {
  const width = Math.round((391 / 76) * height);
  const src =
    variant === "white" ? "/bluelagoon-logo-white.svg" : "/bluelagoon-logo.svg";
  return (
    <Image
      src={src}
      alt="Blue Lagoon"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
