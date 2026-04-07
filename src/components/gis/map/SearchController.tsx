import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function SearchController({ feature }: { feature: GeoJSON.Feature | null }) {
  const map = useMap();

  useEffect(() => {
    if (!feature) return;

    const geometry = feature.geometry as any;
    let coords: [number, number] | null = null;

    if (geometry.type === "Point") {
      coords = [geometry.coordinates[1], geometry.coordinates[0]];
    } else if (geometry.type === "Polygon") {
      const bounds = L.geoJSON(feature).getBounds();
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
      return;
    } else if (geometry.type === "LineString") {
      const bounds = L.geoJSON(feature).getBounds();
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
      return;
    }

    if (coords) {
      map.flyTo(coords, 16, { duration: 1 });
    }
  }, [feature, map]);

  return null;
}
