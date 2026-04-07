import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { educacionGeoJSON, saludGeoJSON, gobiernoGeoJSON, proyectosGeoJSON } from "@/data/ocana-geodata";

interface HeatmapControllerProps {
  enabled: boolean;
}

const POINT_SOURCES = [educacionGeoJSON, saludGeoJSON, gobiernoGeoJSON, proyectosGeoJSON];

export default function HeatmapController({ enabled }: HeatmapControllerProps) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (enabled) {
      const points: [number, number, number][] = [];
      POINT_SOURCES.forEach((source) => {
        source.features.forEach((f) => {
          const coords = (f.geometry as GeoJSON.Point).coordinates;
          points.push([coords[1], coords[0], 0.6]);
        });
      });

      if (!heatLayerRef.current) {
        heatLayerRef.current = (L as any).heatLayer(points, {
          radius: 30,
          blur: 20,
          maxZoom: 17,
          max: 1.0,
          gradient: {
            0.2: "#ffffb2",
            0.4: "#fed976",
            0.6: "#feb24c",
            0.8: "#f03b20",
            1.0: "#bd0026",
          },
        }).addTo(map);
      }
    } else {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [enabled, map]);

  return null;
}
