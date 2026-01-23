import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import { verifyAdminToken } from "@/lib/adminAuth";

// GET - Dashboard stats
export async function GET(request: Request) {
    try {
        // Verify admin is authenticated
        await verifyAdminToken(request);

        // Get counts in parallel
        const [
            eventsCount,
            galleryCount,
            studentsCount,
            fundSettings,
            totalPayments,
            ticketSalesTotal
        ] = await Promise.all([
            prisma.event.count({ where: { isActive: true } }),
            prisma.galleryImage.count({ where: { isActive: true } }),
            prisma.student.count({ where: { isActive: true } }),
            prisma.fundSettings.findUnique({ where: { id: "main" } }),
            prisma.payment.aggregate({ _sum: { amount: true } }),
            prisma.ticketSale.aggregate({
                where: { status: "confirmed" },
                _sum: { totalAmount: true }
            })
        ]);

        // Calculate fund progress
        const paymentsTotal = totalPayments._sum.amount || 0;
        const ticketsTotal = ticketSalesTotal._sum.totalAmount || 0;
        const fundTotal = paymentsTotal + ticketsTotal;
        const goal = fundSettings?.goal || 5000;
        const progress = Math.round((fundTotal / goal) * 100);

        // Get active contributors count (students who have made at least one payment)
        const activeContributors = await prisma.student.count({
            where: {
                isActive: true,
                payments: { some: {} }
            }
        });

        // Get this week's new contributions
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyNewContributions = await prisma.payment.count({
            where: {
                createdAt: { gte: oneWeekAgo }
            }
        });

        return NextResponse.json({
            stats: {
                eventsCount,
                galleryCount,
                studentsCount,
                activeContributors,
                fundTotal,
                goal,
                progress,
                weeklyAmount: fundSettings?.weeklyAmount || 5,
                weeklyNewContributions
            }
        });
    } catch (error) {
        return handleApiError(error, "GET /api/admin/stats");
    }
}
