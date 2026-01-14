import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromCookies, JWTPayload } from "./auth";

/**
 * Verify admin authentication from request
 * @param request - NextRequest object
 * @returns JWTPayload if authenticated, null otherwise
 */
export async function verifyAdmin(request: NextRequest): Promise<JWTPayload | null> {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookies(cookieHeader);

    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
}

/**
 * Higher-order function to wrap API handlers with admin authentication
 * @param handler - The API handler function to wrap
 * @returns Wrapped handler that checks authentication first
 */
export function withAdminAuth(
    handler: (request: NextRequest, admin: JWTPayload) => Promise<NextResponse>
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        const admin = await verifyAdmin(request);
        
        if (!admin) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        return handler(request, admin);
    };
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(): NextResponse {
    return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
    );
}
