import { useNavigate } from "react-router-dom";
import { Map, ChevronRight } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTASection() {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();
    const sectionRef = useRef(null);
    const isVisible = useInView(sectionRef, { once: true, margin: "-100px" });

    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: [0.22, 1, 0.36, 1], type: "tween" as const };

    return (
        <section className="py-24 bg-white" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -3, filter: "blur(10px)", boxShadow: "0 0px 0px rgba(0,0,0,0)" }}
                    animate={isVisible ? { opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" } : { opacity: 0, y: 50, scale: 0.9, rotate: -3, filter: "blur(10px)", boxShadow: "0 0px 0px rgba(0,0,0,0)" }}
                    transition={transition}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2c1e0f] via-[#3d2e1e] to-[#4a3828] px-8 py-16 sm:px-16 sm:py-20 text-center"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#4a7c59]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#d4a96a]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                            Explora el territorio
                            <br />
                            <span className="bg-gradient-to-r from-[#6ba368] to-[#4bb89a] bg-clip-text text-transparent">
                                de Ocaña
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-10" style={{ lineHeight: 1.7 }}>
                            Descubre capas geoespaciales, analiza datos territoriales y contribuye al desarrollo sostenible del municipio.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate("/mapa")}
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4a7c59] to-[#5d9a6e] text-white text-base font-bold rounded-2xl shadow-lg shadow-[#4a7c59]/30 hover:shadow-xl hover:shadow-[#4a7c59]/40 active:scale-[0.97] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ba368] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2c1e0f]"
                            >
                                <Map className="w-5 h-5" />
                                Explorar Mapa
                            </button>
                            <a
                                href="#contacto"
                                className="inline-flex items-center gap-2 px-7 py-4 border-2 border-white/20 text-white/80 text-base font-bold rounded-2xl hover:border-white/40 hover:text-white active:scale-[0.97] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            >
                                Contactar
                                <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
