"use client";

import { useState, useEffect, useRef } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Upload,
    Search,
    Trash2,
    Image as ImageIcon,
    Filter,
    X,
    Loader2,
} from "lucide-react";

interface GalleryImage {
    id: string;
    url: string;
    publicId: string;
    category: string;
    label: string;
    order: number;
    isActive: boolean;
}

const CATEGORIES = [
    { id: "all", label: "Todas" },
    { id: "campus", label: "Campus" },
    { id: "friends", label: "Compañeros" },
    { id: "events", label: "Eventos" },
];

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [uploadProgress, setUploadProgress] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch images
    const fetchImages = async () => {
        try {
            const res = await fetch("/api/admin/gallery");
            const data = await res.json();
            setImages(data.images || []);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Filter images
    const filteredImages = images.filter((image) => {
        const matchesSearch = image.label
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || image.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Handle file upload
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress([]);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress((prev) => [...prev, `Subiendo ${file.name}...`]);

            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("category", selectedCategory === "all" ? "events" : selectedCategory);
                formData.append("label", file.name.replace(/\.[^/.]+$/, ""));

                const res = await fetch("/api/admin/gallery", {
                    method: "POST",
                    body: formData,
                });

                if (res.ok) {
                    setUploadProgress((prev) => [
                        ...prev.slice(0, -1),
                        `✓ ${file.name} subido correctamente`,
                    ]);
                } else {
                    setUploadProgress((prev) => [
                        ...prev.slice(0, -1),
                        `✗ Error al subir ${file.name}`,
                    ]);
                }
            } catch (error) {
                setUploadProgress((prev) => [
                    ...prev.slice(0, -1),
                    `✗ Error al subir ${file.name}`,
                ]);
            }
        }

        fetchImages();
        setIsUploading(false);

        // Clear progress after 3 seconds
        setTimeout(() => setUploadProgress([]), 3000);
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

        try {
            await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
            fetchImages();
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div>
            <AdminHeader
                title="Galería de Imágenes"
                subtitle="Sube y administra las fotos de la promoción"
            />

            <div className="p-8">
                {/* Actions Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar imágenes..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id
                                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                        : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 transition-all"
                    >
                        {isUploading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Upload size={20} />
                        )}
                        Subir Imágenes
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                    />
                </div>

                {/* Upload Progress */}
                {uploadProgress.length > 0 && (
                    <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                        {uploadProgress.map((msg, index) => (
                            <p
                                key={index}
                                className={`text-sm ${msg.startsWith("✓")
                                        ? "text-emerald-400"
                                        : msg.startsWith("✗")
                                            ? "text-red-400"
                                            : "text-slate-400"
                                    }`}
                            >
                                {msg}
                            </p>
                        ))}
                    </div>
                )}

                {/* Image Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-20">
                        <ImageIcon size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">
                            {searchQuery || selectedCategory !== "all"
                                ? "No se encontraron imágenes"
                                : "No hay imágenes en la galería"}
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            Subir la primera imagen →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredImages.map((image) => (
                            <div
                                key={image.id}
                                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700"
                            >
                                <img
                                    src={image.url}
                                    alt={image.label}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-white text-sm font-medium truncate">
                                            {image.label}
                                        </p>
                                        <p className="text-slate-400 text-xs capitalize">
                                            {image.category}
                                        </p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Category Badge */}
                                <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded-md capitalize">
                                    {image.category}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
