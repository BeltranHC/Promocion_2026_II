import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "sonner";
import { getOrganizationSchema, getWebsiteSchema, generateJsonLd } from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "Promoción 2026 - II | EPIEI - UNA Puno",
    description: "Página oficial de la Promoción 2026 - II de la Escuela Profesional de Ingeniería Estadística e Informática - Universidad Nacional del Altiplano, Puno.",
    keywords: ["promoción 2026", "UNA Puno", "EPIEI", "ingeniería estadística", "ingeniería informática", "universidad nacional del altiplano", "graduación"],
    authors: [{ name: "Promoción 2026 - II - EPIEI" }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://promocion2026.vercel.app"),
    openGraph: {
        title: "Promoción 2026 - II | EPIEI - UNA Puno",
        description: "Página oficial de la Promoción 2026 - II - Ingeniería Estadística e Informática",
        type: "website",
        locale: "es_PE",
        siteName: "Promoción 2026-II EPIEI",
    },
    twitter: {
        card: "summary_large_image",
        title: "Promoción 2026 - II | EPIEI - UNA Puno",
        description: "Página oficial de la Promoción 2026 - II - Ingeniería Estadística e Informática",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const organizationSchema = getOrganizationSchema();
    const websiteSchema = getWebsiteSchema();

    return (
        <html lang="es" className="scroll-smooth">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: generateJsonLd(organizationSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: generateJsonLd(websiteSchema) }}
                />
            </head>
            <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
                <LayoutWrapper>{children}</LayoutWrapper>
                <Toaster 
                    position="top-right"
                    richColors
                    closeButton
                    duration={4000}
                    toastOptions={{
                        style: {
                            background: "rgb(15 23 42)",
                            border: "1px solid rgb(51 65 85)",
                            color: "white",
                        },
                    }}
                />
            </body>
        </html>
    );
}

