import { useEffect, useState } from "react";
import { useMap, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { OCANA_CENTER, OCANA_ZOOM } from "@/data/ocana-geodata";

interface MapControllerProps {
  zoomToExtentTrigger?: number;
  locateMeTrigger?: number;
  onLocationFound?: (latlng: L.LatLng) => void;
}

export default function MapController({ zoomToExtentTrigger, locateMeTrigger, onLocationFound }: MapControllerProps) {
  const map = useMap();
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    if (zoomToExtentTrigger) {
      map.setView(OCANA_CENTER, OCANA_ZOOM);
    }
  }, [zoomToExtentTrigger, map]);

  useEffect(() => {
    if (locateMeTrigger) {
      map.locate({
        setView: false,
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    }
  }, [locateMeTrigger, map]);

  useEffect(() => {
    const handleLocationFound = (e: L.LocationEvent) => {
      setUserLocation(e.latlng);
      setAccuracy(e.accuracy);
      map.flyTo(e.latlng, 17, { duration: 1.5 });
      onLocationFound?.(e.latlng);
    };

    const handleLocationError = (e: L.ErrorEvent) => {
      console.error("Error de ubicación:", e.message);
    };

    map.on("locationfound", handleLocationFound);
    map.on("locationerror", handleLocationError);

    return () => {
      map.off("locationfound", handleLocationFound);
      map.off("locationerror", handleLocationError);
    };
  }, [map, onLocationFound]);

  return userLocation ? (
    <>
      <Marker position={userLocation}>
        <Popup>Te encuentras aquí (Margen de error: {Math.round(accuracy)}m)</Popup>
      </Marker>
      <Circle center={userLocation} radius={accuracy} pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.1 }} />
    </>
  ) : null;
}
