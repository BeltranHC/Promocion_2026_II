import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

// Helper to verify admin auth
async function verifyAdmin(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookies(cookieHeader);

    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
}

// DELETE - Delete image
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

        // Get image to delete from Cloudinary
        const image = await prisma.galleryImage.findUnique({
            where: { id },
        });

        if (!image) {
            return NextResponse.json(
                { error: "Imagen no encontrada" },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        if (image.publicId) {
            await deleteImage(image.publicId);
        }

        // Delete from database
        await prisma.galleryImage.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            { error: "Error al eliminar imagen" },
            { status: 500 }
        );
    }
}

// PUT - Update image metadata
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
        const { category, label, order, isActive } = body;

        const image = await prisma.galleryImage.update({
            where: { id },
            data: {
                ...(category && { category }),
                ...(label && { label }),
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        return NextResponse.json({ image });
    } catch (error) {
        console.error("Error updating image:", error);
        return NextResponse.json(
            { error: "Error al actualizar imagen" },
            { status: 500 }
        );
    }
}
