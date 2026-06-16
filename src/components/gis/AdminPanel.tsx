import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Shield,
  Trash2,
  X,
  MapPinned,
  RotateCcw,
  Crosshair,
  Search,
  Pencil,
  Save,
  Target,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LayerConfig } from "@/data/ocana-geodata";
import { useMapContext } from "./MapContext";
import { useGisParser } from "@/hooks/useGisParser";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

interface UpdatePointInput {
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
  onUpdateLayer: (layerId: string, partial: Partial<LayerConfig>) => void;
  onImportLayer: (name: string, category: string, geojson: GeoJSON.FeatureCollection) => void;
  onDeleteLayer: (layerId: string) => void;
  onAddPoint: (input: AddPointInput) => void;
  onUpdatePoint: (layerId: string, index: number, input: UpdatePointInput) => void;
  onDeletePoint: (layerId: string, index: number) => void;
  onFocusFeature: (feature: GeoJSON.Feature) => void;
  onResetSystem: () => void;
  onToggleMapPicker: () => void;
  isPickingFromMap: boolean;
  pickedCoords?: { lat: number; lng: number } | null;
}

const ICON_OPTIONS = [
  "MapPin", "TreePine", "Waves", "Trash2", "Shield", "Droplets", "Sprout",
  "Mountain", "Volume2", "Wind", "Wheat", "Leaf", "Home", "Trophy", "Zap",
  "Factory", "Compass", "Palette", "GraduationCap", "Heart", "Car", "Cpu",
  "Landmark", "Map", "Building", "Building2", "School", "Church", "Bus",
  "Plane", "Coffee", "ShoppingCart", "Briefcase", "Camera", "Wifi", "Phone",
  "Star", "Flag", "Eye", "User", "Users", "Truck", "Bike",
];

const DEFAULT_POINT_FORM = {
  layerId: "",
  name: "",
  type: "",
  description: "",
  lat: "",
  lng: "",
};

type TabKey = "crear" | "importar" | "capas" | "puntos";

const TABS: { key: TabKey; label: string }[] = [
  { key: "crear", label: "Crear" },
  { key: "importar", label: "Importar" },
  { key: "capas", label: "Capas" },
  { key: "puntos", label: "Puntos" },
];

import * as LucideIcons from "lucide-react";

const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Info;
  return <IconComponent className={className} />;
};

