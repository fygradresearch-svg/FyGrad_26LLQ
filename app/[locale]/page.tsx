'use client';

import dynamic from 'next/dynamic';
import { Link } from '../../i18n/routing';
import { useTranslations } from 'next-intl';
import { Info, UserPlus } from 'lucide-react';

// Dynamically import the Map component with no SSR
const WorldMap = dynamic(() => import('../../components/WorldMap'), {
  ssr: false,
  loading: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations('HomePage');
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-900 animate-pulse">
        <p className="text-zinc-400 font-medium">{t('loadingMap')}</p>
      </div>
    );
  },
});

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      {/* HUD / Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-6 py-4 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link
            href="/add-teacher"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/80 border border-white/10 hover:bg-indigo-500 hover:scale-105 backdrop-blur-md transition-all text-sm font-bold shadow-xl shadow-indigo-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">{useTranslations('WorldMap')('register')}</span>
          </Link>

          <Link
            href="/details"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 hover:scale-105 backdrop-blur-md transition-all text-sm font-medium shadow-xl shadow-black/50"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">{t('studyLink')}</span>
          </Link>

          <div className="flex gap-4 border-l border-white/10 pl-6">
            <Link href="/" locale="es" className="text-xs font-bold hover:text-indigo-400 transition-colors">ES</Link>
            <Link href="/" locale="en" className="text-xs font-bold hover:text-indigo-400 transition-colors">EN</Link>
          </div>
        </div>
      </header>

      {/* Full Screen Map Container */}
      <main className="flex-1 w-full relative h-full min-h-0">
        <WorldMap />
      </main>

      {/* Minimal Footer Overlay */}
      <footer className="fixed bottom-4 left-6 z-50 pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-zinc-500 font-medium">
          {t('footer')}
        </p>
      </footer>
    </div>
  );
}
