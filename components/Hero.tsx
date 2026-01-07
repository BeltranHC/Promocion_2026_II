"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PARTICLE_COUNT } from "@/constants";

interface ParticleProps {
    delay: number;
    size: number;
    left: string;
}

function Particle({ delay, size, left }: ParticleProps) {
    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                width: size,
                height: size,
                left: left,
                bottom: "10%",
                background: `radial-gradient(circle, rgba(212, 160, 23, 0.8), transparent)`,
            }}
            animate={{
                y: [-20, -200, -20],
                x: [-10, 20, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: 8 + delay,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
            }}
        />
    );
}

export default function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section
            id="inicio"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,21,56,0.15)_0%,_transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,160,23,0.1)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(21,101,192,0.08)_0%,_transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            {mounted && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
                        <Particle
                            key={i}
                            delay={i * 0.5}
                            size={4 + (i % 3) * 2}
                            left={`${5 + i * 6}%`}
                        />
                    ))}
                </div>
            )}

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `linear-gradient(rgba(212, 160, 23, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 160, 23, 0.2) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                {/* Logos Institucionales */}
                <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
                    <div className="relative w-20 h-20 md:w-28 md:h-28">
                        <Image
                            src="/images/escudo-una.png"
                            alt="Escudo UNA Puno"
                            fill
                            className="object-contain drop-shadow-lg"
                            priority
                        />
                    </div>
                    <div className="relative w-20 h-20 md:w-28 md:h-28">
                        <Image
                            src="/images/logo-epiei.png"
                            alt="Logo EPIEI"
                            fill
                            className="object-contain drop-shadow-lg"
                            priority
                        />
                    </div>
                </div>

                {/* Badge Institucional */}
                <div className="inline-flex items-center gap-3 glass px-5 py-3 rounded-full mb-6">
                    <span className="w-2 h-2 bg-una-gold rounded-full animate-pulse" />
                    <span className="text-sm text-white/80 font-medium">
                        Universidad Nacional del Altiplano - Puno
                    </span>
                </div>

                {/* Escuela Profesional */}
                <div className="mb-6">
                    <span className="text-una-cyan text-sm md:text-base uppercase tracking-widest font-medium">
                        Escuela Profesional de Ingeniería Estadística e Informática
                    </span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                    <span className="gradient-text">Promoción</span>
                    <br />
                    <span className="text-white text-glow">2026 - II</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Unidos construyendo nuestro futuro profesional. Bienvenidos a la página oficial
                    de nuestra promoción universitaria.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#info" className="neon-button">
                        Conocer Más
                    </a>
                    <a
                        href="#eventos"
                        className="px-8 py-4 border border-una-gold/30 rounded-full text-white/80 hover:text-una-gold hover:border-una-gold transition-all duration-300 uppercase text-sm tracking-wider font-medium"
                    >
                        Ver Eventos
                    </a>
                </div>

                {/* Scroll Indicator */}
                {mounted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
                            <div className="w-6 h-10 border-2 border-una-gold/30 rounded-full flex justify-center pt-2">
                                <motion.div
                                    animate={{ y: [0, 12, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 bg-una-gold rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
