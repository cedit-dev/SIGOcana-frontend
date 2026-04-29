import { useState, useCallback, useEffect, lazy, Suspense, useMemo } from "react";
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
import AdminPanel from "@/components/gis/AdminPanel";
import { LayerConfig, OCANA_ZOOM } from "@/data/ocana-geodata";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { clearStoredSession, getStoredSession, isSuperAdmin } from "@/lib/auth";
import {
  createEmptyFeatureCollection,
  createPointFeature,
  detectGeometryType,
  loadAdminMapState,
  resetAdminMapState,
  saveAdminMapState,
} from "@/lib/map-admin";
import { STATIC_GEOJSON_MAP } from "@/components/gis/map/constants";

type ToolName = "measure" | "measureArea" | "routing" | "buffer";

const normalizeId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const Index = () => {
  const isMobile = useIsMobile();
  const [session, setSession] = useState(() => getStoredSession());
  const canAdmin = isSuperAdmin(session);
  const initialState = useMemo(() => loadAdminMapState(), []);
  const [layers, setLayers] = useState<LayerConfig[]>(initialState.layers);
  const [dataOverrides, setDataOverrides] = useState<Record<string, GeoJSON.FeatureCollection>>(initialState.dataOverrides);
  const dataMap = useMemo(() => ({ ...STATIC_GEOJSON_MAP, ...dataOverrides }), [dataOverrides]);
  const pointLayerIds = useMemo(
    () =>
      new Set(
        layers
          .filter((layer) => layer.geometryType === "Point" || detectGeometryType(dataMap[layer.id]) === "Point")
          .map((layer) => layer.id),
      ),
    [dataMap, layers],
  );

  const [baseMap, setBaseMap] = useState<BaseMapKey>("osm");
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [isPickingAdminPoint, setIsPickingAdminPoint] = useState(false);
  const [pickedAdminCoords, setPickedAdminCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSON.Feature | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState(0);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [zoom, setZoom] = useState(OCANA_ZOOM);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTarget, setSearchTarget] = useState<GeoJSON.Feature | null>(null);
  const { toast, dismiss } = useToast();

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

  useEffect(() => {
    saveAdminMapState({ layers, dataOverrides });
  }, [dataOverrides, layers]);

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

  const deactivateToolsExcept = useCallback((except?: ToolName) => {
    if (except !== "measure" && isMeasuring) {
      setClearMeasureTrigger((p) => p + 1);
      setMeasureDistance(null);
      setIsMeasuring(false);
    }
    if (except !== "measureArea" && isMeasuringArea) {
      setClearAreaTrigger((p) => p + 1);
      setMeasureArea(null);
      setIsMeasuringArea(false);
    }
    if (except !== "routing" && isRouting) {
      setClearRouteTrigger((p) => p + 1);
      setRouteInfo(null);
      setIsRouting(false);
    }
    if (except !== "buffer" && isBuffering) {
      setIsBuffering(false);
    }
  }, [isBuffering, isMeasuring, isMeasuringArea, isRouting]);

  const toggleLayer = useCallback((id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  }, []);

  const setOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, opacity } : l)));
  }, []);

  const handleFeatureClick = useCallback((feature: GeoJSON.Feature) => {
    setSelectedFeature(feature);
  }, []);

  const handleZoomToExtent = useCallback(() => {
    setZoomTrigger((prev) => prev + 1);
    toast({ title: "Extension total", description: "Ajustando vista a los limites municipales de Ocana." });
  }, [toast]);

  const handleLocateMe = useCallback(() => {
    setLocateTrigger((prev) => prev + 1);
    toast({ title: "Ubicacion", description: "Buscando ubicacion actual..." });
  }, [toast]);

  const handlePrint = useCallback(() => {
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
  }, []);

  const handleExport = useCallback(() => {
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
    toast({ title: "Exportacion exitosa", description: `Se descargaron ${allFeatures.length} registros de ${visibleLayers.length} capas.` });
  }, [dataMap, layers, toast]);

  const handleMeasure = useCallback(() => {
    if (isMeasuring) {
      setIsMeasuring(false);
      toast({ title: "Modo medicion desactivado", description: "Medicion finalizada." });
    } else {
      deactivateToolsExcept("measure");
      setIsMeasuring(true);
      setMeasureDistance(null);
      toast({ title: "Medir distancia", description: "Haz clic en el mapa para crear puntos de medicion." });
    }
  }, [deactivateToolsExcept, isMeasuring, toast]);

  const handleMeasureArea = useCallback(() => {
    if (isMeasuringArea) {
      setIsMeasuringArea(false);
      toast({ title: "Medicion de area desactivada", description: "Medicion finalizada." });
    } else {
      deactivateToolsExcept("measureArea");
      setIsMeasuringArea(true);
      setMeasureArea(null);
      toast({ title: "Medir area", description: "Haz clic en el mapa para crear vertices del poligono." });
    }
  }, [deactivateToolsExcept, isMeasuringArea, toast]);

  const handleClearMeasure = useCallback(() => {
    setClearMeasureTrigger((prev) => prev + 1);
    setMeasureDistance(null);
    setIsMeasuring(false);
    toast({ title: "Trazo borrado", description: "Se eliminaron todos los trazos de medicion." });
  }, [toast]);

  const handleClearArea = useCallback(() => {
    setClearAreaTrigger((prev) => prev + 1);
    setMeasureArea(null);
    setIsMeasuringArea(false);
    toast({ title: "Area borrada", description: "Se elimino el poligono de medicion." });
  }, [toast]);

  const handleToggleRouting = useCallback(() => {
    if (isRouting) {
      setClearRouteTrigger((prev) => prev + 1);
      setRouteInfo(null);
      setIsRouting(false);
    } else {
      deactivateToolsExcept("routing");
      setLocateTrigger((prev) => prev + 1);
      setIsRouting(true);
      toast({ title: "Trazar ruta", description: "Haz clic en el mapa para elegir el destino." });
    }
  }, [deactivateToolsExcept, isRouting, toast]);

  const handleClearRoute = useCallback(() => {
    setClearRouteTrigger((prev) => prev + 1);
    setRouteInfo(null);
    setIsRouting(false);
  }, []);

  const handleToggleBuffer = useCallback(() => {
    if (isBuffering) {
      setIsBuffering(false);
    } else {
      deactivateToolsExcept("buffer");
      setIsBuffering(true);
      toast({ title: "Buffer activado", description: `Haz clic en el mapa para crear zonas de ${bufferRadius}m.` });
    }
  }, [bufferRadius, deactivateToolsExcept, isBuffering, toast]);

  const handleClearBuffer = useCallback(() => {
    setClearBufferTrigger((prev) => prev + 1);
    setIsBuffering(false);
    toast({ title: "Buffers borrados", description: "Se eliminaron todas las zonas de buffer." });
  }, [toast]);

  const handleToggleHeatmap = useCallback(() => {
    setIsHeatmap((p) => !p);
    toast({
      title: isHeatmap ? "Mapa de calor desactivado" : "Mapa de calor activado",
      description: isHeatmap ? "Se oculto la capa de densidad." : "Mostrando densidad de puntos de interes.",
    });
  }, [isHeatmap, toast]);

  const handleLogout = useCallback(() => {
    clearStoredSession();
    setSession(null);
    setAdminPanelOpen(false);
    setIsPickingAdminPoint(false);
    toast({ title: "Sesion cerrada", description: "Volviste al modo usuario normal." });
  }, [toast]);

  const handleToggleAdminPointPicker = useCallback(() => {
    if (!canAdmin) return;

    if (!isPickingAdminPoint) {
      deactivateToolsExcept();
      setIsPickingAdminPoint(true);
      toast({
        title: "Seleccion de punto activada",
        description: "Haz clic en el mapa para capturar la ubicacion del nuevo punto.",
      });
      return;
    }

    setIsPickingAdminPoint(false);
    toast({
      title: "Seleccion cancelada",
      description: "Se desactivo la toma de coordenadas desde el mapa.",
    });
  }, [canAdmin, deactivateToolsExcept, isPickingAdminPoint, toast]);

  const handleAdminPointPick = useCallback((coords: { lat: number; lng: number }) => {
    setPickedAdminCoords(coords);
    setIsPickingAdminPoint(false);
    toast({
      title: "Ubicacion capturada",
      description: `Lat ${coords.lat}, Lng ${coords.lng}`,
    });
  }, [toast]);

  const handleCreateLayer = useCallback(
    (input: { name: string; category: string; color: string; icon: string; description: string }) => {
      if (!canAdmin) return;
      const name = input.name.trim();
      if (!name) {
        toast({ title: "Nombre requerido", description: "La capa necesita un nombre.", variant: "destructive" });
        return;
      }

      const id = normalizeId(name);
      if (layers.some((layer) => layer.id === id)) {
        toast({ title: "ID duplicado", description: "Ya existe una capa con ese nombre.", variant: "destructive" });
        return;
      }

      setLayers((prev) => [
        ...prev,
        {
          id,
          name,
          category: input.category,
          color: input.color || "#4a7c59",
          icon: input.icon || "MapPin",
          description: input.description || "Capa creada por super admin",
          visible: true,
          opacity: 1,
          geometryType: "Point",
          source: "custom",
        },
      ]);
      setDataOverrides((prev) => ({ ...prev, [id]: createEmptyFeatureCollection() }));
      toast({ title: "Capa creada", description: `La capa ${name} ya esta lista para recibir puntos.` });
    },
    [canAdmin, layers, toast],
  );

  const handleDeleteLayer = useCallback(
    (layerId: string) => {
      if (!canAdmin) return;
      setLayers((prev) => prev.filter((layer) => layer.id !== layerId));
      setDataOverrides((prev) => {
        const next = { ...prev };
        delete next[layerId];
        return next;
      });
      toast({ title: "Capa eliminada", description: `Se removio la capa ${layerId}.` });
    },
    [canAdmin, toast],
  );

  const handleUpdateLayer = useCallback(
    (layerId: string, partial: Partial<LayerConfig>) => {
      if (!canAdmin) return;
      setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, ...partial } : layer)));
      toast({ title: "Capa actualizada", description: `Se guardaron los cambios de ${layerId}.` });
    },
    [canAdmin, toast],
  );

  const handleUpdatePoint = useCallback(
    (
      layerId: string,
      featureIndex: number,
      input: { name: string; type: string; description: string; lat: number; lng: number },
    ) => {
      if (!canAdmin) return;
      const currentData = dataMap[layerId];
      if (!currentData) return;
      if (!input.name.trim() || Number.isNaN(input.lat) || Number.isNaN(input.lng)) {
        toast({ title: "Datos incompletos", description: "Nombre, latitud y longitud son obligatorios.", variant: "destructive" });
        return;
      }

      let updatedFeature: GeoJSON.Feature | null = null;
      const nextFeatures = currentData.features.map((feature, index) => {
        if (index !== featureIndex) return feature;
        const next = {
          ...feature,
          properties: {
            ...(feature.properties || {}),
            nombre: input.name.trim(),
            tipo: input.type.trim() || "Punto",
            descripcion: input.description.trim(),
          },
          geometry: { type: "Point", coordinates: [input.lng, input.lat] },
        } as GeoJSON.Feature;
        updatedFeature = next;
        return next;
      });

      setDataOverrides((prev) => ({ ...prev, [layerId]: { type: "FeatureCollection", features: nextFeatures } }));
      setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, visible: true } : layer)));
      if (updatedFeature) {
        setSearchTarget(updatedFeature);
        setSelectedFeature(updatedFeature);
      }
      toast({ title: "Punto actualizado", description: `Se guardaron los cambios en ${layerId}.` });
    },
    [canAdmin, dataMap, toast],
  );

  const handleFocusFeature = useCallback((feature: GeoJSON.Feature) => {
    setSearchTarget(feature);
    setSelectedFeature(feature);
  }, []);

  const handleAddPoint = useCallback(
    (input: { layerId: string; name: string; type: string; description: string; lat: number; lng: number }) => {
      if (!canAdmin) return;
      if (!input.layerId || !input.name.trim() || Number.isNaN(input.lat) || Number.isNaN(input.lng)) {
        toast({ title: "Datos incompletos", description: "Selecciona capa, nombre, latitud y longitud.", variant: "destructive" });
        return;
      }

      const newFeature = createPointFeature({
        name: input.name.trim(),
        type: input.type.trim(),
        description: input.description.trim(),
        lat: input.lat,
        lng: input.lng,
      });

      const currentData = dataMap[input.layerId] || createEmptyFeatureCollection();
      const nextCollection: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [...currentData.features, newFeature],
      };

      setDataOverrides((prev) => ({ ...prev, [input.layerId]: nextCollection }));
      setLayers((prev) =>
        prev.map((layer) =>
          layer.id === input.layerId
            ? { ...layer, geometryType: "Point", visible: true, source: layer.source ?? "core" }
            : layer,
        ),
      );
      setPickedAdminCoords(null);
      setSearchTarget(newFeature);
      setSelectedFeature(newFeature);
      toast({ title: "Punto agregado", description: `Se agrego ${input.name.trim()} y se centro el mapa.` });
    },
    [canAdmin, dataMap, toast],
  );

  const handleDeletePoint = useCallback(
    (layerId: string, featureIndex: number) => {
      if (!canAdmin) return;
      const currentData = dataMap[layerId];
      if (!currentData) return;

      const nextCollection: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: currentData.features.filter((_, index) => index !== featureIndex),
      };

      setDataOverrides((prev) => ({ ...prev, [layerId]: nextCollection }));
      toast({ title: "Punto eliminado", description: `Se actualizo la capa ${layerId}.` });
    },
    [canAdmin, dataMap, toast],
  );

  const handleResetSystem = useCallback(() => {
    if (!canAdmin) return;
    resetAdminMapState();
    const resetState = loadAdminMapState();
    setLayers(resetState.layers);
    setDataOverrides(resetState.dataOverrides);
    toast({ title: "Sistema restaurado", description: "Se recupero la configuracion base de capas y puntos." });
  }, [canAdmin, toast]);

  const activeLayers = layers.filter((l) => l.visible).length;

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
              const opening = !dashboardOpen;
              if (opening && isMobile) setLayersPanelOpen(false);
              setDashboardOpen((p) => !p);
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
            onCreateLayer={handleCreateLayer}
            onUpdateLayer={handleUpdateLayer}
            onDeleteLayer={handleDeleteLayer}
            onAddPoint={handleAddPoint}
            onUpdatePoint={handleUpdatePoint}
            onDeletePoint={handleDeletePoint}
            onFocusFeature={handleFocusFeature}
            onResetSystem={handleResetSystem}
            onToggleMapPicker={handleToggleAdminPointPicker}
            isPickingFromMap={isPickingAdminPoint}
            pickedCoords={pickedAdminCoords}
          />
        )}

        <Suspense fallback={null}>
          <DashboardPanel isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} />
        </Suspense>

        <MapView
          layers={layers}
          dataMap={dataMap}
          pointLayerIds={pointLayerIds}
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
          onRouteError={(msg) => toast({ title: "Error de ruta", description: msg, variant: "destructive" })}
          onClearRoute={handleClearRoute}
          clearRouteTrigger={clearRouteTrigger}
          isMeasuringArea={isMeasuringArea}
          onAreaUpdate={setMeasureArea}
          clearAreaTrigger={clearAreaTrigger}
          isBuffering={isBuffering}
          bufferRadius={bufferRadius}
          clearBufferTrigger={clearBufferTrigger}
          isHeatmap={isHeatmap}
          isPickingAdminPoint={isPickingAdminPoint}
          onAdminPointPick={handleAdminPointPick}
        />

        {isMeasuring && measureDistance !== null && measureDistance > 0 && (
          <button
            onClick={handleClearMeasure}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #4a7c59, #5d9a6e)", boxShadow: "0 4px 16px rgba(74,124,89,0.4)" }}
          >
            Borrar trazo
          </button>
        )}

        {isMeasuringArea && measureArea !== null && measureArea > 0 && (
          <button
            onClick={handleClearArea}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #c4945a, #d4a96a)", boxShadow: "0 4px 16px rgba(196,148,90,0.4)" }}
          >
            Borrar area
          </button>
        )}

        {isBuffering && (
          <button
            onClick={handleClearBuffer}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #2d8a6e, #3a9b7e)", boxShadow: "0 4px 16px rgba(45,138,110,0.4)" }}
          >
            Borrar buffers
          </button>
        )}

        <FeatureInfoPanel feature={selectedFeature} onClose={() => setSelectedFeature(null)} />

        <AnimatePresence>
          {routeInfo && (
            <DirectionsPanel distance={routeInfo.distance} duration={routeInfo.duration} steps={routeInfo.steps} onClear={handleClearRoute} />
          )}
        </AnimatePresence>

        <AnimatePresence>{isLoadingRoute && <RoutingLoadingIndicator onCancel={handleClearRoute} />}</AnimatePresence>

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
