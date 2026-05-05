import L from "leaflet";

export interface DirectionStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver?: string;
  name?: string;
}

export interface RouteResult {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  steps: DirectionStep[];
}

const viaNames: Record<string, string> = {
  primary: "Vía principal",
  secondary: "Vía secundaria",
  tertiary: "Vía terciaria",
  residential: "Calle residencial",
  service: "Vía de servicio",
  unclassified: "Calle",
  trunk: "Carretera",
  motorway: "Autopista",
  living_street: "Zona residencial",
  pedestrian: "Zona peatonal",
  track: "Camino",
  path: "Sendero",
};

/**
 * Service to handle route calculation and response parsing from BRouter.
 */
export const routingService = {
  /**
   * Fetches a route between two points using BRouter.
   */
  async fetchRoute(from: L.LatLng, to: L.LatLng, signal?: AbortSignal): Promise<RouteResult> {
    const lonlats = `${from.lng},${from.lat}|${to.lng},${to.lat}`;
    const url = `https://brouter.de/brouter?lonlats=${lonlats}&profile=car-fast&alternativeidx=0&format=geojson`;

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("Failed to fetch route");
    
    const data = await res.json();
    const feature = data?.features?.[0];
    
    if (!feature) throw new Error("No route found");

    const coordinates: [number, number][] = feature.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );
    
    const distance = parseFloat(feature.properties["track-length"]) || 0;
    const duration = parseFloat(feature.properties["total-time"]) || 0;
    const messages = feature.properties?.messages;
    
    const steps = messages ? this.parseInstructions(messages) : [];

    return { coordinates, distance, duration, steps };
  },

  /**
   * Parses raw BRouter messages into human-readable steps.
   */
  parseInstructions(messages: string[][]): DirectionStep[] {
    if (!messages || messages.length < 3) return [];

    const waypoints = messages.slice(1);
    const steps: DirectionStep[] = [];

    for (let i = 0; i < waypoints.length; i++) {
      const wp = waypoints[i];
      const dist = parseFloat(wp[3]) || 0;
      const tags = wp[9] || "";
      const timeSec = parseFloat(wp[11]) || 0;
      const prevTime = i > 0 ? (parseFloat(waypoints[i - 1][11]) || 0) : 0;
      const segDuration = timeSec - prevTime;

      const highwayMatch = tags.match(/highway=(\w+)/);
      const highway = highwayMatch ? highwayMatch[1] : "";
      const viaName = viaNames[highway] || (highway ? `Vía ${highway}` : "");

      let maneuver = "straight";
      let instruction = "";

      if (i === 0) {
        instruction = "Comienza el recorrido";
        maneuver = "depart";
      } else if (i === waypoints.length - 1) {
        instruction = "Llegas al destino";
        maneuver = "arrive";
      } else {
        const prevLng = parseFloat(waypoints[i - 1][0]) / 1e6;
        const prevLat = parseFloat(waypoints[i - 1][1]) / 1e6;
        const curLng = parseFloat(wp[0]) / 1e6;
        const curLat = parseFloat(wp[1]) / 1e6;
        const nextLng = parseFloat(waypoints[i + 1][0]) / 1e6;
        const nextLat = parseFloat(waypoints[i + 1][1]) / 1e6;

        const angle1 = Math.atan2(curLng - prevLng, curLat - prevLat);
        const angle2 = Math.atan2(nextLng - curLng, nextLat - curLat);
        let turn = ((angle2 - angle1) * 180) / Math.PI;
        while (turn > 180) turn -= 360;
        while (turn < -180) turn += 360;

        if (turn > 30 && turn <= 90) {
          instruction = "Gira a la derecha";
          maneuver = "right";
        } else if (turn > 90) {
          instruction = "Gira fuertemente a la derecha";
          maneuver = "sharp right";
        } else if (turn < -30 && turn >= -90) {
          instruction = "Gira a la izquierda";
          maneuver = "left";
        } else if (turn < -90) {
          instruction = "Gira fuertemente a la izquierda";
          maneuver = "sharp left";
        } else {
          instruction = "Continúa recto";
          maneuver = "straight";
        }
      }

      if (dist > 5) {
        steps.push({ instruction, distance: dist, duration: segDuration, maneuver, name: viaName || undefined });
      }
    }

    return steps;
  },
};
