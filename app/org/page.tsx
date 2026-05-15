import { Suspense } from "react";
import { MissionTheatre } from "@/components/org/MissionTheatre";

export default function OrgPage() {
  return (
    <div className="space-y-12">
      <Suspense fallback={null}>
        <MissionTheatre />
      </Suspense>
      <p className="text-center text-xs text-bluelagoon-muted">
        Synthetic activity. AI proposes; humans dispose.
      </p>
    </div>
  );
}