export default function AdminPanel({
  isOpen,
  onClose,
  layers,
  dataMap,
  onCreateLayer,
  onUpdateLayer,
  onImportLayer,
  onDeleteLayer,
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
  onFocusFeature,
  onResetSystem,
  onToggleMapPicker,
  isPickingFromMap,
  pickedCoords,
}: AdminPanelProps) {
  const { categories } = useMapContext();
  const { toast } = useToast();
  const { parseFile, isParsing } = useGisParser();
  const [tab, setTab] = useState<TabKey>("crear");
  const [layerForm, setLayerForm] = useState<CreateLayerInput>({
    name: "",
    category: "",
    color: "#4a7c59",
    icon: "MapPin",
    description: "",
  });
  
  const [importCategory, setImportCategory] = useState<string>("");

  useEffect(() => {
    if (categories.length > 0 && !importCategory) {
      setImportCategory(categories[0].id);
    }
  }, [categories, importCategory]);

  useEffect(() => {
    if (categories.length > 0 && !layerForm.category) {
      setLayerForm(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories, layerForm.category]);
  const [pointForm, setPointForm] = useState(DEFAULT_POINT_FORM);
  const [layerSearch, setLayerSearch] = useState("");
  const [pointSearch, setPointSearch] = useState("");
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [layerDraft, setLayerDraft] = useState<Partial<LayerConfig>>({});
  const [editingPointIndex, setEditingPointIndex] = useState<number | null>(null);
  const [pointDraft, setPointDraft] = useState({ name: "", type: "", description: "", lat: "", lng: "" });
  const [showAddPointForm, setShowAddPointForm] = useState(false);

  useEffect(() => {
    if (!pickedCoords) return;
    if (editingPointIndex !== null) {
      setPointDraft((prev) => ({ ...prev, lat: String(pickedCoords.lat), lng: String(pickedCoords.lng) }));
    } else {
      setPointForm((prev) => ({ ...prev, lat: String(pickedCoords.lat), lng: String(pickedCoords.lng) }));
      setShowAddPointForm(true);
    }
  }, [pickedCoords, editingPointIndex]);

  const pointLayers = useMemo(
    () =>
      layers.filter((layer) => {
        const data = dataMap[layer.id];
        return layer.geometryType === "Point" || data?.features.every((feature) => feature.geometry?.type === "Point");
      }),
    [dataMap, layers],
  );

  const filteredLayers = useMemo(() => {
    const q = layerSearch.trim().toLowerCase();
    if (!q) return layers;
    return layers.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q),
    );
  }, [layers, layerSearch]);

  const selectedLayerFeatures = (pointForm.layerId && dataMap[pointForm.layerId]?.features) || [];

  const filteredFeatures = useMemo(() => {
    const q = pointSearch.trim().toLowerCase();
    const indexed = selectedLayerFeatures.map((feature, index) => ({ feature, index }));
    if (!q) return indexed;
    return indexed.filter(({ feature }) => {
      const props = feature.properties || {};
      return [props.nombre, props.tipo, props.descripcion]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [selectedLayerFeatures, pointSearch]);

  const startEditLayer = (layer: LayerConfig) => {
    setEditingLayerId(layer.id);
    setLayerDraft({
      name: layer.name,
      color: layer.color,
      icon: layer.icon,
      category: layer.category,
      description: layer.description,
    });
  };

  const saveEditLayer = () => {
    if (!editingLayerId) return;
    onUpdateLayer(editingLayerId, layerDraft);
    setEditingLayerId(null);
    setLayerDraft({});
  };

  const cancelEditLayer = () => {
    setEditingLayerId(null);
    setLayerDraft({});
  };

  const startEditPoint = (feature: GeoJSON.Feature, index: number) => {
    setEditingPointIndex(index);
    const props = feature.properties || {};
    const coords = (feature.geometry as GeoJSON.Point).coordinates;
    setPointDraft({
      name: String(props.nombre || ""),
      type: String(props.tipo || ""),
      description: String(props.descripcion || ""),
      lat: String(coords[1]),
      lng: String(coords[0]),
    });
  };

  const saveEditPoint = () => {
    if (editingPointIndex === null || !pointForm.layerId) return;
    onUpdatePoint(pointForm.layerId, editingPointIndex, {
      name: pointDraft.name,
      type: pointDraft.type,
      description: pointDraft.description,
      lat: Number(pointDraft.lat),
      lng: Number(pointDraft.lng),
    });
    setEditingPointIndex(null);
  };

  const cancelEditPoint = () => {
    setEditingPointIndex(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="absolute top-4 right-[72px] bottom-4 z-[1002] w-[400px] max-w-[calc(100vw-90px)] overflow-hidden rounded-2xl flex flex-col"
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

          <div className="px-3 pt-3">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 h-8 rounded-lg text-[12px] font-bold transition-colors ${
                    tab === t.key ? "bg-white text-[#4a7c59] shadow-sm" : "text-[#8b7d6b] hover:text-[#4a7c59]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {tab === "crear" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#2c1e0f]">Nueva capa</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a7c59]">Punto</span>
                </div>
                <Input
                  placeholder="Nombre de la capa"
                  value={layerForm.name}
                  onChange={(e) => setLayerForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <select
                  value={layerForm.category}
                  onChange={(e) => setLayerForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-[88px_1fr] gap-3 items-center">
                  <label className="flex items-center gap-2 h-10 px-2 rounded-md border border-input bg-background cursor-pointer">
                    <input
                      type="color"
                      value={layerForm.color}
                      onChange={(e) => setLayerForm((prev) => ({ ...prev, color: e.target.value }))}
                      className="w-7 h-7 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-[#6b5b4e]">{layerForm.color}</span>
                  </label>
                  <select
                    value={layerForm.icon}
                    onChange={(e) => setLayerForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
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
                    setLayerForm({
                      name: "",
                      category: categories[0]?.id || "",
                      color: "#4a7c59",
                      icon: "MapPin",
                      description: "",
                    });
                    setTab("capas");
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Crear capa
                </Button>
              </section>
            )}

            {tab === "importar" && (
              <section className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#2c1e0f]">Importar Datos Externos</h3>
                  <p className="text-[11px] text-[#8b7d6b]">
                    Sube archivos KML o GeoJSON para crear nuevas capas automáticamente.
                    El procesamiento se realiza en segundo plano para no afectar el mapa.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4a7c59]/80">
                    Destino: Categoría del Sistema
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setImportCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                          importCategory === cat.id
                            ? "bg-[#4a7c59] border-[#4a7c59] text-white shadow-md shadow-[#4a7c59]/20"
                            : "bg-white/50 border-[#4a7c59]/10 text-[#555] hover:bg-white/80"
                        }`}
                      >
                        <IconRenderer name={cat.icon} className="w-4 h-4 mb-1" />
                        <span className="text-[9px] font-medium leading-tight text-center line-clamp-1">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div 
                  className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer overflow-hidden ${
                    isParsing ? 'bg-white/20 border-[#4a7c59]/10 cursor-not-allowed' : 'border-[#4a7c59]/20 hover:border-[#4a7c59]/40 bg-white/40'
                  }`}
                  onClick={() => !isParsing && document.getElementById('gis-file-upload')?.click()}
                >
                  <input
                    id="gis-file-upload"
                    type="file"
                    className="hidden"
                    accept=".kml,.json,.geojson"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const result = await parseFile(file);
                      if (result.success && result.geojson) {
                        const baseName = result.fileName?.split('.')[0] || "Capa Importada";
                        const newLayerName = `${baseName} (${new Date().toLocaleTimeString()})`;
                        
                        onImportLayer(
                          newLayerName,
                          importCategory,
                          result.geojson
                        );

                        toast({ 
                          title: "Archivo procesado", 
                          description: `Se detectaron ${result.geojson.features.length} elementos en ${baseName}.` 
                        });
                      } else {
                        toast({ 
                          title: "Error de importación", 
                          description: result.error || "No se pudo procesar el archivo.",
                          variant: "destructive"
                        });
                      }
                    }}
                  />
                  
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-[#4a7c59]/10 text-[#4a7c59] group-hover:scale-110 transition-transform">
                      {isParsing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#2c1e0f]">
                        {isParsing ? "Procesando archivo..." : "Seleccionar Archivo"}
                      </p>
                      <p className="text-[10px] text-[#8b7d6b] mt-1">
                        KML, GeoJSON o JSON hasta 50MB
                      </p>
                    </div>
                  </div>
                  
                  {isParsing && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center" />
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#d4a96a]/5 border border-[#d4a96a]/10">
                  <h4 className="text-[11px] font-bold text-[#a87740] uppercase tracking-wider mb-2">Consejos de Uso</h4>
                  <ul className="space-y-1.5">
                    <li className="text-[10.5px] text-[#8b7d6b] flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#d4a96a] mt-1.5 flex-shrink-0" />
                      Los archivos KML se convertirán automáticamente a GeoJSON.
                    </li>
                    <li className="text-[10.5px] text-[#8b7d6b] flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#d4a96a] mt-1.5 flex-shrink-0" />
                      La geometría se cargará en la categoría predeterminada.
                    </li>
                    <li className="text-[10.5px] text-[#8b7d6b] flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#d4a96a] mt-1.5 flex-shrink-0" />
                      Para archivos muy grandes, verás una barra de progreso.
                    </li>
                  </ul>
                </div>
              </section>
            )}

            {tab === "capas" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#2c1e0f]">Capas registradas</h3>
                  <button
                    onClick={onResetSystem}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c4945a] hover:text-[#a87740]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bbb]" />
                  <Input
                    placeholder="Buscar capa por nombre, id o categoria"
                    value={layerSearch}
                    onChange={(e) => setLayerSearch(e.target.value)}
                    className="pl-8 h-9 text-[13px]"
                  />
                </div>
                <p className="text-[11px] text-[#8b7d6b]">
                  {filteredLayers.length} de {layers.length} capas
                </p>
                <div className="space-y-2">
                  {filteredLayers.length === 0 && (
                    <p className="text-[12px] text-[#8b7d6b] py-4 text-center">No se encontraron capas.</p>
                  )}
                  {filteredLayers.map((layer) => {
                    const isEditing = editingLayerId === layer.id;
                    const count = dataMap[layer.id]?.features.length ?? 0;
                    return (
                      <div key={layer.id} className="rounded-xl border border-black/5 bg-white/50">
                        <div className="flex items-center gap-3 px-3 py-2.5">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-semibold text-[#2c1e0f] truncate">{layer.name}</div>
                            <div className="text-[10px] text-[#8b7d6b]">
                              {count} registros · {layer.source ?? "core"} · {layer.category}
                            </div>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => startEditLayer(layer)}
                              className="p-1.5 rounded-md text-[#4a7c59] hover:bg-[#4a7c59]/10"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteLayer(layer.id)}
                            className="p-1.5 rounded-md text-[#e74c3c] hover:bg-[#e74c3c]/10"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {isEditing && (
                          <div className="px-3 pb-3 pt-1 space-y-2 border-t border-black/5">
                            <Input
                              placeholder="Nombre"
                              value={layerDraft.name ?? ""}
                              onChange={(e) => setLayerDraft((prev) => ({ ...prev, name: e.target.value }))}
                              className="h-9 text-[13px]"
                            />
                            <select
                              value={layerDraft.category ?? ""}
                              onChange={(e) => setLayerDraft((prev) => ({ ...prev, category: e.target.value }))}
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-[13px]"
                            >
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <div className="grid grid-cols-[88px_1fr] gap-2">
                              <label className="flex items-center gap-2 h-9 px-2 rounded-md border border-input bg-background cursor-pointer">
                                <input
                                  type="color"
                                  value={layerDraft.color ?? "#4a7c59"}
                                  onChange={(e) => setLayerDraft((prev) => ({ ...prev, color: e.target.value }))}
                                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-[#6b5b4e]">{layerDraft.color}</span>
                              </label>
                              <select
                                value={layerDraft.icon ?? "MapPin"}
                                onChange={(e) => setLayerDraft((prev) => ({ ...prev, icon: e.target.value }))}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 text-[13px]"
                              >
                                {ICON_OPTIONS.map((icon) => (
                                  <option key={icon} value={icon}>
                                    {icon}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <Textarea
                              placeholder="Descripcion"
                              value={layerDraft.description ?? ""}
                              onChange={(e) => setLayerDraft((prev) => ({ ...prev, description: e.target.value }))}
                              className="min-h-[60px] text-[13px]"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 gap-1.5 h-8" onClick={saveEditLayer}>
                                <Save className="w-3.5 h-3.5" />
                                Guardar
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 h-8" onClick={cancelEditLayer}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {tab === "puntos" && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-[#2c1e0f]">Puntos</h3>
                <select
                  value={pointForm.layerId}
                  onChange={(e) => {
                    setPointForm((prev) => ({ ...prev, layerId: e.target.value }));
                    setEditingPointIndex(null);
                    setPointSearch("");
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecciona una capa</option>
                  {pointLayers.map((layer) => (
                    <option key={layer.id} value={layer.id}>
                      {layer.name}
                    </option>
                  ))}
                </select>

                {pointForm.layerId && (
                  <>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bbb]" />
                      <Input
                        placeholder="Buscar por nombre, tipo o descripcion"
                        value={pointSearch}
                        onChange={(e) => setPointSearch(e.target.value)}
                        className="pl-8 h-9 text-[13px]"
                      />
                    </div>

                    <div className="rounded-xl border border-black/5 bg-white/40">
                      <button
                        onClick={() => setShowAddPointForm((p) => !p)}
                        className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-[#2c1e0f] hover:bg-black/[0.02]"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-3.5 h-3.5 text-[#4a7c59]" />
                          Agregar punto
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAddPointForm ? "rotate-180" : ""}`} />
                      </button>
                      {showAddPointForm && (
                        <div className="px-3 pb-3 space-y-2 border-t border-black/5">
                          <Input
                            placeholder="Nombre del punto"
                            value={pointForm.name}
                            onChange={(e) => setPointForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-9 text-[13px]"
                          />
                          <Input
                            placeholder="Tipo"
                            value={pointForm.type}
                            onChange={(e) => setPointForm((prev) => ({ ...prev, type: e.target.value }))}
                            className="h-9 text-[13px]"
                          />
                          <Textarea
                            placeholder="Descripcion"
                            value={pointForm.description}
                            onChange={(e) => setPointForm((prev) => ({ ...prev, description: e.target.value }))}
                            className="min-h-[60px] text-[13px]"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              step="0.000001"
                              placeholder="Latitud"
                              value={pointForm.lat}
                              onChange={(e) => setPointForm((prev) => ({ ...prev, lat: e.target.value }))}
                              className="h-9 text-[13px]"
                            />
                            <Input
                              type="number"
                              step="0.000001"
                              placeholder="Longitud"
                              value={pointForm.lng}
                              onChange={(e) => setPointForm((prev) => ({ ...prev, lng: e.target.value }))}
                              className="h-9 text-[13px]"
                            />
                          </div>
                          {isPickingFromMap && (
                            <div className="rounded-lg border border-[#4a7c59]/20 bg-[#4a7c59]/8 px-3 py-2 text-[11px] font-medium text-[#4a7c59]">
                              Haz clic en el mapa para tomar la ubicacion del nuevo punto.
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              className="gap-1.5 h-8"
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
                              <MapPinned className="w-3.5 h-3.5" />
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1.5 h-8"
                              variant={isPickingFromMap ? "default" : "outline"}
                              onClick={onToggleMapPicker}
                            >
                              <Crosshair className="w-3.5 h-3.5" />
                              {isPickingFromMap ? "Cancelar" : "Del mapa"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-[#8b7d6b]">
                      {filteredFeatures.length} de {selectedLayerFeatures.length} puntos
                    </p>

                    <div className="space-y-2">
                      {filteredFeatures.length === 0 && (
                        <p className="text-[12px] text-[#8b7d6b] py-4 text-center">
                          {selectedLayerFeatures.length === 0
                            ? "Todavia no hay puntos en esta capa."
                            : "No se encontraron coincidencias."}
                        </p>
                      )}
                      {filteredFeatures.map(({ feature, index }) => {
                        const isEditing = editingPointIndex === index;
                        const props = feature.properties || {};
                        const coords = (feature.geometry as GeoJSON.Point).coordinates;
                        return (
                          <div
                            key={`${pointForm.layerId}-${index}`}
                            className="rounded-xl border border-black/5 bg-white/50"
                          >
                            <div className="flex items-center gap-2 px-3 py-2.5">
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-semibold text-[#2c1e0f] truncate">
                                  {String(props.nombre || `Punto ${index + 1}`)}
                                </div>
                                <div className="text-[10px] text-[#8b7d6b] truncate">
                                  {String(props.tipo || "Punto")} · {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
                                </div>
                              </div>
                              <button
                                onClick={() => onFocusFeature(feature)}
                                className="p-1.5 rounded-md text-[#4a7c59] hover:bg-[#4a7c59]/10"
                                title="Centrar en mapa"
                              >
                                <Target className="w-3.5 h-3.5" />
                              </button>
                              {!isEditing && (
                                <button
                                  onClick={() => startEditPoint(feature, index)}
                                  className="p-1.5 rounded-md text-[#4a7c59] hover:bg-[#4a7c59]/10"
                                  title="Editar"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => onDeletePoint(pointForm.layerId, index)}
                                className="p-1.5 rounded-md text-[#e74c3c] hover:bg-[#e74c3c]/10"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {isEditing && (
                              <div className="px-3 pb-3 pt-1 space-y-2 border-t border-black/5">
                                <Input
                                  placeholder="Nombre"
                                  value={pointDraft.name}
                                  onChange={(e) => setPointDraft((prev) => ({ ...prev, name: e.target.value }))}
                                  className="h-9 text-[13px]"
                                />
                                <Input
                                  placeholder="Tipo"
                                  value={pointDraft.type}
                                  onChange={(e) => setPointDraft((prev) => ({ ...prev, type: e.target.value }))}
                                  className="h-9 text-[13px]"
                                />
                                <Textarea
                                  placeholder="Descripcion"
                                  value={pointDraft.description}
                                  onChange={(e) => setPointDraft((prev) => ({ ...prev, description: e.target.value }))}
                                  className="min-h-[60px] text-[13px]"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="Latitud"
                                    value={pointDraft.lat}
                                    onChange={(e) => setPointDraft((prev) => ({ ...prev, lat: e.target.value }))}
                                    className="h-9 text-[13px]"
                                  />
                                  <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="Longitud"
                                    value={pointDraft.lng}
                                    onChange={(e) => setPointDraft((prev) => ({ ...prev, lng: e.target.value }))}
                                    className="h-9 text-[13px]"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="flex-1 gap-1.5 h-8" onClick={saveEditPoint}>
                                    <Save className="w-3.5 h-3.5" />
                                    Guardar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5 h-8"
                                    onClick={onToggleMapPicker}
                                  >
                                    <Crosshair className="w-3.5 h-3.5" />
                                    {isPickingFromMap ? "Cancelar" : "Mapa"}
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8" onClick={cancelEditPoint}>
                                    X
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
