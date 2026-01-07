"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimateOnScrollProps {
    children: ReactNode;
    className?: string;
    animation?: "fade-in" | "fade-in-up" | "fade-in-down" | "fade-in-left" | "fade-in-right" | "scale-in";
    delay?: number;
    threshold?: number;
}

export default function AnimateOnScroll({
    children,
    className = "",
    animation = "fade-in-up",
    delay = 0,
    threshold = 0.1,
}: AnimateOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold, rootMargin: "50px" }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, hasAnimated, isClient]);

    // En SSR o antes de montar, mostrar contenido visible
    // Después de montar, aplicar animaciones
    const animationClass = !isClient
        ? "" // En servidor: visible sin animación
        : hasAnimated
            ? `animate-${animation}` // Después de animar: con clase de animación
            : "opacity-0"; // Antes de animar: oculto

    return (
        <div
            ref={ref}
            className={`${className} ${animationClass}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
