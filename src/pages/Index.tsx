import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import GISHeader from "@/components/gis/GISHeader";
import MapView from "@/components/gis/MapView";
import { BASE_MAPS } from "@/data/base-maps";
import LayerPanel from "@/components/gis/LayerPanel";
import MapToolbar from "@/components/gis/MapToolbar";
import FeatureInfoPanel from "@/components/gis/FeatureInfoPanel";
import LegendPanel from "@/components/gis/LegendPanel";
import MapStatusBar from "@/components/gis/MapStatusBar";
import DirectionsPanel from "@/components/gis/DirectionsPanel";
import RoutingHelpTip from "@/components/gis/RoutingHelpTip";
import RoutingLoadingIndicator from "@/components/gis/RoutingLoadingIndicator";
import AdminPanel from "@/components/gis/AdminPanel";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { clearStoredSession, getStoredSession, isSuperAdmin } from "@/lib/auth";
import { MapProvider, useMapContext } from "@/components/gis/MapContext";

const DashboardPanel = lazy(() => import("@/components/gis/DashboardPanel"));

const IndexContent = () => {
  const isMobile = useIsMobile();
  const [session, setSession] = useState(() => getStoredSession());
  const canAdmin = isSuperAdmin(session);
  const { toast, dismiss } = useToast();
  
  const {
    layers,
    dataMap,
    pointLayerIds,
    baseMap,
    setBaseMap,
    toggleLayer,
    setOpacity,
    tools,
    zoom,
    setZoom,
    mouseCoords,
    setMouseCoords,
    searchTarget,
    setSearchTarget,
    selectedFeature,
    setSelectedFeature,
    zoomTrigger,
    setZoomTrigger,
    locateTrigger,
    setLocateTrigger,
    createLayer,
    deleteLayer,
    updateLayer,
    importLayer,
    addPoint,
    updatePoint,
    deletePoint,
    resetSystem,
  } = useMapContext();

  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [isPickingAdminPoint, setIsPickingAdminPoint] = useState(false);
  const [pickedAdminCoords, setPickedAdminCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const sync = () => setSession(getStoredSession());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => () => { dismiss(); }, [dismiss]);

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    setAdminPanelOpen(false);
    setIsPickingAdminPoint(false);
    toast({ title: "Sesión cerrada", description: "Volviste al modo usuario normal." });
  };

  const handlePrint = () => {
    const toolbars = document.querySelectorAll("[class*='absolute'][class*='z-']");
    const header = document.querySelector("header");
    if (header) header.classList.add("print-hide");
    toolbars.forEach((el) => el.classList.add("print-hide"));
    window.print();
    const printAfter = () => {
      if (header) header.classList.remove("print-hide");
      toolbars.forEach((el) => el.classList.remove("print-hide"));
      window.removeEventListener("afterprint", printAfter);
    };
    window.addEventListener("afterprint", printAfter);
  };

  const handleExport = () => {
    const visibleLayers = layers.filter((l) => l.visible && dataMap[l.id]);
    const allFeatures: GeoJSON.Feature[] = [];
    visibleLayers.forEach((layer) => {
      const data = dataMap[layer.id];
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
    toast({ title: "Exportación exitosa", description: `Se descargaron ${allFeatures.length} registros.` });
  };

  const handleToggleAdminPointPicker = () => {
    if (!canAdmin) return;
    if (!isPickingAdminPoint) {
      tools.deactivateAll();
      setIsPickingAdminPoint(true);
      toast({ title: "Selección de punto activada", description: "Haz clic en el mapa." });
    } else {
      setIsPickingAdminPoint(false);
      toast({ title: "Selección cancelada" });
    }
  };

  const handleAdminPointPick = (coords: { lat: number; lng: number }) => {
    setPickedAdminCoords(coords);
    setIsPickingAdminPoint(false);
    toast({ title: "Ubicación capturada", description: `Lat ${coords.lat.toFixed(6)}, Lng ${coords.lng.toFixed(6)}` });
  };

  const activeLayersCount = layers.filter((l) => l.visible).length;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <GISHeader
        onFeatureSelect={setSearchTarget}
        currentUser={session}
        onLogout={handleLogout}
        onToggleAdminPanel={() => setAdminPanelOpen((p) => !p)}
        adminPanelOpen={adminPanelOpen}
      />

      <RoutingHelpTip />

      <div className="flex-1 relative">
        {(!isMobile || !dashboardOpen) && (
          <MapToolbar
            onToggleLayers={() => {
              if (isMobile) setDashboardOpen(false);
              setLayersPanelOpen((p) => !p);
            }}
            onToggleDashboard={() => {
              if (isMobile) setLayersPanelOpen(false);
              setDashboardOpen((p) => !p);
            }}
            onZoomToExtent={() => setZoomTrigger((p) => p + 1)}
            onPrint={handlePrint}
            onExport={handleExport}
            onLocateMe={() => setLocateTrigger((p) => p + 1)}
            onMeasure={() => tools.toggleTool("measure")}
            onMeasureArea={() => tools.toggleTool("measureArea")}
            onToggleRouting={() => {
              setLocateTrigger((p) => p + 1);
              tools.toggleTool("routing");
            }}
            onToggleBuffer={() => tools.toggleTool("buffer")}
            onToggleHeatmap={tools.toggleHeatmap}
            layersOpen={layersPanelOpen}
            dashboardOpen={dashboardOpen}
            isMeasuring={tools.activeTool === "measure"}
            isMeasuringArea={tools.activeTool === "measureArea"}
            isRouting={tools.activeTool === "routing"}
            isBuffering={tools.activeTool === "buffer"}
            isHeatmap={tools.isHeatmap}
            baseMap={baseMap}
            onBaseMapChange={setBaseMap}
            bufferRadius={tools.bufferRadius}
            onBufferRadiusChange={tools.setBufferRadius}
          />
        )}

        <LayerPanel
          layers={layers}
          onToggleLayer={toggleLayer}
          onOpacityChange={setOpacity}
          isOpen={layersPanelOpen}
          onClose={() => setLayersPanelOpen(false)}
        />

        {canAdmin && (
          <AdminPanel
            isOpen={adminPanelOpen}
            onClose={() => setAdminPanelOpen(false)}
            layers={layers}
            dataMap={dataMap}
            onCreateLayer={createLayer}
            onUpdateLayer={updateLayer}
            onImportLayer={importLayer}
            onDeleteLayer={deleteLayer}
            onAddPoint={addPoint}
            onUpdatePoint={updatePoint}
            onDeletePoint={deletePoint}
            onFocusFeature={(f) => { setSearchTarget(f); setSelectedFeature(f); }}
            onResetSystem={resetSystem}
            onToggleMapPicker={handleToggleAdminPointPicker}
            isPickingFromMap={isPickingAdminPoint}
            pickedCoords={pickedAdminCoords}
          />
        )}

        <Suspense fallback={null}>
          <DashboardPanel isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} />
        </Suspense>

        <MapView
          onFeatureClick={setSelectedFeature}
          isPickingAdminPoint={isPickingAdminPoint}
          onAdminPointPick={handleAdminPointPick}
        />

        {tools.activeTool === "measure" && tools.measureDistance !== null && tools.measureDistance > 0 && (
          <button
            onClick={() => tools.clearToolData("measure")}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #4a7c59, #5d9a6e)", boxShadow: "0 4px 16px rgba(74,124,89,0.4)" }}
          >
            Borrar trazo
          </button>
        )}

        {tools.activeTool === "measureArea" && tools.measureArea !== null && tools.measureArea > 0 && (
          <button
            onClick={() => tools.clearToolData("measureArea")}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #c4945a, #d4a96a)", boxShadow: "0 4px 16px rgba(196,148,90,0.4)" }}
          >
            Borrar área
          </button>
        )}

        {tools.activeTool === "buffer" && (
          <button
            onClick={() => tools.clearToolData("buffer")}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #2d8a6e, #3a9b7e)", boxShadow: "0 4px 16px rgba(45,138,110,0.4)" }}
          >
            Borrar buffers
          </button>
        )}

        <FeatureInfoPanel feature={selectedFeature} onClose={() => setSelectedFeature(null)} />

        <AnimatePresence>
          {tools.routeInfo && (
            <DirectionsPanel
              distance={tools.routeInfo.distance}
              duration={tools.routeInfo.duration}
              steps={tools.routeInfo.steps}
              onClear={() => tools.clearToolData("routing")}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>{tools.isLoadingRoute && <RoutingLoadingIndicator onCancel={() => tools.clearToolData("routing")} />}</AnimatePresence>

        <LegendPanel layers={layers} onToggleLayer={toggleLayer} />

        <MapStatusBar
          zoom={zoom}
          coords={mouseCoords}
          activeLayers={activeLayersCount}
          totalLayers={layers.length}
          baseMapName={BASE_MAPS[baseMap].name}
          measureDistance={tools.measureDistance}
        />
      </div>
    </div>
  );
};

const Index = () => (
  <MapProvider>
    <IndexContent />
  </MapProvider>
);

export default Index;
