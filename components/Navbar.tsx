"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass py-3" : "bg-transparent py-5"
                }`}
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
                    <a href="#aportes" className="gold-button text-sm">
                        Aportar
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    aria-label="Toggle menu"
                >
                    <motion.span
                        animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-una-gold block"
                    />
                    <motion.span
                        animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-6 h-0.5 bg-una-gold block"
                    />
                    <motion.span
                        animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-una-gold block"
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass mt-2 mx-4 rounded-2xl overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    className="text-white/80 hover:text-una-gold transition-colors py-2 text-center uppercase tracking-wider text-sm"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a href="#aportes" className="gold-button text-center text-sm">
                                Aportar
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
