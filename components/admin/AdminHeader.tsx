"use client";

import { Menu, Bell, User } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
    return (
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    {subtitle && (
                        <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white">
                            <User size={18} />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-white text-sm font-medium">Admin</p>
                            <p className="text-slate-400 text-xs">Administrador</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
