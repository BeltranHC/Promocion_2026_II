"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,21,56,0.15)_0%,_transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,160,23,0.1)_0%,_transparent_50%)]" />
            </div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `linear-gradient(rgba(212, 160, 23, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 160, 23, 0.2) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                }}
            />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <Image
                            src="/images/logo-epiei.png"
                            alt="Logo EPIEI"
                            fill
                            className="object-contain opacity-50"
                        />
                    </div>
                </motion.div>

                {/* 404 Number */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <h1 className="text-8xl md:text-9xl font-bold gradient-text">
                        404
                    </h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Página no encontrada
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed">
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                        Puede que el enlace esté roto o la dirección sea incorrecta.
                    </p>
                </motion.div>

                {/* Search hint */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
                        <Search size={16} className="text-una-gold" />
                        <span className="text-sm text-white/60">
                            Verifica que la URL esté correcta
                        </span>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/"
                        className="neon-button flex items-center gap-2"
                    >
                        <Home size={18} />
                        Ir al Inicio
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-4 border border-una-gold/30 rounded-full text-white/80 hover:text-una-gold hover:border-una-gold transition-all duration-300 uppercase text-sm tracking-wider font-medium flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Volver Atrás
                    </button>
                </motion.div>

                {/* Fun message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-white/30 text-sm"
                >
                    🎓 Promoción 2026 - II | EPIEI - UNA Puno
                </motion.p>
            </div>
        </div>
    );
}
