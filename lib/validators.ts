import { z } from "zod";

// ============================================
// STUDENT SCHEMAS
// ============================================

export const createStudentSchema = z.object({
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    nickname: z.string()
        .max(50, "El apodo no puede exceder 50 caracteres")
        .optional()
        .nullable(),
    description: z.string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .optional()
        .nullable(),
    quote: z.string()
        .max(200, "La cita no puede exceder 200 caracteres")
        .optional()
        .nullable(),
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

// ============================================
// EVENT SCHEMAS
// ============================================

export const scheduleItemSchema = z.object({
    time: z.string().min(1, "La hora es requerida"),
    activity: z.string().min(1, "La actividad es requerida"),
});

export const createEventSchema = z.object({
    date: z.string()
        .min(1, "La fecha es requerida"),
    year: z.string()
        .min(4, "El año debe tener 4 caracteres")
        .max(4, "El año debe tener 4 caracteres"),
    title: z.string()
        .min(2, "El título debe tener al menos 2 caracteres")
        .max(100, "El título no puede exceder 100 caracteres"),
    description: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(500, "La descripción no puede exceder 500 caracteres"),
    status: z.enum(["upcoming", "past"]).default("upcoming"),
    icon: z.string().default("📅"),
    order: z.number().int().min(0).default(0),
    fullDescription: z.string().max(2000).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    time: z.string().max(50).optional().nullable(),
    ticketPrice: z.number().min(0).optional().nullable(),
    maxTickets: z.number().int().min(1).optional().nullable(),
    hasTickets: z.boolean().default(false),
    schedule: z.array(scheduleItemSchema).optional().nullable(),
    instructions: z.string().max(1000).optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// ============================================
// GALLERY SCHEMAS
// ============================================

export const galleryCategories = ["campus", "friends", "events"] as const;

export const createGalleryImageSchema = z.object({
    category: z.enum(["campus", "friends", "events"]).refine(
        (val) => galleryCategories.includes(val as typeof galleryCategories[number]),
        { message: "Categoría inválida. Use: campus, friends, events" }
    ),
    label: z.string()
        .min(2, "La etiqueta debe tener al menos 2 caracteres")
        .max(100, "La etiqueta no puede exceder 100 caracteres"),
    order: z.number().int().min(0).default(0),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;

// ============================================
// CONTRIBUTOR SCHEMAS
// ============================================

export const createContributorSchema = z.object({
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    amount: z.number()
        .min(0.01, "El monto debe ser mayor a 0"),
    description: z.string()
        .max(300, "La descripción no puede exceder 300 caracteres")
        .optional()
        .nullable(),
    isAnonymous: z.boolean().default(false),
});

export const updateContributorSchema = createContributorSchema.partial();

export type CreateContributorInput = z.infer<typeof createContributorSchema>;
export type UpdateContributorInput = z.infer<typeof updateContributorSchema>;

// ============================================
// TICKET SALE SCHEMAS
// ============================================

export const paymentMethods = ["yape", "plin", "efectivo", "transferencia"] as const;
export const saleStatuses = ["pending", "confirmed", "cancelled"] as const;

export const createTicketSaleSchema = z.object({
    buyerName: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    buyerPhone: z.string()
        .regex(/^[0-9]{9}$/, "El teléfono debe tener 9 dígitos")
        .optional()
        .nullable(),
    buyerEmail: z.string()
        .email("Email inválido")
        .optional()
        .nullable(),
    quantity: z.number()
        .int("La cantidad debe ser un número entero")
        .min(1, "Debe comprar al menos 1 entrada"),
    paymentMethod: z.enum(paymentMethods).default("yape"),
    status: z.enum(saleStatuses).default("confirmed"),
    notes: z.string().max(500).optional().nullable(),
});

export const updateTicketSaleSchema = createTicketSaleSchema.partial();

export type CreateTicketSaleInput = z.infer<typeof createTicketSaleSchema>;
export type UpdateTicketSaleInput = z.infer<typeof updateTicketSaleSchema>;

// ============================================
// SETTINGS SCHEMAS
// ============================================

export const updateFundSettingsSchema = z.object({
    goal: z.number().min(0).optional(),
    weeklyAmount: z.number().min(0).optional(),
    maxWeeks: z.number().int().min(1).optional(),
});

export const updateSiteSettingsSchema = z.object({
    siteName: z.string().max(100).optional(),
    siteDescription: z.string().max(500).optional(),
    contactEmail: z.string().email().optional().nullable(),
    contactPhone: z.string().optional().nullable(),
    socialFacebook: z.string().url().optional().nullable(),
    socialInstagram: z.string().url().optional().nullable(),
});

export type UpdateFundSettingsInput = z.infer<typeof updateFundSettingsSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
    email: z.string()
        .email("Email inválido"),
    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// HELPER: Parse and validate
// ============================================

/**
 * Validates data against a Zod schema and returns the result
 */
export function validateData<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    
    if (!result.success) {
        const errors = result.error.issues.map((e: { message: string }) => e.message).join(", ");
        return { success: false, error: errors };
    }
    
    return { success: true, data: result.data };
}
