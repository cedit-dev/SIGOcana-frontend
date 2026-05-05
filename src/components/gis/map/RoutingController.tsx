import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DirectionStep } from "../MapView";
import { routingService } from "@/services/routingService";
import { createOriginIcon, createDestinationIcon } from "./icons";

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

  // Sync callbacks with refs to avoid closure issues in async events
  const callbacks = useRef({ onRouteFound, onLoadingChange, onError, onClearRoute });
  callbacks.current = { onRouteFound, onLoadingChange, onError, onClearRoute };

  const clearRoute = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    requestIdRef.current++;
    [routeLayerRef, originMarkerRef, destinationMarkerRef].forEach(ref => {
      if (ref.current) {
        ref.current.remove();
        ref.current = null;
      }
    });
  };

  useEffect(() => {
    if (!enabled) {
      map.getContainer().style.cursor = "";
      clearRoute();
    } else {
      map.getContainer().style.cursor = "crosshair";
    }
  }, [enabled, map]);

  useEffect(() => {
    clearRoute();
  }, [clearTrigger]);

  useMapEvents({
    click: async (e) => {
      if (!enabled || !userLocation) return;

      clearRoute();
      const myId = ++requestIdRef.current;
      const controller = new AbortController();
      abortRef.current = controller;

      callbacks.current.onLoadingChange?.(true);

      try {
        const result = await routingService.fetchRoute(userLocation, e.latlng, controller.signal);
        
        if (myId !== requestIdRef.current) return;

        // Draw Route
        routeLayerRef.current = L.polyline(result.coordinates, {
          color: "#4a7c59",
          weight: 5,
          opacity: 0.9,
        }).addTo(map);

        // Add Markers
        originMarkerRef.current = L.marker(userLocation, { icon: createOriginIcon(), zIndexOffset: 900 })
          .addTo(map)
          .bindPopup(`<div class="font-sans text-xs"><b class="text-[#4a7c59]">Origen</b><br/><span class="text-gray-400">Tu ubicación</span></div>`);

        const popupContent = document.createElement("div");
        popupContent.className = "font-sans text-xs min-w-[110px]";
        popupContent.innerHTML = `<b class="text-[#c0392b]">Destino</b><br/><span class="text-gray-400">Punto de llegada</span>`;
        
        const clearBtn = document.createElement("button");
        clearBtn.textContent = "Borrar ruta";
        clearBtn.className = "block mt-1.5 px-2.5 py-1 text-[10px] bg-[#e74c3c] text-white rounded cursor-pointer w-full";
        clearBtn.onclick = () => {
          clearRoute();
          callbacks.current.onClearRoute?.();
        };
        popupContent.appendChild(clearBtn);

        destinationMarkerRef.current = L.marker(e.latlng, { icon: createDestinationIcon(), zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();

        // Fit Map
        const bounds = routeLayerRef.current.getBounds();
        map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 16, duration: 1.2 });

        callbacks.current.onRouteFound({ 
          distance: result.distance, 
          duration: result.duration, 
          steps: result.steps 
        });
        callbacks.current.onLoadingChange?.(false);

      } catch (err: any) {
        if (err.name === "AbortError") return;
        callbacks.current.onLoadingChange?.(false);
        callbacks.current.onError?.(err.message === "No route found" 
          ? "No se encontró una ruta válida hacia ese punto." 
          : "Error al calcular la ruta. Verifica tu conexión.");
      }
    },
  });

  return null;
}
