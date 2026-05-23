export default function imageLoader({ src }: { src: string; width?: number; quality?: number }) {
  // Remote images are returned as-is
  if (src.startsWith("http")) return src;
  // Local images get the base path prepended for static (GitHub Pages) exports
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src}`;
}
