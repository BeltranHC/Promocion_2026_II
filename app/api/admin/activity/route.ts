import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import { verifyAdmin } from "@/lib/adminAuth";
import { NextRequest } from "next/server";

// Types
interface ActivityItem {
    type: "event" | "gallery" | "payment" | "ticket_sale" | "student";
    action: string;
    detail: string;
    time: Date;
}

// GET - Recent activity for dashboard
export async function GET(request: NextRequest) {
    try {
        // Verify admin is authenticated
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // Get recent items from different tables in parallel
        const [recentEvents, recentGallery, recentPayments, recentTicketSales, recentStudents] = await Promise.all([
            prisma.event.findMany({
                take: 3,
                orderBy: { createdAt: "desc" },
                select: { title: true, createdAt: true }
            }),
            prisma.galleryImage.findMany({
                take: 3,
                orderBy: { createdAt: "desc" },
                select: { label: true, createdAt: true }
            }),
            prisma.payment.findMany({
                take: 3,
                orderBy: { createdAt: "desc" },
                select: { 
                    amount: true, 
                    createdAt: true,
                    student: { select: { name: true } }
                }
            }),
            prisma.ticketSale.findMany({
                take: 3,
                orderBy: { createdAt: "desc" },
                select: {
                    buyerName: true,
                    quantity: true,
                    totalAmount: true,
                    createdAt: true,
                    event: { select: { title: true } }
                }
            }),
            prisma.student.findMany({
                take: 2,
                orderBy: { createdAt: "desc" },
                select: { name: true, createdAt: true }
            })
        ]);

        // Transform to unified activity format
        const activities: ActivityItem[] = [];

        recentEvents.forEach(event => {
            activities.push({
                type: "event",
                action: "Nuevo evento creado",
                detail: event.title,
                time: event.createdAt
            });
        });

        recentGallery.forEach(image => {
            activities.push({
                type: "gallery",
                action: "Imagen subida",
                detail: image.label,
                time: image.createdAt
            });
        });

        recentPayments.forEach(payment => {
            activities.push({
                type: "payment",
                action: "Aporte registrado",
                detail: `${payment.student.name} - S/. ${payment.amount.toFixed(2)}`,
                time: payment.createdAt
            });
        });

        recentTicketSales.forEach(sale => {
            activities.push({
                type: "ticket_sale",
                action: "Venta de entradas",
                detail: `${sale.buyerName} - ${sale.quantity} entrada(s) para ${sale.event.title}`,
                time: sale.createdAt
            });
        });

        recentStudents.forEach(student => {
            activities.push({
                type: "student",
                action: "Estudiante registrado",
                detail: student.name,
                time: student.createdAt
            });
        });

        // Sort by time descending and take top 10
        activities.sort((a, b) => b.time.getTime() - a.time.getTime());
        const topActivities = activities.slice(0, 10);

        // Format relative time
        const formattedActivities = topActivities.map(activity => ({
            ...activity,
            timeFormatted: formatRelativeTime(activity.time)
        }));

        return NextResponse.json({ activities: formattedActivities });
    } catch (error) {
        return handleApiError(error, "GET /api/admin/activity");
    }
}

// Helper to format relative time
function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
        { label: "año", seconds: 31536000 },
        { label: "mes", seconds: 2592000 },
        { label: "semana", seconds: 604800 },
        { label: "día", seconds: 86400 },
        { label: "hora", seconds: 3600 },
        { label: "minuto", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            const plural = count > 1 ? (interval.label === "mes" ? "es" : "s") : "";
            return `Hace ${count} ${interval.label}${plural}`;
        }
    }

    return "Hace un momento";
}
