import { useState, useCallback } from "react";
import { MapContainer, GeoJSON, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { OCANA_CENTER, OCANA_ZOOM, LayerConfig } from "@/data/ocana-geodata";
import { BaseMapKey } from "@/data/base-maps";

// Fix leaflet default icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

// Sub-components
import BaseMapLayer from "./map/BaseMapLayer";
import PointLayer from "./map/PointLayer";
import MapController from "./map/MapController";
import MapEventsTracker from "./map/MapEventsTracker";
import SearchController from "./map/SearchController";
import RoutingController from "./map/RoutingController";
import MeasureController from "./map/MeasureController";
import AreaMeasureController from "./map/AreaMeasureController";
import BufferController from "./map/BufferController";
import HeatmapController from "./map/HeatmapController";
import { GEOJSON_MAP, POINT_LAYERS, PROP_LABELS, ESTRATO_COLORS, USO_COLORS } from "./map/constants";

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
  distance: number;
  duration: number;
  maneuver?: string;
  name?: string;
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
  onClearRoute?: () => void;
  clearRouteTrigger?: number;
  isMeasuringArea?: boolean;
  onAreaUpdate?: (area: number) => void;
  clearAreaTrigger?: number;
  isBuffering?: boolean;
  bufferRadius?: number;
  onBufferCreated?: (count: number) => void;
  clearBufferTrigger?: number;
  isHeatmap?: boolean;
}

function MapView({ layers, baseMap, onFeatureClick, zoomToExtentTrigger, locateMeTrigger, onZoomChange, onMouseMove, searchTarget, isMeasuring, onMeasureUpdate, clearMeasureTrigger, isRouting, onRouteFound, onLoadingRouteChange, onRouteError, onClearRoute, clearRouteTrigger, isMeasuringArea, onAreaUpdate, clearAreaTrigger, isBuffering, bufferRadius, onBufferCreated, clearBufferTrigger, isHeatmap }: MapViewProps) {
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

      <MeasureController enabled={isMeasuring || false} onDistanceUpdate={onMeasureUpdate || (() => { })} clearTrigger={clearMeasureTrigger} />

      <RoutingController enabled={(isRouting && !!userLocation) || false} userLocation={userLocation} onRouteFound={onRouteFound || (() => { })} onLoadingChange={onLoadingRouteChange} onError={onRouteError} onClearRoute={onClearRoute} clearTrigger={clearRouteTrigger} />

      <AreaMeasureController enabled={isMeasuringArea || false} onAreaUpdate={onAreaUpdate || (() => { })} clearTrigger={clearAreaTrigger} />

      <BufferController enabled={isBuffering || false} radiusMeters={bufferRadius || 500} onBufferCreated={onBufferCreated} clearTrigger={clearBufferTrigger} />

      <HeatmapController enabled={isHeatmap || false} />

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
