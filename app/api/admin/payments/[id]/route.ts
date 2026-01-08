import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Obtener un pago específico
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                student: true,
            },
        });

        if (!payment) {
            return NextResponse.json(
                { error: "Pago no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ payment });
    } catch (error) {
        console.error("Error fetching payment:", error);
        return NextResponse.json(
            { error: "Error al obtener el pago" },
            { status: 500 }
        );
    }
}

// PUT: Actualizar un pago
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { amount, weekNumber, paidAt, notes } = body;

        const payment = await prisma.payment.update({
            where: { id },
            data: {
                ...(amount !== undefined && { amount }),
                ...(weekNumber !== undefined && { weekNumber }),
                ...(paidAt && { paidAt: new Date(paidAt) }),
                ...(notes !== undefined && { notes }),
            },
            include: {
                student: true,
            },
        });

        return NextResponse.json({
            payment,
            message: `Pago actualizado para ${payment.student.name}`,
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { error: "Error al actualizar el pago" },
            { status: 500 }
        );
    }
}

// DELETE: Eliminar un pago
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const payment = await prisma.payment.delete({
            where: { id },
            include: {
                student: true,
            },
        });

        return NextResponse.json({
            message: `Pago eliminado de ${payment.student.name} - Semana ${payment.weekNumber}`,
        });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return NextResponse.json(
            { error: "Error al eliminar el pago" },
            { status: 500 }
        );
    }
}
