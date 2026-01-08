import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET - List all active public events
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            where: { isActive: true },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        });

        // Parse schedule JSON for each event
        const eventsWithParsedSchedule = events.map((event) => ({
            ...event,
            schedule: event.schedule ? JSON.parse(event.schedule) : [],
        }));

        return NextResponse.json({ events: eventsWithParsedSchedule });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Error al obtener eventos" },
            { status: 500 }
        );
    }
}
