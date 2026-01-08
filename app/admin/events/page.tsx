"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Calendar,
    CheckCircle,
    Clock,
    X,
    Save,
} from "lucide-react";

interface Event {
    id: string;
    date: string;
    year: string;
    title: string;
    description: string;
    status: string;
    icon: string;
    order: number;
    isActive: boolean;
}

// Modal Component
function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Event Form Component
function EventForm({
    event,
    onSave,
    onCancel,
    isLoading,
}: {
    event?: Event;
    onSave: (data: Partial<Event>) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        date: event?.date || "",
        year: event?.year || "2026",
        title: event?.title || "",
        description: event?.description || "",
        status: event?.status || "upcoming",
        icon: event?.icon || "📅",
    });

    const icons = ["📅", "📸", "🎓", "🎉", "🏖️", "🎩", "🎭", "🎪", "🎨", "🎯"];

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave(formData);
            }}
            className="space-y-5"
        >
            {/* Title */}
            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Título del Evento
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ej: Sesión de Fotos Oficial"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                />
            </div>

            {/* Date & Year */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Fecha
                    </label>
                    <input
                        type="text"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        placeholder="Ej: 15 Mar"
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                    />
                </div>
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Año
                    </label>
                    <input
                        type="text"
                        value={formData.year}
                        onChange={(e) =>
                            setFormData({ ...formData, year: e.target.value })
                        }
                        placeholder="2026"
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Descripción
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe el evento..."
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none"
                />
            </div>

            {/* Status */}
            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Estado
                </label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="upcoming"
                            checked={formData.status === "upcoming"}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value })
                            }
                            className="w-4 h-4 text-amber-500"
                        />
                        <Clock size={16} className="text-amber-400" />
                        <span className="text-slate-300 text-sm">Próximo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="past"
                            checked={formData.status === "past"}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value })
                            }
                            className="w-4 h-4 text-amber-500"
                        />
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span className="text-slate-300 text-sm">Pasado</span>
                    </label>
                </div>
            </div>

            {/* Icon Selector */}
            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Icono
                </label>
                <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon })}
                            className={`w-10 h-10 text-xl rounded-lg flex items-center justify-center transition-all ${formData.icon === icon
                                    ? "bg-amber-500/20 border-2 border-amber-500"
                                    : "bg-slate-800 border border-slate-700 hover:border-slate-600"
                                }`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            {event ? "Guardar Cambios" : "Crear Evento"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | undefined>();
    const [isSaving, setIsSaving] = useState(false);

    // Fetch events
    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/admin/events");
            const data = await res.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events
    const filteredEvents = events.filter(
        (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle save
    const handleSave = async (data: Partial<Event>) => {
        setIsSaving(true);
        try {
            const url = editingEvent
                ? `/api/admin/events/${editingEvent.id}`
                : "/api/admin/events";
            const method = editingEvent ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                fetchEvents();
                setIsModalOpen(false);
                setEditingEvent(undefined);
            }
        } catch (error) {
            console.error("Error saving event:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este evento?")) return;

        try {
            await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <div>
            <AdminHeader
                title="Gestión de Eventos"
                subtitle="Crea, edita y administra los eventos de la promoción"
            />

            <div className="p-8">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                            placeholder="Buscar eventos..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => {
                            setEditingEvent(undefined);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                    >
                        <Plus size={20} />
                        Nuevo Evento
                    </button>
                </div>

                {/* Events List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">
                            {searchQuery
                                ? "No se encontraron eventos"
                                : "No hay eventos creados"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 text-amber-400 hover:text-amber-300 transition-colors"
                            >
                                Crear el primer evento →
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                                        {event.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white truncate">
                                                {event.title}
                                            </h3>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.status === "upcoming"
                                                        ? "bg-amber-500/20 text-amber-400"
                                                        : "bg-emerald-500/20 text-emerald-400"
                                                    }`}
                                            >
                                                {event.status === "upcoming"
                                                    ? "Próximo"
                                                    : "Pasado"}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                                            {event.description}
                                        </p>
                                        <p className="text-slate-500 text-sm">
                                            📅 {event.date}, {event.year}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => {
                                                setEditingEvent(event);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingEvent(undefined);
                }}
                title={editingEvent ? "Editar Evento" : "Nuevo Evento"}
            >
                <EventForm
                    event={editingEvent}
                    onSave={handleSave}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingEvent(undefined);
                    }}
                    isLoading={isSaving}
                />
            </Modal>
        </div>
    );
}
