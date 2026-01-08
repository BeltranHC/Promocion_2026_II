"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Calendar,
    Clock,
    MapPin,
    Ticket,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    AlertCircle,
    Minus,
    Plus,
    Share2,
    Users,
} from "lucide-react";

interface EventImage {
    id: string;
    url: string;
    caption?: string;
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

// WhatsApp number
const WHATSAPP_NUMBER = "51926465929";

export default function EventDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [ticketCount, setTicketCount] = useState(1);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${id}`);
                if (!res.ok) {
                    throw new Error("Evento no encontrado");
                }
                const data = await res.json();
                setEvent(data.event);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar evento");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // Auto-slide de imágenes cada 4 segundos
    useEffect(() => {
        if (!event?.images || event.images.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % event.images!.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [event?.images]);

    const nextImage = () => {
        if (event?.images) {
            setCurrentImageIndex((prev) => (prev + 1) % event.images!.length);
        }
    };

    const prevImage = () => {
        if (event?.images) {
            setCurrentImageIndex((prev) => (prev - 1 + event.images!.length) % event.images!.length);
        }
    };

    const generateWhatsAppMessage = () => {
        if (!event) return "";
        
        const message = `¡Hola! 👋 Estoy interesado/a en adquirir *${ticketCount} entrada(s)* para el evento *"${event.title}"* del ${event.date}, ${event.year}.${event.ticketPrice ? `\n\nPrecio por entrada: S/. ${event.ticketPrice}\nTotal: S/. ${(event.ticketPrice * ticketCount).toFixed(2)}` : ""}\n\n¿Podrían darme más información sobre cómo realizar el pago? ¡Gracias!`;
        
        return encodeURIComponent(message);
    };

    const openWhatsApp = () => {
        const message = generateWhatsAppMessage();
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    const shareEvent = () => {
        if (navigator.share) {
            navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-una-dark flex items-center justify-center pt-20">
                <div className="w-12 h-12 border-4 border-una-gold/30 border-t-una-gold rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-una-dark flex flex-col items-center justify-center px-6 pt-20">
                <div className="text-6xl mb-4">😕</div>
                <h1 className="text-2xl font-bold text-white mb-2">Evento no encontrado</h1>
                <p className="text-white/60 mb-6">{error || "El evento que buscas no existe"}</p>
                <Link
                    href="/#eventos"
                    className="flex items-center gap-2 px-6 py-3 bg-una-gold text-una-dark font-semibold rounded-full hover:bg-una-gold/90 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Volver a eventos
                </Link>
            </div>
        );
    }

    const hasImages = event.images && event.images.length > 0;

    return (
        <div className="min-h-screen bg-una-dark pt-20">
            {/* Hero Section */}
            <div className="relative">
                {/* Image Gallery */}
                <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                    {hasImages ? (
                        <>
                            <Image
                                src={event.images![currentImageIndex].url}
                                alt={event.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-una-dark via-una-dark/40 to-una-dark/20" />
                            
                            {/* Image Navigation */}
                            {event.images!.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors z-10"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors z-10"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                    
                                    {/* Dots */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                        {event.images!.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-una-gold w-8" : "bg-white/50 w-2"}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-una-red/30 via-una-dark to-una-gold/20 flex items-center justify-center">
                            <motion.span 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-[120px] md:text-[180px]"
                            >
                                {event.icon}
                            </motion.span>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <Link
                    href="/#eventos"
                    className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="hidden sm:inline">Volver</span>
                </Link>

                {/* Share Button */}
                <button
                    onClick={shareEvent}
                    className="absolute top-4 right-4 z-20 p-3 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
                >
                    <Share2 size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-10 pb-32">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8"
                        >
                            {/* Status Badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                    event.status === "upcoming" 
                                        ? "bg-gradient-to-r from-una-gold/20 to-amber-500/20 text-una-gold border border-una-gold/30" 
                                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                }`}>
                                    {event.status === "upcoming" ? "🔥 Próximo Evento" : "✅ Evento Realizado"}
                                </span>
                            </div>

                            {/* Title */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-una-red to-una-gold flex items-center justify-center text-3xl md:text-4xl shadow-lg shadow-una-gold/20 flex-shrink-0">
                                    {event.icon}
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                                        {event.title}
                                    </h1>
                                    <p className="text-white/60">{event.description}</p>
                                </div>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-una-gold mb-1">
                                        <Calendar size={18} />
                                        <span className="text-xs uppercase tracking-wider">Fecha</span>
                                    </div>
                                    <p className="text-white font-bold text-lg">{event.date}</p>
                                    <p className="text-white/50 text-sm">{event.year}</p>
                                </div>
                                
                                {event.time && (
                                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                                        <div className="flex items-center gap-2 text-una-gold mb-1">
                                            <Clock size={18} />
                                            <span className="text-xs uppercase tracking-wider">Hora</span>
                                        </div>
                                        <p className="text-white font-bold text-lg">{event.time}</p>
                                    </div>
                                )}
                                
                                {event.location && (
                                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 col-span-2 md:col-span-1">
                                        <div className="flex items-center gap-2 text-una-gold mb-1">
                                            <MapPin size={18} />
                                            <span className="text-xs uppercase tracking-wider">Lugar</span>
                                        </div>
                                        <p className="text-white font-bold">{event.location}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Description */}
                        {event.fullDescription && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8"
                            >
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    📝 Descripción
                                </h2>
                                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                    {event.fullDescription}
                                </p>
                            </motion.div>
                        )}

                        {/* Schedule */}
                        {event.schedule && event.schedule.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8"
                            >
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Clock className="text-una-gold" size={22} />
                                    Cronograma
                                </h2>
                                <div className="space-y-4">
                                    {event.schedule.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-una-gold/30 transition-colors"
                                        >
                                            <div className="w-20 h-12 bg-gradient-to-br from-una-gold/20 to-amber-500/10 rounded-lg flex items-center justify-center border border-una-gold/20">
                                                <span className="text-una-gold font-mono font-bold">
                                                    {item.time}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-white font-medium">{item.activity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Instructions */}
                        {event.instructions && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8"
                            >
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertCircle className="text-una-gold" size={22} />
                                    Indicaciones Importantes
                                </h2>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                    <p className="text-white/80 whitespace-pre-wrap">{event.instructions}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar - Ticket Purchase */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="sticky top-24"
                        >
                            {/* Ticket Card */}
                            {event.hasTickets && event.status === "upcoming" ? (
                                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-una-gold/30 rounded-3xl overflow-hidden shadow-xl shadow-una-gold/10">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-una-red to-una-gold p-6">
                                        <div className="flex items-center gap-3">
                                            <Ticket size={28} className="text-white" />
                                            <div>
                                                <h3 className="text-white font-bold text-xl">Entradas</h3>
                                                <p className="text-white/80 text-sm">Disponibles ahora</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Price */}
                                        {event.ticketPrice && (
                                            <div className="text-center">
                                                <p className="text-white/60 text-sm mb-1">Precio por entrada</p>
                                                <p className="text-4xl font-bold text-una-gold">
                                                    S/. {event.ticketPrice}
                                                </p>
                                            </div>
                                        )}

                                        {/* Quantity Selector */}
                                        <div>
                                            <p className="text-white/60 text-sm mb-3 text-center">Cantidad de entradas</p>
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                                    className="w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-600"
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <span className="text-4xl font-bold text-white w-16 text-center">
                                                    {ticketCount}
                                                </span>
                                                <button
                                                    onClick={() => setTicketCount(Math.min(event.maxTickets || 10, ticketCount + 1))}
                                                    className="w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-600"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        {event.ticketPrice && (
                                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white/60">Total a pagar:</span>
                                                    <span className="text-2xl font-bold text-una-gold">
                                                        S/. {(event.ticketPrice * ticketCount).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* WhatsApp Button */}
                                        <button
                                            onClick={openWhatsApp}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BD5A] transition-all hover:shadow-lg hover:shadow-[#25D366]/30 text-lg"
                                        >
                                            <MessageCircle size={24} />
                                            Comprar por WhatsApp
                                        </button>

                                        <p className="text-white/40 text-xs text-center">
                                            Serás redirigido a WhatsApp para coordinar el pago y recibir tus entradas
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* No Tickets Card */
                                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 text-center">
                                    <Users size={48} className="mx-auto text-slate-600 mb-4" />
                                    <h3 className="text-white font-semibold mb-2">
                                        {event.status === "past" ? "Evento Finalizado" : "Entrada Libre"}
                                    </h3>
                                    <p className="text-white/50 text-sm">
                                        {event.status === "past" 
                                            ? "Este evento ya se realizó" 
                                            : "No se requiere entrada para este evento"
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Contact Card */}
                            <div className="mt-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
                                <p className="text-white/60 text-sm text-center">
                                    ¿Tienes dudas? Contáctanos
                                </p>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <MessageCircle size={16} />
                                    WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
