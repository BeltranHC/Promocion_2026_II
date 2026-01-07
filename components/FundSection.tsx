"use client";

import { useState, useEffect } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionHeader from "./ui/SectionHeader";
import { FUND_DATA, RECENT_CONTRIBUTORS } from "@/constants";
import type { Contributor } from "@/types";

interface ProgressBarProps {
    percentage: number;
}

function ProgressBar({ percentage }: ProgressBarProps) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(percentage), 500);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="relative h-4 bg-dark-card rounded-full overflow-hidden border border-dark-border">
            <div
                className="absolute h-full bg-gradient-to-r from-una-red via-una-gold to-una-blue rounded-full progress-glow transition-all ease-out"
                style={{ width: `${width}%`, transitionDuration: '1500ms' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>
    );
}

interface ContributorCardProps {
    contributor: Contributor;
    index: number;
}

function ContributorCard({ contributor, index }: ContributorCardProps) {
    return (
        <AnimateOnScroll
            animation="fade-in-left"
            delay={index * 100}
        >
            <div className="flex items-center justify-between glass-card p-3 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-una-red to-una-gold flex items-center justify-center text-sm font-bold">
                        {contributor.name[0]}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">
                            {contributor.name}
                        </div>
                        <div className="text-xs text-white/40">
                            {contributor.weeks} semanas
                        </div>
                    </div>
                </div>
                <div className="text-una-gold font-semibold">
                    S/ {contributor.amount}
                </div>
            </div>
        </AnimateOnScroll>
    );
}

export default function FundSection() {
    const percentage = (FUND_DATA.collected / FUND_DATA.goal) * 100;
    const remaining = FUND_DATA.goal - FUND_DATA.collected;
    const pendingMembers = FUND_DATA.totalMembers - FUND_DATA.contributingMembers;

    return (
        <section id="aportes" className="py-24 px-6 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-una-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative">
                <SectionHeader
                    title="Fondo de Promoción"
                    subtitle="Unidos construimos nuestros sueños. Cada aporte cuenta para lograr una graduación inolvidable."
                />

                {/* Main Fund Card */}
                <AnimateOnScroll animation="fade-in-up">
                    <div className="glass rounded-3xl p-8 md:p-12 border border-una-gold/10">
                        {/* Amount Display */}
                        <div className="text-center mb-10">
                            <div className="text-sm text-white/50 uppercase tracking-wider mb-2">
                                Total Recaudado
                            </div>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-5xl md:text-6xl font-bold gradient-text">
                                    S/ {FUND_DATA.collected.toLocaleString()}
                                </span>
                                <span className="text-xl text-white/40">
                                    / S/ {FUND_DATA.goal.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <ProgressBar percentage={percentage} />
                            <div className="flex justify-between mt-3 text-sm text-white/50">
                                <span>{percentage.toFixed(1)}% completado</span>
                                <span>Faltan S/ {remaining.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            <div className="glass-card p-4 text-center">
                                <div className="text-2xl font-bold text-una-gold mb-1">
                                    S/ {FUND_DATA.weeklyAmount}
                                </div>
                                <div className="text-xs text-white/50">Por Semana</div>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <div className="text-2xl font-bold text-una-blue-light mb-1">
                                    {FUND_DATA.totalMembers}
                                </div>
                                <div className="text-xs text-white/50">Compañeros</div>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <div className="text-2xl font-bold text-una-green-light mb-1">
                                    {FUND_DATA.contributingMembers}
                                </div>
                                <div className="text-xs text-white/50">Aportando</div>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <div className="text-2xl font-bold text-una-red-light mb-1">
                                    {pendingMembers}
                                </div>
                                <div className="text-xs text-white/50">Pendientes</div>
                            </div>
                        </div>

                        {/* Recent Contributors */}
                        <div className="mb-10">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-una-gold rounded-full animate-pulse" />
                                Aportes Recientes
                            </h3>
                            <div className="space-y-3">
                                {RECENT_CONTRIBUTORS.map((contributor, index) => (
                                    <ContributorCard
                                        key={contributor.name}
                                        contributor={contributor}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <button className="gold-button text-lg px-10 py-5">
                                💳 Realizar Aporte
                            </button>
                            <p className="text-white/40 text-xs mt-4">
                                Próximamente integración con Yape y Plin
                            </p>
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Info Note */}
                <AnimateOnScroll animation="fade-in" className="mt-8 text-center">
                    <p className="text-white/40 text-sm">
                        💡 El aporte semanal es de S/ {FUND_DATA.weeklyAmount} por compañero. Los fondos se utilizarán para los eventos de graduación.
                    </p>
                </AnimateOnScroll>
            </div>
        </section>
    );
}
