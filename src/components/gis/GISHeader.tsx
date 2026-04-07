import { MapPin, Search, User, Home, Filter } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import GradientText from "@/components/GradientText";
import { comunasGeoJSON, barriosGeoJSON, educacionGeoJSON, saludGeoJSON, gobiernoGeoJSON, proyectosGeoJSON } from "@/data/ocana-geodata";

interface GISHeaderProps {
  onFeatureSelect?: (feature: GeoJSON.Feature) => void;
}

type CategoryKey = "todos" | "comunas" | "barrios" | "educacion" | "salud" | "gobierno" | "proyectos";

interface SearchEntry {
  text: string;
  category: CategoryKey;
  categoryLabel: string;
  feature: GeoJSON.Feature;
}

const CATEGORY_CONFIG: Record<Exclude<CategoryKey, "todos">, { label: string; icon: string; data: GeoJSON.FeatureCollection }> = {
  comunas: { label: "Comunas", icon: "🏘️", data: comunasGeoJSON },
  barrios: { label: "Barrios", icon: "🏠", data: barriosGeoJSON },
  educacion: { label: "Educación", icon: "🎓", data: educacionGeoJSON },
  salud: { label: "Salud", icon: "🏥", data: saludGeoJSON },
  gobierno: { label: "Gobierno", icon: "🏛️", data: gobiernoGeoJSON },
  proyectos: { label: "Proyectos", icon: "📋", data: proyectosGeoJSON },
};

const SEARCHABLE_FIELDS = ["nombre", "tipo", "sector", "categoria", "especialidad", "estrato", "estado", "uso", "superficie"];

const buildSearchIndex = (): SearchEntry[] => {
  const index: SearchEntry[] = [];

  (Object.entries(CATEGORY_CONFIG) as [Exclude<CategoryKey, "todos">, typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG]][]).forEach(([catKey, config]) => {
    config.data.features.forEach((feature) => {
      const props = feature.properties || {};
      const searchTexts: string[] = [];
      SEARCHABLE_FIELDS.forEach((field) => {
        const val = props[field];
        if (val !== null && val !== undefined && val !== "") {
          searchTexts.push(String(val).toLowerCase());
        }
      });
      const text = searchTexts.join(" ");
      if (text) {
        index.push({ text, category: catKey, categoryLabel: config.label, feature });
      }
    });
  });

  return index;
};

const SEARCH_INDEX = buildSearchIndex();

