import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

type HeatPoint = [number, number, number];
type HeatLayerOptions = {
  radius: number;
  blur: number;
  maxZoom: number;
  max: number;
  gradient: Record<number, string>;
};

type HeatLayer = L.Layer;
type HeatmapLeaflet = typeof L & {
  heatLayer(points: HeatPoint[], options: HeatLayerOptions): HeatLayer;
};

interface HeatmapControllerProps {
  enabled: boolean;
  dataMap: Record<string, GeoJSON.FeatureCollection>;
  pointLayerIds?: Set<string>;
}

export default function HeatmapController({ enabled, dataMap, pointLayerIds }: HeatmapControllerProps) {
  const map = useMap();
  const heatLayerRef = useRef<HeatLayer | null>(null);

  useEffect(() => {
    if (enabled) {
      const heatmap = L as HeatmapLeaflet;
      const points: HeatPoint[] = [];
      Array.from(pointLayerIds || []).forEach((layerId) => {
        const source = dataMap[layerId];
        if (!source) return;
        source.features.forEach((f) => {
          const coords = (f.geometry as GeoJSON.Point).coordinates;
          points.push([coords[1], coords[0], 0.6]);
        });
      });

      if (!heatLayerRef.current) {
        heatLayerRef.current = heatmap.heatLayer(points, {
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
  }, [dataMap, enabled, map, pointLayerIds]);

  return null;
}
