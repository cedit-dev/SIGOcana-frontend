import { useState, useMemo } from "react";
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
  Info
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { LayerConfig, LAYER_CATEGORIES } from "@/data/ocana-geodata";
import { BASE_MAPS, BaseMapKey } from "./MapView";

const ICON_MAP: Record<string, any> = {
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
  Road: RoadIcon
};

const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = ICON_MAP[name] || Info;
  return <IconComponent className={className} />;
};

interface LayerPanelProps {
  layers: LayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  baseMap: BaseMapKey;
  onBaseMapChange: (key: BaseMapKey) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function LayerPanel({
  layers, onToggleLayer, onOpacityChange,
  baseMap, onBaseMapChange, isOpen, onClose
}: LayerPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["admin", "equip"]));
  const [showBaseMaps, setShowBaseMaps] = useState(false);
  const [search, setSearch] = useState("");

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
          className="absolute top-0 left-0 bottom-0 z-[1000] w-[340px] bg-primary text-primary-foreground flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gis-green" />
                <h2 className="font-semibold text-lg">Capas</h2>
                <span className="gis-badge bg-gis-green text-primary-foreground">
                  {activeCount} activas
                </span>
              </div>
              <button onClick={onClose} className="p-1 rounded hover:bg-sidebar-accent transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar capa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground h-9 text-sm"
              />
            </div>
          </div>

          {/* Base maps */}
          <div className="border-b border-sidebar-border">
            <button
              onClick={() => setShowBaseMaps(!showBaseMaps)}
              className="flex items-center gap-2 w-full px-4 py-3 hover:bg-sidebar-accent transition-colors text-sm font-medium"
            >
              <MapIcon className="w-4 h-4 text-gis-earth" />
              <span>Mapa Base</span>
              <span className="text-xs text-muted-foreground ml-auto mr-2">{BASE_MAPS[baseMap].name}</span>
              {showBaseMaps ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {showBaseMaps && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 grid grid-cols-2 gap-2">
                    {(Object.entries(BASE_MAPS) as [BaseMapKey, typeof BASE_MAPS.osm][]).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => onBaseMapChange(key)}
                        className={`text-xs px-3 py-2 rounded-md border transition-all ${baseMap === key
                          ? "bg-gis-green border-gis-green text-primary-foreground font-medium"
                          : "border-sidebar-border hover:bg-sidebar-accent"
                          }`}
                      >
                        {val.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Layer categories */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {LAYER_CATEGORIES.map(cat => {
              const catLayers = filteredLayers.filter(l => l.category === cat.id);
              if (catLayers.length === 0) return null;
              const isExpanded = expandedCategories.has(cat.id);

              return (
                <div key={cat.id} className="border-b border-sidebar-border/30">
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-3 w-full px-5 py-3.5 hover:bg-sidebar-accent/50 transition-all ${isExpanded ? 'bg-sidebar-accent/30' : ''}`}
                  >
                    <div className={`p-1.5 rounded-lg ${isExpanded ? 'bg-gis-green/20 text-gis-green' : 'text-muted-foreground'}`}>
                      <IconRenderer name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-semibold tracking-tight">{cat.name}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sidebar-accent text-muted-foreground">
                        {catLayers.filter(l => l.visible).length}/{catLayers.length}
                      </span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-sidebar-accent/10"
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
                                    <div className="bg-gis-green/20 p-1.5 rounded-md text-gis-green">
                                      <Eye className="w-3.5 h-3.5" />
                                    </div>
                                  ) : (
                                    <div className="bg-muted/50 p-1.5 rounded-md text-muted-foreground">
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
                                    <span className="text-[12.5px] font-medium truncate">{layer.name}</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground/70 truncate px-0">{layer.description}</p>
                                </div>

                                <div className="flex-shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
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
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-14">Opacidad</span>
                                    <Slider
                                      value={[layer.opacity * 100]}
                                      onValueChange={([v]) => onOpacityChange(layer.id, v / 100)}
                                      max={100}
                                      step={1}
                                      className="flex-1 cursor-pointer"
                                    />
                                    <span className="text-[10px] font-mono font-medium text-gis-green w-8 text-right">
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
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border bg-sidebar-background/50 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gis-green animate-pulse" />
              <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/80">
                Sistema Activo
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">
              v1.2.0 · Ocaña
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
