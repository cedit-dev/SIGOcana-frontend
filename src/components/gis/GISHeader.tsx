import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
    <header className="h-14 bg-primary text-primary-foreground flex items-center px-4 gap-4 z-[1001] relative shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gis-green flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight tracking-wide">SigOcaña</h1>
          <p className="text-[10px] text-muted-foreground leading-tight">Sistema de Información Geográfica</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-md ml-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar barrio, dirección, equipamiento..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 h-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground text-sm rounded-lg"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-[11px] text-muted-foreground hidden md:block">
          Municipio de Ocaña · Norte de Santander
        </span>
      </div>
    </header>
  );
}
