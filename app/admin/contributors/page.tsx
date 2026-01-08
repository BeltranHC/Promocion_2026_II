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
    ChevronDown,
    ChevronUp,
} from "lucide-react";

interface Payment {
    id: string;
    weekNumber: number;
    amount: number;
    paidAt: string;
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
}

interface Stats {
    totalStudents: number;
    studentsUpToDate: number;
    studentsPending: number;
    totalCollected: number;
    currentWeek: number;
    weeklyAmount: number;
    goal: number;
}

// Modal Component
function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
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
    currentWeek,
    weeklyAmount,
    onSave,
    onCancel,
    isLoading,
}: {
    students: StudentWithPayments[];
    currentWeek: number;
    weeklyAmount: number;
    onSave: (data: { studentId: string; amount: number; weekNumber: number; paidAt: string }) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        studentId: "",
        amount: weeklyAmount.toString(),
        weekNumber: currentWeek.toString(),
        paidAt: new Date().toISOString().split("T")[0],
    });

    const selectedStudent = students.find((s) => s.id === formData.studentId);

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
                            {student.name} - {student.isUpToDate ? "Al día" : `Debe ${student.weeksPending} sem.`}
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
                        <span className="text-white">{selectedStudent.weeksPaid} de {currentWeek}</span>
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

// Bulk Payment Form for multiple weeks
function BulkPaymentForm({
    students,
    currentWeek,
    weeklyAmount,
    onSave,
    onCancel,
    isLoading,
}: {
    students: StudentWithPayments[];
    currentWeek: number;
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
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: currentWeek }, (_, i) => i + 1).map((week) => {
                                const isPaid = selectedStudent.weeksPaid >= week;
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

// Student Row Component
function StudentRow({
    student,
    currentWeek,
    onDeletePayment,
}: {
    student: StudentWithPayments;
    currentWeek: number;
    onDeletePayment: (paymentId: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);

    const loadPayments = async () => {
        if (payments.length > 0) {
            setIsExpanded(!isExpanded);
            return;
        }

        setLoadingPayments(true);
        try {
            const res = await fetch(`/api/contributions?search=${encodeURIComponent(student.name)}`);
            const data = await res.json();
            if (data.students && data.students.length > 0) {
                setPayments(data.students[0].payments || []);
            }
            setIsExpanded(true);
        } catch (error) {
            console.error("Error loading payments:", error);
        } finally {
            setLoadingPayments(false);
        }
    };

    return (
        <>
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
                        {student.weeksPaid} / {currentWeek}
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
                        onClick={loadPayments}
                        disabled={loadingPayments}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                    >
                        {loadingPayments ? (
                            <div className="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                        ) : isExpanded ? (
                            <ChevronUp size={18} />
                        ) : (
                            <ChevronDown size={18} />
                        )}
                    </button>
                </td>
            </tr>
            {isExpanded && payments.length > 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-4 bg-slate-800/30">
                        <div className="ml-12 space-y-2">
                            <p className="text-slate-400 text-sm mb-3">Historial de Pagos:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-3"
                                    >
                                        <div>
                                            <span className="text-amber-400 font-medium">
                                                Sem. {payment.weekNumber}
                                            </span>
                                            <p className="text-xs text-slate-500">
                                                {new Date(payment.paidAt).toLocaleDateString("es-PE")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white text-sm">S/.{payment.amount}</span>
                                            <button
                                                onClick={() => onDeletePayment(payment.id)}
                                                className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function AdminContributorsPage() {
    const [students, setStudents] = useState<StudentWithPayments[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [filter, setFilter] = useState<"all" | "upToDate" | "pending">("all");

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            setStudents(data.students || []);
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
                fetchData();
                setIsModalOpen(false);
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
            fetchData();
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
            fetchData();
        } catch (error) {
            console.error("Error deleting payment:", error);
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                            <div className="p-3 rounded-xl bg-red-500/20">
                                <Calendar size={24} className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Semana Actual</p>
                                <p className="text-2xl font-bold text-white">
                                    {stats?.currentWeek || 1}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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

                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 border border-amber-500/50 text-amber-400 font-semibold rounded-xl hover:bg-amber-500/10 transition-colors"
                    >
                        <Plus size={20} />
                        Pago Múltiple
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                    >
                        <Plus size={20} />
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
                                        Ver
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <StudentRow
                                        key={student.id}
                                        student={student}
                                        currentWeek={stats?.currentWeek || 1}
                                        onDeletePayment={handleDeletePayment}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Single Payment Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Nuevo Pago"
            >
                <PaymentForm
                    students={students}
                    currentWeek={stats?.currentWeek || 1}
                    weeklyAmount={stats?.weeklyAmount || 5}
                    onSave={handleSavePayment}
                    onCancel={() => setIsModalOpen(false)}
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
                    currentWeek={stats?.currentWeek || 1}
                    weeklyAmount={stats?.weeklyAmount || 5}
                    onSave={handleBulkPayment}
                    onCancel={() => setIsBulkModalOpen(false)}
                    isLoading={isSaving}
                />
            </Modal>
        </div>
    );
}
