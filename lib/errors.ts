import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

// ============================================
// Custom Error Classes
// ============================================

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = "Recurso") {
        super(`${resource} no encontrado`, 404, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "No autorizado") {
        super(message, 401, "UNAUTHORIZED");
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Acceso denegado") {
        super(message, 403, "FORBIDDEN");
        this.name = "ForbiddenError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string = "Datos inválidos") {
        super(message, 400, "VALIDATION_ERROR");
        this.name = "ValidationError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string = "El recurso ya existe") {
        super(message, 409, "CONFLICT");
        this.name = "ConflictError";
    }
}

// ============================================
// Error Response Type
// ============================================

interface ErrorResponse {
    error: string;
    code?: string;
    details?: string;
}

// ============================================
// Error Handler
// ============================================

/**
 * Handles errors and returns appropriate NextResponse
 * Use this in catch blocks of API routes
 */
export function handleApiError(error: unknown, context?: string): NextResponse<ErrorResponse> {
    // Log error for debugging (in production, use a proper logger)
    if (process.env.NODE_ENV === "development") {
        console.error(`[API Error]${context ? ` [${context}]` : ""}:`, error);
    }

    // Custom App Errors
    if (error instanceof AppError) {
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode }
        );
    }

    // Zod Validation Errors
    if (error instanceof ZodError) {
        const messages = error.issues.map((e: { message: string }) => e.message).join(", ");
        return NextResponse.json(
            { error: messages, code: "VALIDATION_ERROR" },
            { status: 400 }
        );
    }

    // Prisma Errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(error);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json(
            { error: "Error de validación de datos", code: "DB_VALIDATION_ERROR" },
            { status: 400 }
        );
    }

    // Generic Error
    if (error instanceof Error) {
        return NextResponse.json(
            { 
                error: process.env.NODE_ENV === "development" 
                    ? error.message 
                    : "Error interno del servidor",
                code: "INTERNAL_ERROR"
            },
            { status: 500 }
        );
    }

    // Unknown error
    return NextResponse.json(
        { error: "Error desconocido", code: "UNKNOWN_ERROR" },
        { status: 500 }
    );
}

/**
 * Handles Prisma-specific errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse<ErrorResponse> {
    switch (error.code) {
        case "P2002": {
            // Unique constraint violation
            const field = (error.meta?.target as string[])?.join(", ") || "campo";
            return NextResponse.json(
                { error: `El ${field} ya existe`, code: "DUPLICATE_ENTRY" },
                { status: 409 }
            );
        }

        case "P2025":
            // Record not found
            return NextResponse.json(
                { error: "Registro no encontrado", code: "NOT_FOUND" },
                { status: 404 }
            );

        case "P2003":
            // Foreign key constraint violation
            return NextResponse.json(
                { error: "Error de referencia: el registro relacionado no existe", code: "FK_VIOLATION" },
                { status: 400 }
            );

        case "P2014":
            // Required relation violation
            return NextResponse.json(
                { error: "Esta operación violaría una relación requerida", code: "RELATION_VIOLATION" },
                { status: 400 }
            );

        default:
            return NextResponse.json(
                { error: "Error de base de datos", code: `DB_ERROR_${error.code}` },
                { status: 500 }
            );
    }
}

// ============================================
// Success Response Helpers
// ============================================

/**
 * Creates a success response with data
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
    return NextResponse.json(data, { status });
}

/**
 * Creates a created response (201)
 */
export function createdResponse<T>(data: T): NextResponse<T> {
    return NextResponse.json(data, { status: 201 });
}

/**
 * Creates a no content response (204)
 */
export function noContentResponse(): NextResponse {
    return new NextResponse(null, { status: 204 });
}
