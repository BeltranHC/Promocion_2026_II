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

// GET: Obtener estadísticas generales del fondo (API pública)
export async function GET() {
    try {
        const students = await prisma.student.findMany({
            where: { isActive: true },
            include: {
                payments: true,
            },
        });

        // Obtener configuración del fondo
        const fundSettings = await prisma.fundSettings.findUnique({
            where: { id: "main" },
        });

        const weeklyAmount = fundSettings?.weeklyAmount || 5;
        const lateFee = 7;
        const startDate = fundSettings?.startDate || new Date("2025-09-08");
        const currentWeek = getWeeksSinceStart(startDate);

        // Calcular estadísticas
        let totalCollected = 0;
        let studentsUpToDate = 0;

        students.forEach((student: typeof students[0]) => {
            const totalPaid = student.payments.reduce((sum: number, p: typeof student.payments[0]) => sum + p.amount, 0);
            const weeksPaid = student.payments.length;
            const weeksPending = Math.max(0, currentWeek - weeksPaid);

            totalCollected += totalPaid;
            if (weeksPending === 0) studentsUpToDate++;
        });

        return NextResponse.json({
            stats: {
                totalStudents: students.length,
                studentsUpToDate,
                studentsPending: students.length - studentsUpToDate,
                totalCollected,
                currentWeek,
                weeklyAmount,
                lateFee,
                goal: fundSettings?.goal || 5000,
            },
        });
    } catch (error) {
        console.error("Error fetching fund stats:", error);
        return NextResponse.json(
            { error: "Error al obtener estadísticas del fondo" },
            { status: 500 }
        );
    }
}
