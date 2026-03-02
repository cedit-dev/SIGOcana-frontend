import { useState, useCallback } from "react";
import GISHeader from "@/components/gis/GISHeader";
import MapView, { BaseMapKey } from "@/components/gis/MapView";
import LayerPanel from "@/components/gis/LayerPanel";
import DashboardPanel from "@/components/gis/DashboardPanel";
import MapToolbar from "@/components/gis/MapToolbar";
import FeatureInfoPanel from "@/components/gis/FeatureInfoPanel";
import LegendPanel from "@/components/gis/LegendPanel";
import { LAYERS_CONFIG, LayerConfig } from "@/data/ocana-geodata";

const Index = () => {
  const [layers, setLayers] = useState<LayerConfig[]>(LAYERS_CONFIG);
  const [baseMap, setBaseMap] = useState<BaseMapKey>("osm");
  const [layersPanelOpen, setLayersPanelOpen] = useState(true);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSON.Feature | null>(null);

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  }, []);

  const setOpacity = useCallback((id: string, opacity: number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, opacity } : l));
  }, []);

  const handleFeatureClick = useCallback((feature: GeoJSON.Feature) => {
    setSelectedFeature(feature);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <GISHeader />

      <div className="flex-1 relative">
        {/* Toolbar */}
        <MapToolbar
          onToggleLayers={() => setLayersPanelOpen(p => !p)}
          onToggleDashboard={() => setDashboardOpen(p => !p)}
          layersOpen={layersPanelOpen}
          dashboardOpen={dashboardOpen}
        />

        {/* Layer Panel */}
        <LayerPanel
          layers={layers}
          onToggleLayer={toggleLayer}
          onOpacityChange={setOpacity}
          baseMap={baseMap}
          onBaseMapChange={setBaseMap}
          isOpen={layersPanelOpen}
          onClose={() => setLayersPanelOpen(false)}
        />

        {/* Dashboard Panel */}
        <DashboardPanel
          isOpen={dashboardOpen}
          onClose={() => setDashboardOpen(false)}
        />

        {/* Map */}
        <MapView
          layers={layers}
          baseMap={baseMap}
          onFeatureClick={handleFeatureClick}
        />

        {/* Feature Info */}
        <FeatureInfoPanel
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />

        {/* Legend */}
        <LegendPanel layers={layers} />
      </div>
    </div>
  );
};

export default Index;
