import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Número máximo de semanas registradas (del CSV: 8 sept 2025 al 29 dic 2025)
const MAX_WEEKS = 17;

// Calcular semanas transcurridas desde la fecha de inicio
function getWeeksSinceStart(startDate: Date): number {
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // Limitar a MAX_WEEKS para no exceder las semanas del período de aportes
    return Math.min(MAX_WEEKS, Math.max(1, Math.floor(diffDays / 7) + 1));
}

// GET: Lista todos los estudiantes con su estado de aportes
export async function GET() {
    try {
        const students = await prisma.student.findMany({
            where: { isActive: true },
            include: {
                payments: {
                    orderBy: { weekNumber: "desc" },
                },
            },
            orderBy: { name: "asc" },
        });

        // Obtener configuración del fondo
        const fundSettings = await prisma.fundSettings.findUnique({
            where: { id: "main" },
        });

        const weeklyAmount = fundSettings?.weeklyAmount || 5;
        const lateFee = 7; // Penalidad por semana no pagada
        const startDate = fundSettings?.startDate || new Date("2025-09-08");
        const currentWeek = getWeeksSinceStart(startDate);

        // Calcular estadísticas
        let totalCollected = 0;
        let studentsUpToDate = 0;

        const studentsWithStats = students.map((student) => {
            const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
            const weeksPaid = student.payments.length;
            const weeksPending = Math.max(0, currentWeek - weeksPaid);
            // Deuda: 7 soles por cada semana no pagada
            const amountOwed = weeksPending * lateFee;

            totalCollected += totalPaid;
            if (weeksPending === 0) studentsUpToDate++;

            return {
                id: student.id,
                name: student.name,
                photoUrl: student.photoUrl,
                totalPaid,
                weeksPaid,
                weeksPending,
                amountOwed,
                isUpToDate: weeksPending === 0,
                lastPayment: student.payments[0] || null,
            };
        });

        return NextResponse.json({
            students: studentsWithStats,
            stats: {
                totalStudents: students.length,
                studentsUpToDate,
                studentsPending: students.length - studentsUpToDate,
                totalCollected,
                currentWeek,
                weeklyAmount,
                goal: fundSettings?.goal || 5000,
            },
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { error: "Error al obtener los pagos" },
            { status: 500 }
        );
    }
}

// POST: Crear nuevo pago
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, amount, weekNumber, paidAt, notes } = body;

        if (!studentId || !weekNumber) {
            return NextResponse.json(
                { error: "Se requiere studentId y weekNumber" },
                { status: 400 }
            );
        }

        // Verificar si ya existe un pago para esa semana
        const existingPayment = await prisma.payment.findFirst({
            where: {
                studentId,
                weekNumber,
            },
        });

        if (existingPayment) {
            return NextResponse.json(
                { error: `Ya existe un pago registrado para la semana ${weekNumber}` },
                { status: 400 }
            );
        }

        // Obtener monto por defecto de la configuración
        const fundSettings = await prisma.fundSettings.findUnique({
            where: { id: "main" },
        });
        const defaultAmount = fundSettings?.weeklyAmount || 5;

        const payment = await prisma.payment.create({
            data: {
                studentId,
                amount: amount || defaultAmount,
                weekNumber,
                paidAt: paidAt ? new Date(paidAt) : new Date(),
                notes,
            },
            include: {
                student: true,
            },
        });

        return NextResponse.json({
            payment,
            message: `Pago registrado para ${payment.student.name} - Semana ${weekNumber}`,
        });
    } catch (error) {
        console.error("Error creating payment:", error);
        return NextResponse.json(
            { error: "Error al crear el pago" },
            { status: 500 }
        );
    }
}
