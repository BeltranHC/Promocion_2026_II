"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const infoCards = [
    {
        icon: "🎓",
        title: "Nuestra Carrera",
        description: "Estudiantes comprometidos con la excelencia académica y el desarrollo profesional.",
        gradient: "from-electric-blue to-cyber-purple",
    },
    {
        icon: "👥",
        title: "Compañeros",
        description: "Un grupo unido de profesionales en formación, listos para conquistar el mundo.",
        gradient: "from-cyber-purple to-neon-pink",
    },
    {
        icon: "🎯",
        title: "Nuestra Misión",
        description: "Celebrar juntos este logro y crear recuerdos inolvidables para toda la vida.",
        gradient: "from-neon-pink to-electric-blue",
    },
    {
        icon: "🌟",
        title: "Visión 2026",
        description: "Graduarnos con éxito y comenzar una nueva etapa llena de oportunidades.",
        gradient: "from-neon-green to-electric-blue",
    },
];

function InfoCard({ card, index }: { card: typeof infoCards[0]; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-8 group"
        >
            {/* Icon Container */}
            <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
                {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-blue transition-colors">
                {card.title}
            </h3>

            {/* Description */}
            <p className="text-white/60 leading-relaxed text-sm">
                {card.description}
            </p>

            {/* Bottom Glow Line */}
            <div className={`h-1 w-0 group-hover:w-full mt-6 rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-500`} />
        </motion.div>
    );
}

export default function InfoSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="info" className="py-24 px-6 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative" ref={ref}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        <span className="gradient-text">Sobre Nosotros</span>
                    </h2>
                    <div className="line-glow" />
                    <p className="section-subtitle">
                        Conoce más sobre nuestra promoción y lo que nos hace especiales
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {infoCards.map((card, index) => (
                        <InfoCard key={card.title} card={card} index={index} />
                    ))}
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="glass mt-16 p-8 rounded-3xl"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold gradient-text mb-2">50+</div>
                            <div className="text-white/60 text-sm">Compañeros</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold gradient-text mb-2">4</div>
                            <div className="text-white/60 text-sm">Años Juntos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold gradient-text mb-2">2026</div>
                            <div className="text-white/60 text-sm">Graduación</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold gradient-text mb-2">∞</div>
                            <div className="text-white/60 text-sm">Recuerdos</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
