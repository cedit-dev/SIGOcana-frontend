import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function SearchController({ feature }: { feature: GeoJSON.Feature | null }) {
  const map = useMap();

  useEffect(() => {
    if (!feature) return;

    const geometry = feature.geometry;
    if (!geometry) return;

    if (geometry.type === "Point") {
      const coords: [number, number] = [geometry.coordinates[1], geometry.coordinates[0]];
      map.flyTo(coords, 16, { duration: 1 });
      return;
    }

    if (geometry.type === "Polygon" || geometry.type === "MultiPolygon" || geometry.type === "LineString" || geometry.type === "MultiLineString") {
      const bounds = L.geoJSON(feature).getBounds();
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
      return;
    }
  }, [feature, map]);

  return null;
}
