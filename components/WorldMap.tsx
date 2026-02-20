'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LocationPoint } from '../lib/constants';
import { getTeachers } from '../lib/teachers';
import { Navigation, Globe, Languages, X, Search, UserPlus } from 'lucide-react';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
            setTeachers(getTeachers());
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        // Set initial camera position after a short delay
        const timer = setTimeout(() => {
            if (globeRef.current) {
                globeRef.current.pointOfView({ lat: 10, lng: 0, altitude: 2.8 }, 1500);
                globeRef.current.controls().autoRotate = true;
                globeRef.current.controls().autoRotateSpeed = 0.5;
            }
        }, 1000);

        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [isMounted]);

    const handleSelectTeacher = (teacher: LocationPoint) => {
        setSelectedPoint(teacher);
        setIsSidebarOpen(false); // Close sidebar on selection (mobile)
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
        <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-80px)] lg:h-full max-w-[1600px] mx-auto animate-fade-in relative z-20 p-4 lg:p-6">
            {/* MOBILE TOGGLE (Floating) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed bottom-10 left-10 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-all"
            >
                <Search className="w-6 h-6" />
            </button>

            {/* SIDEBAR SECTION */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-full sm:w-85 lg:static lg:w-96 lg:translate-x-0 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:flex-shrink-0
            `}>
                {isSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[-1]" onClick={() => setIsSidebarOpen(false)} />
                )}
                <TeacherSidebar
                    teachers={teachers}
                    selectedPoint={selectedPoint}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSelectTeacher={handleSelectTeacher}
                    onHoverTeacher={() => { }}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            {/* GLOBE SECTION (Back in card/window) */}
            <div ref={containerRef} className="flex-1 h-full min-h-[400px] rounded-[2.5rem] overflow-hidden glass-morphism relative group border border-white/10 shadow-3xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-500/10 pointer-events-none z-10" />

                {dimensions.width > 0 && dimensions.height > 0 && (
                    <GlobeView
                        dimensions={dimensions}
                        teachers={teachers}
                        onPointClick={handleSelectTeacher}
                        globeRef={globeRef}
                    />
                )}


                {selectedPoint && (
                    <ProfileModal
                        selectedPoint={selectedPoint}
                        onClose={() => setSelectedPoint(null)}
                    />
                )}
            </div>
        </div>
    );
}
