import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { LayerConfig, OCANA_ZOOM, LAYERS_CONFIG } from "@/data/ocana-geodata";
import { useMapTools } from "@/hooks/useMapTools";
import { STATIC_GEOJSON_MAP } from "@/components/gis/map/constants";
import {
  detectGeometryType,
  loadAdminMapState,
  saveAdminMapState,
  createEmptyFeatureCollection,
  createPointFeature,
  resetAdminMapState,
} from "@/lib/map-admin";
import { BaseMapKey } from "@/data/base-maps";
import { useToast } from "@/components/ui/use-toast";
import { manifestService, CategoryConfig } from "@/services/manifestService";

interface MapContextType {
  // Manifest & Config
  categories: CategoryConfig[];
  isLoading: boolean;

  // Layers & Data
  layers: LayerConfig[];
  dataMap: Record<string, GeoJSON.FeatureCollection>;
  pointLayerIds: Set<string>;
  baseMap: BaseMapKey;
  setBaseMap: (key: BaseMapKey) => void;
  toggleLayer: (id: string) => void;
  setOpacity: (id: string, opacity: number) => void;
  setLayers: React.Dispatch<React.SetStateAction<LayerConfig[]>>;
  setDataOverrides: React.Dispatch<React.SetStateAction<Record<string, GeoJSON.FeatureCollection>>>;
  
  // Admin Operations
  createLayer: (input: { name: string; category: string; color: string; icon: string; description: string }) => void;
  deleteLayer: (layerId: string) => void;
  updateLayer: (layerId: string, partial: Partial<LayerConfig>) => void;
  importLayer: (name: string, category: string, geojson: GeoJSON.FeatureCollection) => void;
  addPoint: (input: { layerId: string; name: string; type: string; description: string; lat: number; lng: number }) => void;
  updatePoint: (layerId: string, featureIndex: number, input: { name: string; type: string; description: string; lat: number; lng: number }) => void;
  deletePoint: (layerId: string, featureIndex: number) => void;
  resetSystem: () => void;
  
  // Tools (from useMapTools)
  tools: ReturnType<typeof useMapTools>;
  
  // Map View State
  zoom: number;
  setZoom: (z: number) => void;
  mouseCoords: { lat: number; lng: number } | null;
  setMouseCoords: (coords: { lat: number; lng: number } | null) => void;
  searchTarget: GeoJSON.Feature | null;
  setSearchTarget: (f: GeoJSON.Feature | null) => void;
  selectedFeature: GeoJSON.Feature | null;
  setSelectedFeature: (f: GeoJSON.Feature | null) => void;
  
