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

// Fix leaflet default icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
});

const BASE_MAPS = {
  osm: { name: "OpenStreetMap", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap" },
  satellite: { name: "Satélite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: "&copy; Esri" },
  topo: { name: "Topográfico", url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenTopoMap" },
  dark: { name: "Oscuro", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attribution: "&copy; CARTO" },
};

type BaseMapKey = keyof typeof BASE_MAPS;

interface MapViewProps {
  layers: LayerConfig[];
  baseMap: BaseMapKey;
  onFeatureClick: (feature: GeoJSON.Feature) => void;
  zoomToExtentTrigger?: number;
  locateMeTrigger?: number;
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
                    <span className="attr-label">{k.replace(/_/g, " ")}</span>
                    <span className="attr-value">{String(v)}</span>
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

  useEffect(() => {
    if (zoomToExtentTrigger) {
      map.setView(OCANA_CENTER, OCANA_ZOOM);
    }
  }, [zoomToExtentTrigger, map]);

  useEffect(() => {
    if (locateMeTrigger) {
      map.locate({ setView: true, maxZoom: 16 });
    }
  }, [locateMeTrigger, map]);

  useEffect(() => {
    map.on("locationfound", (e) => {
      setUserLocation(e.latlng);
    });
    // Clean up event listener on unmount
    return () => {
      map.off("locationfound");
    };
  }, [map]);

  return userLocation ? (
    <>
      <Marker position={userLocation}>
        <Popup>Te encuentras aquí</Popup>
      </Marker>
      <Circle center={userLocation} radius={100} pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.1 }} />
    </>
  ) : null;
}

export default function MapView({ layers, baseMap, onFeatureClick, zoomToExtentTrigger, locateMeTrigger }: MapViewProps) {
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

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties) {
      const props = feature.properties;
      let html = `<div class="custom-popup"><h3>${props.nombre || "Sin nombre"}</h3>`;
      Object.entries(props).filter(([k]) => k !== "nombre").forEach(([k, v]) => {
        html += `<div class="attr-row"><span class="attr-label">${k.replace(/_/g, " ")}</span><span class="attr-value">${v}</span></div>`;
      });
      html += "</div>";
      (layer as L.Path).bindPopup(html);
      (layer as L.Path).on("click", () => onFeatureClick?.(feature));
    }
  };

  return (
    <MapContainer
      center={OCANA_CENTER}
      zoom={OCANA_ZOOM}
      zoomControl={false}
      className="w-full h-full"
      style={{ background: "#e8f0fe" }}
    >
      <ZoomControl position="bottomright" />
      <BaseMapLayer baseMap={baseMap} />

      <MapController
        zoomToExtentTrigger={zoomToExtentTrigger}
        locateMeTrigger={locateMeTrigger}
      />

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
            onEachFeature={onEachFeature}
          />
        );
      })}
    </MapContainer>
  );
}

export { BASE_MAPS, type BaseMapKey };
