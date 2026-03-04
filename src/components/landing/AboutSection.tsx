import { MapPin, Users, Building2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const STATS = [
    { icon: Users, label: "67.500 Habitantes", color: "text-[#4a7c59]" },
    { icon: MapPin, label: "950 ha de Extensión", color: "text-[#c4883a]" },
    { icon: Building2, label: "10 Comunas", color: "text-[#2d8a6e]" },
];

const INFO_ROWS = [
    { label: "Altitud", value: "1.202 m.s.n.m." },
    { label: "Temperatura", value: "22°C promedio" },
    { label: "Fundación", value: "1570" },
    { label: "Departamento", value: "Norte de Santander" },
];

export default function AboutSection() {
    const reduceMotion = useReducedMotion();
    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

    return (
        <section id="nosotros" className="py-24 bg-[#faf7f2]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left — Text */}
                    <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={transition}
                        className="flex-1"
                    >
                        <span className="text-xs font-bold text-[#4a7c59] uppercase tracking-wider mb-3 block">
                            Sobre Nosotros
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-[#2c1e0f] mb-6 leading-tight">
                            ¿Qué es SigOcaña?
                        </h2>
                        <p className="text-base text-[#6b5b4e] leading-relaxed mb-4" style={{ lineHeight: 1.7, maxWidth: "65ch" }}>
                            SigOcaña es un <strong>Sistema de Información Geográfica</strong> que recopila, gestiona y visualiza datos geoespaciales del municipio de Ocaña, Norte de Santander. Permite a ciudadanos, investigadores y funcionarios públicos explorar y analizar datos espaciales de forma intuitiva.
                        </p>
                        <p className="text-base text-[#6b5b4e] leading-relaxed mb-8" style={{ lineHeight: 1.7, maxWidth: "65ch" }}>
                            Nuestro sistema apoya la planificación territorial, la gestión ambiental, el análisis socioeconómico y la transparencia pública a través de mapas interactivos.
                        </p>

                        {/* Stat badges */}
                        <div className="flex flex-wrap gap-3">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ ...transition, delay: i * 0.05 }}
                                    className="flex items-center gap-2 bg-white border border-[#e8dfd4] rounded-xl px-4 py-2.5 shadow-sm"
                                >
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    <span className="text-sm font-semibold text-[#2c1e0f]">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Info card */}
                    <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ ...transition, delay: 0.15 }}
                        className="flex-1 flex justify-center w-full"
                    >
                        <div className="w-full max-w-md bg-white border border-[#e8dfd4] rounded-2xl p-8 shadow-lg">
                            <div className="text-center mb-6">
                                <img
                                    src="/sigocana-logo.png"
                                    alt="SigOcaña Logo"
                                    className="w-14 h-14 mx-auto object-contain mb-3"
                                />
                                <h3 className="text-xl font-bold text-[#2c1e0f]">Ocaña, N. de S.</h3>
                                <p className="text-sm text-[#6b5b4e] mt-1">Colombia</p>
                            </div>
                            <div className="space-y-0">
                                {INFO_ROWS.map((row, i) => (
                                    <div
                                        key={row.label}
                                        className={`flex justify-between py-3 ${i < INFO_ROWS.length - 1 ? "border-b border-[#f0ebe3]" : ""
                                            }`}
                                    >
                                        <span className="text-sm text-[#6b5b4e]">{row.label}</span>
                                        <span className="text-sm font-bold text-[#2c1e0f]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
