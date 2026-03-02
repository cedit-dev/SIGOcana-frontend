import { motion, AnimatePresence } from "framer-motion";
import { X, Users, MapPin, Building2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { dashboardStats } from "@/data/ocana-geodata";

interface DashboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PIE_COLORS = ["#0284c7", "#059669", "#d97706", "#dc2626", "#7c3aed", "#16a34a"];
const BAR_COLOR = "#0ea5e9";

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
          style={{ width: "450px", maxWidth: "100vw" }}
          className="absolute top-0 right-0 bottom-0 h-full z-[1000] bg-background border-l border-border flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg tracking-tight text-foreground">Análisis Territorial</h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[13px] text-muted-foreground font-medium">Municipio de Ocaña, Norte de Santander</p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Población Total"
                value={stats.poblacionTotal.toLocaleString()}
                color="text-blue-500"
              />
              <StatCard
                icon={<MapPin className="w-4 h-4" />}
                label="Área Total"
                value={`${stats.areaTotalHa} ha`}
                color="text-emerald-500"
              />
              <StatCard
                icon={<Building2 className="w-4 h-4" />}
                label="Barrios"
                value={String(stats.numBarrios)}
                color="text-amber-500"
              />
              <StatCard
                icon={<MapPin className="w-4 h-4" />}
                label="Veredas"
                value={String(stats.numVeredas)}
                color="text-purple-500"
              />
            </div>

            {/* Urban vs Rural */}
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-[13px] font-bold tracking-tight mb-3 text-foreground uppercase text-muted-foreground">Distribución del Área</h3>
              <div className="flex justify-between text-[13px] font-medium text-foreground mb-3">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" />Urbana: {stats.areaUrbana} ha ({Math.round(stats.areaUrbana / stats.areaTotalHa * 100)}%)</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" />Rural: {stats.areaRural} ha ({Math.round(stats.areaRural / stats.areaTotalHa * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${(stats.areaUrbana / stats.areaTotalHa) * 100}%` }}
                />
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${(stats.areaRural / stats.areaTotalHa) * 100}%` }}
                />
              </div>
            </div>

            {/* Población por Comuna */}
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-[13px] font-bold tracking-tight mb-4 text-foreground uppercase text-muted-foreground">Población por Comuna</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.poblacionPorComuna} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="comuna" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => v.replace("Comuna ", "C")} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                    contentStyle={{
                      borderRadius: 6, fontSize: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontWeight: 500, backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))"
                    }}
                  />
                  <Bar dataKey="poblacion" fill="url(#barGradient)" radius={[4, 4, 0, 0]} name="Población" maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Estratificación */}
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-[13px] font-bold tracking-tight mb-4 text-foreground uppercase text-muted-foreground">Estratificación</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={stats.estratificacion}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="porcentaje"
                    nameKey="estrato"
                    label={({ estrato, porcentaje }) => `${estrato}: ${porcentaje}%`}
                    labelLine={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
                    style={{ fontSize: '11px', fontWeight: 500 }}
                  >
                    {stats.estratificacion.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 6, fontSize: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontWeight: 500, backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Equipamientos */}
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
              <h3 className="text-[13px] font-bold tracking-tight mb-4 text-foreground uppercase text-muted-foreground">Equipamientos</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(stats.equipamientos).map(([key, value]) => (
                  <div key={key} className="text-center py-2 px-1 border border-border/50 rounded-lg bg-muted/30">
                    <div className="text-[18px] font-bold text-foreground leading-none">{value}</div>
                    <div className="text-[11px] text-muted-foreground font-medium capitalize mt-1.5">{key}</div>
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

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="border border-border/50 rounded-xl p-3 bg-card shadow-sm flex flex-col items-start gap-2">
      <div className={`${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-[18px] font-bold tracking-tight leading-none mb-1 text-foreground">{value}</div>
        <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
