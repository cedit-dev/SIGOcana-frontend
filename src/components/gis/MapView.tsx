import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, useMapEvents, Marker, Popup, Circle, CircleMarker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  OCANA_CENTER, OCANA_ZOOM, LayerConfig,
  comunasGeoJSON, barriosGeoJSON, educacionGeoJSON,
  saludGeoJSON, gobiernoGeoJSON, hidrografiaGeoJSON,
  usoSueloGeoJSON, estratificacionGeoJSON, proyectosGeoJSON, viasGeoJSON,
} from "@/data/ocana-geodata";
import { BASE_MAPS, BaseMapKey } from "@/data/base-maps";

// Fix leaflet default icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

(L.Icon.Default as any).imagePath = "";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});


export interface DirectionStep {
  instruction: string;
  distance: number; // metros
  duration: number; // segundos
  maneuver?: string; // tipo de giro: "left", "right", "straight", etc.
  name?: string; // nombre de la calle
}

interface MapViewProps {
  layers: LayerConfig[];
  baseMap: BaseMapKey;
  onFeatureClick: (feature: GeoJSON.Feature) => void;
  zoomToExtentTrigger?: number;
  locateMeTrigger?: number;
  onZoomChange?: (zoom: number) => void;
  onMouseMove?: (coords: { lat: number; lng: number }) => void;
  searchTarget?: GeoJSON.Feature | null;
  isMeasuring?: boolean;
  onMeasureUpdate?: (distance: number) => void;
  clearMeasureTrigger?: number;
  isRouting?: boolean;
  onRouteFound?: (info: { distance: number; duration: number; steps: DirectionStep[] }) => void;
  onLoadingRouteChange?: (loading: boolean) => void;
  onRouteError?: (msg: string) => void;
  clearRouteTrigger?: number;
}

// Component to change base map dynamically
function BaseMapLayer({ baseMap }: { baseMap: BaseMapKey }) {
  const config = BASE_MAPS[baseMap];
  return <TileLayer key={baseMap} url={config.url} attribution={config.attribution} />;
}

