import { Layers, BarChart3, Crosshair, Ruler, MapPin, Printer, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MapToolbarProps {
  onToggleLayers: () => void;
  onToggleDashboard: () => void;
  layersOpen: boolean;
  dashboardOpen: boolean;
}

export default function MapToolbar({ onToggleLayers, onToggleDashboard, layersOpen, dashboardOpen }: MapToolbarProps) {
  return (
    <>
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleLayers}
              className={`gis-toolbar-btn shadow-lg ${layersOpen ? "active" : ""}`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Panel de Capas
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleDashboard}
              className={`gis-toolbar-btn shadow-lg ${dashboardOpen ? "active" : ""}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            Dashboard
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
