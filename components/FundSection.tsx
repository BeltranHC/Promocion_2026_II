"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Mock data - to be replaced with real data from backend
const fundData = {
    goal: 5000,
    collected: 1250,
    weeklyAmount: 5,
    totalMembers: 50,
    contributingMembers: 25,
};

const recentContributors = [
    { name: "Juan P.", amount: 20, weeks: 4 },
    { name: "María G.", amount: 15, weeks: 3 },
    { name: "Carlos R.", amount: 25, weeks: 5 },
    { name: "Ana M.", amount: 10, weeks: 2 },
    { name: "Luis S.", amount: 20, weeks: 4 },
];

function ProgressBar({ percentage }: { percentage: number }) {
    return (
        <div className="relative h-4 bg-dark-card rounded-full overflow-hidden border border-dark-border">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="absolute h-full bg-gradient-to-r from-una-red via-una-gold to-una-blue rounded-full progress-glow"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>
    );
}

export default function FundSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const percentage = (fundData.collected / fundData.goal) * 100;

    return (
        <section id="aportes" className="py-24 px-6 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-una-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative" ref={ref}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        <span className="gradient-text">Fondo de Promoción</span>
                    </h2>
                    <div className="line-glow" />
                    <p className="section-subtitle">
                        Unidos construimos nuestros sueños. Cada aporte cuenta para lograr una graduación inolvidable.
                    </p>
                </motion.div>

                {/* Main Fund Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass rounded-3xl p-8 md:p-12 border border-una-gold/10"
                >
                    {/* Amount Display */}
                    <div className="text-center mb-10">
                        <div className="text-sm text-white/50 uppercase tracking-wider mb-2">
                            Total Recaudado
                        </div>
                        <div className="flex items-baseline justify-center gap-2">
                            <span className="text-5xl md:text-6xl font-bold gradient-text">
                                S/ {fundData.collected.toLocaleString()}
                            </span>
                            <span className="text-xl text-white/40">
                                / S/ {fundData.goal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <ProgressBar percentage={percentage} />
                        <div className="flex justify-between mt-3 text-sm text-white/50">
                            <span>{percentage.toFixed(1)}% completado</span>
                            <span>Faltan S/ {(fundData.goal - fundData.collected).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl font-bold text-una-gold mb-1">
                                S/ {fundData.weeklyAmount}
                            </div>
                            <div className="text-xs text-white/50">Por Semana</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl font-bold text-una-blue-light mb-1">
                                {fundData.totalMembers}
                            </div>
                            <div className="text-xs text-white/50">Compañeros</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl font-bold text-una-green-light mb-1">
                                {fundData.contributingMembers}
                            </div>
                            <div className="text-xs text-white/50">Aportando</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl font-bold text-una-red-light mb-1">
                                {fundData.totalMembers - fundData.contributingMembers}
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
                            {recentContributors.map((contributor, index) => (
                                <motion.div
                                    key={contributor.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                    className="flex items-center justify-between glass-card p-3 rounded-xl"
                                >
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
                                </motion.div>
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
                </motion.div>

                {/* Info Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-white/40 text-sm">
                        💡 El aporte semanal es de S/ 5 por compañero. Los fondos se utilizarán para los eventos de graduación.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
