'use client';

import React from 'react';
import { LocationPoint } from '../lib/constants';
import { Mail, X, Linkedin, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProfileModalProps {
    selectedPoint: LocationPoint;
    onClose: () => void;
}

export default function ProfileModal({ selectedPoint, onClose }: ProfileModalProps) {
    const t = useTranslations('Modal');
    return (
        <div className="absolute top-6 right-6 z-30 w-80 animate-slide-up">
            <div className="bg-black/95 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl relative ring-1 ring-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${selectedPoint.isReal ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'}`}>
                            {selectedPoint.nombre.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="font-bold text-lg text-white leading-tight truncate">{selectedPoint.nombre}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${selectedPoint.isReal
                                    ? (selectedPoint.isActive ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400')
                                    : 'bg-indigo-500/10 text-indigo-400'
                                    }`}>
                                    {selectedPoint.isReal
                                        ? (selectedPoint.isActive ? t('verified') : t('pending'))
                                        : t('simulated')}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-bold">{selectedPoint.city}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-white/5" />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('specialty')}</h4>
                            <p className="text-sm text-zinc-200 font-semibold">{selectedPoint.especialidad}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('language')}</h4>
                            <div className="flex items-center gap-2 text-sm text-zinc-200 font-semibold">
                                <Languages className="w-3.5 h-3.5 text-indigo-400" />
                                {selectedPoint.idioma}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('academicSummary')}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed italic line-clamp-4">"{selectedPoint.perfil}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {selectedPoint.linkedin && (
                            <a
                                href={selectedPoint.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all font-bold shadow-lg shadow-blue-500/10"
                            >
                                <Linkedin className="w-4 h-4" />
                                <span className="text-xs">{t('connectLinkedIn')}</span>
                            </a>
                        )}

                        {selectedPoint.email && (
                            <a
                                href={`mailto:${selectedPoint.email}?subject=Conexión Académica&body=Hola ${selectedPoint.nombre}, me gustaría conectar con usted por su perfil de investigación en ${selectedPoint.especialidad}.`}
                                className="flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl transition-all font-bold shadow-lg shadow-zinc-500/10"
                            >
                                <Mail className="w-4 h-4" />
                                <span className="text-xs">{t('sendEmail')}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
