"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const socialLinks = [
    { name: "Instagram", icon: "📸", href: "#" },
    { name: "WhatsApp", icon: "💬", href: "#" },
    { name: "Facebook", icon: "👥", href: "#" },
];

const quickLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Información", href: "#info" },
    { name: "Eventos", href: "#eventos" },
    { name: "Galería", href: "#galeria" },
    { name: "Aportes", href: "#aportes" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 px-6 border-t border-una-gold/10">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="md:col-span-2"
                    >
                        {/* Logos */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-16 h-16">
                                <Image
                                    src="/images/escudo-una.png"
                                    alt="Escudo UNA Puno"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative w-16 h-16">
                                <Image
                                    src="/images/logo-epiei.png"
                                    alt="Logo EPIEI"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        <Link href="#inicio" className="flex items-center gap-3 mb-4">
                            <div className="flex flex-col">
                                <span className="text-xl font-bold gradient-text">Promoción 2026 - II</span>
                                <span className="text-xs text-una-cyan uppercase tracking-wider">EPIEI - UNA Puno</span>
                            </div>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed mb-4">
                            Unidos construyendo nuestro futuro profesional. La página oficial de la Promoción 2026 - II de la
                            Escuela Profesional de Ingeniería Estadística e Informática.
                        </p>
                        {/* Universidad Badge */}
                        <div className="inline-flex items-center gap-2 badge-una">
                            <span>🎓</span>
                            <span className="text-xs">Universidad Nacional del Altiplano - Puno</span>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-una-gold rounded-full"></span>
                            Enlaces Rápidos
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-white/50 hover:text-una-gold transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-una-gold rounded-full"></span>
                            Síguenos
                        </h3>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl hover:bg-una-gold/20 hover:scale-110 transition-all duration-300 border border-una-gold/10"
                                    title={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        <p className="text-white/40 text-xs mt-4">
                            Únete a nuestro grupo de WhatsApp para estar al día con las noticias.
                        </p>
                    </motion.div>
                </div>

                {/* Divider - Colores institucionales */}
                <div className="h-px bg-gradient-to-r from-transparent via-una-red via-una-gold via-una-blue to-transparent mb-8" />

                {/* Bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
                >
                    <div>
                        <p className="text-white/40 text-sm">
                            © {currentYear} Promoción 2026 - II | EPIEI. Todos los derechos reservados.
                        </p>
                        <p className="text-una-cyan/50 text-xs mt-1">
                            Universidad Nacional del Altiplano - Puno, Perú
                        </p>
                    </div>
                    <p className="text-white/30 text-xs flex items-center gap-1">
                        Hecho con <span className="text-una-red">❤️</span> por la promoción
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
