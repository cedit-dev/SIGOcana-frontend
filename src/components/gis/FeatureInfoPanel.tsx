import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Copy, Share2, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FeatureInfoPanelProps {
  feature: GeoJSON.Feature | null;
  onClose: () => void;
}

const PROPERTY_LABELS: Record<string, string> = {
  tipo: "Tipo",
  nivel: "Nivel",
  camas: "Camas disponibles",
  estudiantes: "Estudiantes matriculados",
  descripcion: "Descripción",
  poblacion: "Población",
  area_habitantes: "Área (ha)",
  estrato_predominante: "Estrato predominante",
  densidad: "Densidad (hab/ha)",
  comuna: "Comuna",
  estrato: "Estrato socioeconómico",
  longitud_km: "Longitud (km)",
  uso: "Uso del suelo",
  viviendas: "Viviendas",
  estado: "Estado",
  presupuesto: "Presupuesto",
  avance: "Avance (%)",
  area: "Área",
  direccion: "Dirección",
};

export default function FeatureInfoPanel({ feature, onClose }: FeatureInfoPanelProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (!feature) return;
    const data = JSON.stringify(feature.properties, null, 2);
    navigator.clipboard.writeText(data);
    toast({
      title: "Atributos Copiados",
      description: "La información ha sido copiada al portapapeles.",
    });
  };

  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-20 right-4 z-[1000] w-[380px] max-w-[90vw] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(235,228,218,0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(180,170,155,0.4)",
            boxShadow: "0 12px 40px rgba(44, 30, 15, 0.12), 0 4px 12px rgba(44, 30, 15, 0.06)",
          }}
        >
          {/* Header */}
          <div
            className="p-4 text-white relative"
            style={{
              background: "linear-gradient(135deg, #4a7c59 0%, #3d6b4a 100%)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <Info className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight leading-tight text-white">
                    {feature.properties?.nombre || "Atributos del Elemento"}
                  </h3>
                  <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider mt-0.5">
                    Información Detallada
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/15 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-0.5">
              {Object.entries(feature.properties || {})
                .filter(([k]) => k !== "nombre")
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="group flex flex-col py-2.5 border-b last:border-0 hover:bg-[#4a7c59]/4 px-2 rounded-lg transition-colors"
                    style={{ borderColor: "rgba(0,0,0,0.05)" }}
                  >
                    <span className="text-[10px] font-bold text-[#8b7d6b] uppercase tracking-wider mb-0.5">
                      {PROPERTY_LABELS[key] ?? key.replace(/_/g, " ")}
                    </span>
                    <span className="text-[13px] font-semibold text-[#2c1e0f] break-words">
                      {value === null || value === undefined ? "—" : String(value)}
                    </span>
                  </div>
                ))}
            </div>

            {(!feature.properties || Object.keys(feature.properties).length <= 1) && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f5f0e8] flex items-center justify-center mb-3">
                  <MapIcon className="w-6 h-6 text-[#8b7d6b]/40" />
                </div>
                <p className="text-xs text-[#8b7d6b] font-medium">
                  No se encontraron atributos adicionales.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="p-3 flex items-center justify-end gap-2"
            style={{
              borderTop: "1px solid rgba(0,0,0,0.05)",
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-xl border-[#e8dfd4] text-[#8b7d6b] hover:text-[#2c1e0f] hover:border-[#4a7c59]/30"
                  onClick={handleCopy}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copiar datos</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-xl border-[#e8dfd4] text-[#8b7d6b] hover:text-[#2c1e0f] hover:border-[#4a7c59]/30"
                  onClick={() => {
                    const text = feature
                      ? `${feature.properties?.nombre || "Elemento"}\n${JSON.stringify(feature.properties, null, 2)}`
                      : "";
                    if (navigator.share) {
                      navigator.share({ title: feature?.properties?.nombre || "SIGOcaña", text });
                    } else {
                      navigator.clipboard.writeText(text);
                    }
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Compartir</TooltipContent>
            </Tooltip>

            <Button
              className="h-9 px-4 rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #4a7c59, #5d9a6e)" }}
              onClick={() => window.print()}
            >
              Imprimir
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
