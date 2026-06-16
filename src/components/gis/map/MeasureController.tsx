import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MeasureControllerProps {
  enabled: boolean;
  onDistanceUpdate: (distance: number) => void;
  clearTrigger?: number;
}

export default function MeasureController({ enabled, onDistanceUpdate, clearTrigger }: MeasureControllerProps) {
  const map = useMap();
  const pointsRef = useRef<L.LatLng[]>([]);
  const layerGroupRef = useRef<L.LayerGroup>(L.layerGroup());
  const polylineRef = useRef<L.Polyline | null>(null);
  const labelMarkersRef = useRef<L.Marker[]>([]);

  const clearMeasure = useCallback(() => {
    layerGroupRef.current.clearLayers();
    pointsRef.current = [];
    polylineRef.current = null;
    labelMarkersRef.current = [];
    onDistanceUpdate(0);
  }, [onDistanceUpdate]);

  useEffect(() => {
    if (clearTrigger && clearTrigger > 0) {
      clearMeasure();
    }
  }, [clearTrigger, clearMeasure]);

  useEffect(() => {
    const group = layerGroupRef.current;
    if (!map.hasLayer(group)) {
      group.addTo(map);
    }

    if (!enabled) {
      group.clearLayers();
      pointsRef.current = [];
      polylineRef.current = null;
      labelMarkersRef.current = [];
      map.off("click");
      return;
    }

    const formatDist = (m: number) => m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${m.toFixed(0)} m`;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      const pointIndex = pointsRef.current.length;
      pointsRef.current.push(latlng);

      L.circleMarker(latlng, {
        radius: 5,
        fillColor: pointIndex === 0 ? "#d4a96a" : "#4a7c59",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(group);

      if (polylineRef.current) {
        polylineRef.current.setLatLngs(pointsRef.current);
      } else if (pointsRef.current.length > 1) {
        polylineRef.current = L.polyline(pointsRef.current, {
          color: "#4a7c59",
          weight: 3,
          opacity: 0.85,
          dashArray: "8, 6",
        }).addTo(group);
      }

      labelMarkersRef.current.forEach(m => group.removeLayer(m));
      labelMarkersRef.current = [];

      let totalDistance = 0;
      for (let i = 0; i < pointsRef.current.length; i++) {
        if (i > 0) {
          const segDist = pointsRef.current[i - 1].distanceTo(pointsRef.current[i]);
          totalDistance += segDist;
          const midLat = (pointsRef.current[i - 1].lat + pointsRef.current[i].lat) / 2;
          const midLng = (pointsRef.current[i - 1].lng + pointsRef.current[i].lng) / 2;

          const labelMarker = L.marker([midLat, midLng], {
            icon: L.divIcon({
              className: "measure-label",
              html: `<span style="background: rgba(235,228,218,0.93); color: #2c1e0f; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-family: 'JetBrains Mono', monospace; border: 1px solid rgba(74,124,89,0.2);">${formatDist(segDist)}</span>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            }),
            interactive: false,
          }).addTo(group);
          labelMarkersRef.current.push(labelMarker);
        }
      }

      if (pointsRef.current.length > 1) {
        const lastPt = pointsRef.current[pointsRef.current.length - 1];
        const totalLabel = L.marker([lastPt.lat, lastPt.lng], {
          icon: L.divIcon({
            className: "measure-total-label",
            html: `<span style="background: #fff; color: #1a1a1a; padding: 10px 20px; border-radius: 12px; font-size: 15px; font-weight: 900; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3); font-family: 'JetBrains Mono', monospace; display: inline-block; margin-top: -28px; margin-left: 12px; border: 3px solid #4a7c59; line-height: 1;">Total: ${formatDist(totalDistance)}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(group);
        labelMarkersRef.current.push(totalLabel);
      }

      onDistanceUpdate(totalDistance);
    };

    map.on("click", handleMapClick);
    map.getContainer().style.cursor = "crosshair";

    return () => {
      map.off("click", handleMapClick);
      map.getContainer().style.cursor = "default";
    };
  }, [enabled, map, onDistanceUpdate]);

  return null;
}
