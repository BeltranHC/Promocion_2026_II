import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Lista todos los estudiantes con su estado de aportes
export async function GET() {
    try {
        const students = await prisma.student.findMany({
            where: { isActive: true },
            include: {
                payments: {
                    orderBy: { weekNumber: "asc" },
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
        const maxWeeks = fundSettings?.maxWeeks || 17;

        // Calcular estadísticas
        let totalCollected = 0;
        let studentsUpToDate = 0;
        let totalDebt = 0;

        const studentsWithStats = students.map((student) => {
            // Solo contar como "pagado" las semanas con monto > 0
            const paidPayments = student.payments.filter(p => p.amount > 0);
            const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
            
            // Obtener el set de semanas que el estudiante ha cubierto (pagadas con monto > 0)
            const weeksPaidSet = new Set(paidPayments.map(p => p.weekNumber));
            const weeksPaid = weeksPaidSet.size;
            
            // Calcular semanas pendientes (semanas que no están en el set de pagadas)
            let weeksPending = 0;
            for (let week = 1; week <= maxWeeks; week++) {
                if (!weeksPaidSet.has(week)) {
                    weeksPending++;
                }
            }
            
            // Deuda: 7 soles por cada semana no pagada
            const amountOwed = weeksPending * lateFee;

            totalCollected += totalPaid;
            totalDebt += amountOwed;
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
                lastPayment: paidPayments.length > 0 ? paidPayments[paidPayments.length - 1] : null,
                payments: student.payments, // Incluir todos los pagos para historial
            };
        });
        
        // Ordenar para ranking de deudores
        const debtRanking = [...studentsWithStats]
            .filter(s => s.amountOwed > 0)
            .sort((a, b) => b.amountOwed - a.amountOwed)
            .slice(0, 10);

        // Calcular totales por semana
        const weeklyTotals: { week: number; total: number; paidCount: number }[] = [];
        for (let week = 1; week <= maxWeeks; week++) {
            let weekTotal = 0;
            let paidCount = 0;
            students.forEach(student => {
                const payment = student.payments.find(p => p.weekNumber === week && p.amount > 0);
                if (payment) {
                    weekTotal += payment.amount;
                    paidCount++;
                }
            });
            weeklyTotals.push({ week, total: weekTotal, paidCount });
        }

        return NextResponse.json({
            students: studentsWithStats,
            debtRanking,
            weeklyTotals,
            stats: {
                totalStudents: students.length,
                studentsUpToDate,
                studentsPending: students.length - studentsUpToDate,
                totalCollected,
                totalDebt,
                maxWeeks,
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
