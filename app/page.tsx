import Hero from "@/components/Hero";
import InfoSection from "@/components/InfoSection";
import EventsSection from "@/components/EventsSection";
import GallerySection from "@/components/GallerySection";
import FundSection from "@/components/FundSection";

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
