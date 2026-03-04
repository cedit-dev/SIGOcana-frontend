import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "Inicio", href: "#inicio" },
    { label: "Mapa Interactivo", href: "/mapa", isRoute: true },
    { label: "Objetivos", href: "#objetivos" },
    { label: "Sobre Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (link: typeof NAV_LINKS[0], e: React.MouseEvent) => {
        if (link.isRoute) {
            e.preventDefault();
            navigate(link.href);
        }
        setMobileOpen(false);
    };

    return (
        <nav
            className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${scrolled
                    ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-[#3d2e1e]/5 border border-[#e8dfd4]"
                    : "bg-white/50 backdrop-blur-md border border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                {/* Logo */}
                <a
                    href="#inicio"
                    className="flex items-center gap-2.5 cursor-pointer group"
                    aria-label="SigOcaña - Ir al inicio"
                >
                    <img
                        src="/sigocana-logo.png"
                        alt="SigOcaña Logo"
                        className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                    <span className="text-base font-extrabold tracking-tight text-[#2c1e0f]">
                        SIGOCAÑA
                    </span>
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-7">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => handleClick(link, e)}
                            className="text-sm font-semibold text-[#6b5b4e] hover:text-[#4a7c59] transition-colors duration-200 cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#4a7c59] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7c59] focus-visible:ring-offset-2 rounded-sm"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Mobile button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2.5 rounded-xl hover:bg-[#f0ebe3] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7c59]"
                    aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden overflow-hidden border-t border-[#e8dfd4]/50"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleClick(link, e)}
                                    className="block text-sm font-semibold text-[#6b5b4e] hover:text-[#4a7c59] py-2.5 px-3 rounded-lg hover:bg-[#f0ebe3] transition-colors duration-200 cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
