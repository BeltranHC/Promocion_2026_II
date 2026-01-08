"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Image from "next/image";
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
    MapPin,
    DollarSign,
    Ticket,
    ImageIcon,
    Upload,
    List,
    FileText,
    BarChart3,
} from "lucide-react";

interface EventImage {
    id: string;
    url: string;
    publicId: string;
    caption?: string;
    order: number;
}

interface ScheduleItem {
    time: string;
    activity: string;
}

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
    fullDescription?: string;
    location?: string;
    time?: string;
    ticketPrice?: number;
    maxTickets?: number;
    hasTickets?: boolean;
    schedule?: ScheduleItem[];
    instructions?: string;
    images?: EventImage[];
}

// Modal Component
function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "default",
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "default" | "large";
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`relative bg-slate-900 border border-slate-700 rounded-2xl mx-4 max-h-[90vh] overflow-hidden ${size === "large" ? "w-full max-w-4xl" : "w-full max-w-lg"}`}>
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
    // Helper para convertir fecha del evento a formato date input
    const getEventDateValue = () => {
        if (event?.date && event?.year) {
            // Intentar parsear "15 Mar" + "2026" a "2026-03-15"
            const months: { [key: string]: string } = {
                'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04',
                'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08',
                'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dic': '12'
            };
            const parts = event.date.split(' ');
            if (parts.length === 2) {
                const day = parts[0].padStart(2, '0');
                const month = months[parts[1]] || '01';
                return `${event.year}-${month}-${day}`;
            }
        }
        return "";
    };

    const [formData, setFormData] = useState({
        eventDate: getEventDateValue(),
        title: event?.title || "",
        description: event?.description || "",
        status: event?.status || "upcoming",
        icon: event?.icon || "📅",
        fullDescription: event?.fullDescription || "",
        location: event?.location || "",
        time: event?.time || "",
        ticketPrice: event?.ticketPrice?.toString() || "",
        maxTickets: event?.maxTickets?.toString() || "",
        hasTickets: event?.hasTickets || false,
        instructions: event?.instructions || "",
    });

    const [schedule, setSchedule] = useState<ScheduleItem[]>(
        event?.schedule || []
    );

    const [activeTab, setActiveTab] = useState<"basic" | "details" | "schedule">("basic");

    const icons = ["📅", "🍗", "🎉", "🎃", "🎓", "📸", "🏖️", "🎩", "🎭", "🎪", "🎨", "🎯", "🎵", "🍺", "🥳"];

    // Helper para formatear fecha para guardar
    const formatDateForSave = (dateStr: string) => {
        if (!dateStr) return { date: "", year: "" };
        const d = new Date(dateStr + 'T00:00:00');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return {
            date: `${d.getDate()} ${months[d.getMonth()]}`,
            year: d.getFullYear().toString()
        };
    };

    const addScheduleItem = () => {
        setSchedule([...schedule, { time: "", activity: "" }]);
    };

    const removeScheduleItem = (index: number) => {
        setSchedule(schedule.filter((_, i) => i !== index));
    };

    const updateScheduleItem = (index: number, field: keyof ScheduleItem, value: string) => {
        const updated = [...schedule];
        updated[index][field] = value;
        setSchedule(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { date, year } = formatDateForSave(formData.eventDate);
        onSave({
            date,
            year,
            title: formData.title,
            description: formData.description,
            status: formData.status,
            icon: formData.icon,
            fullDescription: formData.fullDescription,
            location: formData.location,
            time: formData.time,
            ticketPrice: formData.ticketPrice ? parseFloat(formData.ticketPrice) : undefined,
            maxTickets: formData.maxTickets ? parseInt(formData.maxTickets) : undefined,
            hasTickets: formData.hasTickets,
            instructions: formData.instructions,
            schedule: schedule.filter(s => s.time && s.activity),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-700 pb-4">
                <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "basic" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-white"}`}
                >
                    Información Básica
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "details" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-white"}`}
                >
                    Detalles
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("schedule")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "schedule" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-white"}`}
                >
                    Cronograma
                </button>
            </div>

            {/* Basic Info Tab */}
            {activeTab === "basic" && (
                <div className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            Título del Evento *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Pollada Pro-Fondos"
                            required
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Fecha del Evento *
                            </label>
                            <input
                                type="date"
                                value={formData.eventDate}
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Hora
                            </label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            Descripción Corta *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Breve descripción para la vista previa..."
                            required
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none"
                        />
                    </div>

                    {/* Status & Icon */}
                    <div className="grid grid-cols-2 gap-4">
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
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-4 h-4 text-amber-500"
                                    />
                                    <CheckCircle size={16} className="text-emerald-400" />
                                    <span className="text-slate-300 text-sm">Pasado</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Icono
                            </label>
                            <div className="flex flex-wrap gap-1">
                                {icons.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon })}
                                        className={`w-8 h-8 text-lg rounded-lg flex items-center justify-center transition-all ${formData.icon === icon
                                            ? "bg-amber-500/20 border-2 border-amber-500"
                                            : "bg-slate-800 border border-slate-700 hover:border-slate-600"
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
                <div className="space-y-5">
                    {/* Location */}
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            <MapPin size={14} className="inline mr-1" />
                            Lugar del Evento
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Ej: Patio Central de la UNA Puno"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                        />
                    </div>

                    {/* Full Description */}
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            <FileText size={14} className="inline mr-1" />
                            Descripción Completa
                        </label>
                        <textarea
                            value={formData.fullDescription}
                            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                            placeholder="Descripción detallada del evento..."
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none"
                        />
                    </div>

                    {/* Tickets Section */}
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                        <label className="flex items-center gap-2 cursor-pointer mb-4">
                            <input
                                type="checkbox"
                                checked={formData.hasTickets}
                                onChange={(e) => setFormData({ ...formData, hasTickets: e.target.checked })}
                                className="w-4 h-4 rounded text-amber-500"
                            />
                            <Ticket size={16} className="text-amber-400" />
                            <span className="text-slate-300 text-sm font-medium">Este evento tiene venta de entradas</span>
                        </label>

                        {formData.hasTickets && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        <DollarSign size={14} className="inline mr-1" />
                                        Precio (S/.)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.ticketPrice}
                                        onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                                        placeholder="15.00"
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Entradas Disponibles
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxTickets}
                                        onChange={(e) => setFormData({ ...formData, maxTickets: e.target.value })}
                                        placeholder="100"
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            <List size={14} className="inline mr-1" />
                            Indicaciones para Asistentes
                        </label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            placeholder="• Traer DNI&#10;• Llegar 15 minutos antes&#10;• Código de vestimenta: casual"
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none"
                        />
                    </div>
                </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
                <div className="space-y-4">
                    <p className="text-slate-400 text-sm">
                        Define el cronograma del evento. Agrega cada actividad con su hora correspondiente.
                    </p>

                    {schedule.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <input
                                type="text"
                                value={item.time}
                                onChange={(e) => updateScheduleItem(index, "time", e.target.value)}
                                placeholder="18:00"
                                className="w-24 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                            />
                            <input
                                type="text"
                                value={item.activity}
                                onChange={(e) => updateScheduleItem(index, "activity", e.target.value)}
                                placeholder="Actividad..."
                                className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeScheduleItem(index)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addScheduleItem}
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 rounded-lg transition-colors w-full justify-center"
                    >
                        <Plus size={18} />
                        Agregar Actividad
                    </button>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-700">
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

// Image Manager Component
function ImageManager({
    event,
    onImageUploaded,
    onImageDeleted,
}: {
    event: Event;
    onImageUploaded: () => void;
    onImageDeleted: () => void;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            await fetch(`/api/admin/events/${event.id}/images`, {
                method: "POST",
                body: formData,
            });

            onImageUploaded();
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDelete = async (imageId: string) => {
        if (!confirm("¿Eliminar esta imagen?")) return;

        try {
            await fetch(`/api/admin/events/${event.id}/images?imageId=${imageId}`, {
                method: "DELETE",
            });
            onImageDeleted();
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    Imágenes del Evento
                </h3>
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-amber-400 rounded-lg cursor-pointer transition-colors">
                    {isUploading ? (
                        <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                    ) : (
                        <Upload size={18} />
                    )}
                    <span className="text-sm">Subir Imagen</span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>
            </div>

            {event.images && event.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {event.images.map((image) => (
                        <div key={image.id} className="relative group aspect-video rounded-lg overflow-hidden bg-slate-800">
                            <Image
                                src={image.url}
                                alt={image.caption || "Imagen del evento"}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
                    <ImageIcon size={40} className="mx-auto text-slate-600 mb-2" />
                    <p className="text-slate-400 text-sm">No hay imágenes</p>
                </div>
            )}
        </div>
    );
}

export default function AdminEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | undefined>();
    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
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
        if (!confirm("¿Estás seguro de eliminar este evento? Se eliminarán también todas sus imágenes.")) return;

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
                                                {event.status === "upcoming" ? "Próximo" : "Pasado"}
                                            </span>
                                            {event.hasTickets && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                                                    <Ticket size={12} className="inline mr-1" />
                                                    S/. {event.ticketPrice}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                                            <span>📅 {event.date}, {event.year}</span>
                                            {event.time && <span>🕐 {event.time}</span>}
                                            {event.location && <span className="truncate">📍 {event.location}</span>}
                                            {event.images && event.images.length > 0 && (
                                                <span>🖼️ {event.images.length} imagen(es)</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        {event.hasTickets && (
                                            <button
                                                onClick={() => router.push(`/admin/events/${event.id}/sales`)}
                                                className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                title="Ver ventas de entradas"
                                            >
                                                <BarChart3 size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setIsImageModalOpen(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                            title="Gestionar imágenes"
                                        >
                                            <ImageIcon size={18} />
                                        </button>
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
                size="large"
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

            {/* Images Modal */}
            <Modal
                isOpen={isImageModalOpen}
                onClose={() => {
                    setIsImageModalOpen(false);
                    setSelectedEvent(undefined);
                }}
                title={`Imágenes: ${selectedEvent?.title || ""}`}
                size="large"
            >
                {selectedEvent && (
                    <ImageManager
                        event={selectedEvent}
                        onImageUploaded={() => {
                            fetchEvents();
                            // Refresh selected event
                            const updated = events.find(e => e.id === selectedEvent.id);
                            if (updated) setSelectedEvent(updated);
                        }}
                        onImageDeleted={() => {
                            fetchEvents();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}
