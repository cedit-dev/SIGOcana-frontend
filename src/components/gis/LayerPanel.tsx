import { useState, type ElementType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Layers,
  X,
  Map as MapIcon,
  Search,
  Layout,
  HardHat,
  Building2,
  Leaf,
  BarChart3,
  Home,
  GraduationCap,
  Hospital,
  Landmark,
  Waves,
  TreePine,
  Construction,
  Route as RoadIcon,
  Info,
  // New icons for expanded categories
  Wheat,
  Trophy,
  Zap,
  Factory,
  Compass,
  Palette,
  Heart,
  Car,
  Cpu,
  Shield,
  // New icons for layers
  Trash2,
  Droplets,
  Sprout,
  Mountain,
  Volume2,
  Wind,
  AlertTriangle,
  Database,
  Square,
  Users,
  Smile,
  Lightbulb,
  Truck,
  Recycle,
  Wifi,
  Store,
  ShoppingBag,
  Briefcase,
  Camera,
  Tent,
  Film,
  BookOpen,
  Wrench,
  TrendingDown,
  Bus,
  UtensilsCrossed,
  Pill,
  Package,
  Baby,
  Activity,
  Bug,
  CircleDot,
  ParkingCircle,
  Microscope,
  ShieldAlert,
  FileText,
  Scale,
  Flame,
  CloudRain,
  FoldVertical,
  UnfoldVertical,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { LayerConfig } from "@/data/ocana-geodata";
import { useMapContext } from "./MapContext";

const ICON_MAP: Record<string, ElementType<{ className?: string }>> = {
  Layout, HardHat, Building2, Leaf, BarChart3, Home, GraduationCap,
  Hospital, Landmark, Waves, TreePine, Construction, Road: RoadIcon,
  // Category icons
  Wheat, Trophy, Zap, Factory, Compass, Palette, Heart, Car, Cpu, Shield,
  Map: MapIcon,
  // Layer icons
  Trash2, Droplets, Sprout, Mountain, Volume2, Wind, AlertTriangle, Database,
  Square, Users, Smile, Lightbulb, Truck, Recycle, Wifi, Store, ShoppingBag,
  Briefcase, Camera, Tent, Film, BookOpen, Wrench, TrendingDown, Bus,
  UtensilsCrossed, Pill, Package, Baby, Activity, Bug, CircleDot,
  ParkingCircle, Microscope, ShieldAlert, FileText, Scale, Flame, CloudRain,
  Route: RoadIcon, Eye: Eye,
};

const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = ICON_MAP[name] || Info;
  return <IconComponent className={className} />;
};

interface LayerPanelProps {
  layers: LayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Layers that have actual GeoJSON data in the map
const FEATURED_LAYER_IDS = [
  "comunas", "barrios", "educacion", "salud", "gobierno",
  "hidrografia", "uso_suelo", "estratificacion", "vias", "proyectos",
];

const FEATURED_LABELS: Record<string, string> = {
  comunas: "Comunas",
  barrios: "Barrios",
  educacion: "Colegios y Escuelas",
  salud: "Hospitales y Clínicas",
  gobierno: "Equipamientos Gubernamentales",
  hidrografia: "Hidrografía",
  uso_suelo: "Uso del Suelo",
  estratificacion: "Estratificación Socioeconómica",
  vias: "Red Vial Urbana",
  proyectos: "Proyectos de Inversión",
};

export default function LayerPanel({
  layers, onToggleLayer, onOpacityChange,
  isOpen, onClose
}: LayerPanelProps) {
  const { categories, isLoading } = useMapContext();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([]));
  const [showFeatured, setShowFeatured] = useState(true);
  const [search, setSearch] = useState("");

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedCategories(new Set(categories.map(c => c.id)));
  const collapseAll = () => setExpandedCategories(new Set());

  const filteredLayers = search
    ? layers.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
    : layers;

