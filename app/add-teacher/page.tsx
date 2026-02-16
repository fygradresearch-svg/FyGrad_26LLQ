'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addTeacher } from '../../lib/teachers';
import { ArrowLeft, UserPlus, MapPin, Phone, BookOpen, GraduationCap, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function AddTeacherPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: '',
        lat: '',
        lng: '',
        perfil: '',
        especialidad: '',
        whatsapp: ''
    });

    const [isLocating, setIsLocating] = useState(false);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('La geolocalización no es compatible con tu navegador');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData({
                    ...formData,
                    lat: position.coords.latitude.toString(),
                    lng: position.coords.longitude.toString()
                });
                setIsLocating(false);
            },
            (error) => {
                console.error(error);
                alert('No se pudo obtener la ubicación. Por favor, asegúrate de dar permisos.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.lat || !formData.lng) {
            alert('Por favor, selecciona tu ubicación actual antes de registrar.');
            return;
        }

        addTeacher({
            nombre: formData.nombre,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            perfil: formData.perfil,
            especialidad: formData.especialidad,
            whatsapp: formData.whatsapp
        });

        router.push('/');
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-indigo-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <Link href="/" className="inline-flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al Mapa Global</span>
                </Link>

                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Registro de <span className="text-green-500">Nuevo Docente</span></h1>
                    <p className="text-zinc-400">Incorpora un nuevo nodo de conocimiento real al sistema georreferenciado para validar la hipótesis de interconexión global.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                    {/* Ubicación Section */}
                    <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Geolocalización del Docente
                            </label>
                            {formData.lat && (
                                <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                    Ubicación Capturada
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            disabled={isLocating}
                            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl border transition-all font-bold ${isLocating
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-500 animate-pulse'
                                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 active:scale-[0.98]'
                                }`}
                        >
                            <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
                            <span>{isLocating ? 'Obteniendo Coordenadas...' : 'Usar mi Ubicación Actual'}</span>
                        </button>

                        {formData.lat && (
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                                    <span className="block text-[10px] text-zinc-500 uppercase">Latitud</span>
                                    <span className="text-sm font-mono text-zinc-300">{parseFloat(formData.lat).toFixed(4)}</span>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                                    <span className="block text-[10px] text-zinc-500 uppercase">Longitud</span>
                                    <span className="text-sm font-mono text-zinc-300">{parseFloat(formData.lng).toFixed(4)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Nombre Completo
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Dr. Pedro Perez"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>

                        {/* Especialidad */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> Especialidad Académica
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="IA en Educación"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                                value={formData.especialidad}
                                onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> WhatsApp Internacional
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="+51 987 654 321"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                    </div>

                    {/* Perfil */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Resumen del Perfil e Hipótesis
                        </label>
                        <textarea
                            required
                            placeholder="Describe la línea de investigación y el aporte al modelo digital..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all resize-none"
                            value={formData.perfil}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-2xl shadow-xl shadow-green-500/10 transition-all transform active:scale-[0.98] mt-4"
                    >
                        Registrar Docente en la Red Global
                    </button>
                </form>
            </div>
        </div>
    );
}
