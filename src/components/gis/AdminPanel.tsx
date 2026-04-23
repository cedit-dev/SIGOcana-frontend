import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Shield, Trash2, X, MapPinned, RotateCcw, Crosshair } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LAYER_CATEGORIES, LayerConfig } from "@/data/ocana-geodata";

interface CreateLayerInput {
  name: string;
  category: string;
  color: string;
  icon: string;
  description: string;
}

interface AddPointInput {
  layerId: string;
  name: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerConfig[];
  dataMap: Record<string, GeoJSON.FeatureCollection>;
  onCreateLayer: (input: CreateLayerInput) => void;
  onDeleteLayer: (layerId: string) => void;
  onAddPoint: (input: AddPointInput) => void;
  onDeletePoint: (layerId: string, featureIndex: number) => void;
  onResetSystem: () => void;
  onToggleMapPicker: () => void;
  isPickingFromMap: boolean;
  pickedCoords?: { lat: number; lng: number } | null;
}

const DEFAULT_LAYER_FORM: CreateLayerInput = {
  name: "",
  category: LAYER_CATEGORIES[0]?.id ?? "ambiente",
  color: "#4a7c59",
  icon: "MapPin",
  description: "",
};

const DEFAULT_POINT_FORM = {
  layerId: "",
  name: "",
  type: "",
  description: "",
  lat: "",
  lng: "",
};

