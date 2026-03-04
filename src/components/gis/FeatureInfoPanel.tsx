import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Copy, Share2, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FeatureInfoPanelProps {
  feature: GeoJSON.Feature | null;
  onClose: () => void;
}

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
          className="absolute top-20 right-4 z-[1000] w-[380px] max-w-[90vw] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header with Background */}
          <div className="bg-primary p-4 text-primary-foreground relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gis-green/20 flex items-center justify-center border border-gis-green/30">
                  <Info className="w-4 h-4 text-gis-green" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight leading-tight">
                    {feature.properties?.nombre || "Atributos del Elemento"}
                  </h3>
                  <p className="text-[10px] text-primary-foreground/60 font-medium uppercase tracking-wider mt-0.5">Información Detallada</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-primary-foreground/70" />
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              {Object.entries(feature.properties || {})
                .filter(([k]) => k !== "nombre")
                .map(([key, value]) => (
                  <div key={key} className="group flex flex-col py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/30 px-2 rounded-lg transition-colors">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{key.replace(/_/g, " ")}</span>
                    <span className="text-[13px] font-semibold text-foreground break-words">{String(value)}</span>
                  </div>
                ))}
            </div>

            {(!feature.properties || Object.keys(feature.properties).length <= 1) && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <MapIcon className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">No se encontraron atributos adicionales para este elemento.</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-xl" onClick={handleCopy}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copiar datos</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-xl">
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Compartir</TooltipContent>
            </Tooltip>

            <Button className="h-9 px-4 rounded-xl text-xs font-bold bg-gis-green hover:bg-gis-green-light">
              Ver Reporte
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
