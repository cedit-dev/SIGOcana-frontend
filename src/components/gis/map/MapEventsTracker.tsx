import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MapEventsTrackerProps {
  onZoomChange?: (zoom: number) => void;
  onMouseMove?: (coords: { lat: number; lng: number }) => void;
}

export default function MapEventsTracker({ onZoomChange, onMouseMove }: MapEventsTrackerProps) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => onZoomChange?.(map.getZoom());
    const handleMouseMove = (e: L.LeafletMouseEvent) =>
      onMouseMove?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    map.on("zoomend", handleZoom);
    map.on("mousemove", handleMouseMove);
    onZoomChange?.(map.getZoom());
    return () => {
      map.off("zoomend", handleZoom);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, onZoomChange, onMouseMove]);

  return null;
}
