"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Image,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    GraduationCap,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Eventos", href: "/admin/events", icon: Calendar },
    { name: "Galería", href: "/admin/gallery", icon: Image },
    { name: "Integrantes", href: "/admin/students", icon: GraduationCap },
    { name: "Aportes", href: "/admin/contributors", icon: DollarSign },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        // Clear the auth cookie
        document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/admin/login";
    };

    return (
        <aside
            className={`
                fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800
                border-r border-slate-700/50 transition-all duration-300 z-50
                ${collapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        P
                    </div>
                    {!collapsed && (
                        <div>
                            <h1 className="text-white font-semibold text-sm">
                                Admin Panel
                            </h1>
                            <p className="text-slate-400 text-xs">Promoción 2026</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive
                                    ? "bg-gradient-to-r from-amber-500/20 to-red-500/20 text-amber-400 border border-amber-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                }
                            `}
                        >
                            <Icon size={20} />
                            {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center gap-3 w-full px-4 py-3 rounded-xl
                        text-slate-400 hover:text-red-400 hover:bg-red-500/10
                        transition-all duration-200
                    `}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="font-medium text-sm">Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
}