  const activeCount = layers.filter(l => l.visible).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -340, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute top-4 bottom-4 z-[1000] w-[320px] flex flex-col rounded-2xl overflow-hidden"
          style={{
            left: "60px",
            background: "rgba(235, 228, 218, 0.97)",
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            border: "1px solid rgba(180,170,155,0.4)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Top accent gradient bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #4a7c59 0%, #5d9a6e 40%, #d4a96a 100%)", flexShrink: 0 }} />

          {/* Header */}
          <div className="p-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#4a7c59]" />
                <h2 className="font-semibold text-lg text-[#2a2a2a]">
                  Capas
                </h2>
                <span className="gis-badge bg-[#4a7c59]/10 text-[#4a7c59]">
                  {activeCount} activas
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={expandAll} title="Expandir todo" className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors text-[#999] hover:text-[#2a2a2a]">
                  <UnfoldVertical className="w-3.5 h-3.5" />
                </button>
                <button onClick={collapseAll} title="Colapsar todo" className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors text-[#999] hover:text-[#2a2a2a]">
                  <FoldVertical className="w-3.5 h-3.5" />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors text-[#999] hover:text-[#2a2a2a]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[#bbb]" />
              <Input
                placeholder="Buscar capa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm rounded-xl border-0 text-[#2a2a2a] placeholder:text-[#bbb] focus-visible:ring-[#4a7c59]/30"
                style={{ background: "rgba(0,0,0,0.03)" }}
              />
            </div>
          </div>

          {/* ── Capas Disponibles (featured data layers) ── */}
          <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <button
              onClick={() => setShowFeatured(!showFeatured)}
              className="flex items-center gap-2 w-full px-4 py-3 hover:bg-black/[0.03] transition-colors text-sm font-semibold text-[#2a2a2a]"
            >
              <Database className="w-4 h-4 text-[#d4a96a]" />
              <span>Capas Disponibles</span>
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#d4a96a]/10 text-[#c4945a]">
                {layers.filter(l => FEATURED_LAYER_IDS.includes(l.id) && l.visible).length} activas
              </span>
              <div className="ml-auto">
                {showFeatured
                  ? <ChevronDown className="w-4 h-4 text-[#999]" />
                  : <ChevronRight className="w-4 h-4 text-[#999]" />}
              </div>
            </button>
            <AnimatePresence>
              {showFeatured && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-black/[0.012]"
                >
                  <div className="px-3 pb-3 pt-1 space-y-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                    {layers
                      .filter(l => FEATURED_LAYER_IDS.includes(l.id))
                      .map(layer => (
                        <div key={layer.id} className={`gis-layer-row ${layer.visible ? "active" : ""}`}>
                          <div className="flex items-center gap-2.5 w-full">
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: layer.color,
                                boxShadow: `0 0 0 2px ${layer.color}35`,
                              }}
                            />
                            <span className="text-[12.5px] font-medium flex-1 text-[#2a2a2a] truncate leading-tight">
                              {FEATURED_LABELS[layer.id] || layer.name}
                            </span>
                            <button
                              onClick={() => onToggleLayer(layer.id)}
                              className="flex-shrink-0 p-1.5 rounded-md transition-all active:scale-90"
                              style={{
                                background: layer.visible
                                  ? "rgba(74,124,89,0.10)"
                                  : "rgba(0,0,0,0.04)",
                              }}
                              title={layer.visible ? "Ocultar capa" : "Mostrar capa"}
                            >
                              {layer.visible
                                ? <Eye className="w-3.5 h-3.5 text-[#4a7c59]" />
                                : <EyeOff className="w-3.5 h-3.5 text-[#bbb]" />}
                            </button>
                          </div>
                          {layer.visible && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-2.5 flex items-center gap-3 px-0.5"
                            >
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#bbb] w-14 flex-shrink-0">
                                Opacidad
                              </span>
                              <Slider
                                value={[layer.opacity * 100]}
                                onValueChange={([v]) => onOpacityChange(layer.id, v / 100)}
                                max={100}
                                step={1}
                                className="flex-1 cursor-pointer"
                              />
                              <span className="text-[10px] font-mono font-semibold text-[#4a7c59] w-8 text-right flex-shrink-0">
                                {Math.round(layer.opacity * 100)}%
                              </span>
                            </motion.div>
                          )}
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Layer categories */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-black/[0.05] rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-black/[0.05] rounded w-3/4" />
                      <div className="h-2 bg-black/[0.05] rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-[#bbb]">
                <Info className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs font-medium">No se encontraron categorías</p>
              </div>
            ) : (
              categories.map(cat => {
              const catLayers = filteredLayers.filter(l => l.category === cat.id);
              if (catLayers.length === 0) return null;
              const isExpanded = expandedCategories.has(cat.id);

              return (
                <div key={cat.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-3 w-full px-5 py-3.5 hover:bg-black/[0.03] transition-all ${isExpanded ? 'bg-black/[0.02]' : ''}`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-200 ${isExpanded ? 'bg-[#4a7c59]/12 text-[#4a7c59]' : 'bg-black/[0.03] text-[#aaa]'}`}>
                      <IconRenderer name={cat.icon} className="w-5 h-5" />
                    </div>
                    <span className={`text-[13px] font-semibold tracking-tight transition-colors ${isExpanded ? 'text-[#1a1a1a]' : 'text-[#3a3a3a]'}`}>{cat.name}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black/[0.04] text-[#888]">
                        {catLayers.filter(l => l.visible).length}/{catLayers.length}
                      </span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#999]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#999]" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/[0.015]"
                      >
                        <div className="px-3 pb-3 pt-1 space-y-1">
                          {catLayers.map(layer => (
                            <div key={layer.id} className={`gis-layer-row ${layer.visible ? "active" : ""}`}>
                              <div className="flex items-center gap-3 w-full">
                                <button
                                  onClick={() => onToggleLayer(layer.id)}
                                  className="flex-shrink-0 transition-transform active:scale-90"
                                >
                                  {layer.visible ? (
                                    <div className="bg-[#4a7c59]/10 p-1.5 rounded-md text-[#4a7c59]">
                                      <Eye className="w-3.5 h-3.5" />
                                    </div>
                                  ) : (
                                    <div className="bg-black/[0.04] p-1.5 rounded-md text-[#bbb]">
                                      <EyeOff className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                </button>

                                <div className="flex-1 min-w-0" onClick={() => onToggleLayer(layer.id)}>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <div
                                      className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                                      style={{ backgroundColor: layer.color }}
                                    />
                                    <span className="text-[12.5px] font-medium truncate text-[#2a2a2a]">{layer.name}</span>
                                  </div>
                                  <p className="text-[10px] text-[#999] truncate px-0">{layer.description}</p>
                                </div>

                                <div className="flex-shrink-0 text-[#ccc] hover:text-[#888] transition-colors">
                                  <IconRenderer name={layer.icon} className="w-3.5 h-3.5" />
                                </div>
                              </div>

                              {layer.visible && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-3 px-1"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#999] w-14">Opacidad</span>
                                    <Slider
                                      value={[layer.opacity * 100]}
                                      onValueChange={([v]) => onOpacityChange(layer.id, v / 100)}
                                      max={100}
                                      step={1}
                                      className="flex-1 cursor-pointer"
                                    />
                                    <span className="text-[10px] font-mono font-medium text-[#4a7c59] w-8 text-right">
                                      {Math.round(layer.opacity * 100)}%
                                    </span>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(74,124,89,0.1)", background: "linear-gradient(0deg, rgba(74,124,89,0.03), rgba(255,255,255,0))" }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" style={{ animation: "marker-pulse 2s infinite" }} />
              <p className="text-[9.5px] font-bold tracking-widest uppercase text-[#4a7c59]/60">
                Sistema Activo
              </p>
            </div>
            <p className="text-[9.5px] text-[#bbb] font-medium">
              v1.2.0 · Ocaña
            </p>
          </div>
        </motion.div>
      )
      }
    </AnimatePresence >
  );
}
