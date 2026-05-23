import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { ConceptHero } from "@/components/concept/ConceptHero";
import { ConceptTargets } from "@/components/concept/ConceptTargets";
import {
  ConceptTocBar,
  ConceptTocRail,
  type TocEntry,
} from "@/components/concept/ConceptToc";
import {
  SectionHeader,
  type SectionAccent,
} from "@/components/concept/SectionHeader";
import { PillarSection } from "@/components/concept/PillarSection";
import { RoadmapTimeline } from "@/components/concept/RoadmapTimeline";
import { conceptMarkdownComponents } from "@/components/concept/MarkdownComponents";

export const dynamic = "force-static";

interface SectionMeta {
  id: string;
  num: string;
  paddedNum: string;
  title: string;
  tocLabel: string;
  kicker: string;
  accent: SectionAccent;
  body: string;
}

interface PillarMeta {
  num: string;
  title: string;
}

const SECTION_META: Record<
  string,
  { kicker: string; tocLabel: string; accent: SectionAccent }
> = {
  "0": { kicker: "Summary", tocLabel: "Summary", accent: "aurora" },
  "1": { kicker: "Thesis", tocLabel: "Thesis", accent: "bright" },
  "2": { kicker: "Brand", tocLabel: "Brand", accent: "fiery" },
  "3": {
    kicker: "Four pillars",
    tocLabel: "Four pillars",
    accent: "midnight",
  },
  "4": {
    kicker: "Operating model",
    tocLabel: "Operating model",
    accent: "boreal",
  },
  "5": { kicker: "Roadmap", tocLabel: "Roadmap", accent: "golden" },
  "6": { kicker: "Risks", tocLabel: "Risks", accent: "fiery" },
  "7": { kicker: "Why now", tocLabel: "Why now", accent: "volcanic" },
};

const PILLARS: Record<string, PillarMeta> = {
  "3.1": { num: "3.1", title: "Conversational guest journey" },
  "3.2": { num: "3.2", title: "Facility operations copilot" },
  "3.3": { num: "3.3", title: "Ancillary revenue engine" },
  "3.4": { num: "3.4", title: "Internal copilots for every role" },
};

