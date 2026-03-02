import { motion, AnimatePresence } from "framer-motion";
import { LayerConfig } from "@/data/ocana-geodata";

interface LegendPanelProps {
  layers: LayerConfig[];
}

export default function LegendPanel({ layers }: LegendPanelProps) {
  const visibleLayers = layers.filter(l => l.visible);

  if (visibleLayers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 right-4 z-[999] gis-panel p-3 max-w-[200px]"
    >
      <h4 className="text-[11px] font-semibold text-foreground mb-2">Leyenda</h4>
      <div className="space-y-1.5">
        {visibleLayers.map(layer => (
          <div key={layer.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm border border-border flex-shrink-0"
              style={{ backgroundColor: layer.color, opacity: layer.opacity }}
            />
            <span className="text-[10px] text-muted-foreground truncate">{layer.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
