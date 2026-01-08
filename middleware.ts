import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const token = request.cookies.get("admin_token")?.value;

        // If no token, redirect to login
        if (!token) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
