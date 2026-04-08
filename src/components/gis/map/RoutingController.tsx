import { useEffect, useRef, useCallback } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { DirectionStep } from "../MapView";

// Icono de ORIGEN — pin verde con letra A
function makeOriginIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      position:relative;width:32px;height:40px;
    ">
      <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:40px;filter:drop-shadow(0 3px 6px rgba(74,124,89,0.45));">
        <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 24 12 24S28 23 28 14C28 7.373 22.627 2 16 2z" fill="#4a7c59"/>
        <path d="M16 3C9.925 3 5 7.925 5 14c0 8.5 11 22.5 11 22.5S27 22.5 27 14C27 7.925 22.075 3 16 3z" fill="#5d9a6e"/>
        <circle cx="16" cy="14" r="7" fill="white" opacity="0.95"/>
        <text x="16" y="18" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="9" fill="#4a7c59">A</text>
      </svg>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

// Icono de DESTINO — pin rojo con letra B
function makeDestinationIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      position:relative;width:32px;height:40px;
    ">
      <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:40px;filter:drop-shadow(0 3px 6px rgba(220,53,69,0.45));">
        <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 24 12 24S28 23 28 14C28 7.373 22.627 2 16 2z" fill="#c0392b"/>
        <path d="M16 3C9.925 3 5 7.925 5 14c0 8.5 11 22.5 11 22.5S27 22.5 27 14C27 7.925 22.075 3 16 3z" fill="#e74c3c"/>
        <circle cx="16" cy="14" r="7" fill="white" opacity="0.95"/>
        <text x="16" y="18" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="9" fill="#c0392b">B</text>
      </svg>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

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
  const originMarkerRef = useRef<L.Marker | null>(null);
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
      if (originMarkerRef.current) {
        originMarkerRef.current.remove();
        originMarkerRef.current = null;
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
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
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
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
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
          opacity: 0.9,
        }).addTo(map);

        // Marcador de ORIGEN (A) — posición del usuario
        originMarkerRef.current = L.marker(userLocation, { icon: makeOriginIcon(), zIndexOffset: 900 })
          .addTo(map)
          .bindPopup(`<div style="font-family:system-ui;font-size:12px;"><b style="color:#4a7c59;">Origen</b><br/><span style="color:#888;font-size:10px;">Tu ubicación</span></div>`);

        // Marcador de DESTINO (B) con botón borrar
        const popupContent = document.createElement("div");
        popupContent.style.cssText = "font-family:system-ui;font-size:12px;min-width:110px;";
        popupContent.innerHTML = `<b style="color:#c0392b;">Destino</b><br/><span style="color:#888;font-size:10px;">Punto de llegada</span>`;
        const clearBtn = document.createElement("button");
        clearBtn.textContent = "Borrar ruta";
        clearBtn.style.cssText = "display:block;margin-top:6px;padding:3px 10px;font-size:10px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;width:100%;";
        clearBtn.addEventListener("click", () => {
          clearRoute();
          onClearRouteRef.current?.();
        });
        popupContent.appendChild(clearBtn);

        destinationMarkerRef.current = L.marker(e.latlng, { icon: makeDestinationIcon(), zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();

        const bounds = routeLayerRef.current.getBounds();
        const currentZoom = map.getZoom();
        const boundsZoom = map.getBoundsZoom(bounds, false, [60, 60] as any);
        const targetZoom = Math.max(currentZoom, Math.min(boundsZoom, 16));
        map.flyToBounds(bounds, { padding: [60, 60], maxZoom: targetZoom, duration: 1.2 });

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
