interface Target {
  category: string;
  value: string;
  detail: string;
  horizon: string;
}

const TARGETS: Target[] = [
  {
    category: "Customer",
    value: "+20",
    detail: "NPS point swing",
    horizon: "within 24 months",
  },
  {
    category: "Operations",
    value: "−30%",
    detail: "IROPS recovery time",
    horizon: "within 18 months",
  },
  {
    category: "Commercial",
    value: "+10%",
    detail: "RASK lift",
    horizon: "within 24 months",
  },
  {
    category: "Internal",
    value: "+15",
    detail: "Employee NPS swing",
    horizon: "within 18 months",
  },
];

export function ConceptTargets() {
  return (
    <section className="border-b border-bluelagoon-line bg-bluelagoon-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
              Targets
            </p>
            <h2 className="mt-3 font-loft text-2xl font-bold leading-tight tracking-tight text-bluelagoon-midnight md:text-[1.75rem]">
              What success looks like.
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-bluelagoon-ink/75">
              Four numbers we hold ourselves to. Measured against the
              Blue Lagoon baseline at the time of writing.
            </p>
          </div>

          <ol className="md:col-span-8 grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4">
            {TARGETS.map((t) => (
              <li key={t.category} className="flex flex-col">
                <p className="font-loft text-xs font-semibold tracking-tight text-bluelagoon-muted">
                  {t.category}
                </p>
                <p className="mt-4 font-loft text-5xl font-bold leading-none tracking-tight text-bluelagoon-midnight md:text-[3.25rem]">
                  {t.value}
                </p>
                <p className="mt-4 text-[15px] leading-snug text-bluelagoon-ink">
                  {t.detail}
                </p>
                <p className="mt-1 text-xs text-bluelagoon-muted">
                  {t.horizon}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
