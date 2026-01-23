"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Calendar,
    Image,
    Users,
    DollarSign,
    TrendingUp,
    Plus,
    ArrowRight,
    LucideIcon,
    Loader2
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
    eventsCount: number;
    galleryCount: number;
    studentsCount: number;
    activeContributors: number;
    fundTotal: number;
    goal: number;
    progress: number;
    weeklyAmount: number;
    weeklyNewContributions: number;
}

interface ActivityItem {
    type: string;
    action: string;
    detail: string;
    time: string;
    timeFormatted: string;
}

// Activity icon mapping
const activityIcons: Record<string, LucideIcon> = {
    event: Calendar,
    gallery: Image,
    payment: DollarSign,
    ticket_sale: DollarSign,
    student: Users,
};

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
    icon: LucideIcon;
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
    icon: LucideIcon;
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
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingActivity, setIsLoadingActivity] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats
                const statsRes = await fetch("/api/admin/stats");
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoading(false);
            }

            try {
                // Fetch activity
                const activityRes = await fetch("/api/admin/activity");
                if (activityRes.ok) {
                    const data = await activityRes.json();
                    setActivities(data.activities || []);
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
            } finally {
                setIsLoadingActivity(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <AdminHeader
                title="Dashboard"
                subtitle="Bienvenido al panel de administración"
            />

            <div className="p-8">
                {/* Stats Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse">
                                <div className="h-4 bg-slate-700 rounded w-1/2 mb-4" />
                                <div className="h-8 bg-slate-700 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Eventos"
                            value={stats?.eventsCount ?? 0}
                            icon={Calendar}
                            color="from-blue-500 to-blue-600"
                        />
                        <StatsCard
                            title="Imágenes en Galería"
                            value={stats?.galleryCount ?? 0}
                            icon={Image}
                            color="from-purple-500 to-purple-600"
                        />
                        <StatsCard
                            title="Contribuidores"
                            value={stats?.activeContributors ?? 0}
                            icon={Users}
                            trend={stats?.weeklyNewContributions ? `+${stats.weeklyNewContributions} esta semana` : undefined}
                            color="from-emerald-500 to-emerald-600"
                        />
                        <StatsCard
                            title="Fondo Recaudado"
                            value={`S/. ${(stats?.fundTotal ?? 0).toLocaleString()}`}
                            icon={DollarSign}
                            trend={stats ? `${stats.progress}% de la meta` : undefined}
                            color="from-amber-500 to-red-600"
                        />
                    </div>
                )}
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

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Recaudado</span>
                                        <span className="text-white font-medium">
                                            S/. {(stats?.fundTotal ?? 0).toLocaleString()} / S/. {(stats?.goal ?? 5000).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(stats?.progress ?? 0, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-slate-400 text-sm">Miembros activos</span>
                                        <span className="text-white font-medium">
                                            {stats?.activeContributors ?? 0} / {stats?.studentsCount ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-slate-400 text-sm">Aporte semanal</span>
                                        <span className="text-white font-medium">S/. {(stats?.weeklyAmount ?? 5).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-slate-400 text-sm">Meta restante</span>
                                        <span className="text-amber-400 font-medium">
                                            S/. {((stats?.goal ?? 5000) - (stats?.fundTotal ?? 0)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

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
                    {isLoadingActivity ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-700 rounded-lg" />
                                        <div>
                                            <div className="h-4 bg-slate-700 rounded w-32 mb-2" />
                                            <div className="h-3 bg-slate-700 rounded w-24" />
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-700 rounded w-16" />
                                </div>
                            ))}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-sm">No hay actividad reciente</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activities.slice(0, 5).map((item, index) => {
                                const IconComponent = activityIcons[item.type] || Calendar;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                                                <IconComponent size={18} />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{item.action}</p>
                                                <p className="text-slate-400 text-xs mt-1">{item.detail}</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-500 text-xs whitespace-nowrap">{item.timeFormatted}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
