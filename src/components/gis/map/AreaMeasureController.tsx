import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface AreaMeasureControllerProps {
  enabled: boolean;
  onAreaUpdate: (area: number) => void;
  clearTrigger?: number;
}

function calculateArea(latlngs: L.LatLng[]): number {
  if (latlngs.length < 3) return 0;
  // Shoelace formula using projected coordinates for accuracy
  const points = latlngs.map(ll => L.CRS.EPSG3857.project(ll));
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

function formatArea(sqm: number): string {
  if (sqm >= 10000) {
    return `${(sqm / 10000).toFixed(2)} ha`;
  }
  return `${sqm.toFixed(0)} m²`;
}

export default function AreaMeasureController({ enabled, onAreaUpdate, clearTrigger }: AreaMeasureControllerProps) {
  const map = useMap();
  const pointsRef = useRef<L.LatLng[]>([]);
  const layerGroupRef = useRef<L.LayerGroup>(L.layerGroup());
  const polygonRef = useRef<L.Polygon | null>(null);
  const labelMarkerRef = useRef<L.Marker | null>(null);

  const clearAll = useCallback(() => {
    layerGroupRef.current.clearLayers();
    pointsRef.current = [];
    polygonRef.current = null;
    labelMarkerRef.current = null;
    onAreaUpdate(0);
  }, [onAreaUpdate]);

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
      group.clearLayers();
      pointsRef.current = [];
      polygonRef.current = null;
      labelMarkerRef.current = null;
      return;
    }

    const updatePolygon = () => {
      if (polygonRef.current) {
        group.removeLayer(polygonRef.current);
      }
      if (labelMarkerRef.current) {
        group.removeLayer(labelMarkerRef.current);
      }

      if (pointsRef.current.length >= 3) {
        polygonRef.current = L.polygon(pointsRef.current, {
          color: "#c4945a",
          weight: 2,
          fillColor: "#c4945a",
          fillOpacity: 0.2,
          dashArray: "6, 4",
        }).addTo(group);

        const area = calculateArea(pointsRef.current);
        onAreaUpdate(area);

        const bounds = polygonRef.current.getBounds();
        const center = bounds.getCenter();
        labelMarkerRef.current = L.marker(center, {
          icon: L.divIcon({
            className: "area-label",
            html: `<span style="background: #fff; color: #1a1a1a; padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 900; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.4); font-family: 'JetBrains Mono', monospace; border: 3px solid #c4945a; line-height: 1;">${formatArea(area)}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(group);
      } else if (pointsRef.current.length === 2) {
        L.polyline(pointsRef.current, {
          color: "#c4945a",
          weight: 2,
          dashArray: "6, 4",
        }).addTo(group);
      }
    };

    const handleClick = (e: L.LeafletMouseEvent) => {
      pointsRef.current.push(e.latlng);

      L.circleMarker(e.latlng, {
        radius: 5,
        fillColor: pointsRef.current.length === 1 ? "#c4945a" : "#4a7c59",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(group);

      updatePolygon();
    };

    const handleDblClick = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      // Close polygon on double-click
      if (pointsRef.current.length >= 3) {
        updatePolygon();
      }
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDblClick);
    map.doubleClickZoom.disable();
    map.getContainer().style.cursor = "crosshair";

    return () => {
      map.off("click", handleClick);
      map.off("dblclick", handleDblClick);
      map.doubleClickZoom.enable();
      map.getContainer().style.cursor = "default";
    };
  }, [enabled, map, onAreaUpdate]);

  return null;
}
