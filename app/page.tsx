"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

// Cargar componentes con animaciones de forma dinámica para evitar problemas de hidratación
const InfoSection = dynamic(() => import("@/components/InfoSection"), {
    ssr: false,
    loading: () => <div className="min-h-[50vh]" />
});

const EventsSection = dynamic(() => import("@/components/EventsSection"), {
    ssr: false,
    loading: () => <div className="min-h-[50vh]" />
});

const GallerySection = dynamic(() => import("@/components/GallerySection"), {
    ssr: false,
    loading: () => <div className="min-h-[50vh]" />
});

const FundSection = dynamic(() => import("@/components/FundSection"), {
    ssr: false,
    loading: () => <div className="min-h-[50vh]" />
});

export default function Home() {
    return (
        <div className="bg-animated min-h-screen">
            <Hero />
            <InfoSection />
            <EventsSection />
            <GallerySection />
            <FundSection />
        </div>
    );
}
