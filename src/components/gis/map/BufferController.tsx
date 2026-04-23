import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import buffer from "@turf/buffer";
import booleanIntersects from "@turf/boolean-intersects";
import { point } from "@turf/helpers";
import type { Position } from "geojson";

interface BufferControllerProps {
  enabled: boolean;
  radiusMeters: number;
  onBufferCreated?: (featureCount: number) => void;
  clearTrigger?: number;
  dataMap: Record<string, GeoJSON.FeatureCollection>;
}

export default function BufferController({ enabled, radiusMeters, onBufferCreated, clearTrigger, dataMap }: BufferControllerProps) {
  const map = useMap();
  const groupRef = useRef<L.LayerGroup | null>(null);

  // Inicializar grupo y añadirlo al mapa una sola vez
  useEffect(() => {
    const group = L.layerGroup().addTo(map);
    groupRef.current = group;
    return () => {
      group.remove();
      groupRef.current = null;
    };
  }, [map]);

  // Limpiar cuando clearTrigger cambia
  useEffect(() => {
    if (clearTrigger && clearTrigger > 0) {
      groupRef.current?.clearLayers();
    }
  }, [clearTrigger]);

  // Limpiar cuando se desactiva
  useEffect(() => {
    if (!enabled) {
      groupRef.current?.clearLayers();
    }
  }, [enabled]);

  const handleClick = useCallback((e: L.LeafletMouseEvent) => {
    const group = groupRef.current;
    if (!group) return;

    const latlng = e.latlng;
    const radiusKm = radiusMeters / 1000;

    try {
      const pt = point([latlng.lng, latlng.lat]);
      const buffered = buffer(pt, radiusKm, { units: "kilometers" });
      if (!buffered) return;

      // Dibujar el polígono del buffer
      const coords = (buffered.geometry.coordinates[0] as Position[]).map(
        ([lng, lat]) => [lat, lng] as [number, number]
      );
      const bufferPolygon = L.polygon(coords, {
        color: "#2d8a6e",
        weight: 2,
        fillColor: "#2d8a6e",
        fillOpacity: 0.12,
        dashArray: "6, 4",
      }).addTo(group);

      // Marcar el centro
      L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#2d8a6e",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(group);

      // Buscar features de todas las capas que intersectan con el buffer
      const hits: Array<{ layerName: string; nombre: string }> = [];

      for (const [layerId, collection] of Object.entries(dataMap)) {
        for (const feature of collection.features) {
          try {
            if (booleanIntersects(buffered, feature)) {
              const nombre =
                feature.properties?.nombre ||
                feature.properties?.name ||
                feature.properties?.tipo ||
                "Sin nombre";
              hits.push({ layerName: layerId, nombre: String(nombre) });
            }
          } catch {
            // Ignorar features con geometría inválida
          }
        }
      }

      // Construir popup con los features encontrados
      const layerLabels: Record<string, string> = {
        comunas: "Comunas",
        barrios: "Barrios",
        educacion: "Educación",
        salud: "Salud",
        gobierno: "Gobierno",
        proyectos: "Proyectos",
        hidrografia: "Hidrografía",
        uso_suelo: "Uso de Suelo",
        estratificacion: "Estratificación",
        vias: "Vías",
      };

      const grouped: Record<string, string[]> = {};
      for (const hit of hits) {
        const label = layerLabels[hit.layerName] || hit.layerName;
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(hit.nombre);
      }

      let featuresHtml = "";
      if (hits.length === 0) {
        featuresHtml = `<p style="color:#999;font-size:10px;margin:4px 0 0;">Sin elementos en esta zona</p>`;
      } else {
        for (const [label, nombres] of Object.entries(grouped)) {
          featuresHtml += `<div style="margin-top:4px;">
            <b style="color:#2d8a6e;font-size:10px;">${label}</b>
            <ul style="margin:2px 0 0 10px;padding:0;font-size:10px;color:#555;">
              ${nombres.map(n => `<li>${n}</li>`).join("")}
            </ul>
          </div>`;
        }
      }

      const popupEl = document.createElement("div");
      popupEl.style.cssText = "font-family:system-ui;min-width:160px;max-width:220px;max-height:220px;overflow-y:auto;";
      popupEl.innerHTML = `
        <b style="color:#2d8a6e;font-size:12px;">Buffer ${radiusMeters}m</b>
        <p style="margin:2px 0;font-size:10px;color:#777;">${hits.length} elemento(s) encontrado(s)</p>
        ${featuresHtml}
      `;

      const clearBtn = document.createElement("button");
      clearBtn.textContent = "Borrar este buffer";
      clearBtn.style.cssText = "display:block;margin-top:6px;padding:3px 10px;font-size:10px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;width:100%;";
      clearBtn.addEventListener("click", () => {
        group.removeLayer(bufferPolygon);
        // También remover el circleMarker del centro (está justo después)
        map.closePopup();
      });
      popupEl.appendChild(clearBtn);

      bufferPolygon.bindPopup(popupEl).openPopup();

      onBufferCreated?.(hits.length);
    } catch (err) {
      console.error("Error creando buffer:", err);
    }
  }, [dataMap, map, radiusMeters, onBufferCreated]);

  useEffect(() => {
    if (!enabled) {
      map.getContainer().style.cursor = "";
      return;
    }

    map.getContainer().style.cursor = "crosshair";
    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
      map.getContainer().style.cursor = "";
    };
  }, [enabled, map, handleClick]);

  return null;
}
