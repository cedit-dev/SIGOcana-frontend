import { useNavigate } from "react-router-dom";
import { Map, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

export default function HeroSection() {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();

    const enterTransition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

    return (
        <section id="inicio" className="relative pt-10 min-h-[80vh] flex items-center overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-0">
                {/* Left — Text (Centered within its column) */}
                <motion.div
                    initial={reduceMotion ? {} : { opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...enterTransition, delay: 0.1 }}
                    className="flex-1 max-w-xl flex flex-col items-center text-center lg:-mt-10"
                >
                    <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...enterTransition, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4a7c59]/10 border border-[#4a7c59]/20 mb-4"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#4a7c59] animate-pulse" />
                        <span className="text-xs font-bold text-[#4a7c59] uppercase tracking-wider">
                            Sistema de Información Geográfica
                        </span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight text-[#2c1e0f] mb-4">
                        DESCUBRE
                        <br />
                        <span className="bg-gradient-to-r from-[#4a7c59] to-[#2d8a6e] bg-clip-text text-transparent">
                            OCAÑA
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[#6b5b4e] font-medium leading-relaxed mb-6 max-w-md" style={{ lineHeight: 1.6 }}>
                        Tu guía digital interactiva para explorar, analizar y gestionar la información geoespacial del municipio.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={() => navigate("/mapa")}
                            className="group inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#4a7c59] to-[#5d9a6e] text-white text-base font-bold rounded-2xl shadow-lg shadow-[#4a7c59]/20 hover:shadow-xl hover:shadow-[#4a7c59]/30 active:scale-[0.97] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7c59] focus-visible:ring-offset-2"
                        >
                            Explorar Mapa
                            <Map className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </button>
                        <a
                            href="#nosotros"
                            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#e8dfd4] text-[#6b5b4e] text-base font-bold rounded-2xl hover:border-[#4a7c59] hover:text-[#4a7c59] active:scale-[0.97] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7c59] focus-visible:ring-offset-2"
                        >
                            Conocer más
                            <ChevronDown className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>

                {/* Right — Illustration (Shifted Higher) */}
                <motion.div
                    initial={reduceMotion ? {} : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...enterTransition, delay: 0.3 }}
                    className="flex-1 flex justify-center lg:justify-end -mt-8 lg:-mt-24"
                >
                    <motion.div
                        className="relative w-full max-w-lg"
                        animate={reduceMotion ? {} : { y: [0, -12, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Glow behind image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4a7c59]/10 to-[#d4a96a]/10 rounded-3xl blur-3xl scale-110" />
                        <img
                            src="/hero-illustration.png"
                            alt="Ilustración de Ocaña: torre histórica con pins de ubicación representando el sistema de información geográfica"
                            className="relative w-full h-auto rounded-3xl shadow-2xl shadow-[#3d2e1e]/8"
                        />

                        {/* Pulsing pin overlays */}
                        <motion.div
                            className="absolute top-[15%] right-[10%] w-4 h-4 rounded-full bg-[#4a7c59]/60"
                            animate={reduceMotion ? {} : { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-[30%] left-[5%] w-3 h-3 rounded-full bg-[#d4a96a]/60"
                            animate={reduceMotion ? {} : { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
