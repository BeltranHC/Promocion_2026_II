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

// GET - List all gallery images
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isPublic = searchParams.get("public") === "true";
        const category = searchParams.get("category");

        const images = await prisma.galleryImage.findMany({
            where: {
                ...(isPublic && { isActive: true }),
                ...(category && category !== "all" && { category }),
            },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ images });
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json(
            { error: "Error al obtener imágenes" },
            { status: 500 }
        );
    }
}

// POST - Upload new image
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
        const file = formData.get("file") as File;
        const category = formData.get("category") as string;
        const label = formData.get("label") as string;

        if (!file) {
            return NextResponse.json(
                { error: "Archivo requerido" },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const { url, publicId } = await uploadImage(file);

        // Save to database
        const image = await prisma.galleryImage.create({
            data: {
                url,
                publicId,
                category: category || "events",
                label: label || "Imagen",
            },
        });

        return NextResponse.json({ image }, { status: 201 });
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { error: "Error al subir imagen" },
            { status: 500 }
        );
    }
}
