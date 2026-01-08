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

// GET - List all events
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isPublic = searchParams.get("public") === "true";

        const events = await prisma.event.findMany({
            where: isPublic ? { isActive: true } : {},
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

// POST - Create new event
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
        const { 
            date, 
            year, 
            title, 
            description, 
            status, 
            icon, 
            order,
            fullDescription,
            location,
            time,
            ticketPrice,
            maxTickets,
            hasTickets,
            schedule,
            instructions,
        } = body;

        if (!date || !year || !title || !description) {
            return NextResponse.json(
                { error: "Campos requeridos faltantes" },
                { status: 400 }
            );
        }

        const event = await prisma.event.create({
            data: {
                date,
                year,
                title,
                description,
                status: status || "upcoming",
                icon: icon || "📅",
                order: order || 0,
                fullDescription: fullDescription || null,
                location: location || null,
                time: time || null,
                ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
                maxTickets: maxTickets ? parseInt(maxTickets) : null,
                hasTickets: hasTickets || false,
                schedule: schedule ? JSON.stringify(schedule) : null,
                instructions: instructions || null,
            },
            include: {
                images: true,
            },
        });

        return NextResponse.json({ 
            event: {
                ...event,
                schedule: event.schedule ? JSON.parse(event.schedule) : [],
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Error al crear evento" },
            { status: 500 }
        );
    }
}
