import { motion, AnimatePresence } from "framer-motion";
import { X, Users, MapPin, Building2, TreePine, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { dashboardStats } from "@/data/ocana-geodata";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PIE_COLORS = ["#4a7c59", "#5d9a6e", "#d4a96a", "#c0392b", "#8e6f3e", "#2d8a6e"];
const AGE_COLORS = ["#d4a96a", "#c0875a", "#4a7c59", "#2d8a6e"];
const TOOLTIP_STYLE = {
  borderRadius: 10, fontSize: 12, border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 4px 16px rgba(44,30,15,0.1)", fontWeight: 500,
  backgroundColor: "white", color: "#2c1e0f",
};

export default function DashboardPanel({ isOpen, onClose }: DashboardPanelProps) {
  const stats = dashboardStats;
  const isMobile = useIsMobile();

  const metrics = [
    { id: "poblacion", icon: Users,     label: "Población Total",       value: stats.poblacionTotal.toLocaleString("es-CO"), sublabel: "2do municipio más poblado del dpto.", color: "#4a7c59", bg: "#f0f7f3" },
    { id: "area",      icon: MapPin,    label: "Área Total",            value: `${(stats.areaTotalHa / 100).toFixed(2)} km²`, sublabel: `Urbano: ${(stats.areaUrbana / 100).toFixed(2)} km²`, color: "#d4a96a", bg: "#fef8f0" },
    { id: "barrios",   icon: Building2, label: "Barrios Urbanos",       value: String(stats.numBarrios), sublabel: `${stats.numComunas} comunas`, color: "#8e6f3e", bg: "#faf5ed" },
    { id: "veredas",   icon: TreePine,  label: "Veredas / Correg.",     value: `${stats.numVeredas} / ${stats.numCorregimientos}`, sublabel: "Divisiones rurales", color: "#2d8a6e", bg: "#e8f7f3" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} className="fixed inset-0 bg-black/40 z-[999]"
            />
          )}

          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.92, x: 40 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className={isMobile
              ? "fixed inset-x-0 top-[56px] bottom-0 z-[1000] flex flex-col overflow-hidden"
              : "absolute top-4 bottom-4 right-[60px] z-[1000] flex flex-col rounded-2xl overflow-hidden w-[400px]"
            }
            style={{
              background: "rgba(235,228,218,0.97)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              boxShadow: "0 12px 40px rgba(44,30,15,0.10)",
              border: isMobile ? "none" : "1px solid rgba(180,170,155,0.4)",
            }}
          >
            {/* Top accent bar */}
            <div style={{ height: "3px", background: "linear-gradient(90deg, #4a7c59, #d4a96a)", flexShrink: 0 }} />

            {/* Header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BarChart3 style={{ width: "18px", height: "18px", color: "#4a7c59" }} />
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>Análisis Territorial</h2>
                  <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>Municipio de Ocaña · Norte de Santander</p>
                </div>
              </div>
              {/* X button - visible in top right */}
              <button
                onClick={onClose}
                aria-label="Cerrar"
                style={{
                  background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "8px",
                  width: "36px", height: "36px", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", flexShrink: 0,
                  transition: "background 150ms"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
              >
                <X style={{ width: "16px", height: "16px", color: "#444" }} />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Datos certificados */}
              <div style={{ background: "rgba(74,124,89,0.07)", border: "1px solid rgba(74,124,89,0.15)", borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#4a7c59", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4a7c59", display: "inline-block" }} />
                  Datos certificados
                </span>
                <span style={{ fontSize: "10px", color: "#888" }}>DANE 2024 · POT Ocaña</span>
              </div>

              {/* KPI Cards - 1 columna */}
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.id} style={{ background: m.bg, border: `1px solid ${m.color}25`, borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ background: `${m.color}18`, borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: "22px", height: "22px", color: m.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: "600", color: m.color, margin: "0 0 2px 0", textTransform: "uppercase", letterSpacing: "0.3px" }}>{m.label}</p>
                      <p style={{ fontSize: "22px", fontWeight: "900", color: "#1a1a1a", margin: "0 0 2px 0", lineHeight: 1.1 }}>{m.value}</p>
                      <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>{m.sublabel}</p>
                    </div>
                  </div>
                );
              })}

              {/* Distribución del Área */}
              <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", padding: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#8b7d6b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px 0" }}>Distribución del Área</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#2c1e0f", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d4a96a", display: "inline-block" }} />
                    Urbana: {(stats.areaUrbana / 100).toFixed(2)} km² ({((stats.areaUrbana / stats.areaTotalHa) * 100).toFixed(1)}%)
                  </span>
                  <span style={{ fontSize: "11px", color: "#2c1e0f", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4a7c59", display: "inline-block" }} />
                    Rural: {((stats.areaRural ?? stats.areaTotalHa - stats.areaUrbana) / 100).toFixed(0)} km²
                  </span>
                </div>
                <div style={{ height: "8px", borderRadius: "99px", background: "#f0ece4", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${(stats.areaUrbana / stats.areaTotalHa) * 100}%`, background: "#d4a96a", minWidth: "3px" }} />
                  <div style={{ flex: 1, background: "#4a7c59" }} />
                </div>
              </div>

              {/* Distribución por Género */}
              <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", padding: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#8b7d6b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px 0" }}>Distribución por Género</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#2c1e0f", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8e6f3e", display: "inline-block" }} />
                    Mujeres: {stats.distribucionGenero[0].cantidad.toLocaleString("es-CO")} ({stats.distribucionGenero[0].porcentaje}%)
                  </span>
                  <span style={{ fontSize: "11px", color: "#2c1e0f", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4a7c59", display: "inline-block" }} />
                    Hombres: {stats.distribucionGenero[1].cantidad.toLocaleString("es-CO")} ({stats.distribucionGenero[1].porcentaje}%)
                  </span>
                </div>
                <div style={{ height: "8px", borderRadius: "99px", background: "#f0ece4", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${stats.distribucionGenero[0].porcentaje}%`, background: "#8e6f3e" }} />
                  <div style={{ flex: 1, background: "#4a7c59" }} />
                </div>
              </div>

              {/* Distribución Etaria */}
              <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", padding: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#8b7d6b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>Distribución Etaria</p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={stats.poblacionPorEdad} layout="vertical" margin={{ top: 0, right: 32, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#8b7d6b" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="grupo" tick={{ fontSize: 10, fill: "#8b7d6b" }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v.toLocaleString("es-CO") + " hab.", "Población"]} />
                    <Bar dataKey="cantidad" radius={[0, 6, 6, 0]} maxBarSize={14}>
                      {stats.poblacionPorEdad.map((_, i) => <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Población por Comuna */}
              <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", padding: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#8b7d6b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>Población por Comuna</p>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={stats.poblacionPorComuna} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="comuna" tick={{ fontSize: 10, fill: "#8b7d6b" }} axisLine={false} tickLine={false} tickFormatter={v => `C${v.split(" ")[0].replace("·","").trim()}`} />
                    <YAxis tick={{ fontSize: 10, fill: "#8b7d6b" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v.toLocaleString("es-CO") + " hab.", "Población"]} />
                    <Bar dataKey="poblacion" fill="#4a7c59" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Estratificación */}
              <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", padding: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#8b7d6b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>Estratificación Socioeconómica</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={stats.estratificacion} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="porcentaje" nameKey="estrato"
                      label={({ estrato, porcentaje }) => `${estrato.replace("Estrato ", "E")}: ${porcentaje}%`}
                      labelLine={{ stroke: "#8b7d6b", strokeWidth: 1 }} style={{ fontSize: "10px", fontWeight: 600 }}>
                      {stats.estratificacion.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, _: string, p: any) => [`${v}% · ${p.payload.viviendas?.toLocaleString("es-CO")} viv.`, _]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginTop: "4px" }}>
                  {stats.estratificacion.map((s, i) => (
                    <div key={s.estrato} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
                      <span style={{ fontSize: "10px", color: "#8b7d6b", fontWeight: "500" }}>{s.estrato.replace("Estrato ", "E")} · {s.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipamientos */}
              <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", padding: "16px", marginBottom: "8px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#8b7d6b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>Equipamientos Urbanos</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {Object.entries(stats.equipamientos).map(([key, value]) => (
                    <div key={key} style={{ background: "#f5f0e8", borderRadius: "10px", padding: "12px 8px", textAlign: "center", border: "1px solid rgba(0,0,0,0.04)" }}>
                      <div style={{ fontSize: "20px", fontWeight: "900", color: "#2c1e0f" }}>{value}</div>
                      <div style={{ fontSize: "9px", color: "#8b7d6b", fontWeight: "600", textTransform: "capitalize", marginTop: "4px" }}>{key}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}