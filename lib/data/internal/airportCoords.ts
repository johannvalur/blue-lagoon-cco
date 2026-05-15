export interface AirportCoord {
  lat: number;
  lng: number;
  name: string;
}

export const AIRPORT_COORDS: Record<string, AirportCoord> = {
  KEF: { lat: 63.985, lng: -22.605, name: "Reykjavík" },
  AEY: { lat: 65.66, lng: -18.073, name: "Akureyri" },
  JFK: { lat: 40.64, lng: -73.778, name: "New York" },
  BOS: { lat: 42.366, lng: -71.02, name: "Boston" },
  YYZ: { lat: 43.677, lng: -79.63, name: "Toronto" },
  SEA: { lat: 47.443, lng: -122.302, name: "Seattle" },
  DEN: { lat: 39.86, lng: -104.673, name: "Denver" },
  LHR: { lat: 51.47, lng: -0.46, name: "London" },
  CDG: { lat: 49.01, lng: 2.548, name: "Paris" },
  AMS: { lat: 52.31, lng: 4.768, name: "Amsterdam" },
  CPH: { lat: 55.618, lng: 12.656, name: "Copenhagen" },
  BER: { lat: 52.366, lng: 13.503, name: "Berlin" },
  MAD: { lat: 40.472, lng: -3.561, name: "Madrid" },
  BCN: { lat: 41.297, lng: 2.078, name: "Barcelona" },
  LIS: { lat: 38.781, lng: -9.136, name: "Lisbon" },
  TFS: { lat: 28.045, lng: -16.573, name: "Tenerife South" },
};
