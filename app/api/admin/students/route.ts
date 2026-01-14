import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import { uploadImage } from "@/lib/cloudinary";
import { createStudentSchema, validateData } from "@/lib/validators";
import { handleApiError, UnauthorizedError, ValidationError, createdResponse } from "@/lib/errors";

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
        return handleApiError(error, "GET /api/admin/students");
    }
}

// POST - Create new student
export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            throw new UnauthorizedError();
        }

        const formData = await request.formData();
        const rawData = {
            name: formData.get("name") as string,
            nickname: formData.get("nickname") as string | null,
            description: formData.get("description") as string | null,
            quote: formData.get("quote") as string | null,
        };
        const file = formData.get("photo") as File | null;

        // Validate with Zod
        const validation = validateData(createStudentSchema, rawData);
        if (!validation.success) {
            throw new ValidationError(validation.error);
        }

        const { name, nickname, description, quote } = validation.data;

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

        return createdResponse({ student });
    } catch (error) {
        return handleApiError(error, "POST /api/admin/students");
    }
}
