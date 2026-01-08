import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const cookieHeader = request.headers.get("cookie");
        const token = getTokenFromCookies(cookieHeader);

        if (!token) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: "Token inválido" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            admin: {
                id: payload.adminId,
                email: payload.email,
            },
        });
    } catch (error) {
        console.error("Verify error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