// Custom colored circle marker for points with clustering
function PointLayer({
  data, color, opacity, onFeatureClick, icon
}: {
  data: GeoJSON.FeatureCollection;
  color: string;
  opacity: number;
  icon: string;
  onFeatureClick?: (f: GeoJSON.Feature) => void;
}) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  // Usar clustering para capas con muchos features
  useEffect(() => {
    if (data.features.length > 50) {
      // Crear grupo de clustering
      if (!clusterRef.current) {
        const cluster = L.markerClusterGroup();
        clusterRef.current = cluster;
        map.addLayer(cluster);
      }

      // Limpiar y agregar nuevos markers
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
        clusterRef.current.addLayer(marker);
      });
    } else {
      // Para capas pequeñas, renderizar sin clustering
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

  // Si usa clustering (>50 features), usar Leaflet directo, no React components
  if (data.features.length > 50) {
    return null; // El clustering se maneja en el useEffect
  }

  // Para capas pequeñas (sin clustering), renderizar con componentes React
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

const GEOJSON_MAP: Record<string, GeoJSON.FeatureCollection> = {
  comunas: comunasGeoJSON,
  barrios: barriosGeoJSON,
  educacion: educacionGeoJSON,
  salud: saludGeoJSON,
  gobierno: gobiernoGeoJSON,
  hidrografia: hidrografiaGeoJSON,
  uso_suelo: usoSueloGeoJSON,
  estratificacion: estratificacionGeoJSON,
  proyectos: proyectosGeoJSON,
  vias: viasGeoJSON,
};

const POINT_LAYERS = new Set(["educacion", "salud", "gobierno", "proyectos"]);

const PROP_LABELS: Record<string, string> = {
  tipo: "Tipo", nivel: "Nivel", camas: "Camas disponibles",
  estudiantes: "Estudiantes matriculados", descripcion: "Descripción",
  poblacion: "Población", area_habitantes: "Área (ha)",
  estrato_predominante: "Estrato predominante", densidad: "Densidad (hab/ha)",
  comuna: "Comuna", estrato: "Estrato", longitud_km: "Longitud (km)",
  uso: "Uso del suelo", viviendas: "Viviendas", estado: "Estado",
  presupuesto: "Presupuesto", avance: "Avance (%)", area: "Área",
  direccion: "Dirección",
};

const ESTRATO_COLORS: Record<number, string> = {
  1: "#fde0c5",  // crema clara — estrato bajo
  2: "#f5a96e",  // ámbar pálido
  3: "#d4804a",  // ámbar-marrón medio
  4: "#a05c30",  // marrón cálido
  5: "#5a8a68",  // verde forestal suave
  6: "#3a6b50",  // verde profundo — estrato alto
};

const USO_COLORS: Record<string, string> = {
  "Urbano": "#c4883a",          // ámbar del brand
  "Agrícola": "#4a7c59",        // verde primario
  "Protección Ambiental": "#2d8a6e", // teal del brand
};

function MapController({ zoomToExtentTrigger, locateMeTrigger, onLocationFound }: { zoomToExtentTrigger?: number; locateMeTrigger?: number; onLocationFound?: (latlng: L.LatLng) => void }) {
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
        maximumAge: 0 // Force fresh location, don't use cached data
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

function MapEventsTracker({
  onZoomChange,
  onMouseMove,
}: {
  onZoomChange?: (zoom: number) => void;
  onMouseMove?: (coords: { lat: number; lng: number }) => void;
}) {
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

function SearchController({ feature }: { feature: GeoJSON.Feature | null }) {
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

function RoutingController({
  enabled,
  userLocation,
  onRouteFound,
  onLoadingChange,
  onError,
  clearTrigger,
}: {
  enabled: boolean;
  userLocation: L.LatLng | null;
  onRouteFound: (info: { distance: number; duration: number; steps: DirectionStep[] }) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (msg: string) => void;
  clearTrigger?: number;
}) {
  const map = useMap();
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);

  // Precalentar conexión a BRouter cuando se activa el modo ruta
  useEffect(() => {
    if (enabled) {
      fetch("https://brouter.de/brouter?lonlats=-73.35,8.25|-73.35,8.25&profile=car-fast&alternativeidx=0&format=geojson", { mode: "cors" }).catch(() => {});
    }
  }, [enabled]);

  // Cambiar cursor cuando está en modo routing
  useEffect(() => {
    if (enabled) {
      map.getContainer().style.cursor = "crosshair";
    } else {
      map.getContainer().style.cursor = "";
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }
    }
  }, [enabled, map]);

  // Limpiar ruta cuando clearTrigger cambia
  useEffect(() => {
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
  }, [clearTrigger]);

  // Generar instrucciones de navegación a partir de los waypoints de BRouter
  const buildSteps = useCallback((messages: string[][]): DirectionStep[] => {
    if (!messages || messages.length < 3) return [];

    // messages[0] = headers, messages[1..n] = waypoints
    // Columns: Longitude, Latitude, Elevation, Distance, CostPerKm, ElevCost, TurnCost, NodeCost, InitialCost, WayTags, NodeTags, Time, Energy
    const waypoints = messages.slice(1);
    const steps: DirectionStep[] = [];

    for (let i = 0; i < waypoints.length; i++) {
      const wp = waypoints[i];
      const dist = parseFloat(wp[3]) || 0; // Distance del segmento
      const tags = wp[9] || ""; // WayTags
      const timeSec = parseFloat(wp[11]) || 0;
      const prevTime = i > 0 ? (parseFloat(waypoints[i - 1][11]) || 0) : 0;
      const segDuration = timeSec - prevTime;

      // Extraer tipo de vía
      const highwayMatch = tags.match(/highway=(\w+)/);
      const surfaceMatch = tags.match(/surface=(\w+)/);
      const highway = highwayMatch ? highwayMatch[1] : "";

      // Nombre de vía legible
      const viaNames: Record<string, string> = {
        primary: "Vía principal",
        secondary: "Vía secundaria",
        tertiary: "Vía terciaria",
        residential: "Calle residencial",
        service: "Vía de servicio",
        unclassified: "Calle",
        trunk: "Carretera",
        motorway: "Autopista",
        living_street: "Zona residencial",
        pedestrian: "Zona peatonal",
        track: "Camino",
        path: "Sendero",
      };
      const viaName = viaNames[highway] || (highway ? `Vía ${highway}` : "");

      // Calcular dirección de giro usando ángulos entre waypoints
      let maneuver = "straight";
      let instruction = "";

      if (i === 0) {
        instruction = "Comienza el recorrido";
        maneuver = "depart";
      } else if (i === waypoints.length - 1) {
        instruction = "Llegas al destino";
        maneuver = "arrive";
      } else {
        // Calcular ángulo entre segmento anterior y siguiente
        const prevLng = parseFloat(waypoints[i - 1][0]) / 1e6;
        const prevLat = parseFloat(waypoints[i - 1][1]) / 1e6;
        const curLng = parseFloat(wp[0]) / 1e6;
        const curLat = parseFloat(wp[1]) / 1e6;
        const nextLng = parseFloat(waypoints[i + 1][0]) / 1e6;
        const nextLat = parseFloat(waypoints[i + 1][1]) / 1e6;

        const angle1 = Math.atan2(curLng - prevLng, curLat - prevLat);
        const angle2 = Math.atan2(nextLng - curLng, nextLat - curLat);
        let turn = ((angle2 - angle1) * 180) / Math.PI;
        // Normalizar a [-180, 180]
        while (turn > 180) turn -= 360;
        while (turn < -180) turn += 360;

        if (turn > 30 && turn <= 90) {
          instruction = "Gira a la derecha";
          maneuver = "right";
        } else if (turn > 90) {
          instruction = "Gira fuertemente a la derecha";
          maneuver = "sharp right";
        } else if (turn < -30 && turn >= -90) {
          instruction = "Gira a la izquierda";
          maneuver = "left";
        } else if (turn < -90) {
          instruction = "Gira fuertemente a la izquierda";
          maneuver = "sharp left";
        } else {
          instruction = "Continúa recto";
          maneuver = "straight";
        }
      }

      if (dist > 5) { // Ignorar segmentos muy cortos
        steps.push({
          instruction,
          distance: dist,
          duration: segDuration,
          maneuver,
          name: viaName || undefined,
        });
      }
    }

    return steps;
  }, []);

  // Limpiar ruta y marcador existentes
  const clearRoute = useCallback(() => {
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
  }, []);

  // Click handler para seleccionar destino
  useMapEvents({
    click: async (e) => {
      if (!enabled || !userLocation) return;

      // Limpiar ruta anterior ANTES de calcular nueva
      clearRoute();

      // BRouter API — gratuita, sin API key, rápida
      const lonlats = `${userLocation.lng},${userLocation.lat}|${e.latlng.lng},${e.latlng.lat}`;
      const url = `https://brouter.de/brouter?lonlats=${lonlats}&profile=car-fast&alternativeidx=0&format=geojson`;

      onLoadingChange?.(true);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();

        const feature = data?.features?.[0];
        if (!feature) {
          onLoadingChange?.(false);
          onError?.("No se encontró una ruta válida hacia ese punto.");
          return;
        }

        const coords: [number, number][] = feature.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        const distance = parseFloat(feature.properties["track-length"]) || 0;
        const duration = parseFloat(feature.properties["total-time"]) || 0;

        // Dibujar ruta
        routeLayerRef.current = L.polyline(coords, {
          color: "#4a7c59",
          weight: 5,
          opacity: 0.85,
        }).addTo(map);

        // Marcador de destino
        const destIcon = L.divIcon({
          className: "destination-marker",
          html: `<div style="width:36px;height:36px;background:#4a7c59;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(74,124,89,0.4);">📍</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        destinationMarkerRef.current = L.marker(e.latlng, { icon: destIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family:system-ui;"><b style="color:#4a7c59;">📍 Destino</b></div>`)
          .openPopup();

        map.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 60] });

        // Generar pasos de navegación desde los mensajes de BRouter
        const messages = feature.properties?.messages;
        const steps = messages ? buildSteps(messages) : [];

        onRouteFound({ distance, duration, steps });
        onLoadingChange?.(false);

      } catch (err: any) {
        onLoadingChange?.(false);
        if (err?.name === "AbortError") {
          onError?.("El servidor de rutas no respondió. Intenta de nuevo en unos momentos.");
        } else {
          onError?.("Error al calcular la ruta. Verifica tu conexión a internet.");
        }
      }
    },
  });

  return null;
}

