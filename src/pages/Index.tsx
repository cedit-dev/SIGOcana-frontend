import { useState, useCallback } from "react";
import GISHeader from "@/components/gis/GISHeader";
import MapView, { BaseMapKey, BASE_MAPS } from "@/components/gis/MapView";
import LayerPanel from "@/components/gis/LayerPanel";
import DashboardPanel from "@/components/gis/DashboardPanel";
import MapToolbar from "@/components/gis/MapToolbar";
import FeatureInfoPanel from "@/components/gis/FeatureInfoPanel";
import LegendPanel from "@/components/gis/LegendPanel";
import MapStatusBar from "@/components/gis/MapStatusBar";
import { LAYERS_CONFIG, LayerConfig, OCANA_ZOOM } from "@/data/ocana-geodata";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [layers, setLayers] = useState<LayerConfig[]>(LAYERS_CONFIG);
  const [baseMap, setBaseMap] = useState<BaseMapKey>("osm");
  const [layersPanelOpen, setLayersPanelOpen] = useState(true);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSON.Feature | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState(0);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [zoom, setZoom] = useState(OCANA_ZOOM);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  }, []);

  const setOpacity = useCallback((id: string, opacity: number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, opacity } : l));
  }, []);

  const handleFeatureClick = useCallback((feature: GeoJSON.Feature) => {
    setSelectedFeature(feature);
  }, []);

  const handleZoomToExtent = useCallback(() => {
    setZoomTrigger(prev => prev + 1);
    toast({
      title: "Extensión Total",
      description: "Ajustando vista a los límites municipales de Ocaña.",
    });
  }, [toast]);

  const handleLocateMe = useCallback(() => {
    setLocateTrigger(prev => prev + 1);
    toast({
      title: "Ubicación",
      description: "Buscando ubicación actual...",
    });
  }, [toast]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExport = useCallback(() => {
    toast({
      title: "Exportar Datos",
      description: "Generando archivo CSV con la información de las capas activas...",
    });
  }, [toast]);

  const activeLayers = layers.filter(l => l.visible).length;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <GISHeader onSearch={(q) => toast({ title: "Búsqueda", description: `Buscando: ${q}` })} />

      <div className="flex-1 relative">
        {/* Toolbar */}
        <MapToolbar
          onToggleLayers={() => setLayersPanelOpen(p => !p)}
          onToggleDashboard={() => setDashboardOpen(p => !p)}
          onZoomToExtent={handleZoomToExtent}
          onPrint={handlePrint}
          onExport={handleExport}
          onLocateMe={handleLocateMe}
          onMeasure={() => toast({ title: "Herramienta de Medición", description: "Haga clic en el mapa para empezar a medir." })}
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
          zoomToExtentTrigger={zoomTrigger}
          locateMeTrigger={locateTrigger}
          onZoomChange={setZoom}
          onMouseMove={setMouseCoords}
        />

        {/* Feature Info */}
        <FeatureInfoPanel
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />

        {/* Legend */}
        <LegendPanel layers={layers} />

        {/* Status Bar */}
        <MapStatusBar
          zoom={zoom}
          coords={mouseCoords}
          activeLayers={activeLayers}
          totalLayers={layers.length}
          baseMapName={BASE_MAPS[baseMap].name}
        />
      </div>
    </div>
  );
};

export default Index;
