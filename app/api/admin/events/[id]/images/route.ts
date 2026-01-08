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

// POST - Upload image to event
export async function POST(
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

        // Check if event exists
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            return NextResponse.json(
                { error: "Evento no encontrado" },
                { status: 404 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("image") as File;
        const caption = formData.get("caption") as string;

        if (!file) {
            return NextResponse.json(
                { error: "No se proporcionó imagen" },
                { status: 400 }
            );
        }

        // Upload to Cloudinary using File directly
        const uploadResult = await uploadImage(file);

        // Get highest order for this event
        const maxOrderImage = await prisma.eventImage.findFirst({
            where: { eventId: id },
            orderBy: { order: "desc" },
        });

        // Create EventImage record
        const eventImage = await prisma.eventImage.create({
            data: {
                eventId: id,
                url: uploadResult.url,
                publicId: uploadResult.publicId,
                caption: caption || null,
                order: (maxOrderImage?.order || 0) + 1,
            },
        });

        return NextResponse.json({ image: eventImage }, { status: 201 });
    } catch (error) {
        console.error("Error uploading event image:", error);
        return NextResponse.json(
            { error: "Error al subir imagen" },
            { status: 500 }
        );
    }
}

// DELETE - Delete image from event
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

        const { id: eventId } = await params;
        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get("imageId");

        if (!imageId) {
            return NextResponse.json(
                { error: "ID de imagen requerido" },
                { status: 400 }
            );
        }

        // Find image
        const eventImage = await prisma.eventImage.findFirst({
            where: { id: imageId, eventId },
        });

        if (!eventImage) {
            return NextResponse.json(
                { error: "Imagen no encontrada" },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        await deleteImage(eventImage.publicId);

        // Delete from database
        await prisma.eventImage.delete({ where: { id: imageId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting event image:", error);
        return NextResponse.json(
            { error: "Error al eliminar imagen" },
            { status: 500 }
        );
    }
}
