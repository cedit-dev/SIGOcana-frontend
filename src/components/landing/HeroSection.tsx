import { useNavigate } from "react-router-dom";
import { Map, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";
import BlurText from "@/components/BlurText";
import GradientText from "@/components/GradientText";

export default function HeroSection() {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();

    const enterTransition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.8, ease: [0.22, 1, 0.36, 1] };

    return (
        <section id="inicio" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 flex-1">
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
                        <GradientText
                            className="text-xs font-bold uppercase tracking-wider"
                            colors={["#4a7c59", "#2d8a6e", "#5d9a6e"]}
                        >
                            Sistema de Información Geográfica
                        </GradientText>
                    </motion.div>

                    <div className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight text-[#2c1e0f] mb-4">
                        <BlurText
                            text="DESCUBRE OCAÑA"
                            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight text-[#2c1e0f]"
                            delay={100}
                            animateBy="words"
                            direction="top"
                        />
                    </div>

                    <motion.p
                        initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...enterTransition, delay: 0.35 }}
                        className="text-lg sm:text-xl text-[#6b5b4e] font-medium leading-relaxed mb-6 max-w-md" style={{ lineHeight: 1.6 }}
                    >
                        Tu guía digital interactiva para explorar, analizar y gestionar la información geoespacial del municipio.
                    </motion.p>

                    <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...enterTransition, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/mapa")}
                            className="group inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#4a7c59] to-[#5d9a6e] text-white text-base font-bold rounded-2xl shadow-lg shadow-[#4a7c59]/20 hover:shadow-xl hover:shadow-[#4a7c59]/30 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7c59] focus-visible:ring-offset-2"
                        >
                            Explorar Mapa
                            <Map className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </motion.button>
                        <motion.a
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            href="#nosotros"
                            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#e8dfd4] text-[#6b5b4e] text-base font-bold rounded-2xl hover:border-[#4a7c59] hover:text-[#4a7c59] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7c59] focus-visible:ring-offset-2"
                        >
                            Conocer más
                            <ChevronDown className="w-4 h-4" />
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Right — Illustration (Shifted Higher) */}
                <motion.div
                    initial={reduceMotion ? {} : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...enterTransition, delay: 0.3 }}
                    className="flex-1 flex justify-center lg:justify-end mt-4 lg:mt-6"
                >
                    <motion.div
                        className="relative w-full max-w-lg"
                        animate={reduceMotion ? {} : {
                            y: [0, -20, 0],
                            x: [0, 10, -5, 0],
                            rotate: [0, 2, -1, 0]
                        }}
                        transition={{
                            duration: 6,
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
                            loading="lazy"
                        />

                        {/* Pulsing pin overlays */}
                        <motion.div
                            className="absolute top-[15%] right-[10%] w-4 h-4 rounded-full bg-[#4a7c59]/60"
                            animate={reduceMotion ? {} : { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-[30%] left-[5%] w-3 h-3 rounded-full bg-[#d4a96a]/60"
                            animate={reduceMotion ? {} : { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={reduceMotion ? {} : {
                    y: [0, 8, 0],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={reduceMotion ? {} : {
                        opacity: [1, 0.5, 1],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-semibold text-[#6b5b4e] uppercase tracking-wider">Desplázate</span>
                    <ChevronDown className="w-5 h-5 text-[#4a7c59]" />
                </motion.div>
            </motion.div>
        </section>
    );
}
