"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Plus,
    Search,
    Trash2,
    Users,
    DollarSign,
    X,
    Save,
    CheckCircle,
    AlertCircle,
    Calendar,
    Edit,
    TrendingDown,
    History,
    Settings,
} from "lucide-react";

interface Payment {
    id: string;
    weekNumber: number;
    amount: number;
    paidAt: string;
    notes?: string;
}

interface StudentWithPayments {
    id: string;
    name: string;
    photoUrl: string | null;
    totalPaid: number;
    weeksPaid: number;
    weeksPending: number;
    amountOwed: number;
    isUpToDate: boolean;
    lastPayment: Payment | null;
    payments: Payment[];
}

interface DebtRanking {
    id: string;
    name: string;
    amountOwed: number;
    weeksPending: number;
}

interface Stats {
    totalStudents: number;
    studentsUpToDate: number;
    studentsPending: number;
    totalCollected: number;
    totalDebt: number;
    maxWeeks: number;
    weeklyAmount: number;
    goal: number;
}

// Modal Component
function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`relative bg-slate-900 border border-slate-700 rounded-2xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// Payment Form
function PaymentForm({
    students,
    maxWeeks,
    weeklyAmount,
    preSelectedStudentId,
    preSelectedWeek,
    onSave,
    onCancel,
    isLoading,
}: {
    students: StudentWithPayments[];
    maxWeeks: number;
    weeklyAmount: number;
    preSelectedStudentId?: string;
    preSelectedWeek?: number;
    onSave: (data: { studentId: string; amount: number; weekNumber: number; paidAt: string }) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        studentId: preSelectedStudentId || "",
        amount: weeklyAmount.toString(),
        weekNumber: preSelectedWeek?.toString() || "1",
        paidAt: new Date().toISOString().split("T")[0],
    });

    const selectedStudent = students.find((s) => s.id === formData.studentId);

    // Encontrar la primera semana no pagada
    useEffect(() => {
        if (selectedStudent && !preSelectedWeek) {
            const paidWeeks = new Set(selectedStudent.payments.filter(p => p.amount > 0).map(p => p.weekNumber));
            for (let i = 1; i <= maxWeeks; i++) {
                if (!paidWeeks.has(i)) {
                    setFormData(prev => ({ ...prev, weekNumber: i.toString() }));
                    break;
                }
            }
        }
    }, [selectedStudent, maxWeeks, preSelectedWeek]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave({
                    studentId: formData.studentId,
                    amount: parseFloat(formData.amount),
                    weekNumber: parseInt(formData.weekNumber),
                    paidAt: formData.paidAt,
                });
            }}
            className="space-y-5"
        >
            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Estudiante
                </label>
                <select
                    value={formData.studentId}
                    onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                    <option value="">Selecciona un estudiante</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.name} - {student.isUpToDate ? "Al día" : `Debe S/.${student.amountOwed}`}
                        </option>
                    ))}
                </select>
            </div>

            {selectedStudent && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Estado actual:</span>
                        <span className={selectedStudent.isUpToDate ? "text-emerald-400" : "text-red-400"}>
                            {selectedStudent.isUpToDate ? "Al día" : `Debe S/.${selectedStudent.amountOwed}`}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-400 text-sm">Semanas pagadas:</span>
                        <span className="text-white">{selectedStudent.weeksPaid} de {maxWeeks}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Semana #
                    </label>
                    <input
                        type="number"
                        min="1"
                        max={maxWeeks + 10}
                        value={formData.weekNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, weekNumber: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Monto (S/.)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>
            </div>

            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Fecha de Pago
                </label>
                <input
                    type="date"
                    value={formData.paidAt}
                    onChange={(e) =>
                        setFormData({ ...formData, paidAt: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !formData.studentId}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            Registrar Pago
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

// Edit Payment Form
function EditPaymentForm({
    payment,
    onSave,
    onCancel,
    isLoading,
}: {
    payment: Payment;
    onSave: (data: { id: string; amount: number; weekNumber: number; paidAt: string }) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        amount: payment.amount.toString(),
        weekNumber: payment.weekNumber.toString(),
        paidAt: new Date(payment.paidAt).toISOString().split("T")[0],
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave({
                    id: payment.id,
                    amount: parseFloat(formData.amount),
                    weekNumber: parseInt(formData.weekNumber),
                    paidAt: formData.paidAt,
                });
            }}
            className="space-y-5"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Semana #
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={formData.weekNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, weekNumber: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Monto (S/.)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>
            </div>

            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Fecha de Pago
                </label>
                <input
                    type="date"
                    value={formData.paidAt}
                    onChange={(e) =>
                        setFormData({ ...formData, paidAt: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

// Bulk Payment Form for multiple weeks
function BulkPaymentForm({
    students,
    maxWeeks,
    weeklyAmount,
    onSave,
    onCancel,
    isLoading,
}: {
    students: StudentWithPayments[];
    maxWeeks: number;
    weeklyAmount: number;
    onSave: (data: { studentId: string; weeks: number[]; paidAt: string }) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [studentId, setStudentId] = useState("");
    const [paidAt, setPaidAt] = useState(new Date().toISOString().split("T")[0]);
    const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

    const selectedStudent = students.find((s) => s.id === studentId);

    const toggleWeek = (week: number) => {
        setSelectedWeeks((prev) =>
            prev.includes(week)
                ? prev.filter((w) => w !== week)
                : [...prev, week].sort((a, b) => a - b)
        );
    };

    // Obtener semanas ya pagadas (con monto > 0)
    const paidWeeksSet = new Set(
        selectedStudent?.payments.filter(p => p.amount > 0).map(p => p.weekNumber) || []
    );

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave({ studentId, weeks: selectedWeeks, paidAt });
            }}
            className="space-y-5"
        >
            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Estudiante
                </label>
                <select
                    value={studentId}
                    onChange={(e) => {
                        setStudentId(e.target.value);
                        setSelectedWeeks([]);
                    }}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                    <option value="">Selecciona un estudiante</option>
                    {students
                        .filter((s) => !s.isUpToDate)
                        .map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name} - Debe {student.weeksPending} semana(s)
                            </option>
                        ))}
                </select>
            </div>

            {selectedStudent && (
                <>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <p className="text-slate-400 text-sm mb-3">
                            Selecciona las semanas a pagar (S/. {weeklyAmount} c/u):
                        </p>
                        <div className="grid grid-cols-6 gap-2">
                            {Array.from({ length: maxWeeks }, (_, i) => i + 1).map((week) => {
                                const isPaid = paidWeeksSet.has(week);
                                const isSelected = selectedWeeks.includes(week);

                                return (
                                    <button
                                        key={week}
                                        type="button"
                                        disabled={isPaid}
                                        onClick={() => toggleWeek(week)}
                                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${isPaid
                                                ? "bg-emerald-500/20 text-emerald-400 cursor-not-allowed"
                                                : isSelected
                                                    ? "bg-amber-500 text-white"
                                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                            }`}
                                    >
                                        {week}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedWeeks.length > 0 && (
                            <p className="mt-3 text-amber-400 font-medium">
                                Total: S/. {(selectedWeeks.length * weeklyAmount).toFixed(2)}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            Fecha de Pago
                        </label>
                        <input
                            type="date"
                            value={paidAt}
                            onChange={(e) => setPaidAt(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </>
            )}

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !studentId || selectedWeeks.length === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            Registrar {selectedWeeks.length} Pago(s)
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

// Payment History Modal Content
function PaymentHistoryContent({
    student,
    maxWeeks,
    onEditPayment,
    onDeletePayment,
    onAddPayment,
}: {
    student: StudentWithPayments;
    maxWeeks: number;
    onEditPayment: (payment: Payment) => void;
    onDeletePayment: (paymentId: string) => void;
    onAddPayment: (weekNumber: number) => void;
}) {
    // Crear mapa de pagos por semana
    const paymentsByWeek = new Map<number, Payment>();
    student.payments.forEach(p => {
        paymentsByWeek.set(p.weekNumber, p);
    });

    return (
        <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-slate-400 text-sm">Total Pagado</p>
                        <p className="text-emerald-400 text-xl font-bold">S/. {student.totalPaid.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Semanas Pagadas</p>
                        <p className="text-blue-400 text-xl font-bold">{student.weeksPaid} / {maxWeeks}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Deuda Total</p>
                        <p className="text-red-400 text-xl font-bold">S/. {student.amountOwed.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <p className="text-slate-400 text-sm mb-2">Historial por semana:</p>
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {Array.from({ length: maxWeeks }, (_, i) => i + 1).map((week) => {
                    const payment = paymentsByWeek.get(week);
                    const isPaid = payment && payment.amount > 0;
                    const isExonerated = payment && payment.amount === 0;

                    return (
                        <div
                            key={week}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                                isPaid
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : isExonerated
                                    ? "bg-blue-500/10 border-blue-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isPaid
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : isExonerated
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "bg-red-500/20 text-red-400"
                                }`}>
                                    {week}
                                </span>
                                <div>
                                    <p className={`font-medium ${
                                        isPaid
                                            ? "text-emerald-400"
                                            : isExonerated
                                            ? "text-blue-400"
                                            : "text-red-400"
                                    }`}>
                                        {isPaid
                                            ? `Pagado - S/. ${payment.amount}`
                                            : isExonerated
                                            ? "Exonerado"
                                            : "No pagado - S/. 7 de deuda"}
                                    </p>
                                    {payment && (
                                        <p className="text-xs text-slate-500">
                                            {new Date(payment.paidAt).toLocaleDateString("es-PE")}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {payment ? (
                                    <>
                                        <button
                                            onClick={() => onEditPayment(payment)}
                                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                            title="Editar pago"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDeletePayment(payment.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Eliminar pago"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => onAddPayment(week)}
                                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                        title="Agregar pago"
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Debt Ranking Component
function DebtRankingCard({ ranking }: { ranking: DebtRanking[] }) {
    if (ranking.length === 0) {
        return (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                        <CheckCircle size={20} className="text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Ranking de Deudas</h3>
                </div>
                <p className="text-slate-400 text-center py-4">¡Todos están al día! 🎉</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/20">
                    <TrendingDown size={20} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Top 10 Deudores</h3>
            </div>
            <div className="space-y-2">
                {ranking.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0
                                    ? "bg-red-500 text-white"
                                    : index === 1
                                    ? "bg-orange-500 text-white"
                                    : index === 2
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-700 text-slate-300"
                            }`}>
                                {index + 1}
                            </span>
                            <div>
                                <p className="text-white font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-slate-500">{item.weeksPending} semanas pendientes</p>
                            </div>
                        </div>
                        <span className="text-red-400 font-bold">S/. {item.amountOwed}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Student Row Component
function StudentRow({
    student,
    maxWeeks,
    onViewHistory,
}: {
    student: StudentWithPayments;
    maxWeeks: number;
    onViewHistory: (student: StudentWithPayments) => void;
}) {
    return (
        <tr className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-sm font-bold">
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
                    <p className="text-white font-medium">{student.name}</p>
                </div>
            </td>
            <td className="px-6 py-4">
                <p className="text-emerald-400 font-medium">
                    S/. {student.totalPaid.toFixed(2)}
                </p>
            </td>
            <td className="px-6 py-4">
                <p className="text-slate-300">
                    {student.weeksPaid} / {maxWeeks}
                </p>
            </td>
            <td className="px-6 py-4">
                {student.isUpToDate ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                        <CheckCircle size={14} />
                        Al día
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                        <AlertCircle size={14} />
                        Debe S/.{student.amountOwed}
                    </span>
                )}
            </td>
            <td className="px-6 py-4">
                <button
                    onClick={() => onViewHistory(student)}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Ver historial"
                >
                    <History size={18} />
                </button>
            </td>
        </tr>
    );
}

// Max Weeks Settings Modal
function MaxWeeksSettingsForm({
    currentMaxWeeks,
    onSave,
    onCancel,
    isLoading,
}: {
    currentMaxWeeks: number;
    onSave: (maxWeeks: number) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [maxWeeks, setMaxWeeks] = useState(currentMaxWeeks.toString());

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave(parseInt(maxWeeks));
            }}
            className="space-y-5"
        >
            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Número máximo de semanas de aportes
                </label>
                <input
                    type="number"
                    min="1"
                    value={maxWeeks}
                    onChange={(e) => setMaxWeeks(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <p className="text-slate-500 text-sm mt-2">
                    Aumenta este número para agregar más semanas de cobro.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            Guardar
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default function AdminContributorsPage() {
    const [students, setStudents] = useState<StudentWithPayments[]>([]);
    const [debtRanking, setDebtRanking] = useState<DebtRanking[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentWithPayments | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [quickAddData, setQuickAddData] = useState<{ studentId: string; weekNumber: number } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [filter, setFilter] = useState<"all" | "upToDate" | "pending">("all");

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            setStudents(data.students || []);
            setDebtRanking(data.debtRanking || []);
            setStats(data.stats || null);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Actualizar selectedStudent cuando cambian los students
    useEffect(() => {
        if (selectedStudent) {
            const updated = students.find(s => s.id === selectedStudent.id);
            if (updated) setSelectedStudent(updated);
        }
    }, [students]);

    const filteredStudents = students
        .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((s) => {
            if (filter === "upToDate") return s.isUpToDate;
            if (filter === "pending") return !s.isUpToDate;
            return true;
        });

    const handleSavePayment = async (data: { studentId: string; amount: number; weekNumber: number; paidAt: string }) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                await fetchData();
                setIsModalOpen(false);
                setQuickAddData(null);
            } else {
                const error = await res.json();
                alert(error.error || "Error al registrar el pago");
            }
        } catch (error) {
            console.error("Error saving payment:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditPayment = async (data: { id: string; amount: number; weekNumber: number; paidAt: string }) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/payments/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                await fetchData();
                setIsEditModalOpen(false);
                setSelectedPayment(null);
            } else {
                const error = await res.json();
                alert(error.error || "Error al actualizar el pago");
            }
        } catch (error) {
            console.error("Error updating payment:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBulkPayment = async (data: { studentId: string; weeks: number[]; paidAt: string }) => {
        setIsSaving(true);
        try {
            for (const weekNumber of data.weeks) {
                await fetch("/api/admin/payments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentId: data.studentId,
                        weekNumber,
                        paidAt: data.paidAt,
                        amount: stats?.weeklyAmount || 5,
                    }),
                });
            }
            await fetchData();
            setIsBulkModalOpen(false);
        } catch (error) {
            console.error("Error saving bulk payments:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePayment = async (paymentId: string) => {
        if (!confirm("¿Estás seguro de eliminar este pago?")) return;

        try {
            await fetch(`/api/admin/payments/${paymentId}`, { method: "DELETE" });
            await fetchData();
        } catch (error) {
            console.error("Error deleting payment:", error);
        }
    };

    const handleViewHistory = (student: StudentWithPayments) => {
        setSelectedStudent(student);
        setIsHistoryModalOpen(true);
    };

    const handleSaveMaxWeeks = async (maxWeeks: number) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    fundSettings: { maxWeeks } 
                }),
            });

            if (res.ok) {
                await fetchData();
                setIsSettingsModalOpen(false);
            } else {
                alert("Error al guardar la configuración");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <AdminHeader
                title="Gestión de Aportes"
                subtitle="Administra los pagos semanales de los integrantes"
            />

            <div className="p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-500/20">
                                <Users size={24} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Integrantes</p>
                                <p className="text-2xl font-bold text-white">
                                    {stats?.totalStudents || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-emerald-500/20">
                                <DollarSign size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Recaudado</p>
                                <p className="text-2xl font-bold text-white">
                                    S/. {stats?.totalCollected.toFixed(2) || "0.00"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/20">
                                <TrendingDown size={24} className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Deuda</p>
                                <p className="text-2xl font-bold text-white">
                                    S/. {stats?.totalDebt?.toFixed(2) || "0.00"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/20">
                                <CheckCircle size={24} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Al Día</p>
                                <p className="text-2xl font-bold text-white">
                                    {stats?.studentsUpToDate || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/20">
                                <Calendar size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Semanas</p>
                                <p className="text-2xl font-bold text-white">
                                    {stats?.maxWeeks || 17}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Actions Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as typeof filter)}
                                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="all">Todos</option>
                                <option value="upToDate">Al día</option>
                                <option value="pending">Pendientes</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <button
                                onClick={() => setIsSettingsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                <Settings size={18} />
                                Configurar Semanas
                            </button>
                            
                            <button
                                onClick={() => setIsBulkModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-amber-500/50 text-amber-400 rounded-xl hover:bg-amber-500/10 transition-colors"
                            >
                                <Plus size={18} />
                                Pago Múltiple
                            </button>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                            >
                                <Plus size={18} />
                                Nuevo Pago
                            </button>
                        </div>

                        {/* Students List */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-20">
                                <Users size={48} className="mx-auto text-slate-600 mb-4" />
                                <p className="text-slate-400">
                                    {searchQuery
                                        ? "No se encontraron estudiantes"
                                        : "No hay estudiantes registrados"}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">
                                                Nombre
                                            </th>
                                            <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">
                                                Total Pagado
                                            </th>
                                            <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">
                                                Semanas
                                            </th>
                                            <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">
                                                Estado
                                            </th>
                                            <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">
                                                Historial
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map((student) => (
                                            <StudentRow
                                                key={student.id}
                                                student={student}
                                                maxWeeks={stats?.maxWeeks || 17}
                                                onViewHistory={handleViewHistory}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Debt Ranking */}
                    <div className="lg:col-span-1">
                        <DebtRankingCard ranking={debtRanking} />
                    </div>
                </div>
            </div>

            {/* Single Payment Modal */}
            <Modal
                isOpen={isModalOpen || quickAddData !== null}
                onClose={() => {
                    setIsModalOpen(false);
                    setQuickAddData(null);
                }}
                title="Registrar Nuevo Pago"
            >
                <PaymentForm
                    students={students}
                    maxWeeks={stats?.maxWeeks || 17}
                    weeklyAmount={stats?.weeklyAmount || 5}
                    preSelectedStudentId={quickAddData?.studentId}
                    preSelectedWeek={quickAddData?.weekNumber}
                    onSave={handleSavePayment}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setQuickAddData(null);
                    }}
                    isLoading={isSaving}
                />
            </Modal>

            {/* Bulk Payment Modal */}
            <Modal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                title="Registrar Múltiples Semanas"
            >
                <BulkPaymentForm
                    students={students}
                    maxWeeks={stats?.maxWeeks || 17}
                    weeklyAmount={stats?.weeklyAmount || 5}
                    onSave={handleBulkPayment}
                    onCancel={() => setIsBulkModalOpen(false)}
                    isLoading={isSaving}
                />
            </Modal>

            {/* History Modal */}
            <Modal
                isOpen={isHistoryModalOpen}
                onClose={() => {
                    setIsHistoryModalOpen(false);
                    setSelectedStudent(null);
                }}
                title={`Historial de Pagos - ${selectedStudent?.name || ""}`}
                size="lg"
            >
                {selectedStudent && (
                    <PaymentHistoryContent
                        student={selectedStudent}
                        maxWeeks={stats?.maxWeeks || 17}
                        onEditPayment={(payment) => {
                            setSelectedPayment(payment);
                            setIsEditModalOpen(true);
                        }}
                        onDeletePayment={handleDeletePayment}
                        onAddPayment={(weekNumber) => {
                            setQuickAddData({ studentId: selectedStudent.id, weekNumber });
                            setIsHistoryModalOpen(false);
                        }}
                    />
                )}
            </Modal>

            {/* Edit Payment Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPayment(null);
                }}
                title="Editar Pago"
            >
                {selectedPayment && (
                    <EditPaymentForm
                        payment={selectedPayment}
                        onSave={handleEditPayment}
                        onCancel={() => {
                            setIsEditModalOpen(false);
                            setSelectedPayment(null);
                        }}
                        isLoading={isSaving}
                    />
                )}
            </Modal>

            {/* Settings Modal */}
            <Modal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                title="Configurar Semanas de Aportes"
            >
                <MaxWeeksSettingsForm
                    currentMaxWeeks={stats?.maxWeeks || 17}
                    onSave={handleSaveMaxWeeks}
                    onCancel={() => setIsSettingsModalOpen(false)}
                    isLoading={isSaving}
                />
            </Modal>
        </div>
    );
}
