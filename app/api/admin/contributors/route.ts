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

// GET - List all contributors
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isPublic = searchParams.get("public") === "true";

        const contributors = await prisma.contributor.findMany({
            where: isPublic ? { isActive: true } : {},
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ contributors });
    } catch (error) {
        console.error("Error fetching contributors:", error);
        return NextResponse.json(
            { error: "Error al obtener contribuidores" },
            { status: 500 }
        );
    }
}

// POST - Create new contributor
export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, amount, weeks } = body;

        if (!name || amount === undefined || weeks === undefined) {
            return NextResponse.json(
                { error: "Campos requeridos faltantes" },
                { status: 400 }
            );
        }

        const contributor = await prisma.contributor.create({
            data: {
                name,
                amount: parseFloat(amount),
                weeks: parseInt(weeks),
            },
        });

        return NextResponse.json({ contributor }, { status: 201 });
    } catch (error) {
        console.error("Error creating contributor:", error);
        return NextResponse.json(
            { error: "Error al crear contribuidor" },
            { status: 500 }
        );
    }
}
