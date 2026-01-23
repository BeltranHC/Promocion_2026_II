"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // Focus first menu item when menu opens
    useEffect(() => {
        if (isMobileMenuOpen && menuItemsRef.current[0]) {
            menuItemsRef.current[0].focus();
        }
    }, [isMobileMenuOpen]);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
    }, []);

    // Keyboard navigation handler
    const handleKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
        const itemCount = NAV_LINKS.length;

        switch (event.key) {
            case "Escape":
                closeMobileMenu();
                break;
            case "ArrowDown":
                event.preventDefault();
                const nextIndex = (index + 1) % itemCount;
                menuItemsRef.current[nextIndex]?.focus();
                break;
            case "ArrowUp":
                event.preventDefault();
                const prevIndex = (index - 1 + itemCount) % itemCount;
                menuItemsRef.current[prevIndex]?.focus();
                break;
            case "Home":
                event.preventDefault();
                menuItemsRef.current[0]?.focus();
                break;
            case "End":
                event.preventDefault();
                menuItemsRef.current[itemCount - 1]?.focus();
                break;
            case "Tab":
                // Allow natural tab behavior but close menu on last item
                if (!event.shiftKey && index === itemCount - 1) {
                    closeMobileMenu();
                }
                break;
        }
    }, [closeMobileMenu]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass py-3" : "bg-transparent py-5"
                }`}
            role="navigation"
            aria-label="Navegación principal"
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="#inicio" className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image
                            src="/images/logo-epiei.png"
                            alt="Logo EPIEI"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold gradient-text">Promoción 2026 - II</span>
                        <span className="text-[10px] text-una-cyan/80 uppercase tracking-wider hidden sm:block">
                            EPIEI - UNA Puno
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-white/70 hover:text-una-gold transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    ref={menuButtonRef}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-una-gold/50 rounded-lg"
                    aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                >
                    <motion.span
                        animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-una-gold block"
                        aria-hidden="true"
                    />
                    <motion.span
                        animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-6 h-0.5 bg-una-gold block"
                        aria-hidden="true"
                    />
                    <motion.span
                        animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-una-gold block"
                        aria-hidden="true"
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        ref={menuRef}
                        id="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass mt-2 mx-4 rounded-2xl overflow-hidden"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {NAV_LINKS.map((link, index) => (
                                <a
                                    key={link.name}
                                    ref={(el) => { menuItemsRef.current[index] = el; }}
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="text-white/80 hover:text-una-gold focus:text-una-gold focus:outline-none focus:ring-2 focus:ring-una-gold/50 rounded-lg transition-colors py-2 text-center uppercase tracking-wider text-sm"
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
