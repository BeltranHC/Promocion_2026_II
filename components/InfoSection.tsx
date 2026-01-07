"use client";

import AnimateOnScroll from "./AnimateOnScroll";
import SectionHeader from "./ui/SectionHeader";
import StatCard from "./ui/StatCard";
import { INFO_CARDS, STATS } from "@/constants";
import type { InfoCard } from "@/types";

interface InfoCardComponentProps {
    card: InfoCard;
    index: number;
}

function InfoCardComponent({ card, index }: InfoCardComponentProps) {
    return (
        <AnimateOnScroll animation="fade-in-up" delay={index * 100}>
            <div className="glass-card p-8 group h-full">
                {/* Icon Container */}
                <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                    {card.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-una-gold transition-colors">
                    {card.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 leading-relaxed text-sm">
                    {card.description}
                </p>

                {/* Bottom Glow Line */}
                <div className={`h-1 w-0 group-hover:w-full mt-6 rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-500`} />
            </div>
        </AnimateOnScroll>
    );
}

export default function InfoSection() {
    return (
        <section id="info" className="py-24 px-6 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-una-red/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-una-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <SectionHeader
                    title="Sobre Nosotros"
                    subtitle="Conoce más sobre nuestra promoción y lo que nos hace especiales como EPIEI"
                />

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {INFO_CARDS.map((card, index) => (
                        <InfoCardComponent key={card.title} card={card} index={index} />
                    ))}
                </div>

                {/* Stats Row */}
                <AnimateOnScroll animation="fade-in-up" delay={400} className="mt-16">
                    <div className="glass p-8 rounded-3xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {STATS.map((stat) => (
                                <StatCard key={stat.label} value={stat.value} label={stat.label} />
                            ))}
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Universidad Badge */}
                <AnimateOnScroll animation="fade-in" delay={500} className="text-center mt-10">
                    <div className="inline-flex items-center gap-3 badge-una">
                        <span className="text-una-gold">🎓</span>
                        <span>Universidad Nacional del Altiplano - Puno</span>
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    );
}
