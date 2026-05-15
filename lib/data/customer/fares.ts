export interface FareRule {
  id: string;
  name: string;
  description: string;
  changeFee: number;
  refundable: boolean;
  bagsIncluded: number;
  seatSelection: "free" | "paid";
  loungeAccess: boolean;
}

export const FARE_RULES: FareRule[] = [
  {
    id: "light",
    name: "Light",
    description: "Lowest fare. Cabin bag only. No changes.",
    changeFee: 0,
    refundable: false,
    bagsIncluded: 0,
    seatSelection: "paid",
    loungeAccess: false,
  },
  {
    id: "standard",
    name: "Standard",
    description: "One checked bag. Standard seat included.",
    changeFee: 50,
    refundable: false,
    bagsIncluded: 1,
    seatSelection: "free",
    loungeAccess: false,
  },
  {
    id: "flex",
    name: "Flex",
    description: "Free changes, premium seat, two bags.",
    changeFee: 0,
    refundable: true,
    bagsIncluded: 2,
    seatSelection: "free",
    loungeAccess: false,
  },
  {
    id: "saga",
    name: "Saga",
    description: "Lie-flat seat, fully flexible, lounge access, three bags.",
    changeFee: 0,
    refundable: true,
    bagsIncluded: 3,
    seatSelection: "free",
    loungeAccess: true,
  },
];

export function fareSummary(): string {
  return FARE_RULES.map(
    (f) =>
      `- ${f.name}: ${f.description} Bags: ${f.bagsIncluded}. Change fee: €${f.changeFee}. Refundable: ${f.refundable}. Lounge: ${f.loungeAccess}.`,
  ).join("\n");
}
