import { motion } from "framer-motion";
import { Globe, Layers, ZoomIn, Map as MapIcon } from "lucide-react";

interface MapStatusBarProps {
  zoom: number;
  coords?: { lat: number; lng: number } | null;
  activeLayers: number;
  totalLayers: number;
  baseMapName: string;
}

export default function MapStatusBar({
  zoom,
  coords,
  activeLayers,
  totalLayers,
  baseMapName,
}: MapStatusBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-0 left-0 right-0 z-[998] flex items-center"
      style={{
        height: "26px",
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(12px) saturate(1.3)",
        WebkitBackdropFilter: "blur(12px) saturate(1.3)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* CRS */}
      <div className="flex items-center gap-1.5 px-3 h-full border-r border-black/[0.05]">
        <Globe className="w-2.5 h-2.5 text-[#4a7c59] flex-shrink-0" />
        <span className="text-[9.5px] font-bold text-[#4a7c59] uppercase tracking-wider">
          EPSG:4326
        </span>
      </div>

      {/* Coordinates */}
      <div className="flex items-center h-full px-3 border-r border-black/[0.05]">
        <span
          className="text-[10px] text-[#666] tabular-nums"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {coords
            ? `${coords.lat >= 0 ? "" : ""}${coords.lat.toFixed(5)}°  ${coords.lng.toFixed(5)}°`
            : "— ° N  — ° W"}
        </span>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1.5 px-3 h-full border-r border-black/[0.05]">
        <ZoomIn className="w-2.5 h-2.5 text-[#999] flex-shrink-0" />
        <span className="text-[10px] font-semibold text-[#666]">
          Nivel {zoom}
        </span>
      </div>

      {/* Active layers */}
      <div className="flex items-center gap-1.5 px-3 h-full border-r border-black/[0.05]">
        <Layers className="w-2.5 h-2.5 text-[#999] flex-shrink-0" />
        <span className="text-[10px] font-semibold text-[#666]">
          {activeLayers} / {totalLayers} capas
        </span>
        {activeLayers > 0 && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" style={{ animation: "status-blink 2.5s infinite" }} />
        )}
      </div>

      {/* Right: base map + branding */}
      <div className="ml-auto flex items-center h-full">
        <div className="flex items-center gap-1.5 px-3 h-full border-l border-black/[0.05]">
          <MapIcon className="w-2.5 h-2.5 text-[#aaa] flex-shrink-0" />
          <span className="text-[10px] text-[#999] font-medium">{baseMapName}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 h-full border-l border-black/[0.05]">
          <span className="text-[9px] font-bold text-[#ccc] uppercase tracking-widest">
            SIGOcaña · v1.2
          </span>
        </div>
      </div>
    </motion.div>
  );
}