export default function AdminPanel({
  isOpen,
  onClose,
  layers,
  dataMap,
  onCreateLayer,
  onDeleteLayer,
  onAddPoint,
  onDeletePoint,
  onResetSystem,
  onToggleMapPicker,
  isPickingFromMap,
  pickedCoords,
}: AdminPanelProps) {
  const [layerForm, setLayerForm] = useState<CreateLayerInput>(DEFAULT_LAYER_FORM);
  const [pointForm, setPointForm] = useState(DEFAULT_POINT_FORM);

  useEffect(() => {
    if (!pickedCoords) return;
    setPointForm((prev) => ({
      ...prev,
      lat: String(pickedCoords.lat),
      lng: String(pickedCoords.lng),
    }));
  }, [pickedCoords]);

  const pointLayers = useMemo(
    () =>
      layers.filter((layer) => {
        const data = dataMap[layer.id];
        return layer.geometryType === "Point" || data?.features.every((feature) => feature.geometry?.type === "Point");
      }),
    [dataMap, layers],
  );

  const selectedLayerFeatures = (pointForm.layerId && dataMap[pointForm.layerId]?.features) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="absolute top-4 right-[72px] bottom-4 z-[1002] w-[360px] overflow-hidden rounded-2xl flex flex-col"
          style={{
            background: "rgba(245, 241, 235, 0.97)",
            backdropFilter: "blur(22px) saturate(1.55)",
            WebkitBackdropFilter: "blur(22px) saturate(1.55)",
            border: "1px solid rgba(210,200,185,0.6)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          }}
        >
          <div className="h-1" style={{ background: "linear-gradient(90deg, #4a7c59, #2d8a6e, #d4a96a)" }} />

          <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#4a7c59]" />
              <div>
                <h2 className="text-base font-bold text-[#2c1e0f]">Super Admin</h2>
                <p className="text-[11px] text-[#8b7d6b]">Capas, puntos y control del sistema</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-[#8b7d6b] hover:bg-black/5">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2c1e0f]">Nueva capa</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a7c59]">Punto</span>
              </div>
              <Input placeholder="Nombre de la capa" value={layerForm.name} onChange={(e) => setLayerForm((prev) => ({ ...prev, name: e.target.value }))} />
              <select
                value={layerForm.category}
                onChange={(e) => setLayerForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {LAYER_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="#4a7c59" value={layerForm.color} onChange={(e) => setLayerForm((prev) => ({ ...prev, color: e.target.value }))} />
                <Input placeholder="Icono lucide" value={layerForm.icon} onChange={(e) => setLayerForm((prev) => ({ ...prev, icon: e.target.value }))} />
              </div>
              <Textarea
                placeholder="Descripcion"
                value={layerForm.description}
                onChange={(e) => setLayerForm((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[72px]"
              />
              <Button
                className="w-full gap-2"
                onClick={() => {
                  onCreateLayer(layerForm);
                  setLayerForm(DEFAULT_LAYER_FORM);
                }}
              >
                <Plus className="w-4 h-4" />
                Crear capa
              </Button>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-[#2c1e0f]">Agregar punto</h3>
              <select
                value={pointForm.layerId}
                onChange={(e) => setPointForm((prev) => ({ ...prev, layerId: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Selecciona una capa</option>
                {pointLayers.map((layer) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
              <Input placeholder="Nombre del punto" value={pointForm.name} onChange={(e) => setPointForm((prev) => ({ ...prev, name: e.target.value }))} />
              <Input placeholder="Tipo" value={pointForm.type} onChange={(e) => setPointForm((prev) => ({ ...prev, type: e.target.value }))} />
              <Textarea
                placeholder="Descripcion"
                value={pointForm.description}
                onChange={(e) => setPointForm((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[72px]"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" step="0.000001" placeholder="Latitud" value={pointForm.lat} onChange={(e) => setPointForm((prev) => ({ ...prev, lat: e.target.value }))} />
                <Input type="number" step="0.000001" placeholder="Longitud" value={pointForm.lng} onChange={(e) => setPointForm((prev) => ({ ...prev, lng: e.target.value }))} />
              </div>

              {isPickingFromMap && (
                <div className="rounded-xl border border-[#4a7c59]/20 bg-[#4a7c59]/8 px-3 py-2 text-[11px] font-medium text-[#4a7c59]">
                  Haz clic en el mapa para tomar la ubicacion del nuevo punto.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="w-full gap-2"
                  variant="secondary"
                  onClick={() => {
                    onAddPoint({
                      layerId: pointForm.layerId,
                      name: pointForm.name,
                      type: pointForm.type,
                      description: pointForm.description,
                      lat: Number(pointForm.lat),
                      lng: Number(pointForm.lng),
                    });
                    setPointForm((prev) => ({ ...DEFAULT_POINT_FORM, layerId: prev.layerId }));
                  }}
                >
                  <MapPinned className="w-4 h-4" />
                  Guardar punto
                </Button>

                <Button className="w-full gap-2" variant={isPickingFromMap ? "default" : "outline"} onClick={onToggleMapPicker}>
                  <Crosshair className="w-4 h-4" />
                  {isPickingFromMap ? "Cancelar mapa" : "Tomar del mapa"}
                </Button>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2c1e0f]">Capas registradas</h3>
                <button onClick={onResetSystem} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c4945a]">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar
                </button>
              </div>
              <div className="space-y-2">
                {layers.map((layer) => (
                  <div key={layer.id} className="flex items-center gap-3 rounded-xl border border-black/5 px-3 py-2.5 bg-white/50">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[#2c1e0f] truncate">{layer.name}</div>
                      <div className="text-[10px] text-[#8b7d6b]">
                        {dataMap[layer.id]?.features.length ?? 0} registros · {layer.source ?? "core"}
                      </div>
                    </div>
                    <button onClick={() => onDeleteLayer(layer.id)} className="p-2 rounded-lg text-[#e74c3c] hover:bg-[#e74c3c]/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {pointForm.layerId && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-[#2c1e0f]">Puntos de la capa</h3>
                <div className="space-y-2">
                  {selectedLayerFeatures.length === 0 && <p className="text-[12px] text-[#8b7d6b]">Todavia no hay puntos en esta capa.</p>}
                  {selectedLayerFeatures.map((feature, index) => (
                    <div key={`${pointForm.layerId}-${index}`} className="flex items-center gap-3 rounded-xl border border-black/5 px-3 py-2.5 bg-white/50">
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-[#2c1e0f] truncate">{String(feature.properties?.nombre || `Punto ${index + 1}`)}</div>
                        <div className="text-[10px] text-[#8b7d6b] truncate">{String(feature.properties?.tipo || "Punto")}</div>
                      </div>
                      <button onClick={() => onDeletePoint(pointForm.layerId, index)} className="p-2 rounded-lg text-[#e74c3c] hover:bg-[#e74c3c]/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
