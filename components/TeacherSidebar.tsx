'use client';

import React, { useMemo } from 'react';
import { LocationPoint } from '../lib/constants';
import { Navigation } from 'lucide-react';

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
    const filteredTeachers = useMemo(() => {
        return teachers.filter(t =>
            t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teachers, searchTerm]);

    const groupedByCountry = useMemo(() => {
        const groups: Record<string, LocationPoint[]> = {};
        filteredTeachers.forEach(t => {
            if (!groups[t.country]) groups[t.country] = [];
            groups[t.country].push(t);
        });
        return groups;
    }, [filteredTeachers]);

    return (
        <div className="w-full lg:w-80 flex flex-col h-[650px] glass-morphism rounded-3xl border border-white/5 order-1 lg:order-2 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-indigo-400" /> Explorador
                </h2>
                <input
                    type="text"
                    placeholder="Filtrar por nombre o área..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
                {Object.entries(groupedByCountry).map(([country, countryTeachers]) => (
                    <div key={country} className="space-y-1">
                        <h3 className="px-3 py-1 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/5 rounded-lg mb-2">
                            {country}
                        </h3>
                        <div className="space-y-1">
                            {countryTeachers.map((t) => (
                                <button
                                    key={t.id}
                                    onMouseEnter={() => onHoverTeacher(t)}
                                    onMouseLeave={() => onHoverTeacher(null)}
                                    onClick={() => onSelectTeacher(t)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border flex items-center gap-3 group ${selectedPoint?.id === t.id
                                        ? 'bg-indigo-500/20 border-indigo-500/40 shadow-lg'
                                        : 'bg-transparent border-transparent hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs ${t.isReal ? 'bg-green-500 text-black' : 'bg-white/10 text-zinc-300'}`}>
                                        {t.nombre.charAt(0)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className={`text-xs font-bold truncate ${selectedPoint?.id === t.id ? 'text-indigo-300' : 'text-zinc-200'}`}>
                                            {t.nombre}
                                        </p>
                                        <p className="text-[9px] text-zinc-600 truncate uppercase tracking-tighter">
                                            {t.city} • {t.especialidad.split(' ')[0]}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {filteredTeachers.length === 0 && (
                    <div className="p-8 text-center">
                        <p className="text-xs text-zinc-500 italic">No hay resultados</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nodos Totales</span>
                <span className="text-xs font-black text-indigo-400">{teachers.length}</span>
            </div>
        </div>
    );
}
