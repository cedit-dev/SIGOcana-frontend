import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DirectionStep } from "@/components/gis/MapView";

export type ToolName = "measure" | "measureArea" | "routing" | "buffer";

export interface RouteInfo {
  distance: number;
  duration: number;
  steps: DirectionStep[];
}

export const useMapTools = () => {
  const { toast } = useToast();

  const [activeTool, setActiveTool] = useState<ToolName | null>(null);
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [bufferRadius, setBufferRadius] = useState(500);

  // Results
  const [measureDistance, setMeasureDistance] = useState<number | null>(null);
  const [measureArea, setMeasureArea] = useState<number | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Triggers for Leaflet controllers
  const [clearMeasureTrigger, setClearMeasureTrigger] = useState(0);
  const [clearAreaTrigger, setClearAreaTrigger] = useState(0);
  const [clearRouteTrigger, setClearRouteTrigger] = useState(0);
  const [clearBufferTrigger, setClearBufferTrigger] = useState(0);

  const deactivateAll = useCallback(() => {
    setActiveTool(null);
    setMeasureDistance(null);
    setMeasureArea(null);
    setRouteInfo(null);
    setIsLoadingRoute(false);
  }, []);

  const toggleTool = useCallback((tool: ToolName) => {
    setActiveTool((prev) => {
      if (prev === tool) {
        toast({ title: "Herramienta desactivada", description: "La operación ha finalizado." });
        return null;
      }

      // Specific toast messages per tool
      const messages: Record<ToolName, { title: string; desc: string }> = {
        measure: { title: "Medir distancia", desc: "Haz clic en el mapa para crear puntos de medición." },
        measureArea: { title: "Medir área", desc: "Haz clic en el mapa para crear vértices del polígono." },
        routing: { title: "Trazar ruta", desc: "Haz clic en el mapa para elegir el destino." },
        buffer: { title: "Buffer activado", desc: `Haz clic en el mapa para crear zonas de ${bufferRadius}m.` },
      };

      toast({ title: messages[tool].title, description: messages[tool].desc });
      
      // Reset relevant states when switching
      if (tool === "measure") setMeasureDistance(null);
      if (tool === "measureArea") setMeasureArea(null);
      if (tool === "routing") setRouteInfo(null);

      return tool;
    });
  }, [bufferRadius, toast]);

  const clearToolData = useCallback((tool: ToolName) => {
    if (tool === "measure") {
      setClearMeasureTrigger((p) => p + 1);
      setMeasureDistance(null);
      if (activeTool === "measure") setActiveTool(null);
      toast({ title: "Trazo borrado", description: "Se eliminaron todos los trazos de medición." });
    }
    if (tool === "measureArea") {
      setClearAreaTrigger((p) => p + 1);
      setMeasureArea(null);
      if (activeTool === "measureArea") setActiveTool(null);
      toast({ title: "Área borrada", description: "Se eliminó el polígono de medición." });
    }
    if (tool === "routing") {
      setClearRouteTrigger((p) => p + 1);
      setRouteInfo(null);
      if (activeTool === "routing") setActiveTool(null);
    }
    if (tool === "buffer") {
      setClearBufferTrigger((p) => p + 1);
      if (activeTool === "buffer") setActiveTool(null);
      toast({ title: "Buffers borrados", description: "Se eliminaron todas las zonas de buffer." });
    }
  }, [activeTool, toast]);

  const toggleHeatmap = useCallback(() => {
    setIsHeatmap((p) => {
      const next = !p;
      toast({
        title: next ? "Mapa de calor activado" : "Mapa de calor desactivado",
        description: next ? "Mostrando densidad de puntos de interés." : "Se ocultó la capa de densidad.",
      });
      return next;
    });
  }, [toast]);

  return {
    // State
    activeTool,
    isHeatmap,
    bufferRadius,
    measureDistance,
    measureArea,
    routeInfo,
    isLoadingRoute,
    
    // Triggers
    clearMeasureTrigger,
    clearAreaTrigger,
    clearRouteTrigger,
    clearBufferTrigger,

    // Actions
    toggleTool,
    deactivateAll,
    clearToolData,
    toggleHeatmap,
    setMeasureDistance,
    setMeasureArea,
    setRouteInfo,
    setIsLoadingRoute,
    setBufferRadius,
  };
};
