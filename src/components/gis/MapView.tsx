import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Marker, Popup, Circle, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
}

// Component to change base map dynamically
function BaseMapLayer({ baseMap }: { baseMap: BaseMapKey }) {
  const config = BASE_MAPS[baseMap];
  return <TileLayer key={baseMap} url={config.url} attribution={config.attribution} />;
}

// Custom colored circle marker for points
function PointLayer({
  data, color, opacity, onFeatureClick, icon
}: {
  data: GeoJSON.FeatureCollection;
  color: string;
  opacity: number;
  icon: string;
  onFeatureClick?: (f: GeoJSON.Feature) => void;
}) {
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
  1: "#E74C3C",
  2: "#E67E22",
  3: "#F1C40F",
  4: "#2ECC71",
  5: "#3498DB",
  6: "#9B59B6",
};

const USO_COLORS: Record<string, string> = {
  "Urbano": "#E67E22",
  "Agrícola": "#27AE60",
  "Protección Ambiental": "#2ECC71",
};

function MapController({ zoomToExtentTrigger, locateMeTrigger }: { zoomToExtentTrigger?: number; locateMeTrigger?: number }) {
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
  }, [map]);

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

function MeasureController({ enabled, onDistanceUpdate, clearTrigger }: { enabled: boolean; onDistanceUpdate: (distance: number) => void; clearTrigger?: number }) {
  const map = useMap();
  const pointsRef = useRef<L.LatLng[]>([]);
  const layerGroupRef = useRef<L.LayerGroup>(L.layerGroup());

  // Clear all measure drawings
  const clearMeasure = useCallback(() => {
    layerGroupRef.current.clearLayers();
    pointsRef.current = [];
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
      map.off("click");
      return;
    }

    const formatDist = (m: number) => m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${m.toFixed(0)} m`;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      pointsRef.current.push(latlng);

      // Rebuild all drawings
      group.clearLayers();

      // Polyline
      if (pointsRef.current.length > 1) {
        L.polyline(pointsRef.current, {
          color: "#4a7c59",
          weight: 3,
          opacity: 0.85,
          dashArray: "8, 6",
        }).addTo(group);
      }

      // Circle markers + segment labels
      let totalDistance = 0;
      pointsRef.current.forEach((pt, i) => {
        // Circle marker at each point
        L.circleMarker(pt, {
          radius: 5,
          fillColor: i === 0 ? "#d4a96a" : "#4a7c59",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
        }).addTo(group);

        // Segment distance label
        if (i > 0) {
          const segDist = pointsRef.current[i - 1].distanceTo(pt);
          totalDistance += segDist;
          const midLat = (pointsRef.current[i - 1].lat + pt.lat) / 2;
          const midLng = (pointsRef.current[i - 1].lng + pt.lng) / 2;

          L.marker([midLat, midLng], {
            icon: L.divIcon({
              className: "measure-label",
              html: `<span style="
                background: rgba(74,124,89,0.92);
                color: #fff;
                padding: 2px 6px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: 700;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                font-family: 'JetBrains Mono', monospace;
              ">${formatDist(segDist)}</span>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            }),
            interactive: false,
          }).addTo(group);
        }
      });

      // Total distance label at last point
      if (pointsRef.current.length > 1) {
        const lastPt = pointsRef.current[pointsRef.current.length - 1];
        L.marker([lastPt.lat, lastPt.lng], {
          icon: L.divIcon({
            className: "measure-total-label",
            html: `<span style="
              background: rgba(212,169,106,0.95);
              color: #fff;
              padding: 3px 8px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 800;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              font-family: 'JetBrains Mono', monospace;
              display: block;
              margin-top: -24px;
              margin-left: 12px;
            ">Total: ${formatDist(totalDistance)}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(group);
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

function MapView({ layers, baseMap, onFeatureClick, zoomToExtentTrigger, locateMeTrigger, onZoomChange, onMouseMove, searchTarget, isMeasuring, onMeasureUpdate, clearMeasureTrigger }: MapViewProps) {
  const visibleLayers = layers.filter(l => l.visible);

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
      style={{ background: "#e8f0fe" }}
    >
      <ZoomControl position="bottomleft" />
      <BaseMapLayer baseMap={baseMap} />

      <MapController
        zoomToExtentTrigger={zoomToExtentTrigger}
        locateMeTrigger={locateMeTrigger}
      />

      <MapEventsTracker onZoomChange={onZoomChange} onMouseMove={onMouseMove} />

      <SearchController feature={searchTarget || null} />

      {isMeasuring && <MeasureController enabled={isMeasuring} onDistanceUpdate={onMeasureUpdate || (() => { })} clearTrigger={clearMeasureTrigger} />}

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
