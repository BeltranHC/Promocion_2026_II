// SEO Structured Data Schemas
// Using Schema.org JSON-LD format

interface SchemaBase {
    "@context": string;
    "@type": string;
}

interface Organization extends SchemaBase {
    "@type": "Organization";
    name: string;
    description: string;
    url: string;
    logo: string;
    foundingDate: string;
    address: {
        "@type": "PostalAddress";
        addressLocality: string;
        addressRegion: string;
        addressCountry: string;
    };
    parentOrganization: {
        "@type": "EducationalOrganization";
        name: string;
        url: string;
    };
}

interface WebSite extends SchemaBase {
    "@type": "WebSite";
    name: string;
    description: string;
    url: string;
    inLanguage: string;
    publisher: {
        "@type": "Organization";
        name: string;
    };
}

interface SchemaEvent extends SchemaBase {
    "@type": "Event";
    name: string;
    description: string;
    startDate: string;
    eventStatus: string;
    eventAttendanceMode: string;
    location?: {
        "@type": "Place";
        name: string;
        address: {
            "@type": "PostalAddress";
            addressLocality: string;
            addressCountry: string;
        };
    };
    organizer: {
        "@type": "Organization";
        name: string;
        url: string;
    };
    offers?: {
        "@type": "Offer";
        price: number;
        priceCurrency: string;
        availability: string;
        url: string;
    };
}

// Organization structured data
export function getOrganizationSchema(): Organization {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Promoción 2026-II EPIEI UNA Puno",
        description: "Promoción 2026-II de la Escuela Profesional de Ingeniería Estadística e Informática de la Universidad Nacional del Altiplano, Puno",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://promocion2026.vercel.app",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/logo-epiei.png`,
        foundingDate: "2021",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Puno",
            addressRegion: "Puno",
            addressCountry: "PE"
        },
        parentOrganization: {
            "@type": "EducationalOrganization",
            name: "Universidad Nacional del Altiplano",
            url: "https://www.unap.edu.pe"
        }
    };
}

// Website structured data
export function getWebsiteSchema(): WebSite {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Promoción 2026-II EPIEI",
        description: "Página oficial de la Promoción 2026-II de Ingeniería Estadística e Informática",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://promocion2026.vercel.app",
        inLanguage: "es-PE",
        publisher: {
            "@type": "Organization",
            name: "Promoción 2026-II EPIEI UNA Puno"
        }
    };
}

// Event structured data generator
export function getEventSchema(event: {
    title: string;
    description: string;
    date: string;
    year: string;
    time?: string;
    location?: string;
    ticketPrice?: number;
    id: string;
}): SchemaEvent {
    const eventDate = new Date(`${event.date} ${event.year}`);
    
    const schema: SchemaEvent = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: eventDate.toISOString(),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        organizer: {
            "@type": "Organization",
            name: "Promoción 2026-II EPIEI UNA Puno",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://promocion2026.vercel.app"
        }
    };

    if (event.location) {
        schema.location = {
            "@type": "Place",
            name: event.location,
            address: {
                "@type": "PostalAddress",
                addressLocality: "Puno",
                addressCountry: "PE"
            }
        };
    }

    if (event.ticketPrice) {
        schema.offers = {
            "@type": "Offer",
            price: event.ticketPrice,
            priceCurrency: "PEN",
            availability: "https://schema.org/InStock",
            url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/eventos/${event.id}`
        };
    }

    return schema;
}

// JSON-LD Script component helper
export function generateJsonLd<T>(data: T): string {
    return JSON.stringify(data, null, 0);
}
