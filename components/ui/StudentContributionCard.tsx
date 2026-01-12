"use client";

import AnimateOnScroll from "../AnimateOnScroll";
import { Calendar, CreditCard, CheckCircle, AlertCircle, X } from "lucide-react";
import type { StudentResult } from "@/types";

interface StudentContributionCardProps {
    student: StudentResult;
    onClose: () => void;
}

export default function StudentContributionCard({ student, onClose }: StudentContributionCardProps) {
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
