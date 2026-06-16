import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function RoutingLoadingIndicator({ onCancel }: { onCancel?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-4 left-4 z-[1001] rounded-xl overflow-hidden pointer-events-auto"
      style={{
        background: "rgba(245, 241, 235, 0.96)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        border: "1px solid rgba(74,124,89,0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 rounded-full border-2 border-[#4a7c59]/20 border-t-[#4a7c59]"
        />
        <div>
          <p className="text-xs font-bold text-[#2c1e0f]">Calculando ruta...</p>
          <p className="text-[11px] text-[#8b7d6b]">Por favor espera</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="ml-2 text-[#8b7d6b] hover:text-[#e74c3c] transition-colors"
            title="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
