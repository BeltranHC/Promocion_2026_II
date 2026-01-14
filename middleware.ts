import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Función para verificar el token JWT
async function verifyJWT(token: string): Promise<boolean> {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const token = request.cookies.get("admin_token")?.value;

        // If no token, redirect to login
        if (!token) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Verify token signature
        const isValid = await verifyJWT(token);
        if (!isValid) {
            // Token inválido o expirado, eliminar cookie y redirigir
            const loginUrl = new URL("/admin/login", request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete("admin_token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
