"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
};

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
    return (
        <div 
            className={`${sizes[size]} ${className}`}
            role="status"
            aria-label="Cargando"
        >
            <motion.div
                className="w-full h-full border-2 border-amber-500/30 border-t-amber-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <span className="sr-only">Cargando...</span>
        </div>
    );
}

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = "Cargando..." }: LoadingOverlayProps) {
    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loading-message"
        >
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p id="loading-message" className="text-white/80 text-sm" aria-live="polite">{message}</p>
            </div>
        </div>
    );
}

interface LoadingSkeletonProps {
    className?: string;
}

export function LoadingSkeleton({ className = "h-4 w-full" }: LoadingSkeletonProps) {
    return (
        <div 
            className={`animate-pulse bg-slate-700/50 rounded ${className}`}
        />
    );
}

interface LoadingCardProps {
    count?: number;
}

export function LoadingCard({ count = 1 }: LoadingCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div 
                    key={i}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-xl" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-slate-700/50 rounded w-3/4" />
                            <div className="h-3 bg-slate-700/50 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

interface LoadingTableProps {
    rows?: number;
    columns?: number;
}

export function LoadingTable({ rows = 5, columns = 4 }: LoadingTableProps) {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="grid gap-4 p-4 border-b border-slate-700" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="h-4 bg-slate-700/50 rounded animate-pulse" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div 
                    key={rowIndex} 
                    className="grid gap-4 p-4 border-b border-slate-800"
                    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div 
                            key={colIndex} 
                            className="h-4 bg-slate-700/30 rounded animate-pulse"
                            style={{ animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

interface ButtonLoadingProps {
    isLoading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

export function ButtonLoading({
    isLoading,
    children,
    loadingText = "Procesando...",
    className = "",
    disabled,
    onClick,
    type = "button",
}: ButtonLoadingProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`relative inline-flex items-center justify-center gap-2 transition-all ${
                isLoading ? "cursor-not-allowed opacity-80" : ""
            } ${className}`}
        >
            {isLoading && <LoadingSpinner size="sm" />}
            <span>{isLoading ? loadingText : children}</span>
        </button>
    );
}
