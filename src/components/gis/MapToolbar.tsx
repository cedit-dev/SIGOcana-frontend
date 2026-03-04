import { Layers, BarChart3, Crosshair, Ruler, MapPin, Printer, Download, Maximize, LocateFixed, Ruler as RulerIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MapToolbarProps {
  onToggleLayers: () => void;
  onToggleDashboard: () => void;
  onZoomToExtent?: () => void;
  onLocateMe?: () => void;
  onMeasure?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
  layersOpen: boolean;
  dashboardOpen: boolean;
}

export default function MapToolbar({
  onToggleLayers,
  onToggleDashboard,
  onZoomToExtent,
  onLocateMe,
  onMeasure,
  onPrint,
  onExport,
  layersOpen,
  dashboardOpen
}: MapToolbarProps) {
  return (
    <>
      {/* Left Toolbar */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <ToolbarButton
          icon={<Layers className="w-4 h-4" />}
          label="Panel de Capas"
          onClick={onToggleLayers}
          active={layersOpen}
        />

        <div className="w-full h-px bg-border/20 mx-1" />

        <ToolbarButton
          icon={<Maximize className="w-4 h-4" />}
          label="Ver Extensión Total"
          onClick={onZoomToExtent}
        />
        <ToolbarButton
          icon={<LocateFixed className="w-4 h-4" />}
          label="Mi Ubicación"
          onClick={onLocateMe}
        />
        <ToolbarButton
          icon={<RulerIcon className="w-4 h-4" />}
          label="Medir Distancia"
          onClick={onMeasure}
        />
      </div>

      {/* Right Toolbar */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <ToolbarButton
          icon={<BarChart3 className="w-4 h-4" />}
          label="Dashboard"
          onClick={onToggleDashboard}
          active={dashboardOpen}
        />

        <div className="w-full h-px bg-border/20 mx-1" />

        <ToolbarButton
          icon={<Printer className="w-4 h-4" />}
          label="Imprimir Mapa"
          onClick={onPrint}
        />
        <ToolbarButton
          icon={<Download className="w-4 h-4" />}
          label="Exportar Datos"
          onClick={onExport}
        />
      </div>
    </>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  active = false
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`gis-toolbar-btn shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${active ? "active bg-gis-green text-primary-foreground border-gis-green" : "bg-card text-foreground hover:bg-muted"}`}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side={active ? "bottom" : "right"} className="text-xs font-semibold">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