  // Triggers
  zoomTrigger: number;
  setZoomTrigger: React.Dispatch<React.SetStateAction<number>>;
  locateTrigger: number;
  setLocateTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState = useMemo(() => loadAdminMapState(), []);
  const [layers, setLayers] = useState<LayerConfig[]>(initialState.layers);
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dataOverrides, setDataOverrides] = useState<Record<string, GeoJSON.FeatureCollection>>(initialState.dataOverrides);
  const dataMap = useMemo(() => ({ ...STATIC_GEOJSON_MAP, ...dataOverrides }), [dataOverrides]);
  
  const [baseMap, setBaseMap] = useState<BaseMapKey>("osm");
  const [zoom, setZoom] = useState(OCANA_ZOOM);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTarget, setSearchTarget] = useState<GeoJSON.Feature | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSON.Feature | null>(null);
  
  const [zoomTrigger, setZoomTrigger] = useState(0);
  const [locateTrigger, setLocateTrigger] = useState(0);

  const tools = useMapTools();
  const { toast } = useToast();

  // Load Manifest (Bridge to Backend)
  useEffect(() => {
    let isMounted = true;
    manifestService.getManifest()
      .then(manifest => {
        if (!isMounted) return;
        setCategories(manifest.categories);
        
        // Only override layers if we don't have local changes in storage
        const stored = localStorage.getItem("sigocana.map.admin.state");
        if (!stored) {
          setLayers(manifest.layers);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load manifest:", err);
        setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const normalizeId = useCallback((value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""), []);

  const createLayer = useCallback((input: { name: string; category: string; color: string; icon: string; description: string }) => {
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
  }, [layers, normalizeId, toast]);

  const deleteLayer = useCallback((layerId: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== layerId));
    setDataOverrides((prev) => {
      const next = { ...prev };
      delete next[layerId];
      return next;
    });
    toast({ title: "Capa eliminada", description: `Se removio la capa ${layerId}.` });
  }, [toast]);

  const updateLayer = useCallback((layerId: string, partial: Partial<LayerConfig>) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, ...partial } : layer)));
    toast({ title: "Capa actualizada", description: `Se guardaron los cambios de ${layerId}.` });
  }, [toast]);

  const importLayer = useCallback((name: string, category: string, geojson: GeoJSON.FeatureCollection) => {
    const id = normalizeId(name);
    if (layers.some(l => l.id === id)) {
      toast({ title: "Error", description: "Ya existe una capa con este nombre.", variant: "destructive" });
      return;
    }

    const geometryType = detectGeometryType(geojson);

    setLayers(prev => [...prev, {
      id,
      name,
      category,
      color: "#d4a96a",
      icon: "Database",
      description: `Capa importada (${geojson.features.length} elementos)`,
      visible: true,
      opacity: 0.8,
      geometryType,
      source: "custom"
    }]);

    setDataOverrides(prev => ({ ...prev, [id]: geojson }));
    toast({ title: "Importación exitosa", description: `Se creó la capa ${name} con ${geojson.features.length} elementos.` });
  }, [layers, normalizeId, toast]);

  const addPoint = useCallback((input: { layerId: string; name: string; type: string; description: string; lat: number; lng: number }) => {
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
    setDataOverrides((prev) => ({
      ...prev,
      [input.layerId]: { ...currentData, features: [...currentData.features, newFeature] },
    }));
    setLayers((prev) => prev.map((l) => l.id === input.layerId ? { ...l, visible: true } : l));
    setSearchTarget(newFeature);
    setSelectedFeature(newFeature);
    toast({ title: "Punto agregado", description: `Se agrego ${input.name.trim()}.` });
  }, [dataMap, toast]);

  const updatePoint = useCallback((layerId: string, featureIndex: number, input: { name: string; type: string; description: string; lat: number; lng: number }) => {
    const currentData = dataMap[layerId];
    if (!currentData || !input.name.trim() || Number.isNaN(input.lat) || Number.isNaN(input.lng)) {
      toast({ title: "Datos incompletos", description: "Nombre, latitud y longitud son obligatorios.", variant: "destructive" });
      return;
    }
    const nextFeatures = currentData.features.map((f, i) => {
      if (i !== featureIndex) return f;
      return {
        ...f,
        properties: { ...f.properties, nombre: input.name.trim(), tipo: input.type.trim() || "Punto", descripcion: input.description.trim() },
        geometry: { type: "Point", coordinates: [input.lng, input.lat] },
      } as GeoJSON.Feature;
    });
    setDataOverrides((prev) => ({ ...prev, [layerId]: { ...currentData, features: nextFeatures } }));
    setSearchTarget(nextFeatures[featureIndex]);
    setSelectedFeature(nextFeatures[featureIndex]);
    toast({ title: "Punto actualizado", description: "Cambios guardados." });
  }, [dataMap, toast]);

  const deletePoint = useCallback((layerId: string, featureIndex: number) => {
    const currentData = dataMap[layerId];
    if (!currentData) return;
    setDataOverrides((prev) => ({
      ...prev,
      [layerId]: { ...currentData, features: currentData.features.filter((_, i) => i !== featureIndex) },
    }));
    toast({ title: "Punto eliminado", description: "Se actualizó la capa." });
  }, [dataMap, toast]);

  const resetSystem = useCallback(() => {
    resetAdminMapState();
    const resetState = loadAdminMapState();
    setLayers(resetState.layers);
    setDataOverrides(resetState.dataOverrides);
    toast({ title: "Sistema restaurado", description: "Se recuperó la configuración base." });
  }, [toast]);

  const pointLayerIds = useMemo(
    () =>
      new Set(
        layers
          .filter((layer) => layer.geometryType === "Point" || detectGeometryType(dataMap[layer.id]) === "Point")
          .map((layer) => layer.id),
      ),
    [dataMap, layers],
  );

  const toggleLayer = useCallback((id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  }, []);

  const setOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, opacity } : l)));
  }, []);

  // Sync with storage
  React.useEffect(() => {
    saveAdminMapState({ layers, dataOverrides });
  }, [dataOverrides, layers]);

  const value = useMemo(() => ({
    categories,
    isLoading,
    layers,
    dataMap,
    pointLayerIds,
    baseMap,
    setBaseMap,
    toggleLayer,
    setOpacity,
    setLayers,
    setDataOverrides,
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
  }), [categories, isLoading, layers, dataMap, pointLayerIds, baseMap, toggleLayer, setOpacity, tools, zoom, mouseCoords, searchTarget, selectedFeature, zoomTrigger, locateTrigger, createLayer, deleteLayer, updateLayer, importLayer, addPoint, updatePoint, deletePoint, resetSystem]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMapContext must be used within a MapProvider");
  return context;
};
