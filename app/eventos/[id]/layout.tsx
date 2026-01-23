import type { Metadata } from "next";
import prisma from "@/lib/db";
import { getEventSchema, generateJsonLd } from "@/lib/seo";

interface EventPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const { id } = await params;
    
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                images: {
                    take: 1,
                    orderBy: { order: "asc" }
                }
            }
        });

        if (!event) {
            return {
                title: "Evento no encontrado | Promoción 2026-II",
                description: "El evento que buscas no existe o ha sido eliminado.",
            };
        }

        const eventImage = event.images[0]?.url || "/images/logo-epiei.png";
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://promocion2026.vercel.app";

        return {
            title: `${event.title} | Promoción 2026-II`,
            description: event.description,
            openGraph: {
                title: event.title,
                description: event.description,
                type: "website",
                url: `${siteUrl}/eventos/${id}`,
                images: [
                    {
                        url: eventImage,
                        width: 1200,
                        height: 630,
                        alt: event.title,
                    },
                ],
                locale: "es_PE",
                siteName: "Promoción 2026-II EPIEI",
            },
            twitter: {
                card: "summary_large_image",
                title: event.title,
                description: event.description,
                images: [eventImage],
            },
        };
    } catch {
        return {
            title: "Evento | Promoción 2026-II",
            description: "Página de evento de la Promoción 2026-II EPIEI UNA Puno",
        };
    }
}

export default async function EventLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    let eventSchema = null;
    
    try {
        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (event) {
            eventSchema = getEventSchema({
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                year: event.year,
                time: event.time || undefined,
                location: event.location || undefined,
                ticketPrice: event.ticketPrice || undefined,
            });
        }
    } catch {
        // Silently fail - schema is optional
    }

    return (
        <>
            {eventSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: generateJsonLd(eventSchema) }}
                />
            )}
            {children}
        </>
    );
}
