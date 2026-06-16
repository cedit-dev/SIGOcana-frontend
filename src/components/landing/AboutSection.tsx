import { MapPin, Users, Building2, Layers, Calendar, Database } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "@/components/CountUp";

const STATS = [
    { icon: Users, number: 67500, unit: "Habitantes", color: "text-[#4a7c59]" },
    { icon: MapPin, number: 950, unit: "ha de Extensión", color: "text-[#c4883a]" },
    { icon: Building2, number: 10, unit: "Comunas", color: "text-[#2d8a6e]" },
];

const PLATFORM_STATS = [
    { icon: Layers, label: "Capas disponibles", value: "65+", color: "text-[#4a7c59]" },
    { icon: MapPin, label: "Barrios mapeados", value: "47", color: "text-[#c4883a]" },
    { icon: Building2, label: "Equipamientos geo.", value: "80+", color: "text-[#2d8a6e]" },
    { icon: Calendar, label: "Datos actualizados", value: "2024", color: "text-[#6b7c5e]" },
    { icon: Database, label: "Fuentes DANE · POT", value: "Oficial", color: "text-[#8e6f3e]" },
];

export default function AboutSection() {
    const reduceMotion = useReducedMotion();
    const sectionRef = useRef(null);
    const isVisible = useInView(sectionRef, { once: true, margin: "-100px" });

    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.22, 1, 0.36, 1], type: "tween" as const };

    return (
        <section id="nosotros" className="py-24 bg-white" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left — Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={transition}
                        className="flex-1"
                    >
                        <span className="text-xs font-bold text-[#4a7c59] uppercase tracking-wider mb-3 block">
                            Sobre Nosotros
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-[#2c1e0f] mb-6 leading-tight">
                            ¿Qué es SIGOcaña?
                        </h2>
                        <p className="text-base text-[#6b5b4e] leading-relaxed mb-4" style={{ lineHeight: 1.7, maxWidth: "65ch" }}>
                            SIGOcaña es un <strong>Sistema de Información Geográfica</strong> que recopila, gestiona y visualiza datos geoespaciales del municipio de Ocaña, Norte de Santander. Permite a ciudadanos, investigadores y funcionarios públicos explorar y analizar datos espaciales de forma intuitiva.
                        </p>
                        <p className="text-base text-[#6b5b4e] leading-relaxed mb-8" style={{ lineHeight: 1.7, maxWidth: "65ch" }}>
                            Nuestro sistema apoya la planificación territorial, la gestión ambiental, el análisis socioeconómico y la transparencia pública a través de mapas interactivos.
                        </p>

                        {/* Stat badges */}
                        <div className="flex flex-wrap gap-3">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.unit}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    transition={{ ...transition, delay: 0.1 + i * 0.06 }}
                                    className="flex items-center gap-2 bg-white border border-[#e8dfd4] rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:border-[#4a7c59]/30 cursor-pointer transition-[transform,box-shadow,border-color] duration-200"
                                >
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    <span className="text-sm font-semibold text-[#2c1e0f]">
                                        <CountUp
                                            from={0}
                                            to={stat.number}
                                            separator="."
                                            duration={2.5}
                                            className="inline"
                                        />
                                        {" " + stat.unit}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Platform Stats card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], type: "tween", delay: 0.08 }}
                        className="flex-1 flex justify-center w-full"
                    >
                        <div className="w-full max-w-md bg-white border border-[#e8dfd4] rounded-2xl p-8 shadow-lg">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-[#2c1e0f]">Capacidades</h3>
                                <p className="text-sm text-[#6b5b4e] mt-1">de la Plataforma</p>
                            </div>
                            <div className="space-y-3">
                                {PLATFORM_STATS.map((stat, i) => {
                                    const strValue = String(stat.value);
                                    const numMatch = strValue.match(/^(\d+)/);
                                    const numValue = numMatch ? parseInt(numMatch[1]) : null;
                                    const suffix = strValue.replace(/^\d+/, '');

                                    return (
                                        <div
                                            key={stat.label}
                                            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#f9f7f3] transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                                <span className="text-sm text-[#6b5b4e]">{stat.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-[#2c1e0f]">
                                                {numValue !== null ? (
                                                    <>
                                                        <CountUp
                                                            from={0}
                                                            to={numValue}
                                                            duration={2.5}
                                                            className="inline"
                                                        />
                                                        {suffix}
                                                    </>
                                                ) : (
                                                    stat.value
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
