'use client';

import dynamic from 'next/dynamic';
import { Link } from '../../i18n/routing';
import { useTranslations } from 'next-intl';
import { Info } from 'lucide-react';

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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {t('badge')}
          </div>
        </div>

        <div className="flex items-center gap-6 pointer-events-auto">
          <Link
            href="/details"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Info</span>
          </Link>

          <div className="flex gap-4 border-l border-white/10 pl-6">
            <Link href="/" locale="es" className="text-xs font-bold hover:text-indigo-400 transition-colors">ES</Link>
            <Link href="/" locale="en" className="text-xs font-bold hover:text-indigo-400 transition-colors">EN</Link>
          </div>
        </div>
      </header>

      {/* Full Screen Map Container */}
      <main className="flex-1 w-full relative">
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
