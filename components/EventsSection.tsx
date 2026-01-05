"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const events = [
    {
        date: "15 Mar",
        year: "2026",
        title: "Sesión de Fotos Oficial",
        description: "Capturamos nuestros mejores momentos en una sesión fotográfica profesional.",
        status: "upcoming",
        icon: "📸",
    },
    {
        date: "20 Abr",
        year: "2026",
        title: "Paseo de Promoción",
        description: "Viaje grupal para fortalecer lazos y crear nuevos recuerdos juntos.",
        status: "upcoming",
        icon: "🏖️",
    },
    {
        date: "10 Jun",
        year: "2026",
        title: "Cena de Gala",
        description: "Celebración elegante para despedir nuestra etapa universitaria.",
        status: "upcoming",
        icon: "🎩",
    },
    {
        date: "15 Jul",
        year: "2026",
        title: "Ceremonia de Graduación",
        description: "El gran día donde recibiremos nuestros títulos profesionales.",
        status: "upcoming",
        icon: "🎓",
    },
];

function EventCard({ event, index, isLast }: { event: typeof events[0]; index: number; isLast: boolean }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative flex items-start gap-6 md:gap-10"
        >
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-electric-blue to-cyber-purple flex items-center justify-center text-2xl z-10 shadow-glow-blue">
                    {event.icon}
                </div>
                {!isLast && (
                    <div className="w-0.5 h-full min-h-[120px] bg-gradient-to-b from-electric-blue/50 to-transparent" />
                )}
            </div>

            {/* Event Content */}
            <div className="glass-card p-6 flex-1 mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-electric-blue/20 text-electric-blue text-xs font-medium rounded-full uppercase">
                        {event.status === "upcoming" ? "Próximo" : "Pasado"}
                    </span>
                    <span className="text-white/50 text-sm">
                        {event.date}, {event.year}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-blue">
                    {event.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                    {event.description}
                </p>
            </div>
        </motion.div>
    );
}

export default function EventsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="eventos" className="py-24 px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative" ref={ref}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        <span className="gradient-text">Próximos Eventos</span>
                    </h2>
                    <div className="line-glow" />
                    <p className="section-subtitle">
                        Marca estas fechas importantes en tu calendario
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {events.map((event, index) => (
                        <EventCard
                            key={event.title}
                            event={event}
                            index={index}
                            isLast={index === events.length - 1}
                        />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <p className="text-white/50 text-sm mb-4">
                        ¿Tienes ideas para más eventos?
                    </p>
                    <button className="px-6 py-3 border border-white/20 rounded-full text-white/70 hover:text-electric-blue hover:border-electric-blue transition-all duration-300 text-sm">
                        Proponer Evento
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
