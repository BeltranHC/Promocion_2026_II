"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
        <footer className="relative py-16 px-6 border-t border-white/5">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Link href="#inicio" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-cyber-purple flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="text-xl font-bold gradient-text">Promoción 2026</span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Unidos construyendo nuestro futuro. La página oficial de nuestra promoción universitaria.
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-white/50 hover:text-electric-blue transition-colors text-sm"
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
                        <h3 className="text-white font-semibold mb-4">Síguenos</h3>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl hover:bg-electric-blue/20 hover:scale-110 transition-all duration-300"
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

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
                >
                    <p className="text-white/40 text-sm">
                        © {currentYear} Promoción 2026. Todos los derechos reservados.
                    </p>
                    <p className="text-white/30 text-xs">
                        Hecho con 💜 por la promoción
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
