import { MapPin, Search, User, Home } from "lucide-react";
import { useState, useCallback } from "react";
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

export default function GISHeader({ onFeatureSelect }: GISHeaderProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoJSON.Feature[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const searchFeatures = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const lowerQ = q.toLowerCase();
    const allGeoJSONs = [
      comunasGeoJSON,
      barriosGeoJSON,
      educacionGeoJSON,
      saludGeoJSON,
      gobiernoGeoJSON,
      proyectosGeoJSON,
    ];

    const foundFeatures: GeoJSON.Feature[] = [];
    for (const geoJSON of allGeoJSONs) {
      for (const feature of geoJSON.features) {
        const nombre = (feature.properties?.nombre || "").toLowerCase();
        if (nombre.includes(lowerQ) && foundFeatures.length < 6) {
          foundFeatures.push(feature);
        }
      }
    }

    setResults(foundFeatures);
    setShowDropdown(foundFeatures.length > 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchFeatures(value);
  };

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
          {showDropdown && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e0e0e0] rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {results.map((feature, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectFeature(feature)}
                  className="w-full px-4 py-3 text-left flex items-center gap-2.5 hover:bg-[#f5f5f5] transition-colors text-sm border-b border-[#f0f0f0] last:border-b-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#4a7c59] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1a1a1a] truncate">
                      {feature.properties?.nombre || "Sin nombre"}
                    </div>
                    <div className="text-[11px] text-[#888] truncate">
                      {feature.properties?.tipo || feature.properties?.categoria || "Ubicación"}
                    </div>
                  </div>
                </button>
              ))}
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
