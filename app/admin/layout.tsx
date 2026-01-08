"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        // Don't check auth on login page
        if (isLoginPage) {
            setIsLoading(false);
            return;
        }

        // Check authentication on mount
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/verify");
                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    router.push("/admin/login");
                }
            } catch {
                router.push("/admin/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, isLoginPage]);

    // Login page - no sidebar, no auth check
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Cargando...</p>
                </div>
            </div>
        );
    }

    // If not authenticated and not on login page, show nothing (redirect will happen)
    if (!isAuthenticated) {
        return null;
    }

    // Authenticated - show sidebar and content
    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

