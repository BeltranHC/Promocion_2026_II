"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

// Placeholder gallery images - replace with actual photos later
const galleryImages = [
    { id: 1, category: "campus", color: "from-electric-blue to-cyber-purple" },
    { id: 2, category: "friends", color: "from-cyber-purple to-neon-pink" },
    { id: 3, category: "events", color: "from-neon-pink to-neon-green" },
    { id: 4, category: "campus", color: "from-neon-green to-electric-blue" },
    { id: 5, category: "friends", color: "from-electric-blue to-neon-pink" },
    { id: 6, category: "events", color: "from-cyber-purple to-neon-green" },
];

const categories = [
    { id: "all", label: "Todas" },
    { id: "campus", label: "Campus" },
    { id: "friends", label: "Compañeros" },
    { id: "events", label: "Eventos" },
];

function GalleryItem({ image, index }: { image: typeof galleryImages[0]; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl"
        >
            {/* Placeholder Gradient Background */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${image.color} opacity-80`}
            />

            {/* Placeholder Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl opacity-50">📷</span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-deep-space/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-electric-blue/20 flex items-center justify-center mx-auto mb-3 border border-electric-blue/50">
                        <svg
                            className="w-5 h-5 text-electric-blue"
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
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-electric-blue/50 rounded-2xl transition-all duration-300" />
        </motion.div>
    );
}

export default function GallerySection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredImages =
        activeCategory === "all"
            ? galleryImages
            : galleryImages.filter((img) => img.category === activeCategory);

    return (
        <section id="galeria" className="py-24 px-6 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-space/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative" ref={ref}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">
                        <span className="gradient-text">Galería de Fotos</span>
                    </h2>
                    <div className="line-glow" />
                    <p className="section-subtitle">
                        Los mejores momentos de nuestra promoción capturados en imágenes
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                                    ? "bg-gradient-to-r from-electric-blue to-cyber-purple text-white shadow-glow-blue"
                                    : "glass text-white/60 hover:text-white hover:border-electric-blue/30"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </motion.div>

                {/* Gallery Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                >
                    {filteredImages.map((image, index) => (
                        <GalleryItem key={image.id} image={image} index={index} />
                    ))}
                </motion.div>

                {/* Empty State Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <p className="text-white/40 text-sm">
                        Las fotos reales se agregarán próximamente 📸
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center mt-8"
                >
                    <button className="neon-button">
                        Subir Fotos
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
