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

// GET: Buscar estudiante y su estado de aportes
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        if (!search || search.length < 2) {
            return NextResponse.json(
                { error: "Ingresa al menos 2 caracteres para buscar" },
                { status: 400 }
            );
        }

        // Buscar estudiantes por nombre (case insensitive)
        const students = await prisma.student.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
                isActive: true,
            },
            include: {
                payments: {
                    orderBy: { weekNumber: "desc" },
                },
            },
            take: 10,
        });

        // Obtener configuración del fondo
        const fundSettings = await prisma.fundSettings.findUnique({
            where: { id: "main" },
        });

        const weeklyAmount = fundSettings?.weeklyAmount || 5;
        const lateFee = 7; // Penalidad por semana no pagada
        const startDate = fundSettings?.startDate || new Date("2025-09-08");
        const currentWeek = getWeeksSinceStart(startDate);

        // Calcular estado de cada estudiante
        const results = students.map((student: typeof students[0]) => {
            const totalPaid = student.payments.reduce((sum: number, p: typeof student.payments[0]) => sum + p.amount, 0);
            const weeksPaid = student.payments.length;
            const weeksPending = Math.max(0, currentWeek - weeksPaid);
            // Deuda: 7 soles por cada semana no pagada (penalidad por tardanza)
            const amountOwed = weeksPending * lateFee;

            return {
                id: student.id,
                name: student.name,
                photoUrl: student.photoUrl,
                totalPaid,
                weeksPaid,
                weeksPending,
                amountOwed,
                currentWeek,
                weeklyAmount,  // Monto normal por semana (5 soles)
                lateFee,       // Penalidad por mora (7 soles)
                isUpToDate: weeksPending === 0,
                payments: student.payments.map((p: typeof student.payments[0]) => ({
                    id: p.id,
                    weekNumber: p.weekNumber,
                    amount: p.amount,
                    paidAt: p.paidAt,
                })),
            };
        });

        return NextResponse.json({ students: results });
    } catch (error) {
        console.error("Error searching contributions:", error);
        return NextResponse.json(
            { error: "Error al buscar aportes" },
            { status: 500 }
        );
    }
}
