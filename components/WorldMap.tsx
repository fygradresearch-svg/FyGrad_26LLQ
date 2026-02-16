'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { POINTS, LocationPoint } from '../lib/constants';
import Globe from 'react-globe.gl';
import { MessageCircle, X } from 'lucide-react';

export default function WorldMap3D() {
    const globeRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedPoint, setSelectedPoint] = useState<LocationPoint | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

    // Format data for the globe
    const globeData = useMemo(() => POINTS.map(p => ({
        ...p,
        size: 0.5, // Increased size for better visibility
        color: '#f472b6' // pink-400 for high contrast against dark globe
    })), []);

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

                    pointsData={globeData}
                    pointLat="lat"
                    pointLng="lng"
                    pointColor="color"
                    pointRadius={0.6} // Larger radius for clicking
                    pointAltitude={0.02}

                    labelsData={globeData}
                    labelLat="lat"
                    labelLng="lng"
                    labelText="nombre"
                    labelSize={1.8}
                    labelDotRadius={0.4}
                    labelColor={() => '#ffffff'}
                    labelResolution={2}

                    atmosphereColor="#4f46e5"
                    atmosphereAltitude={0.25}

                    onPointClick={(point: any) => {
                        console.log('Point clicked:', point);
                        setSelectedPoint(point as LocationPoint);
                        if (globeRef.current) {
                            globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 2 }, 800);
                        }
                    }}
                    onLabelClick={(label: any) => {
                        console.log('Label clicked:', label);
                        setSelectedPoint(label as LocationPoint);
                        if (globeRef.current) {
                            globeRef.current.pointOfView({ lat: label.lat, lng: label.lng, altitude: 2 }, 800);
                        }
                    }}
                />
            )}

            {/* MODAL / PROFILE CARD */}
            {selectedPoint && (
                <div className="absolute top-6 right-6 z-30 w-80 animate-slide-up">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative">
                        <button
                            onClick={() => setSelectedPoint(null)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                                    {selectedPoint.nombre.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white leading-tight">{selectedPoint.nombre}</h3>
                                    <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">{selectedPoint.especialidad}</span>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-tighter">Resumen Académico</h4>
                                <p className="text-sm text-zinc-300 leading-relaxed italic">
                                    "{selectedPoint.perfil}"
                                </p>
                            </div>

                            <a
                                href={`https://wa.me/${selectedPoint.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center space-x-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-3 rounded-xl transition-all font-semibold"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Contactar Docente</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                    <span className="w-4 h-4 rounded border border-white/30 flex items-center justify-center text-[10px]">L</span>
                    Rotar
                </span>
                <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                    <span className="w-4 h-4 rounded border border-white/30 flex items-center justify-center text-[10px]">S</span>
                    Zoom
                </span>
                <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                    <span className="w-4 h-4 rounded border border-white/30 flex items-center justify-center text-[10px]">C</span>
                    Click Docente
                </span>
                <span className="flex items-center gap-1.5 text-indigo-400">
                    Nodos: {POINTS.length}
                </span>
            </div>
        </div>
    );
}
