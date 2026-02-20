'use client';

import { Link } from '../../../i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';

export default function Details() {
    const t = useTranslations('HomePage');
    const common = useTranslations('AddTeacher');

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
                {/* Navigation */}
                <div className="absolute top-8 left-6">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>{common('backToMap')}</span>
                    </Link>
                </div>

                {/* Language Switcher */}
                <div className="absolute top-8 right-6 flex gap-4">
                    <Link href="/details" locale="es" className="text-sm font-medium hover:text-indigo-400 transition-colors">ES</Link>
                    <Link href="/details" locale="en" className="text-sm font-medium hover:text-indigo-400 transition-colors">EN</Link>
                </div>

                <div className="flex flex-col items-center text-center space-y-8 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        {t('badge')}
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white max-w-5xl leading-tight">
                        {t.rich('title', {
                            span: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{t('titleSpan')}</span>
                        }) || ''}
                    </h1>

                    <p className="text-zinc-400 text-lg lg:text-xl max-w-3xl leading-relaxed">
                        {t('description')}
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <h3 className="text-xl font-bold mb-3 text-indigo-300">{t('features.registration.title')}</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            {t('features.registration.description')}
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <h3 className="text-xl font-bold mb-3 text-purple-300">{t('features.visualization.title')}</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            {t('features.visualization.description')}
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <h3 className="text-xl font-bold mb-3 text-pink-300">{t('features.validation.title')}</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            {t('features.validation.description')}
                        </p>
                    </div>
                </div>

                <footer className="mt-32 pt-12 border-t border-white/10 text-center flex flex-col items-center gap-4">
                    <p className="text-zinc-600 text-sm">
                        {t('footer')}
                    </p>
                    <Link href="/pendientes" className="text-[10px] text-zinc-800 hover:text-indigo-500/50 transition-colors uppercase tracking-[0.2em] font-bold">
                        {t('adminAccess')}
                    </Link>
                </footer>
            </main>
        </div>
    );
}