export default function GISHeader({ onFeatureSelect }: GISHeaderProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CategoryKey>("todos");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchLocal = useCallback((q: string, filter: CategoryKey) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const lowerQ = q.toLowerCase();
    const filtered = SEARCH_INDEX.filter((item) => {
      if (filter !== "todos" && item.category !== filter) return false;
      return item.text.includes(lowerQ);
    }).slice(0, 12);

    setResults(filtered);
  }, []);

  const searchNominatim = useCallback(async (q: string) => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q + ", Ocaña, Colombia"
        )}&limit=3&timeout=5`
      );
      const data = await response.json();

      if (data.length > 0) {
        const nominatimResults: SearchEntry[] = data.map((item: any) => ({
          text: (item.name || "").toLowerCase(),
          category: "todos" as CategoryKey,
          categoryLabel: "Nominatim",
          feature: {
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
            },
            properties: {
              nombre: item.name,
              tipo: "Ubicación (búsqueda)",
              display_name: item.display_name,
            },
          },
        }));

        setResults((prev) => {
          const combined = [...prev, ...nominatimResults];
          const unique = Array.from(
            new Map(combined.map((item) => [item.feature.properties?.nombre, item])).values()
          ).slice(0, 12);
          return unique;
        });
      }
      setIsSearching(false);
    } catch (err) {
      console.error("Error en búsqueda Nominatim:", err);
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (!value.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      searchLocal(value, activeFilter);
      setShowDropdown(true);

      debounceTimeoutRef.current = setTimeout(() => {
        searchNominatim(value);
      }, 400);
    },
    [searchLocal, searchNominatim, activeFilter]
  );

  const handleFilterChange = useCallback((filter: CategoryKey) => {
    setActiveFilter(filter);
    if (query.trim()) {
      searchLocal(query, filter);
      setShowDropdown(true);
    }
  }, [query, searchLocal]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectFeature = (entry: SearchEntry) => {
    onFeatureSelect?.(entry.feature);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  // Group results by category
  const groupedResults = results.reduce<Record<string, SearchEntry[]>>((acc, entry) => {
    const key = entry.categoryLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const filterChips: { key: CategoryKey; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "comunas", label: "Comunas" },
    { key: "barrios", label: "Barrios" },
    { key: "educacion", label: "Educación" },
    { key: "salud", label: "Salud" },
    { key: "gobierno", label: "Gobierno" },
    { key: "proyectos", label: "Proyectos" },
  ];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col z-[1001] relative"
      style={{
        background: "rgba(235, 228, 218, 0.96)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        borderBottom: "1px solid rgba(74, 124, 89, 0.14)",
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(74, 124, 89, 0.08)",
      }}
    >
      <div className="h-[56px] flex items-center px-5 gap-5">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          title="Ir a la página principal"
        >
          <div className="text-left">
            <GradientText
              className="text-[14px] font-extrabold leading-none tracking-tight"
              colors={["#4a7c59", "#2d8a6e", "#5d9a6e"]}
            >
              SIGOcaña
            </GradientText>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" style={{ animation: "marker-pulse 2s infinite" }} />
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#4a7c59" }}>
                Sistema GIS
              </p>
            </div>
          </div>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md" ref={dropdownRef}>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bbb] group-focus-within:text-[#4a7c59] transition-colors duration-200" />
            <Input
              type="text"
              placeholder="Buscar barrios, escuelas, estrato, tipo..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                if (query) setShowDropdown(results.length > 0);
                setShowFilters(true);
              }}
              className="pl-9 pr-9 h-9 text-[13px] rounded-xl text-[#2a2a2a] placeholder:text-[#c0c0c0] focus-visible:ring-[#4a7c59]/25 transition-all font-medium"
              style={{
                background: "rgba(74, 124, 89, 0.04)",
                border: "1px solid rgba(74, 124, 89, 0.12)",
              }}
            />
            <button
              onClick={() => setShowFilters(p => !p)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${showFilters ? "text-[#4a7c59] bg-[#4a7c59]/10" : "text-[#bbb] hover:text-[#4a7c59]"}`}
              title="Filtros"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showDropdown && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e0e0e0] rounded-xl shadow-lg z-50 overflow-hidden max-h-[420px] overflow-y-auto"
                >
                  {Object.entries(groupedResults).map(([categoryLabel, entries]) => (
                    <div key={categoryLabel}>
                      <div className="px-3 py-1.5 bg-[#f8f7f5] border-b border-[#eee]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a7c59]">
                          {categoryLabel}
                        </span>
                        <span className="text-[10px] text-[#999] ml-1.5">({entries.length})</span>
                      </div>
                      {entries.map((entry, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectFeature(entry)}
                          className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#f5f5f5] transition-colors text-sm border-b border-[#f0f0f0] last:border-b-0"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#4a7c59] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[#1a1a1a] truncate text-[13px]">
                              {entry.feature.properties?.nombre || "Sin nombre"}
                            </div>
                            <div className="text-[10px] text-[#888] truncate">
                              {entry.feature.properties?.tipo || entry.feature.properties?.categoria || entry.feature.properties?.uso || "Ubicación"}
                              {entry.feature.properties?.estrato && ` · Estrato ${entry.feature.properties.estrato}`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                  {isSearching && (
                    <div className="px-4 py-2 text-[11px] text-[#999] text-center">Buscando en línea...</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          <div className="hidden lg:flex flex-col items-end mr-3">
            <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">
              Alcaldía de Ocaña
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "#4a7c59" }}>
              Norte de Santander · Col.
            </span>
          </div>

          <div className="h-5 w-px bg-black/6 mx-2 hidden lg:block" />

          <div className="flex items-center gap-0.5">
            <HeaderBtn icon={<Home className="w-[15px] h-[15px]" />} label="Inicio" onClick={() => navigate("/")} />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/login")}
                  className="w-8 h-8 rounded-xl hover:bg-black/[0.04] ml-1"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#4a7c59]/8 border border-[#4a7c59]/12 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-[#4a7c59]" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Perfil</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 px-5 pb-2.5 flex-wrap">
              {filterChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => handleFilterChange(chip.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeFilter === chip.key
                      ? "bg-[#4a7c59] text-white shadow-sm"
                      : "bg-[#4a7c59]/6 text-[#4a7c59] hover:bg-[#4a7c59]/12"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function HeaderBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className="w-8 h-8 rounded-xl hover:bg-black/[0.04] text-[#888] hover:text-[#2a2a2a] transition-colors"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs font-semibold">{label}</TooltipContent>
    </Tooltip>
  );
}
