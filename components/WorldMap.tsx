'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LocationPoint } from '../lib/constants';
import { getTeachers } from '../lib/teachers';
import { MessageCircle, X, Navigation, UserPlus } from 'lucide-react';
import { Link } from '../i18n/routing';
import ProfileModal from './ProfileModal';
import TeacherSidebar from './TeacherSidebar';
import GlobeView from './GlobeView';
import { useTranslations } from 'next-intl';

export default function WorldMap3D() {
    const t = useTranslations('WorldMap');
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [teachers, setTeachers] = useState<LocationPoint[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<LocationPoint | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
            setTeachers(getTeachers());
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        // Delay expansion for smooth entry
        const resizeTimer = setTimeout(updateDimensions, 100);

        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('resize', updateDimensions);
            clearTimeout(resizeTimer);
        };
    }, [isMounted]);

    const handleSelectTeacher = (teacher: LocationPoint) => {
        setSelectedPoint(teacher);
        if (globeRef.current) {
            globeRef.current.pointOfView({
                lat: teacher.lat,
                lng: teacher.lng,
                altitude: 1.5
            }, 1200);
        }
    };

    if (!isMounted) return (
        <div className="h-full min-h-[600px] w-full flex items-center justify-center bg-black/40 backdrop-blur-md rounded-3xl border border-white/5">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                <p className="text-zinc-500 text-sm font-medium animate-pulse">{t('syncing')}</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-0 w-full h-full animate-fade-in relative z-20">
            {/* GLOBE SECTION */}
            <div ref={containerRef} className="flex-1 min-h-[500px] relative group order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-500/5 pointer-events-none z-10" />

                {dimensions.width > 0 && (
                    <GlobeView
                        dimensions={dimensions}
                        teachers={teachers}
                        onPointClick={handleSelectTeacher}
                        globeRef={globeRef}
                    />
                )}

                {/* OVERLAYS */}
                <div className="absolute top-6 left-6 z-30">
                    <Link href="/add-teacher" className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-xl shadow-indigo-500/20 transition-all font-semibold active:scale-95">
                        <UserPlus className="w-5 h-5" />
                        <span>{t('register')}</span>
                    </Link>
                </div>

                {selectedPoint && (
                    <ProfileModal
                        selectedPoint={selectedPoint}
                        onClose={() => setSelectedPoint(null)}
                    />
                )}
            </div>

            {/* SIDEBAR SECTION */}
            <TeacherSidebar
                teachers={teachers}
                selectedPoint={selectedPoint}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSelectTeacher={handleSelectTeacher}
                onHoverTeacher={() => { }} // Could add hover effect back if needed
            />
        </div>
    );
}
