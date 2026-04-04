import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Navigation, MapPin, X } from "lucide-react";
import { useState } from "react";

export interface DirectionStep {
  instruction: string;
  distance: number; // metros
  duration: number; // segundos
}

interface DirectionsPanelProps {
  steps: DirectionStep[];
  distance: number; // metros
  duration: number; // segundos
  onClear?: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

export default function DirectionsPanel({
  steps,
  distance,
  duration,
  onClear,
  onCollapse,
}: DirectionsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const km = (distance / 1000).toFixed(1);
  const mins = Math.round(duration / 60);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse?.(!isCollapsed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`absolute z-[1001] right-4 flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
        isCollapsed ? "bottom-4 w-64" : "bottom-4 w-80 max-h-[500px]"
      }`}
      style={{
        background: "rgba(245, 241, 235, 0.97)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        border: "1px solid rgba(74,124,89,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <motion.div
        layout
        className="p-4 border-b border-black/10 flex items-center justify-between"
      >
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-black/3 px-2 py-1 rounded transition-colors -ml-2"
          onClick={handleToggleCollapse}
        >
          <Navigation className="w-4 h-4 text-[#4a7c59]" />
          <span className="text-sm font-bold text-[#2c1e0f]">{km} km</span>
          <span className="text-xs text-[#8b7d6b]">• ~{mins} min</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleToggleCollapse}
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            className="text-[#8b7d6b] hover:text-[#4a7c59] transition-colors"
          >
            {isCollapsed ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </motion.button>
          <button
            onClick={onClear}
            className="text-[#8b7d6b] hover:text-[#e74c3c] transition-colors"
            title="Limpiar ruta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Directions List */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-y-auto flex-1"
          style={{ maxHeight: "calc(500px - 60px)" }}
        >
          <div className="p-3 space-y-2">
            {/* Start point */}
            <div className="flex gap-3 pb-3 border-b border-black/5">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full bg-[#d4a96a]" />
                <div className="w-px h-6 bg-[#d4a96a]/40 my-1" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#2c1e0f]">Ubicación Actual</p>
                <p className="text-[11px] text-[#8b7d6b]">Tu posición</p>
              </div>
            </div>

            {/* Steps */}
            {steps.map((step, idx) => {
              const stepKm = (step.distance / 1000).toFixed(2);
              const stepMins = Math.round(step.duration / 60);

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3 pb-3 border-b border-black/5 last:border-0"
                >
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#4a7c59]" />
                    {idx < steps.length - 1 && (
                      <div className="w-px h-6 bg-[#4a7c59]/40 my-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-medium text-[#2c1e0f] leading-tight">
                      {step.instruction}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] text-[#8b7d6b] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {stepKm} km
                      </span>
                      {stepMins > 0 && (
                        <span className="text-[10px] text-[#8b7d6b]">
                          ~{stepMins} min
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Destination */}
            <div className="flex gap-3 pt-2">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full bg-[#4a7c59] ring-2 ring-[#4a7c59]/30" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#2c1e0f]">Destino</p>
                <p className="text-[11px] text-[#8b7d6b]">Llegada</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Info when collapsed */}
      {isCollapsed && (
        <div className="p-3 text-center">
          <p className="text-[11px] text-[#8b7d6b]">
            {steps.length} pasos
          </p>
        </div>
      )}
    </motion.div>
  );
}
