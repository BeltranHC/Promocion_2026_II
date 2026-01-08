import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET - Get single event details (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const event = await prisma.event.findUnique({
            where: { id, isActive: true },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Evento no encontrado" },
                { status: 404 }
            );
        }

        // Parse schedule JSON
        const eventWithParsedSchedule = {
            ...event,
            schedule: event.schedule ? JSON.parse(event.schedule) : [],
        };

        return NextResponse.json({ event: eventWithParsedSchedule });
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { error: "Error al obtener evento" },
            { status: 500 }
        );
    }
}
