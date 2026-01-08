"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionHeader from "./ui/SectionHeader";
import { Ticket, Calendar, ArrowRight } from "lucide-react";
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
            <Link href={`/eventos/${event.id}`} className="block group">
                <div className="relative flex items-start gap-6 md:gap-10">
                    {/* Timeline Line & Dot */}
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-una-red to-una-gold flex items-center justify-center text-2xl z-10 shadow-glow-gold group-hover:scale-110 transition-transform">
                            {event.icon}
                        </div>
                        {!isLast && (
                            <div className="w-0.5 h-full min-h-[120px] bg-gradient-to-b from-una-gold/50 to-transparent" />
                        )}
                    </div>

                    {/* Event Content */}
                    <div className="glass-card p-6 flex-1 mb-6 group-hover:border-una-gold/30 transition-all group-hover:shadow-lg group-hover:shadow-una-gold/10">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase border ${event.status === "upcoming" 
                                ? "bg-una-red/20 text-una-gold border-una-red/30" 
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}>
                                {event.status === "upcoming" ? "Próximo" : "Pasado"}
                            </span>
                            <span className="text-white/50 text-sm flex items-center gap-1">
                                <Calendar size={14} />
                                {event.date}, {event.year}
                            </span>
                            {event.hasTickets && event.ticketPrice && (
                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full flex items-center gap-1">
                                    <Ticket size={12} />
                                    S/. {event.ticketPrice}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-una-gold transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            {event.description}
                        </p>
                        <div className="flex items-center text-una-gold text-sm font-medium group-hover:gap-2 transition-all">
                            Ver detalles
                            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </AnimateOnScroll>
    );
}

export default function EventsSection() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                setEvents(data.events || []);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Separar eventos próximos y pasados
    const upcomingEvents = events.filter(e => e.status === "upcoming");
    const pastEvents = events.filter(e => e.status === "past");

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

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-una-gold/30 border-t-una-gold rounded-full animate-spin" />
                    </div>
                )}

                {/* No events */}
                {!isLoading && events.length === 0 && (
                    <div className="text-center py-20">
                        <Calendar size={48} className="mx-auto text-white/20 mb-4" />
                        <p className="text-white/50">No hay eventos programados por el momento</p>
                    </div>
                )}

                {/* Upcoming Events Timeline */}
                {!isLoading && upcomingEvents.length > 0 && (
                    <div className="relative mb-12">
                        {upcomingEvents.map((event, index) => (
                            <EventCard
                                key={event.id || event.title}
                                event={event}
                                index={index}
                                isLast={index === upcomingEvents.length - 1 && pastEvents.length === 0}
                            />
                        ))}
                    </div>
                )}

                {/* Past Events */}
                {!isLoading && pastEvents.length > 0 && (
                    <>
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-semibold text-white/50">Eventos Anteriores</h3>
                        </div>
                        <div className="relative opacity-70">
                            {pastEvents.map((event, index) => (
                                <EventCard
                                    key={event.id || event.title}
                                    event={event}
                                    index={index}
                                    isLast={index === pastEvents.length - 1}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
