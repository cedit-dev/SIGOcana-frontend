import { Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const FOOTER_LINKS = [
    { label: "Inicio", href: "#inicio" },
    { label: "Objetivos", href: "#objetivos" },
    { label: "Sobre Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
];

export default function Footer() {
    const reduceMotion = useReducedMotion();
    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

    return (
        <footer id="contacto" className="bg-[#2c1e0f] text-white/70 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ ...transition, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="text-base font-extrabold text-white/90">SIGOCAÑA</span>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed max-w-xs" style={{ lineHeight: 1.7 }}>
                            Sistema de Información Geográfica del municipio de Ocaña, Norte de Santander.
                        </p>
                    </motion.div>

                    {/* Links */}
                    <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ ...transition, delay: 0.2 }}
                    >
                        <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">
                            Navegación
                        </h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 cursor-pointer"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ ...transition, delay: 0.3 }}
                    >
                        <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">
                            Contacto
                        </h4>
                        <p className="text-sm text-white/50 mb-3">
                            Alcaldía de Ocaña
                            <br />
                            Norte de Santander, Colombia
                        </p>
                        <a
                            href="mailto:contacto@sigocana.gov.co"
                            className="inline-flex items-center gap-2 text-sm text-[#6ba368] hover:text-[#4bb89a] transition-colors duration-200 cursor-pointer"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            contacto@sigocana.gov.co
                        </a>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-white/30">
                        © 2026 Alcaldía de Ocaña · Norte de Santander, Colombia
                    </span>
                    <span className="text-xs text-white/30">
                        Sistema de Información Geográfica v1.2.0
                    </span>
                </div>
            </div>
        </footer>
    );
}
