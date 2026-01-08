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

// GET - Get settings
export async function GET() {
    try {
        let fundSettings = await prisma.fundSettings.findUnique({
            where: { id: "main" },
        });

        let siteSettings = await prisma.siteSettings.findUnique({
            where: { id: "main" },
        });

        // Create default settings if they don't exist
        if (!fundSettings) {
            fundSettings = await prisma.fundSettings.create({
                data: { id: "main" },
            });
        }

        if (!siteSettings) {
            siteSettings = await prisma.siteSettings.create({
                data: { id: "main" },
            });
        }

        return NextResponse.json({ fundSettings, siteSettings });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json(
            { error: "Error al obtener configuración" },
            { status: 500 }
        );
    }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { fundSettings, siteSettings } = body;

        let updatedFundSettings = null;
        let updatedSiteSettings = null;

        if (fundSettings) {
            updatedFundSettings = await prisma.fundSettings.upsert({
                where: { id: "main" },
                update: {
                    ...(fundSettings.goal !== undefined && { goal: parseFloat(fundSettings.goal) }),
                    ...(fundSettings.weeklyAmount !== undefined && { weeklyAmount: parseFloat(fundSettings.weeklyAmount) }),
                    ...(fundSettings.totalMembers !== undefined && { totalMembers: parseInt(fundSettings.totalMembers) }),
                    ...(fundSettings.maxWeeks !== undefined && { maxWeeks: parseInt(fundSettings.maxWeeks) }),
                },
                create: {
                    id: "main",
                    goal: parseFloat(fundSettings.goal) || 5000,
                    weeklyAmount: parseFloat(fundSettings.weeklyAmount) || 5,
                    totalMembers: parseInt(fundSettings.totalMembers) || 50,
                    maxWeeks: parseInt(fundSettings.maxWeeks) || 17,
                },
            });
        }

        if (siteSettings) {
            updatedSiteSettings = await prisma.siteSettings.upsert({
                where: { id: "main" },
                update: {
                    ...(siteSettings.promotionName && { promotionName: siteSettings.promotionName }),
                    ...(siteSettings.schoolName && { schoolName: siteSettings.schoolName }),
                    ...(siteSettings.contactEmail !== undefined && { contactEmail: siteSettings.contactEmail }),
                    ...(siteSettings.instagramUrl !== undefined && { instagramUrl: siteSettings.instagramUrl }),
                    ...(siteSettings.facebookUrl !== undefined && { facebookUrl: siteSettings.facebookUrl }),
                    ...(siteSettings.whatsappNumber !== undefined && { whatsappNumber: siteSettings.whatsappNumber }),
                },
                create: {
                    id: "main",
                    promotionName: siteSettings.promotionName || "Promoción 2026 - II",
                    schoolName: siteSettings.schoolName || "EPIEI - UNA Puno",
                },
            });
        }

        return NextResponse.json({
            fundSettings: updatedFundSettings,
            siteSettings: updatedSiteSettings,
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { error: "Error al actualizar configuración" },
            { status: 500 }
        );
    }
}
