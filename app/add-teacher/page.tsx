'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { addTeacher } from '../../lib/teachers';
import { ArrowLeft, UserPlus, MapPin, Phone, BookOpen, GraduationCap, Globe } from 'lucide-react';
import Link from 'next/link';
import { Country, City } from 'country-state-city';

export default function AddTeacherPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: '',
        countryCode: '',
        countryName: '',
        city: '',
        lat: '',
        lng: '',
        perfil: '',
        especialidad: '',
        whatsapp: ''
    });

    const countries = useMemo(() => Country.getAllCountries(), []);

    const cities = useMemo(() => {
        if (!formData.countryCode) return [];
        return City.getCitiesOfCountry(formData.countryCode);
    }, [formData.countryCode]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const name = countries.find(c => c.isoCode === code)?.name || '';
        setFormData({
            ...formData,
            countryCode: code,
            countryName: name,
            city: '',
            lat: '',
            lng: ''
        });
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityName = e.target.value;
        const cityData = (cities || []).find(c => c.name === cityName);
        setFormData({
            ...formData,
            city: cityName,
            lat: cityData?.latitude || '',
            lng: cityData?.longitude || ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.lat || !formData.lng) {
            alert('Por favor, selecciona un país y ciudad válidos.');
            return;
        }

        addTeacher({
            nombre: formData.nombre,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            city: formData.city,
            country: formData.countryName,
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
                    <h1 className="text-4xl font-bold mb-4">Registro de <span className="text-green-500">Investigador</span></h1>
                    <p className="text-zinc-400">Selecciona tu ubicación y únete a la red académica global.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                    {/* Ubicación Section */}
                    <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                        <label className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Ubicación Geográfica
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">País</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer"
                                    value={formData.countryCode}
                                    onChange={handleCountryChange}
                                >
                                    <option value="">Seleccionar País</option>
                                    {countries.map(c => (
                                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Ciudad</label>
                                <select
                                    disabled={!formData.countryCode}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={formData.city}
                                    onChange={handleCityChange}
                                >
                                    <option value="">{formData.countryCode ? 'Seleccionar Ciudad' : 'Primero elige un país'}</option>
                                    {(cities || []).map(city => (
                                        <option key={`${city.name}-${city.latitude}`} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formData.lat && (
                            <div className="flex items-center gap-2 text-[10px] text-green-500/80 font-mono bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                                <Globe className="w-3 h-3" />
                                <span>Coordenadas detectadas: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lng).toFixed(4)}</span>
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all placeholder:text-zinc-700"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all placeholder:text-zinc-700"
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
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all placeholder:text-zinc-700"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                    </div>

                    {/* Perfil */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Resumen del Perfil
                        </label>
                        <textarea
                            required
                            placeholder="Describe tu línea de investigación..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 focus:border-green-500/50 outline-none transition-all resize-none placeholder:text-zinc-700"
                            value={formData.perfil}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform active:scale-[0.98] mt-4"
                    >
                        Completar Registro
                    </button>

                    <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold px-4">
                        Tu perfil será validado por un administrador antes de aparecer en el mapa global.
                    </p>
                </form>
            </div>
        </div>
    );
}
