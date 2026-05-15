"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="my-2 list-disc pl-5 space-y-1 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal pl-5 space-y-1 last:mb-0">{children}</ol>,
        li: ({ children }) => <li className="leading-snug">{children}</li>,
        h1: ({ children }) => <h2 className="font-loft font-bold text-base mt-3 first:mt-0 mb-1.5 text-bluelagoon-midnight">{children}</h2>,
        h2: ({ children }) => <h3 className="font-loft font-bold text-base mt-3 first:mt-0 mb-1.5 text-bluelagoon-midnight">{children}</h3>,
        h3: ({ children }) => <h4 className="font-loft font-semibold text-sm mt-2 first:mt-0 mb-1 text-bluelagoon-midnight">{children}</h4>,
        strong: ({ children }) => <strong className="font-semibold text-bluelagoon-midnight">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="rounded bg-bluelagoon-mist/60 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
        pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-lg bg-bluelagoon-mist/60 p-3 text-xs">{children}</pre>,
        blockquote: ({ children }) => <blockquote className="my-2 border-l-2 border-bluelagoon-crisp pl-3 text-bluelagoon-ink/85">{children}</blockquote>,
        table: ({ children }) => <table className="my-2 w-full border-collapse text-xs">{children}</table>,
        th: ({ children }) => <th className="border border-bluelagoon-line bg-bluelagoon-mist/40 px-2 py-1 text-left font-semibold">{children}</th>,
        td: ({ children }) => <td className="border border-bluelagoon-line px-2 py-1 align-top">{children}</td>,
        a: ({ href, children }) => <a href={href} className="text-bluelagoon-midnight underline underline-offset-2 hover:no-underline">{children}</a>,
        hr: () => <hr className="my-3 border-bluelagoon-line" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
