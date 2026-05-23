import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { StrategyHero } from "@/components/strategy/StrategyHero";
import { VisionSection } from "@/components/strategy/VisionSection";
import { PhasesPlan } from "@/components/strategy/PhasesPlan";
import { StructureSection } from "@/components/strategy/StructureSection";
import { KpiDashboard } from "@/components/strategy/KpiDashboard";
import { CultureSection } from "@/components/strategy/CultureSection";
import { SalesPricingSection } from "@/components/strategy/SalesPricingSection";
import { RisksSection } from "@/components/strategy/RisksSection";
import { ClosingSection } from "@/components/strategy/ClosingSection";
import { StrategyTocBar } from "@/components/strategy/StrategyToc";

export const metadata: Metadata = {
  title: "Strategic Commercial Plan · Bláa Lónið",
  description:
    "A 24-month CCO commercial plan for Bláa Lónið — listen, build, lead. Phased strategy, organisation, KPIs, culture, sales, pricing, and risk mitigation.",
};

export const dynamic = "force-static";

export default function StrategyPage() {
  return (
    <>
      <Nav />
      <StrategyHero />
      <StrategyTocBar />
      <VisionSection />
      <PhasesPlan />
      <StructureSection />
      <KpiDashboard />
      <CultureSection />
      <SalesPricingSection />
      <RisksSection />
      <ClosingSection />
    </>
  );
}
