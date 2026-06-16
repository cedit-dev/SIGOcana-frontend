import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MapPreviewSection() {
    const reduceMotion = useReducedMotion();
    const sectionRef = useRef(null);
    const isVisible = useInView(sectionRef, { once: true, margin: "-100px" });

    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.22, 1, 0.36, 1], type: "tween" as const };

    return (
        <section id="plataforma" className="py-24 bg-[#faf7f2]" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={transition}
                    className="text-center mb-12"
                >
                    <span className="text-xs font-bold text-[#4a7c59] uppercase tracking-wider mb-3 block">
                        Plataforma en Acción
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#2c1e0f] mb-4 leading-tight">
                        El territorio, en tiempo real
                    </h2>
                    <p className="text-base text-[#6b5b4e] max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
                        Accede a la plataforma GIS completa con miles de capas de datos geoespaciales, análisis territorial
                        y herramientas de visualización profesionales.
                    </p>
                </motion.div>

                {/* Map preview iframe */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ ...transition, delay: 0.08 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                    style={{ height: "520px", border: "1px solid rgba(74,124,89,0.2)" }}
                >
                    <iframe
                        src="/mapa"
                        title="Vista previa del mapa GIS de Ocaña"
                        className="w-full h-full"
                        loading="lazy"
                    />

                    {/* CTA overlay at bottom */}
                    <motion.div
                        className="absolute bottom-0 inset-x-0 flex justify-center pb-6 pointer-events-none"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ ...transition, delay: 0.16 }}
                    >
                        <a
                            href="/mapa"
                            className="pointer-events-auto px-6 py-3 bg-[#4a7c59] text-white font-bold rounded-xl
                                     shadow-lg hover:bg-[#3d6b4a] transition-colors duration-200 cursor-pointer
                                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4a7c59]"
                        >
                            Abrir mapa completo →
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
