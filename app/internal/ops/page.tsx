import { OpsDashboard } from "@/components/OpsDashboard";

export default function OpsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
          <span className="text-bluelagoon-midnight">Operations</span>
          <span className="text-bluelagoon-line"> · </span>scenario
        </p>
        <h1 className="mt-1 font-loft text-4xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-5xl">
          Operations Control Center
        </h1>
        <p className="mt-2 max-w-3xl text-bluelagoon-ink/85">
          The dashboard data is scripted — a representative IROPS event. The
          reasoning panel is generated live on the fly. Click &ldquo;Generate
          plan&rdquo; to see the AI propose recovery options and recommend one.
        </p>
      </div>
      <OpsDashboard />
    </div>
  );
}
