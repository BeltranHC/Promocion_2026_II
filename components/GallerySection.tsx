"use client";

import { useState } from "react";
import AnimateOnScroll from "./AnimateOnScroll";

// Placeholder gallery images - replace with actual photos later
const galleryImages = [
    { id: 1, category: "campus", color: "from-una-red to-una-gold", label: "Campus UNA" },
    { id: 2, category: "friends", color: "from-una-gold to-una-blue", label: "Compañeros" },
    { id: 3, category: "events", color: "from-una-blue to-una-cyan", label: "Eventos" },
    { id: 4, category: "campus", color: "from-una-cyan to-una-green", label: "Campus UNA" },
    { id: 5, category: "friends", color: "from-una-green to-una-gold", label: "Compañeros" },
    { id: 6, category: "events", color: "from-una-red to-una-blue", label: "Eventos" },
];

const categories = [
    { id: "all", label: "Todas" },
    { id: "campus", label: "Campus" },
    { id: "friends", label: "Compañeros" },
    { id: "events", label: "Eventos" },
];

function GalleryItem({ image, index }: { image: typeof galleryImages[0]; index: number }) {
    return (
        <AnimateOnScroll animation="scale-in" delay={index * 100}>
            <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl">
                {/* Placeholder Gradient Background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${image.color} opacity-80`}
                />

                {/* Placeholder Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl opacity-50">📷</span>
                    <span className="text-xs text-white/50 mt-2">{image.label}</span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-dark-bg/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-una-gold/20 flex items-center justify-center mx-auto mb-3 border border-una-gold/50">
                            <svg
                                className="w-5 h-5 text-una-gold"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                            </svg>
                        </div>
                        <span className="text-sm text-white/80">Ver Foto</span>
                    </div>
                </div>

                {/* Glow Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-una-gold/50 rounded-2xl transition-all duration-300" />
            </div>
        </AnimateOnScroll>
    );
}

export default function GallerySection() {
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredImages =
        activeCategory === "all"
            ? galleryImages
            : galleryImages.filter((img) => img.category === activeCategory);

    return (
        <section id="galeria" className="py-24 px-6 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-card/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                {/* Section Header */}
                <AnimateOnScroll animation="fade-in" className="text-center mb-12">
                    <h2 className="section-title">
                        <span className="gradient-text">Galería de Fotos</span>
                    </h2>
                    <div className="line-glow" />
                    <p className="section-subtitle">
                        Los mejores momentos de nuestra promoción capturados en imágenes
                    </p>
                </AnimateOnScroll>

                {/* Category Filter */}
                <AnimateOnScroll animation="fade-in-up" className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                                ? "bg-gradient-to-r from-una-red to-una-gold text-white shadow-glow-gold"
                                : "glass text-white/60 hover:text-white hover:border-una-gold/30"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </AnimateOnScroll>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {filteredImages.map((image, index) => (
                        <GalleryItem key={image.id} image={image} index={index} />
                    ))}
                </div>

                {/* Empty State Message */}
                <AnimateOnScroll animation="fade-in" className="text-center mt-12">
                    <p className="text-white/40 text-sm">
                        Las fotos reales se agregarán próximamente 📸
                    </p>
                </AnimateOnScroll>

                {/* CTA */}
                <AnimateOnScroll animation="fade-in-up" delay={300} className="text-center mt-8">
                    <button className="neon-button">
                        Subir Fotos
                    </button>
                </AnimateOnScroll>
            </div>
        </section>
    );
}
