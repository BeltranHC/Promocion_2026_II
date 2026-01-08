import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";

// Helper to verify admin auth
async function verifyAdmin(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookies(cookieHeader);

    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
}

// GET - Get single event
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Evento no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ event });
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { error: "Error al obtener evento" },
            { status: 500 }
        );
    }
}

// PUT - Update event
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { date, year, title, description, status, icon, order, isActive } = body;

        const event = await prisma.event.update({
            where: { id },
            data: {
                ...(date && { date }),
                ...(year && { year }),
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
                ...(icon && { icon }),
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        return NextResponse.json({ event });
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { error: "Error al actualizar evento" },
            { status: 500 }
        );
    }
}

// DELETE - Delete event
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const { id } = await params;

        await prisma.event.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json(
            { error: "Error al eliminar evento" },
            { status: 500 }
        );
    }
}
