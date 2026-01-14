import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "Promoción 2026 - II | EPIEI - UNA Puno",
    description: "Página oficial de la Promoción 2026 - II de la Escuela Profesional de Ingeniería Estadística e Informática - Universidad Nacional del Altiplano, Puno.",
    keywords: ["promoción 2026", "UNA Puno", "EPIEI", "ingeniería estadística", "ingeniería informática", "universidad nacional del altiplano", "graduación"],
    authors: [{ name: "Promoción 2026 - II - EPIEI" }],
    openGraph: {
        title: "Promoción 2026 - II | EPIEI - UNA Puno",
        description: "Página oficial de la Promoción 2026 - II - Ingeniería Estadística e Informática",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="scroll-smooth">
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

