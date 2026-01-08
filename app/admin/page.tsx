"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import {
    Calendar,
    Image,
    Users,
    DollarSign,
    TrendingUp,
    Plus,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

// Stats Card Component
function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color
}: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color: string;
}) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
                            <TrendingUp size={14} />
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );
}

// Quick Action Component
function QuickAction({
    title,
    description,
    href,
    icon: Icon
}: {
    title: string;
    description: string;
    href: string;
    icon: any;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-amber-500/50 hover:bg-slate-800 transition-all group"
        >
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <h3 className="text-white font-medium text-sm">{title}</h3>
                <p className="text-slate-400 text-xs mt-1">{description}</p>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </Link>
    );
}

export default function AdminDashboardPage() {
    return (
        <div>
            <AdminHeader
                title="Dashboard"
                subtitle="Bienvenido al panel de administración"
            />

            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Eventos"
                        value={4}
                        icon={Calendar}
                        color="from-blue-500 to-blue-600"
                    />
                    <StatsCard
                        title="Imágenes en Galería"
                        value={6}
                        icon={Image}
                        color="from-purple-500 to-purple-600"
                    />
                    <StatsCard
                        title="Contribuidores"
                        value={25}
                        icon={Users}
                        trend="+5 esta semana"
                        color="from-emerald-500 to-emerald-600"
                    />
                    <StatsCard
                        title="Fondo Recaudado"
                        value="S/. 1,250"
                        icon={DollarSign}
                        trend="25% de la meta"
                        color="from-amber-500 to-red-600"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Plus size={20} className="text-amber-400" />
                                Acciones Rápidas
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <QuickAction
                                    title="Crear Nuevo Evento"
                                    description="Agrega un nuevo evento al calendario"
                                    href="/admin/events?action=new"
                                    icon={Calendar}
                                />
                                <QuickAction
                                    title="Subir Imágenes"
                                    description="Añade fotos a la galería"
                                    href="/admin/gallery?action=new"
                                    icon={Image}
                                />
                                <QuickAction
                                    title="Registrar Aporte"
                                    description="Registra una nueva contribución"
                                    href="/admin/contributors?action=new"
                                    icon={DollarSign}
                                />
                                <QuickAction
                                    title="Ver Todos los Aportes"
                                    description="Gestiona las contribuciones"
                                    href="/admin/contributors"
                                    icon={Users}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fund Progress */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Progreso del Fondo
                        </h2>

                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Recaudado</span>
                                <span className="text-white font-medium">S/. 1,250 / S/. 5,000</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-500"
                                    style={{ width: "25%" }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-slate-400 text-sm">Miembros activos</span>
                                <span className="text-white font-medium">25 / 50</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-slate-400 text-sm">Aporte semanal</span>
                                <span className="text-white font-medium">S/. 5.00</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-slate-400 text-sm">Meta restante</span>
                                <span className="text-amber-400 font-medium">S/. 3,750</span>
                            </div>
                        </div>

                        <Link
                            href="/admin/settings"
                            className="mt-6 block w-full py-3 text-center text-sm text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 transition-colors"
                        >
                            Modificar Meta
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Actividad Reciente
                    </h2>
                    <div className="space-y-4">
                        {[
                            { action: "Nuevo evento creado", detail: "Sesión de Fotos Oficial", time: "Hace 2 días" },
                            { action: "Imagen subida", detail: "Foto del campus", time: "Hace 3 días" },
                            { action: "Aporte registrado", detail: "Juan P. - S/. 20", time: "Hace 5 días" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl"
                            >
                                <div>
                                    <p className="text-white text-sm font-medium">{item.action}</p>
                                    <p className="text-slate-400 text-xs mt-1">{item.detail}</p>
                                </div>
                                <span className="text-slate-500 text-xs">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
