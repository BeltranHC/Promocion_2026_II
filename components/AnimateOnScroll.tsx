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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
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
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? `animate-${animation}` : "opacity-0"}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
