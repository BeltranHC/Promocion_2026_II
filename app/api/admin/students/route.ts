import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

// Helper to verify admin auth
async function verifyAdmin(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookies(cookieHeader);

    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
}

// GET - List all students
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isPublic = searchParams.get("public") === "true";

        const students = await prisma.student.findMany({
            where: isPublic ? { isActive: true } : {},
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json(
            { error: "Error al obtener estudiantes" },
            { status: 500 }
        );
    }
}

// POST - Create new student
export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const nickname = formData.get("nickname") as string | null;
        const description = formData.get("description") as string | null;
        const quote = formData.get("quote") as string | null;
        const file = formData.get("photo") as File | null;

        if (!name) {
            return NextResponse.json(
                { error: "El nombre es requerido" },
                { status: 400 }
            );
        }

        let photoUrl: string | null = null;
        let photoId: string | null = null;

        // Upload photo if provided
        if (file && file.size > 0) {
            const result = await uploadImage(file);
            photoUrl = result.url;
            photoId = result.publicId;
        }

        const student = await prisma.student.create({
            data: {
                name,
                nickname: nickname || null,
                description: description || null,
                quote: quote || null,
                photoUrl,
                photoId,
            },
        });

        return NextResponse.json({ student }, { status: 201 });
    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { error: "Error al crear estudiante" },
            { status: 500 }
        );
    }
}
