"use client";

import { useState, useEffect } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionHeader from "./ui/SectionHeader";
import ProgressBar from "./ui/ProgressBar";
import StudentContributionCard from "./ui/StudentContributionCard";
import { Search, User, AlertTriangle, RefreshCw } from "lucide-react";
import type { StudentResult, FundStats } from "@/types";

export default function FundSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [stats, setStats] = useState<FundStats | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Cargar estadísticas generales
    const fetchStats = async () => {
        setIsLoadingStats(true);
        setStatsError(null);
        try {
            const res = await fetch("/api/contributions/stats");
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if (data.stats) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            setStatsError(error instanceof Error ? error.message : "Error al cargar estadísticas");
        } finally {
            setIsLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Buscar estudiantes
    useEffect(() => {
        const searchStudents = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                setShowDropdown(false);
                setSearchError(null);
                return;
            }

            setIsSearching(true);
            setSearchError(null);
            try {
                const res = await fetch(`/api/contributions?search=${encodeURIComponent(searchQuery)}`);
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setSearchResults(data.students || []);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error searching:", error);
                setSearchError(error instanceof Error ? error.message : "Error al buscar");
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchStudents, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSelectStudent = (student: StudentResult) => {
        setSelectedStudent(student);
        setSearchQuery("");
        setShowDropdown(false);
    };

    const percentage = stats ? (stats.totalCollected / stats.goal) * 100 : 0;
    const remaining = stats ? stats.goal - stats.totalCollected : 0;

    return (
        <section id="aportes" className="py-24 px-6 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-una-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative">
                <SectionHeader
                    title="Fondo de Promoción"
                    subtitle="Unidos construimos nuestros sueños. Consulta tu estado de aportes ingresando tu nombre."
                />

                {/* Search Section */}
                <AnimateOnScroll animation="fade-in-up" className="mb-8 relative z-20">
                    <div className="glass rounded-2xl p-6 border border-una-gold/10 relative">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Search size={20} className="text-una-gold" />
                            Consulta tu Estado de Aportes
                        </h3>
                        <div className="relative z-30">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Escribe tu nombre (ej: BELTRAN HANCCO)"
                                className="w-full px-4 py-3 pl-12 bg-dark-card border border-dark-border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-una-gold/50"
                            />
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 border-2 border-una-gold/30 border-t-una-gold rounded-full animate-spin" />
                                </div>
                            )}

                            {/* Dropdown Results */}
                            {showDropdown && searchResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-2 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden">
                                    {searchResults.map((student) => (
                                        <button
                                            key={student.id}
                                            onClick={() => handleSelectStudent(student)}
                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <User size={18} className="text-una-gold" />
                                                <span className="text-white">{student.name}</span>
                                            </div>
                                            <span className={`text-sm ${student.isUpToDate ? 'text-una-green-light' : 'text-una-red-light'}`}>
                                                {student.isUpToDate ? 'Al día' : `Debe S/.${student.amountOwed}`}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && !searchError && (
                                <div className="absolute z-50 w-full mt-2 bg-dark-card border border-dark-border rounded-xl p-4 text-center text-white/50">
                                    No se encontraron resultados para &quot;{searchQuery}&quot;
                                </div>
                            )}

                            {/* Search Error */}
                            {searchError && (
                                <div className="absolute z-50 w-full mt-2 bg-una-red/10 border border-una-red/30 rounded-xl p-4 flex items-center gap-3 text-una-red-light">
                                    <AlertTriangle size={18} />
                                    <span className="text-sm">{searchError}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Selected Student Card */}
                {selectedStudent && (
                    <div className="mb-8">
                        <StudentContributionCard
                            student={selectedStudent}
                            onClose={() => setSelectedStudent(null)}
                        />
                    </div>
                )}

                {/* Main Fund Card */}
                <AnimateOnScroll animation="fade-in-up">
                    <div className="glass rounded-3xl p-8 md:p-12 border border-una-gold/10">
                        {/* Stats Error */}
                        {statsError && (
                            <div className="bg-una-red/10 border border-una-red/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-una-red-light">
                                    <AlertTriangle size={20} />
                                    <span>{statsError}</span>
                                </div>
                                <button
                                    onClick={fetchStats}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-una-red/20 hover:bg-una-red/30 rounded-lg text-una-red-light text-sm transition-colors"
                                >
                                    <RefreshCw size={14} />
                                    Reintentar
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoadingStats && !statsError && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-10 h-10 border-3 border-una-gold/30 border-t-una-gold rounded-full animate-spin mb-4" />
                                <span className="text-white/50 text-sm">Cargando estadísticas...</span>
                            </div>
                        )}

                        {/* Amount Display */}
                        {!isLoadingStats && !statsError && (
                            <div className="text-center mb-10">
                                <div className="text-sm text-white/50 uppercase tracking-wider mb-2">
                                    Total Recaudado
                                </div>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-5xl md:text-6xl font-bold gradient-text">
                                        S/ {stats?.totalCollected.toLocaleString() || 0}
                                    </span>
                                    <span className="text-xl text-white/40">
                                        / S/ {stats?.goal.toLocaleString() || 5000}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Progress Bar, Stats Grid, Info Note - Solo mostrar si hay datos */}
                        {!isLoadingStats && !statsError && (
                            <>
                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <ProgressBar percentage={Math.min(percentage, 100)} />
                                    <div className="flex justify-between mt-3 text-sm text-white/50">
                                        <span>{percentage.toFixed(1)}% completado</span>
                                        <span>Faltan S/ {remaining.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                    <div className="glass-card p-4 text-center">
                                        <div className="text-2xl font-bold text-una-gold mb-1">
                                            S/ {stats?.weeklyAmount || 5}
                                        </div>
                                        <div className="text-xs text-white/50">Por Semana</div>
                                    </div>
                                    <div className="glass-card p-4 text-center">
                                        <div className="text-2xl font-bold text-una-blue-light mb-1">
                                            {stats?.totalStudents || 0}
                                        </div>
                                        <div className="text-xs text-white/50">Compañeros</div>
                                    </div>
                                    <div className="glass-card p-4 text-center">
                                        <div className="text-2xl font-bold text-una-green-light mb-1">
                                            {stats?.studentsUpToDate || 0}
                                        </div>
                                        <div className="text-xs text-white/50">Al Día</div>
                                    </div>
                                    <div className="glass-card p-4 text-center">
                                        <div className="text-2xl font-bold text-una-red-light mb-1">
                                            {stats?.studentsPending || 0}
                                        </div>
                                        <div className="text-xs text-white/50">Pendientes</div>
                                    </div>
                                </div>

                                {/* Info Note */}
                                <div className="text-center">
                                    <p className="text-white/40 text-sm">
                                        💡 El aporte semanal es de S/ {stats?.weeklyAmount || 5} por compañero. Semana actual: {stats?.currentWeek || 1}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </AnimateOnScroll>

                {/* Info Note */}
                <AnimateOnScroll animation="fade-in" className="mt-8 text-center">
                    <p className="text-white/40 text-sm">
                        🔍 Escribe tu apellido para consultar tu estado de aportes. Los datos se actualizan en tiempo real.
                    </p>
                </AnimateOnScroll>
            </div>
        </section>
    );
}
