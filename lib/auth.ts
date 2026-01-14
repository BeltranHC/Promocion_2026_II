import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT_SECRET debe estar definido en las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Validar que JWT_SECRET esté configurado
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined. Please set it in your .env file.');
}

export interface JWTPayload {
    adminId: string;
    email: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

// Get token from cookies string
export function getTokenFromCookies(cookieString: string | null): string | null {
    if (!cookieString) return null;

    const cookies = cookieString.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);

    return cookies['admin_token'] || null;
}