function MeasureController({ enabled, onDistanceUpdate, clearTrigger }: { enabled: boolean; onDistanceUpdate: (distance: number) => void; clearTrigger?: number }) {
  const map = useMap();
  const pointsRef = useRef<L.LatLng[]>([]);
  const layerGroupRef = useRef<L.LayerGroup>(L.layerGroup());
  const polylineRef = useRef<L.Polyline | null>(null);
  const labelMarkersRef = useRef<L.Marker[]>([]);

  // Clear all measure drawings
  const clearMeasure = useCallback(() => {
    layerGroupRef.current.clearLayers();
    pointsRef.current = [];
    polylineRef.current = null;
    labelMarkersRef.current = [];
    onDistanceUpdate(0);
  }, [onDistanceUpdate]);

  // Clear when trigger changes
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

      // Add new point marker (no rebuild)
      L.circleMarker(latlng, {
        radius: 5,
        fillColor: pointIndex === 0 ? "#d4a96a" : "#4a7c59",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(group);

      // Update polyline (not rebuild)
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

      // Clear old labels and recalculate
      labelMarkersRef.current.forEach(m => group.removeLayer(m));
      labelMarkersRef.current = [];

      // Recalculate distances and add labels
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

      // Total distance label
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

function MapView({ layers, baseMap, onFeatureClick, zoomToExtentTrigger, locateMeTrigger, onZoomChange, onMouseMove, searchTarget, isMeasuring, onMeasureUpdate, clearMeasureTrigger, isRouting, onRouteFound, onLoadingRouteChange, onRouteError, clearRouteTrigger }: MapViewProps) {
  const visibleLayers = layers.filter(l => l.visible);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);

  const getStyle = (layerId: string, color: string, opacity: number) => {
    return (feature?: GeoJSON.Feature) => {
      let fillColor = color;

      if (layerId === "estratificacion" && feature?.properties?.estrato) {
        fillColor = ESTRATO_COLORS[feature.properties.estrato] || color;
      }
      if (layerId === "uso_suelo" && feature?.properties?.uso) {
        fillColor = USO_COLORS[feature.properties.uso] || color;
      }

      const isLine = feature?.geometry?.type === "LineString" || feature?.geometry?.type === "MultiLineString";

      return {
        fillColor,
        color: isLine ? color : "#fff",
        weight: isLine ? 3 : 1.5,
        fillOpacity: opacity,
        opacity: 0.9,
        dashArray: layerId === "hidrografia" ? "" : undefined,
      };
    };
  };

  const createOnEachFeature = useCallback((layerId: string, color: string, opacity: number) => {
    return (feature: GeoJSON.Feature, layer: L.Layer) => {
      if (feature.properties) {
        const props = feature.properties;
        let html = `<div class="custom-popup"><h3>${props.nombre || "Sin nombre"}</h3>`;
        Object.entries(props).filter(([k]) => k !== "nombre").forEach(([k, v]) => {
          const label = PROP_LABELS[k] ?? k.replace(/_/g, " ");
          const val = v === null || v === undefined ? "—" : String(v);
          html += `<div class="attr-row"><span class="attr-label">${label}</span><span class="attr-value">${val}</span></div>`;
        });
        html += "</div>";
        (layer as L.Path).bindPopup(html);
        (layer as L.Path).on("click", () => onFeatureClick?.(feature));
      }
    };
  }, [onFeatureClick]);

  return (
    <MapContainer
      center={OCANA_CENTER}
      zoom={OCANA_ZOOM}
      maxZoom={20}
      zoomControl={false}
      className="w-full h-full"
      style={{ background: "#f0ede8" }}
    >
      <ZoomControl position="bottomleft" />
      <BaseMapLayer baseMap={baseMap} />

      <MapController
        zoomToExtentTrigger={zoomToExtentTrigger}
        locateMeTrigger={locateMeTrigger}
        onLocationFound={setUserLocation}
      />

      <MapEventsTracker onZoomChange={onZoomChange} onMouseMove={onMouseMove} />

      <SearchController feature={searchTarget || null} />

      {isMeasuring && <MeasureController enabled={isMeasuring} onDistanceUpdate={onMeasureUpdate || (() => { })} clearTrigger={clearMeasureTrigger} />}

      {isRouting && userLocation && <RoutingController enabled={isRouting} userLocation={userLocation} onRouteFound={onRouteFound || (() => { })} onLoadingChange={onLoadingRouteChange} onError={onRouteError} clearTrigger={clearRouteTrigger} />}

      {visibleLayers.map(layer => {
        const data = GEOJSON_MAP[layer.id];
        if (!data) return null;

        if (POINT_LAYERS.has(layer.id)) {
          return (
            <PointLayer
              key={layer.id}
              data={data}
              color={layer.color}
              opacity={layer.opacity}
              icon={layer.icon}
              onFeatureClick={onFeatureClick}
            />
          );
        }

        return (
          <GeoJSON
            key={`${layer.id}-${layer.opacity}-${layer.visible}`}
            data={data}
            style={getStyle(layer.id, layer.color, layer.opacity)}
            onEachFeature={createOnEachFeature(layer.id, layer.color, layer.opacity)}
          />
        );
      })}
    </MapContainer>
  );
}

export default MapView;
