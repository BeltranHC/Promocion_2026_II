"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, DollarSign, Globe, Loader2 } from "lucide-react";

interface FundSettings {
    goal: number;
    collected: number;
    weeklyAmount: number;
    totalMembers: number;
    contributingMembers: number;
}

interface SiteSettings {
    promotionName: string;
    schoolName: string;
    contactEmail: string;
    instagramUrl: string;
    facebookUrl: string;
    whatsappNumber: string;
}

export default function AdminSettingsPage() {
    const [fundSettings, setFundSettings] = useState<FundSettings>({
        goal: 5000,
        collected: 0,
        weeklyAmount: 5,
        totalMembers: 50,
        contributingMembers: 0,
    });

    const [siteSettings, setSiteSettings] = useState<SiteSettings>({
        promotionName: "Promoción 2026 - II",
        schoolName: "EPIEI - UNA Puno",
        contactEmail: "",
        instagramUrl: "",
        facebookUrl: "",
        whatsappNumber: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    // Fetch settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const data = await res.json();

                if (data.fundSettings) {
                    setFundSettings(data.fundSettings);
                }
                if (data.siteSettings) {
                    setSiteSettings(data.siteSettings);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Save settings
    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage("");

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fundSettings, siteSettings }),
            });

            if (res.ok) {
                setSaveMessage("Configuración guardada correctamente");
                setTimeout(() => setSaveMessage(""), 3000);
            } else {
                setSaveMessage("Error al guardar");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            setSaveMessage("Error al guardar");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <AdminHeader title="Configuración" />
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHeader
                title="Configuración"
                subtitle="Ajusta la configuración del sitio y el fondo"
            />

            <div className="p-8 space-y-8">
                {/* Fund Settings */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                            <DollarSign size={20} className="text-amber-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            Configuración del Fondo
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Meta Total (S/.)
                            </label>
                            <input
                                type="number"
                                value={fundSettings.goal}
                                onChange={(e) =>
                                    setFundSettings({
                                        ...fundSettings,
                                        goal: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Recaudado (S/.)
                            </label>
                            <input
                                type="number"
                                value={fundSettings.collected}
                                onChange={(e) =>
                                    setFundSettings({
                                        ...fundSettings,
                                        collected: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Aporte Semanal (S/.)
                            </label>
                            <input
                                type="number"
                                value={fundSettings.weeklyAmount}
                                onChange={(e) =>
                                    setFundSettings({
                                        ...fundSettings,
                                        weeklyAmount: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Total Miembros
                            </label>
                            <input
                                type="number"
                                value={fundSettings.totalMembers}
                                onChange={(e) =>
                                    setFundSettings({
                                        ...fundSettings,
                                        totalMembers: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Miembros Contribuyendo
                            </label>
                            <input
                                type="number"
                                value={fundSettings.contributingMembers}
                                onChange={(e) =>
                                    setFundSettings({
                                        ...fundSettings,
                                        contributingMembers: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>

                    {/* Progress Preview */}
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Progreso</span>
                            <span className="text-white font-medium">
                                {((fundSettings.collected / fundSettings.goal) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all"
                                style={{
                                    width: `${Math.min(
                                        (fundSettings.collected / fundSettings.goal) * 100,
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Site Settings */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <Globe size={20} className="text-blue-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            Información del Sitio
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Nombre de la Promoción
                            </label>
                            <input
                                type="text"
                                value={siteSettings.promotionName}
                                onChange={(e) =>
                                    setSiteSettings({
                                        ...siteSettings,
                                        promotionName: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Nombre de la Escuela
                            </label>
                            <input
                                type="text"
                                value={siteSettings.schoolName}
                                onChange={(e) =>
                                    setSiteSettings({
                                        ...siteSettings,
                                        schoolName: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Email de Contacto
                            </label>
                            <input
                                type="email"
                                value={siteSettings.contactEmail}
                                onChange={(e) =>
                                    setSiteSettings({
                                        ...siteSettings,
                                        contactEmail: e.target.value,
                                    })
                                }
                                placeholder="contacto@ejemplo.com"
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                WhatsApp
                            </label>
                            <input
                                type="text"
                                value={siteSettings.whatsappNumber}
                                onChange={(e) =>
                                    setSiteSettings({
                                        ...siteSettings,
                                        whatsappNumber: e.target.value,
                                    })
                                }
                                placeholder="+51 999 999 999"
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                value={siteSettings.instagramUrl}
                                onChange={(e) =>
                                    setSiteSettings({
                                        ...siteSettings,
                                        instagramUrl: e.target.value,
                                    })
                                }
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Facebook URL
                            </label>
                            <input
                                type="url"
                                value={siteSettings.facebookUrl}
                                onChange={(e) =>
                                    setSiteSettings({
                                        ...siteSettings,
                                        facebookUrl: e.target.value,
                                    })
                                }
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between">
                    {saveMessage && (
                        <p
                            className={`text-sm ${saveMessage.includes("Error")
                                    ? "text-red-400"
                                    : "text-emerald-400"
                                }`}
                        >
                            {saveMessage}
                        </p>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="ml-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 transition-all"
                    >
                        {isSaving ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Save size={20} />
                        )}
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    );
}
