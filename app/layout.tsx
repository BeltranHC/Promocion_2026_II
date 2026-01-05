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
    title: "Promoción 2026 | Universidad",
    description: "Página oficial de la Promoción 2026. Eventos, fotos, información y aportes de nuestra promoción universitaria.",
    keywords: ["promoción 2026", "universidad", "graduación", "eventos universitarios"],
    authors: [{ name: "Promoción 2026" }],
    openGraph: {
        title: "Promoción 2026 | Universidad",
        description: "Página oficial de la Promoción 2026",
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
