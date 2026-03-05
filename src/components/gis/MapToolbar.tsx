import { motion } from "framer-motion";
import {
  Layers, BarChart3, Ruler, Printer, Download,
  Maximize, LocateFixed, Map as MapIcon, Info,
} from "lucide-react";
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

const TOOLBAR_STYLE = {
  background: "rgba(255, 255, 255, 0.94)",
  backdropFilter: "blur(20px) saturate(1.6)",
  WebkitBackdropFilter: "blur(20px) saturate(1.6)",
  border: "1px solid rgba(0,0,0,0.07)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
};

export default function MapToolbar({
  onToggleLayers,
  onToggleDashboard,
  onZoomToExtent,
  onLocateMe,
  onMeasure,
  onPrint,
  onExport,
  layersOpen,
  dashboardOpen,
}: MapToolbarProps) {
  return (
    <>
      {/* Left toolbar */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 left-4 z-[1001] flex flex-col items-center gap-0.5 p-1.5 rounded-2xl overflow-hidden"
        style={{
          ...TOOLBAR_STYLE,
          borderLeft: "3px solid rgba(74, 124, 89, 0.5)",
        }}
      >
        <IconBtn
          icon={<Layers className="w-[17px] h-[17px]" />}
          label="Capas"
          onClick={onToggleLayers}
          active={layersOpen}
        />
        <IconBtn
          icon={<MapIcon className="w-[17px] h-[17px]" />}
          label="Extensión Total"
          onClick={onZoomToExtent}
        />
        <IconBtn
          icon={<Ruler className="w-[17px] h-[17px]" />}
          label="Medir"
          onClick={onMeasure}
        />
        <IconBtn
          icon={<LocateFixed className="w-[17px] h-[17px]" />}
          label="Mi Ubicación"
          onClick={onLocateMe}
        />

        <div className="w-6 h-px my-0.5" style={{ background: "rgba(74, 124, 89, 0.15)" }} />

        <IconBtn
          icon={<Info className="w-[17px] h-[17px]" />}
          label="Información"
        />
      </motion.div>

      {/* Right toolbar */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 right-4 z-[1000] flex flex-col items-center gap-0.5 p-1.5 rounded-2xl overflow-hidden"
        style={{
          ...TOOLBAR_STYLE,
          borderRight: "3px solid rgba(212, 169, 106, 0.5)",
        }}
      >
        <IconBtn
          icon={<BarChart3 className="w-[17px] h-[17px]" />}
          label="Análisis Territorial"
          onClick={onToggleDashboard}
          active={dashboardOpen}
          activeColor="#c4945a"
        />

        <div className="w-6 h-px my-0.5" style={{ background: "rgba(0,0,0,0.07)" }} />

        <IconBtn
          icon={<Printer className="w-[17px] h-[17px]" />}
          label="Imprimir"
          onClick={onPrint}
        />
        <IconBtn
          icon={<Download className="w-[17px] h-[17px]" />}
          label="Exportar"
          onClick={onExport}
        />
        <IconBtn
          icon={<Maximize className="w-[17px] h-[17px]" />}
          label="Vista Completa"
          onClick={onZoomToExtent}
        />
      </motion.div>
    </>
  );
}

function IconBtn({
  icon,
  label,
  onClick,
  active = false,
  activeColor = "#4a7c59",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.91 }}
          onClick={onClick}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer"
          style={
            active
              ? {
                  background: `${activeColor}`,
                  color: "#fff",
                  boxShadow: `0 2px 10px ${activeColor}55, 0 0 0 3px ${activeColor}22`,
                }
              : {
                  color: "#777",
                }
          }
          onMouseEnter={e => {
            if (!active) {
              (e.currentTarget as HTMLElement).style.background = "rgba(74,124,89,0.07)";
              (e.currentTarget as HTMLElement).style.color = "#2a2a2a";
            }
          }}
          onMouseLeave={e => {
            if (!active) {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "#777";
            }
          }}
        >
          {icon}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs font-semibold">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
