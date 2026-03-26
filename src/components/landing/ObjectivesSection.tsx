import { Database, RefreshCw, Target, Handshake, Cpu, Users } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

const OBJECTIVES = [
    {
        icon: Database,
        title: "Estandarización de Datos",
        description: "Unificar y normalizar la información geoespacial del municipio bajo estándares nacionales e internacionales.",
        gradient: "from-[#4a7c59] to-[#6ba368]",
    },
    {
        icon: RefreshCw,
        title: "Información Actualizada",
        description: "Garantizar el acceso a datos geográficos actualizados y confiables para la toma de decisiones.",
        gradient: "from-[#2d8a6e] to-[#4bb89a]",
    },
    {
        icon: Target,
        title: "Planificación Territorial",
        description: "Apoyar la planificación basada en evidencia para el desarrollo sostenible del municipio.",
        gradient: "from-[#c4883a] to-[#d4a96a]",
    },
    {
        icon: Handshake,
        title: "Colaboración Institucional",
        description: "Facilitar la cooperación entre entidades públicas y privadas mediante datos geoespaciales compartidos.",
        gradient: "from-[#3b82f6] to-[#60a5fa]",
    },
    {
        icon: Cpu,
        title: "Territorios Inteligentes",
        description: "Promover territorios inteligentes y resilientes mediante el uso de tecnología geoespacial avanzada.",
        gradient: "from-[#8b5cf6] to-[#a78bfa]",
    },
    {
        icon: Users,
        title: "Participación Ciudadana",
        description: "Empoderar a los ciudadanos con herramientas para consultar y aportar información territorial.",
        gradient: "from-[#ec4899] to-[#f472b6]",
    },
];

export default function ObjectivesSection() {
    const reduceMotion = useReducedMotion();
    const sectionRef = useRef(null);
    const isVisible = useInView(sectionRef, { once: true, margin: "-100px" });

    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: [0.22, 1, 0.36, 1], type: "tween" as const };

    return (
        <section id="objetivos" className="py-24 bg-white" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={transition}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-bold text-[#4a7c59] uppercase tracking-wider mb-3 block">
                        Nuestros Objetivos
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#2c1e0f] mb-4 leading-tight">
                        ¿Hacia dónde vamos?
                    </h2>
                    <p className="text-base text-[#6b5b4e] max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
                        SigOcaña busca transformar la gestión territorial del municipio a través de seis objetivos estratégicos.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {OBJECTIVES.map((obj, i) => (
                        <motion.div
                            key={obj.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ ...transition, delay: i * 0.04 }}
                            className="group bg-[#faf7f2] border border-[#e8dfd4] rounded-2xl p-7 cursor-pointer hover:shadow-xl hover:shadow-[#3d2e1e]/5 hover:-translate-y-1 transition-all duration-200"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${obj.gradient} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-200`}
                            >
                                <obj.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-[#2c1e0f] mb-2">{obj.title}</h3>
                            <p className="text-sm text-[#6b5b4e] leading-relaxed" style={{ lineHeight: 1.65 }}>
                                {obj.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
