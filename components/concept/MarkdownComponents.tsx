import type { Components } from "react-markdown";

export const conceptMarkdownComponents: Components = {
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="my-8 border-l border-bluelagoon-midnight/40 pl-6 font-loft text-[1.05rem] italic leading-relaxed text-bluelagoon-ink/80 before:hidden after:hidden [&>p]:my-0 [&>p]:before:hidden [&>p]:after:hidden"
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      aria-hidden
      className="my-14 border-0 border-t border-bluelagoon-line"
    />
  ),
  table: ({ children }) => (
    <div className="my-10 overflow-hidden">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-bluelagoon-midnight/30 text-bluelagoon-midnight">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-3 text-left font-loft text-xs font-semibold tracking-tight">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-bluelagoon-line/70 px-3 py-4 align-top text-[15px] leading-relaxed text-bluelagoon-ink/85">
      {children}
    </td>
  ),
  tr: ({ children }) => <tr>{children}</tr>,
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mt-12 scroll-mt-28 font-loft text-xl font-semibold tracking-tight text-bluelagoon-midnight"
    >
      {children}
    </h3>
  ),
};
