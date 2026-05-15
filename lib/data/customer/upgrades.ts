export interface UpgradeOffer {
  id: string;
  flight: string;
  fromFareClass: "light" | "standard" | "flex";
  toFareClass: "saga";
  priceEUR: number;
  inclusions: string[];
  context: string;
}

export const AVAILABLE_UPGRADE: UpgradeOffer = {
  id: "saga-fi617",
  flight: "FI617",
  fromFareClass: "standard",
  toFareClass: "saga",
  priceEUR: 180,
  inclusions: [
    "Saga Lounge at KEF (hot shower included)",
    "Lie-flat seat for the 5h45 westbound",
    "Two checked bags, priority boarding",
    "À la carte dining, full bar",
  ],
  context:
    "User is in a Standard fare on a 5h45 daytime westbound. Saga is the only way to actually sleep on this leg.",
};
