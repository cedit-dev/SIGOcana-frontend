import { useState, useCallback, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import GISHeader from "@/components/gis/GISHeader";
import MapView, { DirectionStep } from "@/components/gis/MapView";
import { BASE_MAPS, BaseMapKey } from "@/data/base-maps";
import LayerPanel from "@/components/gis/LayerPanel";
const DashboardPanel = lazy(() => import("@/components/gis/DashboardPanel"));
import MapToolbar from "@/components/gis/MapToolbar";
import FeatureInfoPanel from "@/components/gis/FeatureInfoPanel";
import LegendPanel from "@/components/gis/LegendPanel";
import MapStatusBar from "@/components/gis/MapStatusBar";
import DirectionsPanel from "@/components/gis/DirectionsPanel";
import RoutingHelpTip from "@/components/gis/RoutingHelpTip";
import RoutingLoadingIndicator from "@/components/gis/RoutingLoadingIndicator";
import { LAYERS_CONFIG, LayerConfig, OCANA_ZOOM, comunasGeoJSON, barriosGeoJSON, educacionGeoJSON, saludGeoJSON, gobiernoGeoJSON, proyectosGeoJSON } from "@/data/ocana-geodata";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Helper to deactivate all tools
type ToolName = "measure" | "measureArea" | "routing" | "buffer";

const Index = () => {
  const isMobile = useIsMobile();
  const [layers, setLayers] = useState<LayerConfig[]>(LAYERS_CONFIG);
  const [baseMap, setBaseMap] = useState<BaseMapKey>("osm");
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSON.Feature | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState(0);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [zoom, setZoom] = useState(OCANA_ZOOM);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTarget, setSearchTarget] = useState<GeoJSON.Feature | null>(null);
  const { toast } = useToast();

  // Tool states
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureDistance, setMeasureDistance] = useState<number | null>(null);
  const [clearMeasureTrigger, setClearMeasureTrigger] = useState(0);

  const [isMeasuringArea, setIsMeasuringArea] = useState(false);
  const [measureArea, setMeasureArea] = useState<number | null>(null);
  const [clearAreaTrigger, setClearAreaTrigger] = useState(0);

  const [isRouting, setIsRouting] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; steps: DirectionStep[] } | null>(null);
  const [clearRouteTrigger, setClearRouteTrigger] = useState(0);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferRadius, setBufferRadius] = useState(500);
  const [clearBufferTrigger, setClearBufferTrigger] = useState(0);

  const [isHeatmap, setIsHeatmap] = useState(false);

  // Deactivate all tools except the one being activated
  const deactivateToolsExcept = useCallback((except?: ToolName) => {
    if (except !== "measure" && isMeasuring) {
      setClearMeasureTrigger(p => p + 1);
      setMeasureDistance(null);
      setIsMeasuring(false);
    }
    if (except !== "measureArea" && isMeasuringArea) {
      setClearAreaTrigger(p => p + 1);
      setMeasureArea(null);
      setIsMeasuringArea(false);
    }
    if (except !== "routing" && isRouting) {
      setClearRouteTrigger(p => p + 1);
      setRouteInfo(null);
      setIsRouting(false);
    }
    if (except !== "buffer" && isBuffering) {
      setIsBuffering(false);
    }
  }, [isMeasuring, isMeasuringArea, isRouting, isBuffering]);

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
    toast({ title: "Extensión Total", description: "Ajustando vista a los límites municipales de Ocaña." });
  }, [toast]);

  const handleLocateMe = useCallback(() => {
    setLocateTrigger(prev => prev + 1);
    toast({ title: "Ubicación", description: "Buscando ubicación actual..." });
  }, [toast]);

  const handlePrint = useCallback(() => {
    const toolbars = document.querySelectorAll("[class*='absolute'][class*='z-']");
    const header = document.querySelector("header");
    if (header) header.classList.add("print-hide");
    toolbars.forEach(el => el.classList.add("print-hide"));
    window.print();
    const printAfter = () => {
      if (header) header.classList.remove("print-hide");
      toolbars.forEach(el => el.classList.remove("print-hide"));
      window.removeEventListener("afterprint", printAfter);
    };
    window.addEventListener("afterprint", printAfter);
  }, []);

  const handleExport = useCallback(() => {
    const GEOJSON_MAP: Record<string, GeoJSON.FeatureCollection> = {
      comunas: comunasGeoJSON, barrios: barriosGeoJSON, educacion: educacionGeoJSON,
      salud: saludGeoJSON, gobierno: gobiernoGeoJSON, proyectos: proyectosGeoJSON,
    };
    const visibleLayers = layers.filter(l => l.visible && GEOJSON_MAP[l.id]);
    const allFeatures: GeoJSON.Feature[] = [];
    visibleLayers.forEach(layer => {
      const data = GEOJSON_MAP[layer.id];
      if (data) allFeatures.push(...data.features);
    });
    const featureCollection: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: allFeatures };
    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sigocana-export-${new Date().toISOString().split("T")[0]}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exportación Exitosa", description: `Se descargó el archivo con ${allFeatures.length} features de ${visibleLayers.length} capas.` });
  }, [layers, toast]);

  // Tool handlers — mutual exclusion
  const handleMeasure = useCallback(() => {
    if (isMeasuring) {
      setIsMeasuring(false);
      toast({ title: "Modo Medición Desactivado", description: "Medición finalizada." });
    } else {
      deactivateToolsExcept("measure");
      setIsMeasuring(true);
      setMeasureDistance(null);
      toast({ title: "Medir Distancia", description: "Haga clic en el mapa para crear puntos de medición." });
    }
  }, [isMeasuring, deactivateToolsExcept, toast]);

  const handleMeasureArea = useCallback(() => {
    if (isMeasuringArea) {
      setIsMeasuringArea(false);
      toast({ title: "Medición de Área Desactivada", description: "Medición finalizada." });
    } else {
      deactivateToolsExcept("measureArea");
      setIsMeasuringArea(true);
      setMeasureArea(null);
      toast({ title: "Medir Área", description: "Haga clic en el mapa para crear vértices del polígono." });
    }
  }, [isMeasuringArea, deactivateToolsExcept, toast]);

  const handleClearMeasure = useCallback(() => {
    setClearMeasureTrigger(prev => prev + 1);
    setMeasureDistance(null);
    setIsMeasuring(false);
    toast({ title: "Trazo Borrado", description: "Se eliminaron todos los trazos de medición." });
  }, [toast]);

  const handleClearArea = useCallback(() => {
    setClearAreaTrigger(prev => prev + 1);
    setMeasureArea(null);
    setIsMeasuringArea(false);
    toast({ title: "Área Borrada", description: "Se eliminó el polígono de medición." });
  }, [toast]);

  const handleToggleRouting = useCallback(() => {
    if (isRouting) {
      setClearRouteTrigger(prev => prev + 1);
      setRouteInfo(null);
      setIsRouting(false);
    } else {
      deactivateToolsExcept("routing");
      setLocateTrigger(prev => prev + 1);
      setIsRouting(true);
      toast({ title: "Trazar Ruta", description: "Haz clic en el mapa para elegir el destino." });
    }
  }, [isRouting, deactivateToolsExcept, toast]);

  const handleClearRoute = useCallback(() => {
    setClearRouteTrigger(prev => prev + 1);
    setRouteInfo(null);
    setIsRouting(false);
  }, []);

  const handleToggleBuffer = useCallback(() => {
    if (isBuffering) {
      setIsBuffering(false);
    } else {
      deactivateToolsExcept("buffer");
      setIsBuffering(true);
      toast({ title: "Buffer Activado", description: `Haz clic en el mapa para crear zonas de ${bufferRadius}m.` });
    }
  }, [isBuffering, bufferRadius, deactivateToolsExcept, toast]);

  const handleClearBuffer = useCallback(() => {
    setClearBufferTrigger(prev => prev + 1);
    setIsBuffering(false);
    toast({ title: "Buffers Borrados", description: "Se eliminaron todas las zonas de buffer." });
  }, [toast]);

  const handleToggleHeatmap = useCallback(() => {
    setIsHeatmap(p => !p);
    toast({
      title: isHeatmap ? "Mapa de Calor Desactivado" : "Mapa de Calor Activado",
      description: isHeatmap ? "Se ocultó la capa de densidad." : "Mostrando densidad de puntos de interés.",
    });
  }, [isHeatmap, toast]);

  const activeLayers = layers.filter(l => l.visible).length;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <GISHeader onFeatureSelect={setSearchTarget} />

      <RoutingHelpTip />

      <div className="flex-1 relative">
        {(!isMobile || !dashboardOpen) && <MapToolbar
          onToggleLayers={() => {
            if (isMobile) setDashboardOpen(false);
            setLayersPanelOpen(p => !p);
          }}
          onToggleDashboard={() => {
            const opening = !dashboardOpen;
            if (opening && isMobile) setLayersPanelOpen(false);
            setDashboardOpen(p => !p);
          }}
          onZoomToExtent={handleZoomToExtent}
          onPrint={handlePrint}
          onExport={handleExport}
          onLocateMe={handleLocateMe}
          onMeasure={handleMeasure}
          onMeasureArea={handleMeasureArea}
          onToggleRouting={handleToggleRouting}
          onToggleBuffer={handleToggleBuffer}
          onToggleHeatmap={handleToggleHeatmap}
          layersOpen={layersPanelOpen}
          dashboardOpen={dashboardOpen}
          isMeasuring={isMeasuring}
          isMeasuringArea={isMeasuringArea}
          isRouting={isRouting}
          isBuffering={isBuffering}
          isHeatmap={isHeatmap}
          baseMap={baseMap}
          onBaseMapChange={setBaseMap}
          bufferRadius={bufferRadius}
          onBufferRadiusChange={setBufferRadius}
        />}

        <LayerPanel
          layers={layers}
          onToggleLayer={toggleLayer}
          onOpacityChange={setOpacity}
          isOpen={layersPanelOpen}
          onClose={() => setLayersPanelOpen(false)}
        />

        <Suspense fallback={null}>
          <DashboardPanel
            isOpen={dashboardOpen}
            onClose={() => setDashboardOpen(false)}
          />
        </Suspense>

        <MapView
          layers={layers}
          baseMap={baseMap}
          onFeatureClick={handleFeatureClick}
          zoomToExtentTrigger={zoomTrigger}
          locateMeTrigger={locateTrigger}
          onZoomChange={setZoom}
          onMouseMove={setMouseCoords}
          searchTarget={searchTarget}
          isMeasuring={isMeasuring}
          onMeasureUpdate={setMeasureDistance}
          clearMeasureTrigger={clearMeasureTrigger}
          isRouting={isRouting}
          onRouteFound={setRouteInfo}
          onLoadingRouteChange={setIsLoadingRoute}
          onRouteError={(msg) => toast({ title: "Error de Ruta", description: msg, variant: "destructive" })}
          onClearRoute={handleClearRoute}
          clearRouteTrigger={clearRouteTrigger}
          isMeasuringArea={isMeasuringArea}
          onAreaUpdate={setMeasureArea}
          clearAreaTrigger={clearAreaTrigger}
          isBuffering={isBuffering}
          bufferRadius={bufferRadius}
          clearBufferTrigger={clearBufferTrigger}
          isHeatmap={isHeatmap}
        />

        {/* Measure Distance Clear */}
        {isMeasuring && measureDistance !== null && measureDistance > 0 && (
          <button
            onClick={handleClearMeasure}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #4a7c59, #5d9a6e)", boxShadow: "0 4px 16px rgba(74,124,89,0.4)" }}
          >
            Borrar Trazo
          </button>
        )}

        {/* Measure Area Clear */}
        {isMeasuringArea && measureArea !== null && measureArea > 0 && (
          <button
            onClick={handleClearArea}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #c4945a, #d4a96a)", boxShadow: "0 4px 16px rgba(196,148,90,0.4)" }}
          >
            Borrar Área
          </button>
        )}

        {/* Buffer Clear */}
        {isBuffering && (
          <button
            onClick={handleClearBuffer}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #2d8a6e, #3a9b7e)", boxShadow: "0 4px 16px rgba(45,138,110,0.4)" }}
          >
            Borrar Buffers
          </button>
        )}

        <FeatureInfoPanel
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />

        <AnimatePresence>
          {routeInfo && (
            <DirectionsPanel
              distance={routeInfo.distance}
              duration={routeInfo.duration}
              steps={routeInfo.steps}
              onClear={handleClearRoute}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLoadingRoute && <RoutingLoadingIndicator onCancel={handleClearRoute} />}
        </AnimatePresence>

        <LegendPanel layers={layers} onToggleLayer={toggleLayer} />

        <MapStatusBar
          zoom={zoom}
          coords={mouseCoords}
          activeLayers={activeLayers}
          totalLayers={layers.length}
          baseMapName={BASE_MAPS[baseMap].name}
          measureDistance={measureDistance}
        />
      </div>
    </div>
  );
};

export default Index;
