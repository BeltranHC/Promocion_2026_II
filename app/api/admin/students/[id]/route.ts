import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

// Helper to verify admin auth
async function verifyAdmin(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookies(cookieHeader);

    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
}

// GET - Get single student
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const student = await prisma.student.findUnique({
            where: { id },
        });

        if (!student) {
            return NextResponse.json(
                { error: "Estudiante no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ student });
    } catch (error) {
        console.error("Error fetching student:", error);
        return NextResponse.json(
            { error: "Error al obtener estudiante" },
            { status: 500 }
        );
    }
}

// PUT - Update student
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
        const formData = await request.formData();

        const name = formData.get("name") as string | null;
        const nickname = formData.get("nickname") as string | null;
        const description = formData.get("description") as string | null;
        const quote = formData.get("quote") as string | null;
        const file = formData.get("photo") as File | null;
        const removePhoto = formData.get("removePhoto") === "true";

        // Get current student
        const currentStudent = await prisma.student.findUnique({
            where: { id },
        });

        if (!currentStudent) {
            return NextResponse.json(
                { error: "Estudiante no encontrado" },
                { status: 404 }
            );
        }

        let photoUrl = currentStudent.photoUrl;
        let photoId = currentStudent.photoId;

        // Handle photo removal
        if (removePhoto && currentStudent.photoId) {
            await deleteImage(currentStudent.photoId);
            photoUrl = null;
            photoId = null;
        }

        // Handle new photo upload
        if (file && file.size > 0) {
            // Delete old photo if exists
            if (currentStudent.photoId) {
                await deleteImage(currentStudent.photoId);
            }
            const result = await uploadImage(file);
            photoUrl = result.url;
            photoId = result.publicId;
        }

        const student = await prisma.student.update({
            where: { id },
            data: {
                ...(name && { name }),
                nickname: nickname !== null ? nickname : currentStudent.nickname,
                description: description !== null ? description : currentStudent.description,
                quote: quote !== null ? quote : currentStudent.quote,
                photoUrl,
                photoId,
            },
        });

        return NextResponse.json({ student });
    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json(
            { error: "Error al actualizar estudiante" },
            { status: 500 }
        );
    }
}

// DELETE - Delete student
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

        // Get student to delete photo from Cloudinary
        const student = await prisma.student.findUnique({
            where: { id },
        });

        if (student?.photoId) {
            await deleteImage(student.photoId);
        }

        await prisma.student.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json(
            { error: "Error al eliminar estudiante" },
            { status: 500 }
        );
    }
}
