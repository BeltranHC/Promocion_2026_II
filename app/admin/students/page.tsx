"use client";

import { useState, useEffect, useRef } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Users,
    X,
    Save,
    Upload,
    User,
} from "lucide-react";
import Image from "next/image";

interface Student {
    id: string;
    name: string;
    nickname: string | null;
    description: string | null;
    quote: string | null;
    photoUrl: string | null;
    isActive: boolean;
}

// Modal Component
function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// Student Form
function StudentForm({
    student,
    onSave,
    onCancel,
    isLoading,
}: {
    student?: Student;
    onSave: (data: FormData) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        name: student?.name || "",
        nickname: student?.nickname || "",
        description: student?.description || "",
        quote: student?.quote || "",
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        student?.photoUrl || null
    );
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("nickname", formData.nickname);
        data.append("description", formData.description);
        data.append("quote", formData.quote);
        if (photoFile) {
            data.append("photo", photoFile);
        }
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Photo Upload */}
            <div className="flex flex-col items-center">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-2 border-dashed border-slate-600 hover:border-amber-500 cursor-pointer transition-colors group"
                >
                    {photoPreview ? (
                        <Image
                            src={photoPreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 group-hover:text-amber-400">
                            <User size={40} />
                            <span className="text-xs mt-1">Subir foto</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={24} className="text-white" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                />
                <p className="text-slate-500 text-xs mt-2">
                    Clic para subir foto (opcional)
                </p>
            </div>

            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Nombre Completo *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Juan Carlos Pérez López"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
            </div>

            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Apodo
                </label>
                <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                    }
                    placeholder="Ej: Juancho"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
            </div>

            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Descripción Breve
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Ej: El más chistoso del salón, siempre llegaba tarde pero con buen humor."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                />
            </div>

            <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                    Frase Característica
                </label>
                <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) =>
                        setFormData({ ...formData, quote: e.target.value })
                    }
                    placeholder='Ej: "La vida es bella cuando tienes café"'
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            {student ? "Guardar" : "Agregar"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | undefined>();
    const [isSaving, setIsSaving] = useState(false);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/admin/students");
            const data = await res.json();
            setStudents(data.students || []);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = async (formData: FormData) => {
        setIsSaving(true);
        try {
            const url = editingStudent
                ? `/api/admin/students/${editingStudent.id}`
                : "/api/admin/students";
            const method = editingStudent ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: formData,
            });

            if (res.ok) {
                fetchStudents();
                setIsModalOpen(false);
                setEditingStudent(undefined);
            }
        } catch (error) {
            console.error("Error saving student:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este estudiante?")) return;

        try {
            await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    return (
        <div>
            <AdminHeader
                title="Integrantes de la Promoción"
                subtitle="Gestiona los estudiantes que forman parte de la promoción"
            />

            <div className="p-8">
                {/* Stats */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/20">
                            <Users size={24} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Integrantes</p>
                            <p className="text-2xl font-bold text-white">
                                {students.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nombre o apodo..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditingStudent(undefined);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                    >
                        <Plus size={20} />
                        Nuevo Integrante
                    </button>
                </div>

                {/* Students Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-20">
                        <Users size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">
                            {searchQuery
                                ? "No se encontraron integrantes"
                                : "No hay integrantes registrados"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredStudents.map((student) => (
                            <div
                                key={student.id}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-700 transition-colors"
                            >
                                {/* Photo */}
                                <div className="relative aspect-square bg-slate-800">
                                    {student.photoUrl ? (
                                        <Image
                                            src={student.photoUrl}
                                            alt={student.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <User size={64} className="text-slate-600" />
                                        </div>
                                    )}
                                    {/* Actions overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingStudent(student);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-3 bg-amber-500/20 text-amber-400 rounded-full hover:bg-amber-500/30 transition-colors"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="p-3 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="text-white font-semibold truncate">
                                        {student.name}
                                    </h3>
                                    {student.nickname && (
                                        <p className="text-amber-400 text-sm">
                                            &quot;{student.nickname}&quot;
                                        </p>
                                    )}
                                    {student.quote && (
                                        <p className="text-slate-500 text-xs mt-2 italic line-clamp-2">
                                            &quot;{student.quote}&quot;
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingStudent(undefined);
                }}
                title={editingStudent ? "Editar Integrante" : "Nuevo Integrante"}
            >
                <StudentForm
                    student={editingStudent}
                    onSave={handleSave}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingStudent(undefined);
                    }}
                    isLoading={isSaving}
                />
            </Modal>
        </div>
    );
}
