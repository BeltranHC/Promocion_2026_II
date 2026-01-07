import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "Promoción 2026 | EPIEI - UNA Puno",
    description: "Página oficial de la Promoción 2026 de la Escuela Profesional de Ingeniería Estadística e Informática - Universidad Nacional del Altiplano, Puno.",
    keywords: ["promoción 2026", "UNA Puno", "EPIEI", "ingeniería estadística", "ingeniería informática", "universidad nacional del altiplano", "graduación"],
    authors: [{ name: "Promoción 2026 - EPIEI" }],
    openGraph: {
        title: "Promoción 2026 | EPIEI - UNA Puno",
        description: "Página oficial de la Promoción 2026 - Ingeniería Estadística e Informática",
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
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
