"use client";

import { useState, useEffect } from "react";
import type { ProgressBarProps } from "@/types";

/**
 * Barra de progreso animada con gradiente institucional UNA-Puno.
 * Muestra el porcentaje de avance con una animación suave de expansión.
 * 
 * @param percentage - Porcentaje de progreso (0-100)
 * @returns Componente de barra de progreso con animación
 */
export default function ProgressBar({ percentage }: ProgressBarProps) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(percentage), 500);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="relative h-4 bg-dark-card rounded-full overflow-hidden border border-dark-border">
            <div
                className="absolute h-full bg-gradient-to-r from-una-red via-una-gold to-una-blue rounded-full progress-glow transition-all ease-out"
                style={{ width: `${width}%`, transitionDuration: '1500ms' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>
    );
}
