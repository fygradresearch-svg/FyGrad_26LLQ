'use client';

import React, { useEffect, useState } from 'react';
import { getTeachers, updateTeacherStatus, deleteTeacher } from '../../../lib/teachers';
import { LocationPoint } from '../../../lib/constants';
import { ArrowLeft, CheckCircle2, XCircle, ShieldAlert, Navigation, Trash2, Mail, Linkedin } from 'lucide-react';
import { useRouter, Link } from '../../../i18n/routing';
import { useTranslations } from 'next-intl';

export default function AdminPage() {
    const t = useTranslations('Admin');
    const [teachers, setTeachers] = useState<LocationPoint[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        // We only care about real teachers here
        setTeachers(getTeachers(true).filter(t => t.isReal));

        // Check if already authenticated in this session
        const auth = sessionStorage.getItem('admin-auth');
        if (auth === 'true') setIsAuthenticated(true);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'ADMIN123') {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin-auth', 'true');
        } else {
            alert(t('login.incorrectPassword'));
        }
    };

    const handleToggle = (id: string | number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        updateTeacherStatus(id, newStatus);
        setTeachers(teachers.map(t => t.id === id ? { ...t, isActive: newStatus } : t));
    };

    const handleDelete = (id: string | number) => {
        if (!confirm(t('panel.deleteConfirm'))) return;
        deleteTeacher(id);
        setTeachers(teachers.filter(t => t.id !== id));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full space-y-8 bg-zinc-900/50 p-10 rounded-3xl border border-white/10 backdrop-blur-xl animate-fade-in text-center">
                    <div className="w-20 h-20 bg-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
                        <ShieldAlert className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{t('login.restricted')}</h1>
                        <p className="text-zinc-500">{t('login.description')}</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4 pt-4">
                        <input
                            required
                            type="password"
                            placeholder={t('login.passwordPlaceholder')}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-center focus:border-indigo-500 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-500/10 active:scale-95"
                        >
                            {t('login.submit')}
                        </button>
                        <Link href="/" className="block text-zinc-600 hover:text-zinc-400 text-sm pt-2 transition-colors">
                            {t('login.backToHome')}
                        </Link>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>{t('panel.backToMain')}</span>
                </Link>

                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                            {t('panel.badge')}
                        </div>
                        <h1 className="text-4xl font-bold">
                            {t.rich('panel.title', {
                                span: (chunks) => <span className="text-indigo-500">{t('panel.titleSpan')}</span>
                            })}
                        </h1>
                        <p className="text-zinc-500 max-w-xl">{t('panel.description')}</p>
                    </div>

                    <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-center">
                            <span className="block text-2xl font-bold">{teachers.filter(t => t.isActive).length}</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">{t('panel.active')}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-amber-500">{teachers.filter(t => !t.isActive).length}</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">{t('panel.pending')}</span>
                        </div>
                    </div>
                </header>

                {teachers.length === 0 ? (
                    <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <ShieldAlert className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 italic">{t('panel.noRecords')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {teachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 ${teacher.isActive
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-indigo-500/5 border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                                    }`}
                            >
                                {!teacher.isActive && (
                                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-500 text-[10px] font-black uppercase tracking-tighter rounded-bl-xl text-white">
                                        {t('panel.newRecord')}
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Avatar & Basic Info */}
                                    <div className="flex items-center gap-4 min-w-[300px]">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${teacher.isActive ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                            }`}>
                                            {teacher.nombre.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{teacher.nombre}</h3>
                                            <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest mt-1">{teacher.especialidad}</p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="flex flex-1 gap-4 flex-wrap">
                                        {teacher.email && (
                                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-sm text-zinc-400">
                                                <Mail className="w-4 h-4 text-white/70" />
                                                {teacher.email}
                                            </div>
                                        )}
                                        {teacher.linkedin && (
                                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-sm text-zinc-400">
                                                <Linkedin className="w-4 h-4 text-blue-500/70" />
                                                LinkedIn
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-sm text-zinc-400">
                                            <Navigation className="w-4 h-4 text-indigo-500/70" />
                                            {teacher.lat.toFixed(2)}, {teacher.lng.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                        {teacher.linkedin && (
                                            <a
                                                href={teacher.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl text-sm font-bold transition-all border border-blue-500/20"
                                            >
                                                {t('panel.contact')}
                                            </a>
                                        )}

                                        <button
                                            onClick={() => handleDelete(teacher.id)}
                                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20 shadow-lg shadow-red-500/5 group/del"
                                            title={t('panel.delete')}
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                                        </button>

                                        <button
                                            onClick={() => handleToggle(teacher.id, teacher.isActive || false)}
                                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${teacher.isActive
                                                ? 'bg-zinc-800 text-zinc-500 hover:bg-amber-500/10 hover:text-amber-500 border border-transparent hover:border-amber-500/20'
                                                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                }`}
                                        >
                                            {teacher.isActive ? (
                                                <>
                                                    <XCircle className="w-4 h-4" />
                                                    <span>{t('panel.deactivate')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>{t('panel.validate')}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Profile Summary */}
                                <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-white/5 text-sm text-zinc-400 leading-relaxed italic">
                                    "{teacher.perfil}"
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
