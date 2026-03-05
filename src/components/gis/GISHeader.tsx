import { MapPin, Search, User, Settings, Bell, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GISHeaderProps {
  onSearch?: (query: string) => void;
}

export default function GISHeader({ onSearch }: GISHeaderProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-[56px] flex items-center px-5 gap-5 z-[1001] relative"
      style={{
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        borderBottom: "1px solid rgba(74, 124, 89, 0.14)",
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(74, 124, 89, 0.08)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="relative">
          <img
            src="/sigocana-logo.png"
            alt="SigOcaña Logo"
            className="w-9 h-9 rounded-xl object-cover"
            style={{ boxShadow: "0 2px 8px rgba(74,124,89,0.25)" }}
          />
        </div>
        <div>
          <h1 className="text-[14px] font-extrabold leading-none tracking-tight text-[#1a1a1a]">
            SigOcaña
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" style={{ animation: "marker-pulse 2s infinite" }} />
            <p className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "#4a7c59" }}>
              Sistema GIS
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bbb] group-focus-within:text-[#4a7c59] transition-colors duration-200" />
          <Input
            type="text"
            placeholder="Buscar capas, barrios, direcciones..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 h-9 text-[13px] rounded-xl text-[#2a2a2a] placeholder:text-[#c0c0c0] focus-visible:ring-[#4a7c59]/25 transition-all font-medium"
            style={{
              background: "rgba(74, 124, 89, 0.04)",
              border: "1px solid rgba(74, 124, 89, 0.12)",
            }}
          />
        </div>
      </form>

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
          <HeaderBtn icon={<Bell className="w-[15px] h-[15px]" />} label="Notificaciones" />
          <HeaderBtn icon={<Settings className="w-[15px] h-[15px]" />} label="Configuración" />

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
