'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, Link } from '../../../i18n/routing';
import { addTeacher } from '../../../lib/teachers';
import { MapPin, User, BookOpen, GraduationCap, Globe, ArrowLeft, Mail, Linkedin, Languages, UserPlus } from 'lucide-react';
import { Country, City } from 'country-state-city';
import { useTranslations } from 'next-intl';

export default function AddTeacherPage() {
    const router = useRouter();
    const t = useTranslations('AddTeacher');
    const [formData, setFormData] = useState({
        nombre: '',
        countryCode: '',
        countryName: '',
        city: '',
        lat: '',
        lng: '',
        perfil: '',
        especialidad: '',
        idioma: '',
        email: '',
        linkedin: ''
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
            alert(t('alertInvalidLocation'));
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
            idioma: formData.idioma,
            email: formData.email,
            linkedin: formData.linkedin
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
                    <span>{t('backToMap')}</span>
                </Link>

                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        {t.rich('title', {
                            span: (chunks) => <span className="text-green-500">{t('titleSpan')}</span>
                        })}
                    </h1>
                    <p className="text-zinc-400">{t('description')}</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                    {/* Ubicación Section */}
                    <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                        <label className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {t('location.title')}
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t('location.country')}</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer"
                                    value={formData.countryCode}
                                    onChange={handleCountryChange}
                                >
                                    <option value="">{t('location.selectCountry')}</option>
                                    {countries.map(c => (
                                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t('location.city')}</label>
                                <select
                                    disabled={!formData.countryCode}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={formData.city}
                                    onChange={handleCityChange}
                                >
                                    <option value="">{formData.countryCode ? t('location.selectCity') : t('location.chooseCountryFirst')}</option>
                                    {(cities || []).map(city => (
                                        <option key={`${city.name}-${city.latitude}`} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formData.lat && (
                            <div className="flex items-center gap-2 text-[10px] text-green-500/80 font-mono bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                                <Globe className="w-3 h-3" />
                                <span>{t('location.coords', { lat: parseFloat(formData.lat).toFixed(4), lng: parseFloat(formData.lng).toFixed(4) })}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> {t('form.fullName')}
                            </label>
                            <input
                                required
                                type="text"
                                placeholder={t('form.fullNamePlaceholder')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all placeholder:text-zinc-700"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>

                        {/* Especialidad */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> {t('form.specialty')}
                            </label>
                            <input
                                required
                                type="text"
                                placeholder={t('form.specialtyPlaceholder')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all placeholder:text-zinc-700"
                                value={formData.especialidad}
                                onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {t('form.email')}
                            </label>
                            <input
                                required
                                type="email"
                                placeholder={t('form.emailPlaceholder')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all placeholder:text-zinc-700"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <Linkedin className="w-4 h-4" /> {t('form.linkedin')}
                            </label>
                            <input
                                required
                                type="url"
                                placeholder={t('form.linkedinPlaceholder')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all placeholder:text-zinc-700"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Idioma */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Languages className="w-4 h-4" /> {t('form.language')}
                        </label>
                        <select
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500/50 outline-none transition-all appearance-none text-white"
                            value={formData.idioma}
                            onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                        >
                            <option value="" className="bg-zinc-900">Seleccionar idioma...</option>
                            <option value={t('form.languages.es')} className="bg-zinc-900">{t('form.languages.es')}</option>
                            <option value={t('form.languages.en')} className="bg-zinc-900">{t('form.languages.en')}</option>
                            <option value={t('form.languages.pt')} className="bg-zinc-900">{t('form.languages.pt')}</option>
                            <option value={t('form.languages.fr')} className="bg-zinc-900">{t('form.languages.fr')}</option>
                            <option value={t('form.languages.de')} className="bg-zinc-900">{t('form.languages.de')}</option>
                        </select>
                    </div>

                    {/* Perfil */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> {t('form.profile')}
                        </label>
                        <textarea
                            required
                            placeholder={t('form.profilePlaceholder')}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 focus:border-green-500/50 outline-none transition-all resize-none placeholder:text-zinc-700"
                            value={formData.perfil}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform active:scale-[0.98] mt-4"
                    >
                        {t('form.submit')}
                    </button>

                    <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold px-4">
                        {t('validationNote')}
                    </p>
                </form>
            </div>
        </div>
    );
}
