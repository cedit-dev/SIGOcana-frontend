import { MapPin, Search, User, Home, Loader } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import GradientText from "@/components/GradientText";
import { comunasGeoJSON, barriosGeoJSON, educacionGeoJSON, saludGeoJSON, gobiernoGeoJSON, proyectosGeoJSON } from "@/data/ocana-geodata";

interface GISHeaderProps {
  onFeatureSelect?: (feature: GeoJSON.Feature) => void;
}

// Crear índice preconstruido de nombres para búsqueda ultrarrápida
const buildSearchIndex = () => {
  const index: { nombre: string; feature: GeoJSON.Feature }[] = [];
  const allGeoJSONs = [
    comunasGeoJSON,
    barriosGeoJSON,
    educacionGeoJSON,
    saludGeoJSON,
    gobiernoGeoJSON,
    proyectosGeoJSON,
  ];

  allGeoJSONs.forEach((geoJSON) => {
    geoJSON.features.forEach((feature) => {
      const nombre = feature.properties?.nombre || "";
      if (nombre) {
        index.push({ nombre: nombre.toLowerCase(), feature });
      }
    });
  });

  return index;
};

const SEARCH_INDEX = buildSearchIndex();

export default function GISHeader({ onFeatureSelect }: GISHeaderProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoJSON.Feature[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Búsqueda local rápida en el índice
  const searchLocal = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const lowerQ = q.toLowerCase();
    const localResults = SEARCH_INDEX.filter(
      (item) =>
        item.nombre.includes(lowerQ) ||
        item.nombre.startsWith(lowerQ)
    )
      .slice(0, 8)
      .map((item) => item.feature);

    setResults(localResults);
  }, []);

  // Búsqueda en Nominatim API (geocodificación)
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
        const nominatimResults = data.map((item: any) => ({
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
        }));

        // Combinar resultados locales + Nominatim
        setResults((prev) => {
          const combined = [...prev, ...nominatimResults];
          const unique = Array.from(
            new Map(combined.map((item) => [item.properties?.nombre, item])).values()
          ).slice(0, 8);
          return unique;
        });
      }
      setIsSearching(false);
    } catch (err) {
      console.error("Error en búsqueda Nominatim:", err);
      setIsSearching(false);
    }
  }, []);

  // Debounce para búsqueda
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      // Limpiar timeout anterior
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (!value.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      // Búsqueda local inmediata
      searchLocal(value);
      setShowDropdown(true);

      // Búsqueda en Nominatim después de 400ms
      debounceTimeoutRef.current = setTimeout(() => {
        searchNominatim(value);
      }, 400);
    },
    [searchLocal, searchNominatim]
  );

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectFeature = (feature: GeoJSON.Feature) => {
    onFeatureSelect?.(feature);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-[56px] flex items-center px-5 gap-5 z-[1001] relative"
      style={{
        background: "rgba(235, 228, 218, 0.96)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        borderBottom: "1px solid rgba(74, 124, 89, 0.14)",
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(74, 124, 89, 0.08)",
      }}
    >
      {/* Logo — clickable to landing */}
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
            <p className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "#4a7c59" }}>
              Sistema GIS
            </p>
          </div>
        </div>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bbb] group-focus-within:text-[#4a7c59] transition-colors duration-200" />
          <Input
            type="text"
            placeholder="Buscar barrios, comunas, ubicaciones..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowDropdown(results.length > 0)}
            className="pl-9 h-9 text-[13px] rounded-xl text-[#2a2a2a] placeholder:text-[#c0c0c0] focus-visible:ring-[#4a7c59]/25 transition-all font-medium"
            style={{
              background: "rgba(74, 124, 89, 0.04)",
              border: "1px solid rgba(74, 124, 89, 0.12)",
            }}
          />

          {/* Search Results Dropdown */}
          {showDropdown && (results.length > 0 || isSearching) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e0e0e0] rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto"
            >
              {results.map((feature, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectFeature(feature)}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#f9f9f9] transition-colors text-sm border-b border-[#f5f5f5] last:border-b-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#4a7c59] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1a1a1a] text-xs truncate">
                      {feature.properties?.nombre || "Sin nombre"}
                    </div>
                    <div className="text-[10px] text-[#999] truncate">
                      {feature.properties?.tipo || "Ubicación"}
                    </div>
                  </div>
                </button>
              ))}

              {isSearching && (
                <div className="px-4 py-3 flex items-center gap-2 text-[12px] text-[#666] bg-[#f9f9f9]">
                  <Loader className="w-3 h-3 animate-spin text-[#4a7c59]" />
                  Buscando en mapas...
                </div>
              )}

              {query && results.length === 0 && !isSearching && (
                <div className="px-4 py-3 text-center text-[11px] text-[#999]">
                  No se encontraron resultados
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1">
        <div className="hidden lg:flex flex-col items-end mr-3">
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">
            Alcaldía de Ocaña
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: "#4a7c59" }}>
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
