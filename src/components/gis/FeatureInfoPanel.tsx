import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react";

interface FeatureInfoPanelProps {
  feature: GeoJSON.Feature | null;
  onClose: () => void;
}

export default function FeatureInfoPanel({ feature, onClose }: FeatureInfoPanelProps) {
  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[420px] max-w-[90vw] gis-panel p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-gis-green" />
              <h3 className="font-semibold text-sm text-foreground">
                {feature.properties?.nombre || "Elemento seleccionado"}
              </h3>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-1.5">
            {Object.entries(feature.properties || {})
              .filter(([k]) => k !== "nombre")
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-xs font-medium text-foreground">{String(value)}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