function parseSections(markdown: string): SectionMeta[] {
  // The doc starts with "# Title\n\n> blockquote\n\n---\n\n## 0. ..."
  // Slice past the first "\n## " marker so the first chunk has the same shape
  // as the rest (no leading "## "). split() on "\n## " then yields uniform chunks.
  const marker = "\n## ";
  const firstSectionIdx = markdown.indexOf(marker);
  if (firstSectionIdx === -1) return [];
  const trimmed = markdown.slice(firstSectionIdx + marker.length);

  const chunks = trimmed.split(/\n## /).filter((c) => c.trim().length > 0);

  return chunks
    .map((chunk) => {
      const headingMatch = chunk.match(/^(\d+)\.\s+(.+?)(?:\n|$)/);
      if (!headingMatch) return null;
      const num = headingMatch[1];
      const title = headingMatch[2].trim();
      const body = chunk.slice(headingMatch[0].length).replace(/^\n+/, "");
      // Strip a trailing horizontal rule + any blank lines (the `---` between sections).
      const cleaned = body.replace(/\n*---\s*$/, "").trimEnd();
      const meta = SECTION_META[num] ?? {
        kicker: "",
        tocLabel: title,
        accent: "aurora" as SectionAccent,
      };
      return {
        id: `section-${num}`,
        num,
        paddedNum: num.padStart(2, "0"),
        title,
        tocLabel: meta.tocLabel,
        kicker: meta.kicker,
        accent: meta.accent,
        body: cleaned,
      } satisfies SectionMeta;
    })
    .filter((s): s is SectionMeta => s !== null);
}

function parsePillars(body: string): {
  intro: string;
  pillars: { meta: PillarMeta; body: string }[];
} {
  // Body starts with an intro paragraph, then "### 3.1 Customer journey\n\n..."
  const firstPillarIdx = body.indexOf("\n### 3.");
  const intro = firstPillarIdx === -1 ? body : body.slice(0, firstPillarIdx);
  const rest = firstPillarIdx === -1 ? "" : body.slice(firstPillarIdx + 1);

  const chunks = rest.split(/\n### /).filter((c) => c.trim().length > 0);
  const pillars = chunks
    .map((chunk) => {
      const headingMatch = chunk.match(/^(3\.\d)\s+(.+?)(?:\n|$)/);
      if (!headingMatch) return null;
      const num = headingMatch[1];
      const meta = PILLARS[num];
      if (!meta) return null;
      const pillarBody = chunk.slice(headingMatch[0].length).replace(/^\n+/, "");
      return { meta, body: pillarBody.trimEnd() };
    })
    .filter((p): p is { meta: PillarMeta; body: string } => p !== null);

  return { intro: intro.trim(), pillars };
}

function parseRoadmap(body: string): { intro: string; closing: string } {
  // Intro is everything up to the first "### Year". Closing is everything after the last bullet list.
  const firstYearIdx = body.indexOf("\n### Year");
  const intro = firstYearIdx === -1 ? "" : body.slice(0, firstYearIdx).trim();

  // Closing paragraph starts at "The roadmap is deliberately"
  const closingMatch = body.match(/\n(The roadmap is deliberately[\s\S]*)$/);
  const closing = closingMatch ? closingMatch[1].trim() : "";

  return { intro, closing };
}

export default async function ConceptPage() {
  const filePath = path.join(process.cwd(), "strategy", "CONCEPT.md");
  const markdown = await fs.readFile(filePath, "utf-8");
  const sections = parseSections(markdown);

  const tocEntries: TocEntry[] = sections.map((s) => ({
    id: s.id,
    num: s.paddedNum,
    title: s.tocLabel,
    accent: s.accent,
  }));

  return (
    <>
      <Nav />
      <ConceptHero />
      <ConceptTargets />
      <main className="mx-auto max-w-7xl px-6 pb-24">
        <ConceptTocBar entries={tocEntries} />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <article
            className="prose prose-bluelagoon prose-lg max-w-none lg:col-span-9 prose-headings:font-loft prose-headings:tracking-tight prose-h3:text-xl prose-h3:font-bold prose-strong:text-bluelagoon-midnight prose-table:text-sm prose-th:font-semibold"
          >
            {sections.map((section) => {
              if (section.num === "3") {
                const { intro, pillars } = parsePillars(section.body);
                return (
                  <div key={section.id}>
                    <SectionHeader
                      id={section.id}
                      num={section.paddedNum}
                      title={section.title}
                      kicker={section.kicker}
                      accent={section.accent}
                    />
                    {intro && (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={conceptMarkdownComponents}
                      >
                        {intro}
                      </ReactMarkdown>
                    )}
                    <div className="not-prose">
                      {pillars.map((p) => (
                        <PillarSection
                          key={p.meta.num}
                          num={p.meta.num}
                          title={p.meta.title}
                        >
                          <div className="prose prose-bluelagoon prose-base max-w-none prose-headings:font-loft prose-strong:text-bluelagoon-midnight prose-p:leading-relaxed [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2 [&_li]:pl-1 [&_li::marker]:text-bluelagoon-muted [&_p]:my-4">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={conceptMarkdownComponents}
                            >
                              {p.body}
                            </ReactMarkdown>
                          </div>
                        </PillarSection>
                      ))}
                    </div>
                  </div>
                );
              }

              if (section.num === "5") {
                const { intro, closing } = parseRoadmap(section.body);
                return (
                  <div key={section.id}>
                    <SectionHeader
                      id={section.id}
                      num={section.paddedNum}
                      title={section.title}
                      kicker={section.kicker}
                      accent={section.accent}
                    />
                    {intro && (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={conceptMarkdownComponents}
                      >
                        {intro}
                      </ReactMarkdown>
                    )}
                    <div className="not-prose">
                      <RoadmapTimeline />
                    </div>
                    {closing && (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={conceptMarkdownComponents}
                      >
                        {closing}
                      </ReactMarkdown>
                    )}
                  </div>
                );
              }

              return (
                <div key={section.id}>
                  <SectionHeader
                    id={section.id}
                    num={section.paddedNum}
                    title={section.title}
                    kicker={section.kicker}
                    accent={section.accent}
                  />
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={conceptMarkdownComponents}
                  >
                    {section.body}
                  </ReactMarkdown>
                </div>
              );
            })}
          </article>

          <div className="lg:col-span-3">
            <ConceptTocRail entries={tocEntries} />
          </div>
        </div>
      </main>
    </>
  );
}
