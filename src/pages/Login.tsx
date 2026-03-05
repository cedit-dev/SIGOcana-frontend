import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, MapPin, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
    const navigate = useNavigate();
    const { toast } = useToast();
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

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
            style={{ background: "#F5F5F0" }}
        >
            {/* Decorative blurred shapes */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, rgba(74,124,89,0.25) 0%, transparent 70%)" }}
            />
            <div
                className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-25"
                style={{ background: "radial-gradient(circle, rgba(196,148,90,0.3) 0%, transparent 70%)" }}
            />

            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 flex items-center gap-2 text-[13px] font-semibold text-[#888] hover:text-[#2a2a2a] transition-colors z-10"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver
            </motion.button>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[420px] rounded-3xl overflow-hidden"
                style={{
                    background: "rgba(255, 255, 255, 0.82)",
                    backdropFilter: "blur(24px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.03)",
                }}
            >
                {/* Header */}
                <div className="pt-10 pb-6 px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="flex justify-center mb-5"
                    >
                        <img
                            src="/sigocana-logo.png"
                            alt="SigOcaña"
                            className="w-24 h-24 rounded-3xl object-cover shadow-lg"
                        />
                    </motion.div>
                    <h1 className="text-[22px] font-extrabold text-[#2a2a2a] tracking-tight">
                        Iniciar Sesión
                    </h1>
                    <p className="text-[13px] text-[#999] mt-1.5 font-medium">
                        Accede al Sistema de Información Geográfica de Ocaña
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
                            Correo electrónico
                        </label>
                        <Input
                            type="email"
                            placeholder="usuario@alcaldia.gov.co"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="h-11 rounded-xl border-0 text-[14px] font-medium text-[#2a2a2a] placeholder:text-[#bbb] focus-visible:ring-[#4a7c59]/30"
                            style={{ background: "rgba(0,0,0,0.03)" }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="h-11 rounded-xl border-0 pr-10 text-[14px] font-medium text-[#2a2a2a] placeholder:text-[#bbb] focus-visible:ring-[#4a7c59]/30"
                                style={{ background: "rgba(0,0,0,0.03)" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#666] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-[#ddd] text-[#4a7c59] accent-[#4a7c59] cursor-pointer"
                            />
                            <span className="text-[12px] font-medium text-[#888]">Recordarme</span>
                        </label>
                        <button type="button" className="text-[12px] font-semibold text-[#4a7c59] hover:underline">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-xl text-[14px] font-bold text-white transition-all disabled:opacity-70"
                        style={{
                            background: "linear-gradient(135deg, #4a7c59 0%, #5d9a6e 100%)",
                            boxShadow: "0 4px 12px rgba(74,124,89,0.25)",
                        }}
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            "Ingresar"
                        )}
                    </Button>

                    <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-3 font-semibold uppercase tracking-wider text-[#bbb]" style={{ background: "rgba(255,255,255,0.82)" }}>
                                o continuar con
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl border-0 text-[12px] font-semibold text-[#666] hover:text-[#2a2a2a]"
                            style={{ background: "rgba(0,0,0,0.03)" }}
                        >
                            Google
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl border-0 text-[12px] font-semibold text-[#666] hover:text-[#2a2a2a]"
                            style={{ background: "rgba(0,0,0,0.03)" }}
                        >
                            Microsoft
                        </Button>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 pb-6 text-center">
                    <p className="text-[12px] text-[#999]">
                        ¿No tienes cuenta?{" "}
                        <button className="font-bold text-[#4a7c59] hover:underline">
                            Solicitar acceso
                        </button>
                    </p>
                </div>
            </motion.div>

            {/* Footer line */}
            <div className="absolute bottom-4 text-center w-full">
                <p className="text-[10px] text-[#bbb] font-medium">
                    © 2025 Alcaldía de Ocaña · Norte de Santander, Colombia
                </p>
            </div>
        </div>
    );
}
