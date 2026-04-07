import { useEffect, useRef, useCallback } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { DirectionStep } from "../MapView";

interface RoutingControllerProps {
  enabled: boolean;
  userLocation: L.LatLng | null;
  onRouteFound: (info: { distance: number; duration: number; steps: DirectionStep[] }) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (msg: string) => void;
  onClearRoute?: () => void;
  clearTrigger?: number;
}

export default function RoutingController({
  enabled,
  userLocation,
  onRouteFound,
  onLoadingChange,
  onError,
  onClearRoute,
  clearTrigger,
}: RoutingControllerProps) {
  const map = useMap();
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const onClearRouteRef = useRef(onClearRoute);
  onClearRouteRef.current = onClearRoute;
  const onRouteFoundRef = useRef(onRouteFound);
  onRouteFoundRef.current = onRouteFound;
  const onLoadingChangeRef = useRef(onLoadingChange);
  onLoadingChangeRef.current = onLoadingChange;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    if (enabled) {
      fetch("https://brouter.de/brouter?lonlats=-73.35,8.25|-73.35,8.25&profile=car-fast&alternativeidx=0&format=geojson", { mode: "cors" }).catch(() => {});
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      map.getContainer().style.cursor = "crosshair";
    } else {
      map.getContainer().style.cursor = "";
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }
    }
  }, [enabled, map]);

  useEffect(() => {
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
  }, [clearTrigger]);

  const buildSteps = useCallback((messages: string[][]): DirectionStep[] => {
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
        steps.push({
          instruction,
          distance: dist,
          duration: segDuration,
          maneuver,
          name: viaName || undefined,
        });
      }
    }

    return steps;
  }, []);

  const clearRoute = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    requestIdRef.current++;
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
  }, []);

  useMapEvents({
    click: async (e) => {
      if (!enabled || !userLocation) return;

      clearRoute();

      const myId = requestIdRef.current;
      const controller = new AbortController();
      abortRef.current = controller;

      const lonlats = `${userLocation.lng},${userLocation.lat}|${e.latlng.lng},${e.latlng.lat}`;
      const url = `https://brouter.de/brouter?lonlats=${lonlats}&profile=car-fast&alternativeidx=0&format=geojson`;

      onLoadingChangeRef.current?.(true);

      try {
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (myId !== requestIdRef.current) return;

        const data = await res.json();

        const feature = data?.features?.[0];
        if (!feature) {
          onLoadingChangeRef.current?.(false);
          onErrorRef.current?.("No se encontró una ruta válida hacia ese punto.");
          return;
        }

        const coords: [number, number][] = feature.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        const distance = parseFloat(feature.properties["track-length"]) || 0;
        const duration = parseFloat(feature.properties["total-time"]) || 0;

        routeLayerRef.current = L.polyline(coords, {
          color: "#4a7c59",
          weight: 5,
          opacity: 0.85,
        }).addTo(map);

        const destIcon = L.divIcon({
          className: "destination-marker",
          html: `<div style="width:36px;height:36px;background:#4a7c59;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(74,124,89,0.4);">📍</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const popupContent = document.createElement("div");
        popupContent.style.fontFamily = "system-ui";
        popupContent.innerHTML = `<b style="color:#4a7c59;font-size:12px;">📍 Destino</b>`;
        const clearBtn = document.createElement("button");
        clearBtn.textContent = "Borrar";
        clearBtn.style.cssText = "display:block;margin-top:4px;padding:2px 8px;font-size:10px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;";
        clearBtn.addEventListener("click", () => {
          clearRoute();
          onClearRouteRef.current?.();
        });
        popupContent.appendChild(clearBtn);

        destinationMarkerRef.current = L.marker(e.latlng, { icon: destIcon })
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();

        map.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 60] });

        const messages = feature.properties?.messages;
        const steps = messages ? buildSteps(messages) : [];

        onRouteFoundRef.current({ distance, duration, steps });
        onLoadingChangeRef.current?.(false);

      } catch (err: any) {
        onLoadingChangeRef.current?.(false);
        if (err?.name === "AbortError") {
          onErrorRef.current?.("El servidor de rutas no respondió. Intenta de nuevo en unos momentos.");
        } else {
          onErrorRef.current?.("Error al calcular la ruta. Verifica tu conexión a internet.");
        }
      }
    },
  });

  return null;
}
