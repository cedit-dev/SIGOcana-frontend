import { MapPin, Search, User, Settings, Bell } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GISHeaderProps {
  onSearch?: (query: string) => void;
}

export default function GISHeader({ onSearch }: GISHeaderProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <header className="h-16 bg-primary text-primary-foreground flex items-center px-6 gap-6 z-[1001] relative shadow-lg border-b border-primary-foreground/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gis-green flex items-center justify-center shadow-inner group cursor-pointer transition-transform hover:scale-105">
          <MapPin className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-extrabold leading-tight tracking-tight uppercase">SigOcaña</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gis-green animate-pulse" />
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Sistema de Información Geográfica</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-xl ml-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-gis-green transition-colors" />
          <Input
            type="text"
            placeholder="Buscar capas, barrios, direcciones..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10 h-10 bg-sidebar-accent/50 border-sidebar-border/30 text-sidebar-foreground placeholder:text-muted-foreground/60 text-sm rounded-xl focus-visible:ring-gis-green/40 transition-all"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-[11px] font-bold text-primary-foreground/90 leading-none">Alcaldía de Ocaña</span>
          <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Norte de Santander, COL</span>
        </div>

        <div className="h-8 w-px bg-primary-foreground/10 mx-2 hidden md:block" />

        <div className="flex items-center gap-1">
          <HeaderAction icon={<Bell className="w-4 h-4" />} label="Notificaciones" />
          <HeaderAction icon={<Settings className="w-4 h-4" />} label="Configuración" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-sidebar-accent text-primary-foreground">
                <div className="w-8 h-8 rounded-lg bg-gis-earth-light/20 flex items-center justify-center border border-gis-earth-light/30">
                  <User className="w-4 h-4 text-gis-earth" />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Perfil de Usuario</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}

function HeaderAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-sidebar-accent text-primary-foreground/70 hover:text-primary-foreground">
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
