import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, ListFilter, Eye, EyeOff } from "lucide-react";
import { LayerConfig, LAYER_CATEGORIES } from "@/data/ocana-geodata";

interface LegendPanelProps {
  layers: LayerConfig[];
  onToggleLayer?: (id: string) => void;
}

export default function LegendPanel({ layers, onToggleLayer }: LegendPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const visibleLayers = layers.filter(l => l.visible);

  if (visibleLayers.length === 0) return null;

  // Group visible layers by category
  const categoryMap = new Map(LAYER_CATEGORIES.map(c => [c.id, c.name]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-8 right-4 z-[999] w-[230px] rounded-2xl overflow-hidden"
      style={{
        background: "rgba(235,228,218,0.96)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        border: "1px solid rgba(180,170,155,0.4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-black/[0.03] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <ListFilter className="w-3.5 h-3.5 text-[#4a7c59]" />
          <h4 className="text-[11px] font-bold text-[#1c1c1c] uppercase tracking-widest">
            Leyenda
          </h4>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#4a7c59]/10 text-[#4a7c59]">
            {visibleLayers.length}
          </span>
        </div>
        {isCollapsed ? (
          <ChevronUp className="w-3.5 h-3.5 text-[#aaa]" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-[#aaa]" />
        )}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-3.5 pb-3 pt-1 space-y-1.5 max-h-[280px] overflow-y-auto custom-scrollbar"
              style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
            >
              {visibleLayers.map(layer => (
                <div key={layer.id} className="flex items-center gap-2.5 group px-1 py-1.5 rounded-lg hover:bg-black/[0.03] transition-colors">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: layer.color,
                      opacity: Math.max(0.5, layer.opacity),
                      boxShadow: `0 0 0 2px ${layer.color}30`,
                    }}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-[#1c1c1c] truncate leading-tight">
                      {layer.name}
                    </span>
                    <span className="text-[9px] text-[#aaa] font-medium uppercase tracking-wider leading-none mt-0.5">
                      {categoryMap.get(layer.category) || layer.category}
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleLayer?.(layer.id)}
                    className="p-1 rounded-lg hover:bg-black/[0.05] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title={`Ocultar ${layer.name}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#4a7c59]" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
