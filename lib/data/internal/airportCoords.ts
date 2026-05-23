// Facility and location coordinates around Blue Lagoon. File name and the
// AIRPORT_COORDS export are kept stable for back-compat with components that
// still import from this path; the data shape inside is repurposed for spa
// + transfer geography.
//
// The Blue Lagoon spa sits ~50 min from Reykjavík and ~20 min from
// Keflavík (KEF), which is just a transfer pickup point in this context, not
// a hub.

export interface AirportCoord {
  lat: number;
  lng: number;
  name: string;
}

export const AIRPORT_COORDS: Record<string, AirportCoord> = {
  // Blue Lagoon facility points.
  BLUE_LAGOON: { lat: 63.8804, lng: -22.4495, name: "Blue Lagoon entrance" },
  SILICA: { lat: 63.881, lng: -22.4475, name: "Silica Hotel" },
  RETREAT: { lat: 63.879, lng: -22.452, name: "The Retreat at Blue Lagoon" },
  LAVA: { lat: 63.8806, lng: -22.4488, name: "Lava restaurant" },
  MOSS: { lat: 63.879, lng: -22.4517, name: "Moss restaurant" },

  // Transfer pickup points.
  KEF: { lat: 63.985, lng: -22.605, name: "Keflavík (KEF) transfer pickup" },
  BSI: { lat: 64.1373, lng: -21.93, name: "Reykjavík BSÍ bus terminal" },
  REYKJAVIK: { lat: 64.1466, lng: -21.9426, name: "Reykjavík (city centre)" },
  GRINDAVIK: { lat: 63.8418, lng: -22.4368, name: "Grindavík" },
};
