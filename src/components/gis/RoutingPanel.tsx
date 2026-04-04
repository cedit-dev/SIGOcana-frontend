import { motion } from "framer-motion";
import { Navigation, X } from "lucide-react";

interface RoutingPanelProps {
  distance: number;   // en metros
  duration: number;   // en segundos
  onClear: () => void;
}

export default function RoutingPanel({ distance, duration, onClear }: RoutingPanelProps) {
  const km = (distance / 1000).toFixed(1);
  const mins = Math.round(duration / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-4 px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(235,228,218,0.97)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        border: "1px solid rgba(74,124,89,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <Navigation className="w-4 h-4 text-[#4a7c59]" />
      <div className="text-sm font-bold text-[#2c1e0f]">{km} km</div>
      <div className="w-px h-4 bg-black/10" />
      <div className="text-sm text-[#6b5b4e]">~{mins} min en auto</div>
      <button
        onClick={onClear}
        className="ml-2 text-[#999] hover:text-[#e74c3c] transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
