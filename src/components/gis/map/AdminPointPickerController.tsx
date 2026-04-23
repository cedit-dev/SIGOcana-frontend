import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

interface AdminPointPickerControllerProps {
  enabled: boolean;
  onPick: (coords: { lat: number; lng: number }) => void;
}

export default function AdminPointPickerController({
  enabled,
  onPick,
}: AdminPointPickerControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.getContainer().style.cursor = enabled ? "crosshair" : "";

    return () => {
      map.getContainer().style.cursor = "";
    };
  }, [enabled, map]);

  useMapEvents({
    click: (e) => {
      if (!enabled) return;
      onPick({
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}
