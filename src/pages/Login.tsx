import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Map, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

// ─── Floating gradient orbs (same palette as landing page) ─────────────────
const ORBS = [
    { w: 480, h: 480, top: "-10%", left: "-8%", from: "#4a7c59", to: "#2d8a6e", delay: 0 },
    { w: 380, h: 380, top: "55%", left: "65%", from: "#d4a96a", to: "#c0875a", delay: 1.4 },
    { w: 320, h: 320, top: "10%", left: "70%", from: "#4a7c59", to: "#5d9a6e", delay: 0.7 },
];

export default function Login() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const reduceMotion = useReducedMotion();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Bienvenido",
                description: "Has iniciado sesión correctamente.",
            });
            navigate("/mapa");
        }, 1200);
    };

    const enterT = reduceMotion
        ? { duration: 0 }
        : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f0ebe1 0%, #e8ded0 50%, #edf2ec 100%)" }}
        >
            {/* ── Animated map-pin background (same as Hero) ── */}
            <AnimatedBackground />

            {/* ── Floating glowing orbs ── */}
            {ORBS.map((orb, i) => (
                <motion.div
                    key={i}
                    aria-hidden="true"
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: orb.w,
                        height: orb.h,
                        top: orb.top,
                        left: orb.left,
                        background: `radial-gradient(circle, ${orb.from}22, ${orb.to}08)`,
                        filter: "blur(60px)",
                    }}
                    animate={reduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
                />
            ))}

            {/* ── Back button ── */}
            <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...enterT, delay: 0.1 }}
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 flex items-center gap-2 text-[13px] font-semibold text-[#6b5b4e] hover:text-[#4a7c59] transition-colors z-20 group"
            >
                <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/60 backdrop-blur-sm border border-white/50 group-hover:bg-[#4a7c59]/10 group-hover:border-[#4a7c59]/20 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                </span>
                Volver
            </motion.button>

            {/* ── Login Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...enterT, delay: 0.15 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                {/* Top accent bar */}
                <div className="h-1 rounded-t-3xl" style={{ background: "linear-gradient(90deg, #d4a96a 0%, #c4945a 40%, #4a7c59 100%)" }} />

                <div
                    className="rounded-b-3xl overflow-hidden"
                    style={{
                        background: "rgba(245, 241, 235, 0.88)",
                        backdropFilter: "blur(28px) saturate(1.5)",
                        WebkitBackdropFilter: "blur(28px) saturate(1.5)",
                        border: "1px solid rgba(210, 200, 185, 0.55)",
                        borderTop: "none",
                        boxShadow: "0 24px 64px rgba(44,30,15,0.10), 0 4px 16px rgba(44,30,15,0.05)",
                    }}
                >
                    {/* ── Header ── */}
                    <div className="pt-10 pb-6 px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ ...enterT, delay: 0.25 }}
                            className="flex justify-center mb-5"
                        >
                            <img
                                src="/sigocana-logo.png"
                                alt="SigOcaña"
                                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                                style={{
                                    boxShadow: "0 8px 24px rgba(74,124,89,0.30)",
                                }}
                            />
                        </motion.div>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...enterT, delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-3"
                            style={{ background: "rgba(74,124,89,0.10)", border: "1px solid rgba(74,124,89,0.20)" }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a7c59]">
                                Sistema GIS · Ocaña
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...enterT, delay: 0.35 }}
                            className="text-[24px] font-black tracking-tight text-[#2c1e0f]"
                        >
                            Iniciar Sesión
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ ...enterT, delay: 0.4 }}
                            className="text-[13px] text-[#8b7d6b] mt-1 font-medium leading-snug"
                        >
                            Accede al Sistema de Información<br />Geográfica de Ocaña
                        </motion.p>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">

                        {/* Email */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...enterT, delay: 0.42 }}
                            className="space-y-1.5"
                        >
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#8b7d6b] flex items-center gap-1.5">
                                <Mail className="w-3 h-3" />
                                Correo electrónico
                            </label>
                            <Input
                                type="email"
                                placeholder="usuario@alcaldia.gov.co"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="h-11 rounded-xl text-[14px] font-medium text-[#2c1e0f] placeholder:text-[#c4b8a8] focus-visible:ring-[#4a7c59]/30"
                                style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(210,200,185,0.6)" }}
                            />
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...enterT, delay: 0.47 }}
                            className="space-y-1.5"
                        >
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#8b7d6b] flex items-center gap-1.5">
                                <Lock className="w-3 h-3" />
                                Contraseña
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="h-11 rounded-xl pr-10 text-[14px] font-medium text-[#2c1e0f] placeholder:text-[#c4b8a8] focus-visible:ring-[#4a7c59]/30"
                                    style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(210,200,185,0.6)" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4b8a8] hover:text-[#6b5b4e] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember / Forgot */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ ...enterT, delay: 0.51 }}
                            className="flex items-center justify-between"
                        >
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[#d4c8b8] accent-[#4a7c59] cursor-pointer"
                                />
                                <span className="text-[12px] font-medium text-[#8b7d6b]">Recordarme</span>
                            </label>
                            <button type="button" className="text-[12px] font-semibold text-[#4a7c59] hover:underline underline-offset-2">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </motion.div>

                        {/* Submit */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...enterT, delay: 0.55 }}
                        >
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                                className="w-full h-12 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-70 cursor-pointer"
                                style={{
                                    background: "linear-gradient(135deg, #4a7c59 0%, #5d9a6e 100%)",
                                    boxShadow: "0 4px 16px rgba(74,124,89,0.30)",
                                }}
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : (
                                    <>
                                        Ingresar al Sistema
                                        <Map className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>

                        {/* Divider */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ ...enterT, delay: 0.58 }}
                            className="relative py-1"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" style={{ borderColor: "rgba(210,200,185,0.5)" }} />
                            </div>
                            <div className="relative flex justify-center text-[10px]">
                                <span className="px-3 font-semibold uppercase tracking-wider text-[#c4b8a8]"
                                    style={{ background: "rgba(245,241,235,0.0)" }}>
                                    o continuar con
                                </span>
                            </div>
                        </motion.div>

                        {/* OAuth buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...enterT, delay: 0.6 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {["Google", "Microsoft"].map((provider) => (
                                <motion.button
                                    key={provider}
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="h-10 rounded-xl text-[12px] font-semibold text-[#6b5b4e] hover:text-[#2c1e0f] transition-all cursor-pointer"
                                    style={{
                                        background: "rgba(255,255,255,0.55)",
                                        border: "1px solid rgba(210,200,185,0.6)",
                                    }}
                                >
                                    {provider}
                                </motion.button>
                            ))}
                        </motion.div>
                    </form>

                    {/* Footer */}
                    <div className="px-8 pb-7 text-center">
                        <p className="text-[12px] text-[#8b7d6b]">
                            ¿No tienes cuenta?{" "}
                            <button className="font-bold text-[#4a7c59] hover:underline underline-offset-2">
                                Solicitar acceso
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ── Bottom copyright ── */}
            <div className="absolute bottom-4 text-center w-full z-10">
                <p className="text-[10px] text-[#b4a898] font-medium">
                    © 2025 Alcaldía de Ocaña · Norte de Santander, Colombia
                </p>
            </div>
        </div>
    );
}
