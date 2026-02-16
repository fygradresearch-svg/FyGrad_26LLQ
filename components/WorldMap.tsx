'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LocationPoint } from '../lib/constants';
import Globe from 'react-globe.gl';
import { MessageCircle, X, Navigation, UserPlus } from 'lucide-react';
import { getTeachers } from '../lib/teachers';
import Link from 'next/link';

export default function WorldMap3D() {
    const globeRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedPoint, setSelectedPoint] = useState<LocationPoint | null>(null);
    const [hoveredPoint, setHoveredPoint] = useState<LocationPoint | null>(null);
    const [teachers, setTeachers] = useState<LocationPoint[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTeachers(getTeachers());

        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }

        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const globeData = useMemo(() => teachers.map(p => ({
        ...p,
        size: p.isReal ? 2.5 : 2,
        color: p.isReal ? '#22c55e' : '#f472b6', // Green for real, pink for others
    })), [teachers]);

    return (
        <div ref={containerRef} className="h-[650px] w-full rounded-2xl overflow-hidden glass-morphism relative group border border-white/5 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-500/5 pointer-events-none z-10" />

            {dimensions.width > 0 && (
                <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

                    // Points logic
                    pointsData={globeData}
                    pointLat="lat"
                    pointLng="lng"
                    pointColor="color"
                    pointRadius={1.2}
                    pointAltitude={0.03}
                    pointResolution={32}

                    // Rings logic
                    ringsData={globeData}
                    ringLat="lat"
                    ringLng="lng"
                    ringColor={(d: any) => d.color}
                    ringMaxRadius={5}
                    ringPropagationSpeed={3}
                    ringRepeatPeriod={1000}

                    // Show labels ONLY on hover to avoid collision
                    labelsData={hoveredPoint ? [hoveredPoint] : []}
                    labelLat="lat"
                    labelLng="lng"
                    labelText="nombre"
                    labelSize={2.0}
                    labelDotRadius={0.5}
                    labelColor={() => '#ffffff'}
                    labelResolution={2}

                    atmosphereColor="#4f46e5"
                    atmosphereAltitude={0.25}

                    onPointClick={(point: any) => {
                        setSelectedPoint(point as LocationPoint);
                        if (globeRef.current) {
                            globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.8 }, 800);
                        }
                    }}
                    onPointHover={(point: any) => {
                        setHoveredPoint(point as LocationPoint | null);
                    }}
                />
            )}

            {/* ACTION BUTTON - ADD TEACHER */}
            <div className="absolute top-6 left-6 z-30">
                <Link href="/add-teacher" className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-xl transition-all font-semibold animate-fade-in">
                    <UserPlus className="w-5 h-5" />
                    <span>Añadir Docente</span>
                </Link>
            </div>

            {/* MODAL / PROFILE CARD */}
            {selectedPoint && (
                <div className="absolute top-6 right-6 z-30 w-80 animate-slide-up">
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative">
                        <button
                            onClick={() => setSelectedPoint(null)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${selectedPoint.isReal ? 'bg-green-500' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                                    {selectedPoint.nombre.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white leading-tight">{selectedPoint.nombre}</h3>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${selectedPoint.isReal ? 'bg-green-500/20 text-green-400' : 'text-indigo-400'}`}>
                                        {selectedPoint.isReal ? 'Docente Real' : selectedPoint.especialidad}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-tighter">Resumen Académico</h4>
                                <p className="text-sm text-zinc-300 leading-relaxed italic">
                                    "{selectedPoint.perfil}"
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <a
                                    href={`https://wa.me/${selectedPoint.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center space-x-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-3 rounded-xl transition-all font-semibold"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Contactar</span>
                                </a>
                                {selectedPoint.isReal && (
                                    <div className="flex items-center justify-center space-x-1 text-[10px] text-green-500/50 font-mono">
                                        <Navigation className="w-3 h-3" />
                                        <span>Lat: {selectedPoint.lat.toFixed(2)} | Lng: {selectedPoint.lng.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                    <span className="w-4 h-4 rounded border border-white/30 flex items-center justify-center text-[10px]">P</span>
                    {teachers.length} Nodos
                </span>
                <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                    <div className="w-2 h-2 rounded-full bg-[#f472b6]" />
                    Simulados
                </span>
                <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    Reales
                </span>
            </div>
        </div>
    );
}
