import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { OCANA_CENTER, OCANA_ZOOM } from "@/data/ocana-geodata";

interface MapControllerProps {
  zoomToExtentTrigger?: number;
  locateMeTrigger?: number;
  onLocationFound?: (latlng: L.LatLng) => void;
}

// CSS de animación de pulso (inyectado una sola vez)
const PULSE_STYLE = `
  @keyframes gps-pulse {
    0%   { transform: scale(1);   opacity: 0.7; }
    70%  { transform: scale(2.8); opacity: 0; }
    100% { transform: scale(2.8); opacity: 0; }
  }
  @keyframes gps-dot-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.5); }
    50%       { box-shadow: 0 0 0 8px rgba(14,165,233,0); }
  }
  .gps-marker-wrap { position: relative; width: 22px; height: 22px; }
  .gps-pulse-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    background: rgba(14,165,233,0.3);
    animation: gps-pulse 2s ease-out infinite;
  }
  .gps-dot {
    position: absolute; inset: 3px;
    background: #0ea5e9;
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 2px 8px rgba(14,165,233,0.6);
    animation: gps-dot-glow 2s ease-in-out infinite;
  }
  .gps-dot-inner {
    position: absolute; inset: 3px;
    background: #fff;
    border-radius: 50%;
    opacity: 0.6;
  }
`;

function injectStyle() {
  if (document.getElementById("gps-pulse-style")) return;
  const s = document.createElement("style");
  s.id = "gps-pulse-style";
  s.textContent = PULSE_STYLE;
  document.head.appendChild(s);
}

function makeLocationIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="gps-marker-wrap">
      <div class="gps-pulse-ring"></div>
      <div class="gps-dot">
        <div class="gps-dot-inner"></div>
      </div>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

export default function MapController({ zoomToExtentTrigger, locateMeTrigger, onLocationFound }: MapControllerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const flyDoneRef = useRef(false);

  useEffect(() => {
    injectStyle();
  }, []);

  useEffect(() => {
    if (zoomToExtentTrigger) {
      map.setView(OCANA_CENTER, OCANA_ZOOM);
    }
  }, [zoomToExtentTrigger, map]);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const onSuccess = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords;
    const latlng = L.latLng(latitude, longitude);

    // Actualizar marcador
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      markerRef.current = L.marker(latlng, { icon: makeLocationIcon(), zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui;font-size:12px;">
            <b style="color:#0ea5e9;">Tu ubicación</b><br/>
            <span style="color:#888;font-size:10px;">Precisión: ±${Math.round(accuracy)}m</span>
          </div>`
        );
    }

    // Actualizar círculo de precisión
    if (circleRef.current) {
      circleRef.current.setLatLng(latlng);
      circleRef.current.setRadius(accuracy);
    } else {
      circleRef.current = L.circle(latlng, {
        radius: accuracy,
        color: "#0ea5e9",
        weight: 1.5,
        opacity: 0.5,
        fillColor: "#0ea5e9",
        fillOpacity: 0.08,
        dashArray: "4 4",
      }).addTo(map);
    }

    // Volar solo la primera vez
    if (!flyDoneRef.current) {
      flyDoneRef.current = true;
      map.flyTo(latlng, Math.min(17, map.getZoom() + 2), { duration: 1.4 });
    }

    onLocationFound?.(latlng);
  }, [map, onLocationFound]);

  const onError = useCallback((err: GeolocationPositionError) => {
    console.warn("GPS error:", err.message);
  }, []);

  useEffect(() => {
    if (!locateMeTrigger) return;

    // Limpiar watch anterior si existe
    stopWatch();
    flyDoneRef.current = false;

    if (!navigator.geolocation) {
      console.warn("Geolocalización no disponible en este navegador.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 2000,       // acepta posición de hasta 2s de antigüedad
      }
    );

    return () => stopWatch();
  }, [locateMeTrigger, onSuccess, onError, stopWatch]);

  // Limpiar layers al desmontar
  useEffect(() => {
    return () => {
      stopWatch();
      markerRef.current?.remove();
      circleRef.current?.remove();
    };
  }, [stopWatch]);

  return null;
}
