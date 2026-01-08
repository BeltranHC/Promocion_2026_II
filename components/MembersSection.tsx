"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionHeader from "./ui/SectionHeader";

interface Student {
    id: string;
    name: string;
    nickname: string | null;
    description: string | null;
    quote: string | null;
    photoUrl: string | null;
}

function MemberCard({ student, index }: { student: Student; index: number }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <AnimateOnScroll animation="scale-in" delay={index * 80}>
            <div
                className="relative aspect-[3/4] group cursor-pointer perspective-1000"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""
                        }`}
                >
                    {/* Front Side */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                        {/* Photo or Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                            {student.photoUrl ? (
                                <Image
                                    src={student.photoUrl}
                                    alt={student.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-una-gold/30 to-una-red/30 flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-una-gold/60"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                    <span className="text-white/40 text-sm mt-3">
                                        Foto próximamente
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />

                        {/* Name & Nickname */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-semibold text-lg truncate">
                                {student.name}
                            </h3>
                            {student.nickname && (
                                <p className="text-una-gold text-sm">
                                    &quot;{student.nickname}&quot;
                                </p>
                            )}
                        </div>

                        {/* Hover hint */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="px-2 py-1 bg-dark-bg/80 rounded text-xs text-white/60">
                                Clic para ver más
                            </div>
                        </div>

                        {/* Glow border on hover */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-una-gold/40 rounded-2xl transition-all duration-300" />
                    </div>

                    {/* Back Side */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-una-gold/30">
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <h3 className="text-white font-semibold text-lg mb-1">
                                {student.name}
                            </h3>
                            {student.nickname && (
                                <p className="text-una-gold text-sm mb-4">
                                    &quot;{student.nickname}&quot;
                                </p>
                            )}

                            {student.description && (
                                <p className="text-white/70 text-sm mb-4 line-clamp-4">
                                    {student.description}
                                </p>
                            )}

                            {student.quote && (
                                <div className="mt-auto">
                                    <p className="text-una-gold/80 text-sm italic">
                                        &quot;{student.quote}&quot;
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AnimateOnScroll>
    );
}

export default function MembersSection() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("/api/admin/students?public=true");
                const data = await res.json();
                setStudents(data.students || []);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Don't render section if no students
    if (!isLoading && students.length === 0) {
        return null;
    }

    return (
        <section id="integrantes" className="py-24 px-6 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-card/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <SectionHeader
                    title="Integrantes"
                    subtitle="Conoce a los futuros profesionales de la Promoción 2026"
                    className="mb-12"
                />

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-una-gold/30 border-t-una-gold rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {students.map((student, index) => (
                            <MemberCard
                                key={student.id}
                                student={student}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Stats */}
                <AnimateOnScroll animation="fade-in-up" delay={300} className="text-center mt-12">
                    <div className="inline-flex items-center gap-6 glass px-8 py-4 rounded-2xl">
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-una-gold to-una-red bg-clip-text text-transparent">
                                {students.length}
                            </p>
                            <p className="text-white/60 text-sm">Integrantes</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-una-gold to-una-red bg-clip-text text-transparent">
                                2026
                            </p>
                            <p className="text-white/60 text-sm">Promoción</p>
                        </div>
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    );
}
