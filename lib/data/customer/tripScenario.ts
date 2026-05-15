import { SCENARIO } from "@/lib/data/internal/opsScenario";

const FI617 = SCENARIO.disruptedFlights.find((f) => f.flight === "FI617");

if (!FI617) {
  throw new Error(
    "tripScenario expects FI617 to exist in the ops scenario; aircraft data drifted.",
  );
}

export interface TravelerTrip {
  bookingRef: string;
  passengerName: string;
  flight: string;
  registration: string;
  aircraftType: string;
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  schedDep: string;
  schedDepLocal: string;
  fareClass: "light" | "standard" | "flex" | "saga";
  seat: string;
  durationHrs: number;
  returnDate: string;
}

export const TRAVELER_TRIP: TravelerTrip = {
  bookingRef: "ICK7M2QX",
  passengerName: "you",
  flight: FI617.flight,
  registration: FI617.registration,
  aircraftType: FI617.type,
  origin: FI617.origin,
  originName: "Keflavík",
  destination: FI617.destination,
  destinationName: "Boston",
  schedDep: FI617.schedDep,
  schedDepLocal: "0735 KEF · 0635 BOS",
  fareClass: "standard",
  seat: "14C",
  durationHrs: 5.75,
  returnDate: "+6 days",
};

export interface DisruptionOption {
  id: "stay" | "rebook" | "credit";
  label: string;
  detail: string;
  consequence: string;
  recommended?: boolean;
}

export interface DisruptionBrief {
  cause: string;
  causeDetail: string;
  riskMinutes: number;
  options: DisruptionOption[];
}

export const FOG_DISRUPTION: DisruptionBrief = {
  cause: "KEF fog",
  causeDetail:
    "Visibility at Keflavík dropped below CAT II minima at 0540z; forecast clears 0820z.",
  riskMinutes: 90,
  options: [
    {
      id: "stay",
      label: "Stay on FI617",
      detail: "Most likely outcome: depart 0905z once visibility lifts.",
      consequence: "Arrive BOS 0805 local instead of 0635.",
    },
    {
      id: "rebook",
      label: "Rebook to FI619 at 1100z",
      detail: "Same aircraft type, same Saga cabin availability.",
      consequence: "Arrive BOS 0945 local. Adds 3h to your day.",
      recommended: true,
    },
    {
      id: "credit",
      label: "Take a Saga Club credit and stay home",
      detail: "Full fare returned to Saga Club account; no fee.",
      consequence: "Rebook anytime in the next 12 months.",
    },
  ],
};
