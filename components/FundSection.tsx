"use client";

import { useState, useEffect } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionHeader from "./ui/SectionHeader";
import { Search, User, Calendar, CreditCard, CheckCircle, AlertCircle, X } from "lucide-react";

interface Payment {
    id: string;
    weekNumber: number;
    amount: number;
    paidAt: string;
}

interface StudentResult {
    id: string;
    name: string;
    photoUrl: string | null;
    totalPaid: number;
    weeksPaid: number;
    weeksPending: number;
    amountOwed: number;
    currentWeek: number;
    weeklyAmount: number;
    isUpToDate: boolean;
    payments: Payment[];
}

interface FundStats {
    totalStudents: number;
    studentsUpToDate: number;
    studentsPending: number;
    totalCollected: number;
    currentWeek: number;
    weeklyAmount: number;
    goal: number;
}

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

function StudentContributionCard({ student, onClose }: { student: StudentResult; onClose: () => void }) {
    return (
        <AnimateOnScroll animation="fade-in-up">
            <div className="glass rounded-2xl p-6 border border-una-gold/20 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-una-red to-una-gold flex items-center justify-center text-xl font-bold">
                        {student.photoUrl ? (
                            <img
                                src={student.photoUrl}
                                alt={student.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            student.name.charAt(0)
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{student.name}</h3>
                        <p className="text-white/50 text-sm">Semana actual: {student.currentWeek}</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${student.isUpToDate
                    ? 'bg-una-green/20 text-una-green-light'
                    : 'bg-una-red/20 text-una-red-light'
                    }`}>
                    {student.isUpToDate ? (
                        <>
                            <CheckCircle size={18} />
                            <span className="font-medium">¡Al día con los aportes!</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle size={18} />
                            <span className="font-medium">Tienes {student.weeksPending} semana(s) pendiente(s)</span>
                        </>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass-card p-4 text-center">
                        <CreditCard size={20} className="mx-auto mb-2 text-una-gold" />
                        <div className="text-2xl font-bold text-una-gold">S/. {student.totalPaid}</div>
                        <div className="text-xs text-white/50">Total Pagado</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <CheckCircle size={20} className="mx-auto mb-2 text-una-green-light" />
                        <div className="text-2xl font-bold text-una-green-light">{student.weeksPaid}</div>
                        <div className="text-xs text-white/50">Semanas Pagadas</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Calendar size={20} className="mx-auto mb-2 text-una-red-light" />
                        <div className="text-2xl font-bold text-una-red-light">{student.weeksPending}</div>
                        <div className="text-xs text-white/50">Semanas Pendientes</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <AlertCircle size={20} className="mx-auto mb-2 text-white" />
                        <div className="text-2xl font-bold text-white">S/. {student.amountOwed}</div>
                        <div className="text-xs text-white/50">Monto Adeudado</div>
                    </div>
                </div>

                {/* Payment History */}
                {student.payments.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-white/70 mb-3">Historial de Pagos</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {student.payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between glass-card p-3 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-una-gold/20 flex items-center justify-center text-sm font-bold text-una-gold">
                                            {payment.weekNumber}
                                        </div>
                                        <span className="text-white/70 text-sm">Semana {payment.weekNumber}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-una-gold font-medium">S/. {payment.amount}</div>
                                        <div className="text-white/40 text-xs">
                                            {new Date(payment.paidAt).toLocaleDateString('es-PE')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AnimateOnScroll>
    );
}

export default function FundSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [stats, setStats] = useState<FundStats | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Cargar estadísticas generales
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/contributions/stats");
                const data = await res.json();
                if (data.stats) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    // Buscar estudiantes
    useEffect(() => {
        const searchStudents = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/contributions?search=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(data.students || []);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error searching:", error);
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

                            {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                                <div className="absolute z-50 w-full mt-2 bg-dark-card border border-dark-border rounded-xl p-4 text-center text-white/50">
                                    No se encontraron resultados para &quot;{searchQuery}&quot;
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
                        {/* Amount Display */}
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
