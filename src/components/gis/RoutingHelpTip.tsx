import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "lucide-react";
import { useState, useEffect } from "react";

export default function RoutingHelpTip() {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[220px] left-4 z-[1002] rounded-xl overflow-hidden pointer-events-auto"
          style={{
            background: "rgba(245, 241, 235, 0.96)",
            backdropFilter: "blur(20px) saturate(1.5)",
            WebkitBackdropFilter: "blur(20px) saturate(1.5)",
            border: "1px solid rgba(74,124,89,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {/* Content - Compact */}
          <div className="px-4 py-3 flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#4a7c59]/15 flex items-center justify-center"
            >
              <Navigation className="w-4 h-4 text-[#4a7c59]" />
            </motion.div>
            <div>
              <p className="text-xs font-bold text-[#2c1e0f]">Trazar Ruta</p>
              <p className="text-[11px] text-[#8b7d6b] mt-0.5">
                Haz clic el botón para comenzar
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
