import { Network, Eye, BarChart3 } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

const PRINCIPLES = [
    {
        icon: Network,
        title: "Interoperabilidad",
        description: "Integración fluida de datos entre diferentes sistemas y entidades, garantizando compatibilidad con estándares OGC y nacionales.",
        bg: "bg-[#4a7c59]/[0.06]",
        border: "border-[#4a7c59]/15",
        iconColor: "text-[#4a7c59]",
    },
    {
        icon: Eye,
        title: "Transparencia",
        description: "Acceso público y abierto a la información territorial del municipio, fortaleciendo la confianza institucional y el control ciudadano.",
        bg: "bg-[#c4883a]/[0.06]",
        border: "border-[#c4883a]/15",
        iconColor: "text-[#c4883a]",
    },
    {
        icon: BarChart3,
        title: "Gestión Territorial Eficiente",
        description: "Optimización de recursos y procesos administrativos mediante el análisis espacial y la toma de decisiones informadas.",
        bg: "bg-[#2d8a6e]/[0.06]",
        border: "border-[#2d8a6e]/15",
        iconColor: "text-[#2d8a6e]",
    },
];

export default function PrinciplesSection() {
    const reduceMotion = useReducedMotion();
    const sectionRef = useRef(null);
    const isVisible = useInView(sectionRef, { once: true, margin: "-100px" });

    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: [0.22, 1, 0.36, 1], type: "tween" as const };

    return (
        <section className="py-24 bg-[#faf7f2]" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={transition}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-bold text-[#4a7c59] uppercase tracking-wider mb-3 block">
                        Principios Rectores
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#2c1e0f] mb-4 leading-tight">
                        Nuestra base de trabajo
                    </h2>
                    <p className="text-base text-[#6b5b4e] max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
                        Tres principios fundamentales guían el desarrollo y operación de SigOcaña.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {PRINCIPLES.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ ...transition, delay: i * 0.04 }}
                            className={`${p.bg} border ${p.border} rounded-2xl p-8 hover:shadow-lg hover:shadow-[#3d2e1e]/5 hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${p.iconColor} mb-6 shadow-sm`}>
                                <p.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2c1e0f] mb-3">{p.title}</h3>
                            <p className="text-sm text-[#6b5b4e] leading-relaxed" style={{ lineHeight: 1.7 }}>
                                {p.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
