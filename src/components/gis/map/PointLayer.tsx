import { useEffect, useRef } from "react";
import { useMap, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import { PROP_LABELS } from "./constants";

interface PointLayerProps {
  data: GeoJSON.FeatureCollection;
  color: string;
  opacity: number;
  icon: string;
  onFeatureClick?: (f: GeoJSON.Feature) => void;
}

export default function PointLayer({ data, color, opacity, onFeatureClick, icon }: PointLayerProps) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (data.features.length > 50) {
      if (!clusterRef.current) {
        const cluster = L.markerClusterGroup();
        clusterRef.current = cluster;
        map.addLayer(cluster);
      }

      clusterRef.current.clearLayers();
      data.features.forEach((f) => {
        const coords = (f.geometry as GeoJSON.Point).coordinates;
        const marker = L.circleMarker([coords[1], coords[0]], {
          radius: 8,
          fillColor: color,
          color: "#fff",
          weight: 2,
          fillOpacity: opacity,
          opacity: 1,
        });

        const popupHTML = `
          <div class="custom-popup">
            <h3>${icon} ${f.properties?.nombre || "Sin nombre"}</h3>
            ${Object.entries(f.properties || {})
              .filter(([k]) => k !== "nombre")
              .map(([k, v]) => {
                const label = PROP_LABELS[k] ?? k.replace(/_/g, " ");
                const val = v === null || v === undefined ? "—" : String(v);
                return `<div class="attr-row"><span class="attr-label">${label}</span><span class="attr-value">${val}</span></div>`;
              })
              .join("")}
          </div>
        `;

        marker.bindPopup(popupHTML);
        marker.on("click", () => onFeatureClick?.(f));
        clusterRef.current!.addLayer(marker);
      });
    } else {
      if (clusterRef.current && map.hasLayer(clusterRef.current)) {
        map.removeLayer(clusterRef.current);
        clusterRef.current = null;
      }
    }

    return () => {
      if (clusterRef.current && map.hasLayer(clusterRef.current)) {
        map.removeLayer(clusterRef.current);
        clusterRef.current = null;
      }
    };
  }, [data, color, opacity, map, icon, onFeatureClick]);

  if (data.features.length > 50) {
    return null;
  }

  return (
    <>
      {data.features.map((f, i) => {
        const coords = (f.geometry as GeoJSON.Point).coordinates;
        return (
          <CircleMarker
            key={i}
            center={[coords[1], coords[0]]}
            radius={8}
            pathOptions={{
              fillColor: color,
              color: "#fff",
              weight: 2,
              fillOpacity: opacity,
              opacity: 1,
            }}
            eventHandlers={{
              click: () => onFeatureClick?.(f),
            }}
          >
            <Popup className="custom-popup">
              <div>
                <h3>{icon} {f.properties?.nombre}</h3>
                {Object.entries(f.properties || {}).filter(([k]) => k !== "nombre").map(([k, v]) => (
                  <div className="attr-row" key={k}>
                    <span className="attr-label">{PROP_LABELS[k] ?? k.replace(/_/g, " ")}</span>
                    <span className="attr-value">{v === null || v === undefined ? "—" : String(v)}</span>
                  </div>
                ))}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
