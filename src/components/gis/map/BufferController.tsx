import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import buffer from "@turf/buffer";
import { point, polygon } from "@turf/helpers";

interface BufferControllerProps {
  enabled: boolean;
  radiusMeters: number;
  onBufferCreated?: (featureCount: number) => void;
  clearTrigger?: number;
}

export default function BufferController({ enabled, radiusMeters, onBufferCreated, clearTrigger }: BufferControllerProps) {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup>(L.layerGroup());

  const clearAll = useCallback(() => {
    layerGroupRef.current.clearLayers();
  }, []);

  useEffect(() => {
    if (clearTrigger && clearTrigger > 0) {
      clearAll();
    }
  }, [clearTrigger, clearAll]);

  useEffect(() => {
    const group = layerGroupRef.current;
    if (!map.hasLayer(group)) {
      group.addTo(map);
    }

    if (!enabled) {
      return;
    }

    const handleClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      const radiusKm = radiusMeters / 1000;

      try {
        const pt = point([latlng.lng, latlng.lat]);
        const buffered = buffer(pt, radiusKm, { units: "kilometers" });

        if (buffered) {
          const coords = buffered.geometry.coordinates[0].map(
            ([lng, lat]: number[]) => [lat, lng] as [number, number]
          );

          const bufferPolygon = L.polygon(coords, {
            color: "#2d8a6e",
            weight: 2,
            fillColor: "#2d8a6e",
            fillOpacity: 0.15,
            dashArray: "4, 4",
          }).addTo(group);

          // Label with radius
          const label = `Buffer ${radiusMeters}m`;
          bufferPolygon.bindPopup(`
            <div style="font-family:system-ui;text-align:center;">
              <b style="color:#2d8a6e;">${label}</b><br/>
              <small>Radio: ${radiusMeters}m</small><br/>
              <button onclick="this.closest('.leaflet-popup').querySelector('.leaflet-popup-close-button').click()" style="margin-top:4px;padding:2px 8px;font-size:10px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;">Borrar</button>
            </div>
          `);

          // Add center marker
          L.circleMarker(latlng, {
            radius: 4,
            fillColor: "#2d8a6e",
            color: "#fff",
            weight: 2,
            fillOpacity: 1,
          }).addTo(group);

          onBufferCreated?.(group.getLayers().length);
        }
      } catch (err) {
        console.error("Error creando buffer:", err);
      }
    };

    map.on("click", handleClick);
    map.getContainer().style.cursor = "crosshair";

    return () => {
      map.off("click", handleClick);
      map.getContainer().style.cursor = "default";
    };
  }, [enabled, map, radiusMeters, onBufferCreated]);

  return null;
}
