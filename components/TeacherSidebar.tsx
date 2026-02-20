'use client';

import React, { useMemo } from 'react';
import { LocationPoint } from '../lib/constants';
import { Navigation, Globe, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Fuse from 'fuse.js';

interface TeacherSidebarProps {
    teachers: LocationPoint[];
    selectedPoint: LocationPoint | null;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    onSelectTeacher: (t: LocationPoint) => void;
    onHoverTeacher: (t: LocationPoint | null) => void;
}

export default function TeacherSidebar({
    teachers,
    selectedPoint,
    searchTerm,
    onSearchChange,
    onSelectTeacher,
    onHoverTeacher
}: TeacherSidebarProps) {
    const t = useTranslations('Sidebar');

    const fuse = useMemo(() => {
        return new Fuse(teachers, {
            keys: [
                'nombre',
                'especialidad',
                'city',
                'country',
                'idioma'
            ],
            threshold: 0.3,
            ignoreLocation: true
        });
    }, [teachers]);

    const filteredTeachers = useMemo(() => {
        if (!searchTerm) return teachers;
        return fuse.search(searchTerm).map(result => result.item);
    }, [teachers, searchTerm, fuse]);

    const groupedByCountry = useMemo(() => {
        const groups: Record<string, LocationPoint[]> = {};
        filteredTeachers.forEach(teacher => {
            if (!groups[teacher.country]) groups[teacher.country] = [];
            groups[teacher.country].push(teacher);
        });
        return groups;
    }, [filteredTeachers]);

    return (
        <div className="w-full lg:w-96 flex flex-col h-full bg-black/40 backdrop-blur-xl border-r border-white/5 order-1 lg:order-2 overflow-hidden shadow-2xl relative z-30">
            <div className="p-6 border-b border-white/5 bg-white/5 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-indigo-400" /> {t('title')}
                </h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600 pl-10"
                    />
                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
                {Object.entries(groupedByCountry).map(([country, countryTeachers]) => (
                    <div key={country} className="space-y-1">
                        <h3 className="px-3 py-1 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/5 rounded-lg mb-2">
                            {country}
                        </h3>
                        <div className="space-y-1">
                            {countryTeachers.map((teacher) => (
                                <button
                                    key={teacher.id}
                                    onMouseEnter={() => onHoverTeacher(teacher)}
                                    onMouseLeave={() => onHoverTeacher(null)}
                                    onClick={() => onSelectTeacher(teacher)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border flex items-center gap-3 group ${selectedPoint?.id === teacher.id
                                        ? 'bg-indigo-500/20 border-indigo-500/40 shadow-lg'
                                        : 'bg-transparent border-transparent hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs ${teacher.isReal ? 'bg-green-500 text-black' : 'bg-white/10 text-zinc-300'}`}>
                                        {teacher.nombre.charAt(0)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className={`text-xs font-bold truncate ${selectedPoint?.id === teacher.id ? 'text-indigo-300' : 'text-zinc-200'}`}>
                                                {teacher.nombre}
                                            </p>
                                            {teacher.idioma && (
                                                <span className="text-[8px] bg-white/5 text-zinc-500 px-1 rounded flex items-center gap-0.5">
                                                    <Languages className="w-2 h-2" />
                                                    {teacher.idioma.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[9px] text-zinc-600 truncate uppercase tracking-tighter">
                                            {teacher.city} • {teacher.especialidad.split(' ')[0]}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {filteredTeachers.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">
                        <Globe className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-xs italic">{t('noResults')}</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{t('totalNodes')}</span>
                <span className="text-xs font-black text-indigo-400">{teachers.length}</span>
            </div>
        </div>
    );
}
