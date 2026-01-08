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

// PUT - Update contributor
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
        const { name, amount, weeks, isActive } = body;

        const contributor = await prisma.contributor.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(amount !== undefined && { amount: parseFloat(amount) }),
                ...(weeks !== undefined && { weeks: parseInt(weeks) }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        return NextResponse.json({ contributor });
    } catch (error) {
        console.error("Error updating contributor:", error);
        return NextResponse.json(
            { error: "Error al actualizar contribuidor" },
            { status: 500 }
        );
    }
}

// DELETE - Delete contributor
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

        await prisma.contributor.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting contributor:", error);
        return NextResponse.json(
            { error: "Error al eliminar contribuidor" },
            { status: 500 }
        );
    }
}
