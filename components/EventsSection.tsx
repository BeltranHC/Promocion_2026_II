"use client";

import AnimateOnScroll from "./AnimateOnScroll";
import SectionHeader from "./ui/SectionHeader";
import { EVENTS } from "@/constants";
import type { Event } from "@/types";

interface EventCardProps {
    event: Event;
    index: number;
    isLast: boolean;
}

function EventCard({ event, index, isLast }: EventCardProps) {
    return (
        <AnimateOnScroll
            animation={index % 2 === 0 ? "fade-in-left" : "fade-in-right"}
            delay={index * 150}
        >
            <div className="relative flex items-start gap-6 md:gap-10">
                {/* Timeline Line & Dot */}
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-una-red to-una-gold flex items-center justify-center text-2xl z-10 shadow-glow-gold">
                        {event.icon}
                    </div>
                    {!isLast && (
                        <div className="w-0.5 h-full min-h-[120px] bg-gradient-to-b from-una-gold/50 to-transparent" />
                    )}
                </div>

                {/* Event Content */}
                <div className="glass-card p-6 flex-1 mb-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-una-red/20 text-una-gold text-xs font-medium rounded-full uppercase border border-una-red/30">
                            {event.status === "upcoming" ? "Próximo" : "Pasado"}
                        </span>
                        <span className="text-white/50 text-sm">
                            {event.date}, {event.year}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-una-gold">
                        {event.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                        {event.description}
                    </p>
                </div>
            </div>
        </AnimateOnScroll>
    );
}

export default function EventsSection() {
    return (
        <section id="eventos" className="py-24 px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-una-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-una-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative">
                <SectionHeader
                    title="Próximos Eventos"
                    subtitle="Marca estas fechas importantes en tu calendario"
                />

                {/* Timeline */}
                <div className="relative">
                    {EVENTS.map((event, index) => (
                        <EventCard
                            key={event.title}
                            event={event}
                            index={index}
                            isLast={index === EVENTS.length - 1}
                        />
                    ))}
                </div>

                {/* CTA */}
                <AnimateOnScroll animation="fade-in-up" delay={600} className="text-center mt-12">
                    <p className="text-white/50 text-sm mb-4">
                        ¿Tienes ideas para más eventos?
                    </p>
                    <button className="px-6 py-3 border border-una-gold/30 rounded-full text-white/70 hover:text-una-gold hover:border-una-gold transition-all duration-300 text-sm">
                        Proponer Evento
                    </button>
                </AnimateOnScroll>
            </div>
        </section>
    );
}
