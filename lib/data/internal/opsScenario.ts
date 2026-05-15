export interface DisruptedFlight {
  flight: string;
  registration: string;
  type: string;
  origin: string;
  destination: string;
  schedDep: string;
  pax: number;
  saga: number;
  crewIds: string[];
}

export interface AffectedCrew {
  id: string;
  role: "CPT" | "FO" | "SCCM" | "CC";
  name: string;
  hoursRemainingToday: number;
  baseStation: string;
}

export interface AvailableAircraft {
  registration: string;
  type: string;
  location: string;
  availableFrom: string;
  notes: string;
}

export interface OpsEvent {
  id: string;
  severity: "major" | "moderate" | "minor";
  title: string;
  time: string;
  location: string;
  summary: string;
}

export const EVENTS: OpsEvent[] = [
  {
    id: "kef-fog",
    severity: "major",
    title: "KEF dense fog event — 0540z to 0820z",
    time: "0612z",
    location: "KEF",
    summary:
      "Visibility at KEF below CAT II minima. Four westbound rotations at risk; standby crew partially committed to a separate medical diversion from yesterday.",
  },
  {
    id: "tf-isj-mel",
    severity: "moderate",
    title: "TF-ISJ hydraulic pump 2 indication",
    time: "0558z",
    location: "KEF",
    summary:
      "Line maintenance investigating; MEL deferral pending. FI318 (KEF→AMS, 1145z) at risk if not signed off by 1030z.",
  },
  {
    id: "fi330-medical",
    severity: "moderate",
    title: "FI330 LHR→KEF medical diversion",
    time: "0608z",
    location: "in-flight",
    summary:
      "Cabin medical event. Crew requesting diversion to GLA. Coordinating with GLA handling and onward repositioning of 174 pax.",
  },
  {
    id: "cdg-slot",
    severity: "minor",
    title: "CDG ATC flow restriction",
    time: "0545z",
    location: "CDG",
    summary:
      "Slot delays of 25–40 min on FI542 (1320z) and FI544 (1610z) due to French ATC industrial action. Monitoring.",
  },
  {
    id: "ams-crew",
    severity: "minor",
    title: "AMS standby SCCM sick call",
    time: "0530z",
    location: "AMS",
    summary:
      "1 SCCM unavailable for FI505 (1430z AMS→KEF). AMS base scheduler covering from reserve list.",
  },
];

export const SCENARIO = {
  title: "KEF dense fog event — 0540z to 0820z",
  triggeredAt: "0612z",
  briefing:
    "Visibility at KEF dropped below CAT II minima at 0540z. Forecast clears by 0820z. Four westbound rotations are at risk; standby crew at KEF base is partially committed to a separate medical diversion from yesterday.",
  disruptedFlights: [
    {
      flight: "FI631",
      registration: "TF-ISA",
      type: "B737 MAX 8",
      origin: "KEF",
      destination: "JFK",
      schedDep: "0700z",
      pax: 168,
      saga: 16,
      crewIds: ["CPT-2241", "FO-3318", "SCCM-1108", "CC-1190", "CC-1244", "CC-1287", "CC-1305"],
    },
    {
      flight: "FI617",
      registration: "TF-ISC",
      type: "A321neo",
      origin: "KEF",
      destination: "BOS",
      schedDep: "0735z",
      pax: 192,
      saga: 12,
      crewIds: ["CPT-2199", "FO-3402", "SCCM-1142", "CC-1218", "CC-1260", "CC-1311"],
    },
    {
      flight: "FI603",
      registration: "TF-ISE",
      type: "B757-200",
      origin: "KEF",
      destination: "YYZ",
      schedDep: "0745z",
      pax: 178,
      saga: 14,
      crewIds: ["CPT-2150", "FO-3299", "SCCM-1119", "CC-1201", "CC-1245", "CC-1281"],
    },
    {
      flight: "FI609",
      registration: "TF-ISG",
      type: "B737 MAX 8",
      origin: "KEF",
      destination: "SEA",
      schedDep: "0810z",
      pax: 152,
      saga: 18,
      crewIds: ["CPT-2278", "FO-3370", "SCCM-1156", "CC-1212", "CC-1259", "CC-1295", "CC-1320"],
    },
  ] as DisruptedFlight[],
  affectedCrew: [
    {
      id: "CPT-2241",
      role: "CPT",
      name: "Hjörtur Egilsson",
      hoursRemainingToday: 11.5,
      baseStation: "KEF",
    },
    {
      id: "SCCM-1108",
      role: "SCCM",
      name: "Sara Pétursdóttir",
      hoursRemainingToday: 10.0,
      baseStation: "KEF",
    },
    {
      id: "CPT-2199",
      role: "CPT",
      name: "Linda Magnúsdóttir",
      hoursRemainingToday: 9.5,
      baseStation: "KEF",
    },
  ] as AffectedCrew[],
  availableAircraft: [
    {
      registration: "TF-ISK",
      type: "B737 MAX 8",
      location: "KEF (gate B6)",
      availableFrom: "0830z",
      notes: "Originally scheduled for FI655 (1100z) — swap candidate for FI631",
    },
    {
      registration: "TF-ISM",
      type: "A321neo",
      location: "KEF (hangar 3)",
      availableFrom: "0900z",
      notes: "Just out of B-check; line maintenance signs off by 0845z",
    },
  ] as AvailableAircraft[],
  knownConstraints: [
    "EU261 / Icelandic Reg. 1107 compensation triggers above 3h delay on flights >3500km.",
    "Crew duty hour caps: max 13h FDP for 4+ sectors; max 12h for unaugmented operations.",
    "JFK and BOS slot allocations are valid +/- 30 min from filed.",
    "KEF gate availability becomes constrained after 1000z due to inbound European wave.",
  ],
};
