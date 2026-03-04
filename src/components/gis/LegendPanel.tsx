import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, ListFilter } from "lucide-react";
import { LayerConfig } from "@/data/ocana-geodata";

interface LegendPanelProps {
  layers: LayerConfig[];
}

export default function LegendPanel({ layers }: LegendPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const visibleLayers = layers.filter(l => l.visible);

  if (visibleLayers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 right-4 z-[999] bg-card border border-border rounded-xl shadow-xl overflow-hidden w-[220px]"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border/50"
      >
        <div className="flex items-center gap-2">
          <ListFilter className="w-3.5 h-3.5 text-gis-green" />
          <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Leyenda</h4>
        </div>
        {isCollapsed ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {visibleLayers.map(layer => (
                <div key={layer.id} className="flex items-center gap-3 group">
                  <div
                    className="w-3.5 h-3.5 rounded shadow-sm border border-black/5 flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: layer.color, opacity: Math.max(0.3, layer.opacity) }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-foreground truncate leading-none mb-0.5">{layer.name}</span>
                    <span className="text-[9px] text-muted-foreground/70 uppercase tracking-tighter leading-none">{layer.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
