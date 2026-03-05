import { motion, AnimatePresence } from "framer-motion";
import { X, Users, MapPin, Building2, TrendingUp, TreePine } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { dashboardStats } from "@/data/ocana-geodata";

interface DashboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PIE_COLORS = ["#4a7c59", "#5d9a6e", "#d4a96a", "#c0392b", "#8e6f3e", "#2d8a6e"];
const BAR_GRADIENT_START = "#4a7c59";
const BAR_GRADIENT_END = "#2d8a6e";
const AGE_COLORS = ["#d4a96a", "#c0875a", "#4a7c59", "#2d8a6e"];

const TOOLTIP_STYLE = {
  borderRadius: 12,
  fontSize: 12,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 4px 16px rgba(44,30,15,0.1)",
  fontWeight: 500,
  backgroundColor: "white",
  color: "#2c1e0f",
};

const CARD_STYLE = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 1px 4px rgba(44,30,15,0.04)",
};

export default function DashboardPanel({ isOpen, onClose }: DashboardPanelProps) {
  const stats = dashboardStats;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute top-4 bottom-4 h-auto z-[1000] flex flex-col overflow-hidden rounded-2xl"
          style={{
            width: "380px",
            maxWidth: "95vw",
            right: "60px",
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Top accent gradient bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #d4a96a 0%, #c4945a 40%, #4a7c59 100%)", flexShrink: 0 }} />

          {/* Header */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(74,124,89,0.10)" }}>
                  <TrendingUp className="w-4 h-4 text-[#4a7c59]" />
                </div>
                <h2 className="font-bold text-[15px] tracking-tight text-[#1a1a1a]">
                  Análisis Territorial
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/[0.05] text-[#aaa] hover:text-[#2a2a2a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12px] text-[#888] font-medium ml-[42px]">
              Municipio de Ocaña · Norte de Santander
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">

            {/* Data source banner */}
            <div
              className="rounded-xl px-3.5 py-2.5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, rgba(74,124,89,0.08) 0%, rgba(212,169,106,0.06) 100%)", border: "1px solid rgba(74,124,89,0.12)" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" />
                <span className="text-[11px] text-[#4a7c59] font-bold">Datos certificados</span>
              </div>
              <span className="text-[10px] text-[#8b7d6b] font-medium">DANE 2024 · POT Ocaña</span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Población Total"
                value={stats.poblacionTotal.toLocaleString("es-CO")}
                subValue="2do municipio más poblado del dpto."
                color="#4a7c59"
              />
              <StatCard
                icon={<MapPin className="w-4 h-4" />}
                label="Área Total"
                value={`${(stats.areaTotalHa / 100).toFixed(2)} km²`}
                subValue={`Urbano: ${(stats.areaUrbana / 100).toFixed(2)} km²`}
                color="#d4a96a"
              />
              <StatCard
                icon={<Building2 className="w-4 h-4" />}
                label="Barrios Urbanos"
                value={String(stats.numBarrios)}
                subValue={`${stats.numComunas} comunas`}
                color="#8e6f3e"
              />
              <StatCard
                icon={<TreePine className="w-4 h-4" />}
                label="Veredas / Correg."
                value={`${stats.numVeredas} / ${stats.numCorregimientos}`}
                subValue="Divisiones rurales"
                color="#2d8a6e"
              />
            </div>

            {/* Urban vs Rural */}
            <div className="rounded-2xl p-4" style={CARD_STYLE}>
              <h3 className="text-[11px] font-bold tracking-wider mb-3 uppercase text-[#8b7d6b]">
                Distribución del Área
              </h3>
              <div className="flex justify-between text-[11px] font-semibold text-[#2c1e0f] mb-3">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#d4a96a]" />
                  Urbana: {(stats.areaUrbana / 100).toFixed(2)} km² ({((stats.areaUrbana / stats.areaTotalHa) * 100).toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#4a7c59]" />
                  Rural: {(stats.areaRural / 100).toFixed(0)} km² ({((stats.areaRural / stats.areaTotalHa) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0ece4] overflow-hidden flex">
                <div
                  className="h-full bg-[#d4a96a] transition-all rounded-l-full"
                  style={{ width: `${(stats.areaUrbana / stats.areaTotalHa) * 100}%`, minWidth: "3px" }}
                />
                <div
                  className="h-full bg-[#4a7c59] transition-all rounded-r-full"
                  style={{ width: `${(stats.areaRural / stats.areaTotalHa) * 100}%` }}
                />
              </div>
            </div>

            {/* Distribución por Género */}
            <div className="rounded-2xl p-4" style={CARD_STYLE}>
              <h3 className="text-[11px] font-bold tracking-wider mb-3 uppercase text-[#8b7d6b]">
                Distribución por Género
              </h3>
              <div className="flex justify-between text-[11px] font-semibold text-[#2c1e0f] mb-3">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#9b59b6" }} />
                  Mujeres: {stats.distribucionGenero[0].cantidad.toLocaleString("es-CO")} ({stats.distribucionGenero[0].porcentaje}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#3498db" }} />
                  Hombres: {stats.distribucionGenero[1].cantidad.toLocaleString("es-CO")} ({stats.distribucionGenero[1].porcentaje}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0ece4] overflow-hidden flex">
                <div
                  className="h-full rounded-l-full transition-all"
                  style={{ width: `${stats.distribucionGenero[0].porcentaje}%`, background: "#9b59b6" }}
                />
                <div
                  className="h-full rounded-r-full transition-all"
                  style={{ width: `${stats.distribucionGenero[1].porcentaje}%`, background: "#3498db" }}
                />
              </div>
              <p className="text-[9.5px] text-[#aaa] mt-2 text-right font-medium">
                Total: {stats.poblacionTotal.toLocaleString("es-CO")} habitantes · DANE 2024
              </p>
            </div>

            {/* Distribución Etaria */}
            <div className="rounded-2xl p-4" style={CARD_STYLE}>
              <h3 className="text-[11px] font-bold tracking-wider mb-4 uppercase text-[#8b7d6b]">
                Distribución Etaria
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={stats.poblacionPorEdad}
                  layout="vertical"
                  margin={{ top: 0, right: 42, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#8b7d6b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="grupo"
                    tick={{ fontSize: 10, fill: "#8b7d6b" }}
                    axisLine={false}
                    tickLine={false}
                    width={105}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(74,124,89,0.06)" }}
                    formatter={(value: number) => [value.toLocaleString("es-CO") + " hab.", "Población"]}
                    contentStyle={TOOLTIP_STYLE}
                  />
                  <Bar dataKey="cantidad" radius={[0, 6, 6, 0]} maxBarSize={18} label={{ position: "right", fontSize: 10, fill: "#8b7d6b", formatter: (v: number) => `${((v / stats.poblacionTotal) * 100).toFixed(1)}%` }}>
                    {stats.poblacionPorEdad.map((_, i) => (
                      <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Población por Comuna */}
            <div className="rounded-2xl p-4" style={CARD_STYLE}>
              <h3 className="text-[11px] font-bold tracking-wider mb-4 uppercase text-[#8b7d6b]">
                Población por Comuna
              </h3>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={stats.poblacionPorComuna} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BAR_GRADIENT_START} stopOpacity={1} />
                      <stop offset="100%" stopColor={BAR_GRADIENT_END} stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                  <XAxis
                    dataKey="comuna"
                    tick={{ fontSize: 11, fill: "#8b7d6b" }}
                    tickFormatter={v => `C${v.split(" ")[0].replace("·", "").trim()}`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#8b7d6b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(74,124,89,0.06)" }}
                    formatter={(value: number, _: string, props: { payload: { comuna: string } }) => [
                      value.toLocaleString("es-CO") + " hab.",
                      props.payload.comuna,
                    ]}
                    contentStyle={TOOLTIP_STYLE}
                  />
                  <Bar dataKey="poblacion" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Población" maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Estratificación */}
            <div className="rounded-2xl p-4" style={CARD_STYLE}>
              <h3 className="text-[11px] font-bold tracking-wider mb-2 uppercase text-[#8b7d6b]">
                Estratificación Socioeconómica
              </h3>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Pie
                    data={stats.estratificacion}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="porcentaje"
                    nameKey="estrato"
                    label={({ estrato, porcentaje }) => `${estrato.replace("Estrato ", "E")}: ${porcentaje}%`}
                    labelLine={{ stroke: "#8b7d6b", strokeWidth: 1 }}
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    {stats.estratificacion.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: { payload: { viviendas: number } }) => [
                      `${value}% · ${props.payload.viviendas.toLocaleString("es-CO")} viviendas`,
                      name,
                    ]}
                    contentStyle={TOOLTIP_STYLE}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Stratification legend */}
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {stats.estratificacion.map((s, i) => (
                  <div key={s.estrato} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-[10px] text-[#8b7d6b] font-medium truncate">{s.estrato.replace("Estrato ", "E")} · {s.porcentaje}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipamientos */}
            <div className="rounded-2xl p-4" style={CARD_STYLE}>
              <h3 className="text-[11px] font-bold tracking-wider mb-4 uppercase text-[#8b7d6b]">
                Equipamientos Urbanos
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(stats.equipamientos).map(([key, value]) => (
                  <div
                    key={key}
                    className="text-center py-3 px-1 rounded-xl transition-all duration-200 hover:scale-[1.04]"
                    style={{ background: "#f5f0e8", border: "1px solid rgba(0,0,0,0.04)" }}
                  >
                    <div className="text-[20px] font-extrabold text-[#2c1e0f] leading-none">{value}</div>
                    <div className="text-[10px] text-[#8b7d6b] font-semibold capitalize mt-1.5">{key}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  icon, label, value, subValue, color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-3.5 flex flex-col items-start gap-2 cursor-default transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, white 60%, ${color}08)`,
        border: `1px solid ${color}18`,
        boxShadow: `0 2px 8px ${color}0f, 0 1px 2px rgba(0,0,0,0.03)`,
      }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}14`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-[18px] font-extrabold tracking-tight leading-none mb-1 text-[#1c1c1c]">{value}</div>
        <div className="text-[11px] font-semibold text-[#8b7d6b]">{label}</div>
        {subValue && <div className="text-[9.5px] font-medium text-[#bbb] mt-0.5">{subValue}</div>}
      </div>
    </div>
  );
}
