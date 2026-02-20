'use client';

import React, { useMemo } from 'react';
import Globe from 'react-globe.gl';
import { LocationPoint } from '../lib/constants';

interface GlobeViewProps {
    dimensions: { width: number, height: number };
    teachers: LocationPoint[];
    onPointClick: (t: LocationPoint) => void;
    globeRef: any;
}

export default function GlobeView({ dimensions, teachers, onPointClick, globeRef }: GlobeViewProps) {
    const clusters = useMemo(() => {
        const cityGroups: Record<string, { lat: number, lng: number, count: number, members: LocationPoint[], displayName: string }> = {};

        const normalize = (str: string) =>
            str.trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        teachers.forEach(t => {
            const countryName = (t.country || 'Desconocido').trim();
            const key = normalize(countryName);

            if (!cityGroups[key]) {
                cityGroups[key] = {
                    lat: t.lat,
                    lng: t.lng,
                    count: 0,
                    members: [],
                    displayName: countryName
                };
            }
            cityGroups[key].count++;
            cityGroups[key].members.push(t);
        });

        return Object.entries(cityGroups).map(([key, data], index) => ({
            id: `cluster-${index}`,
            name: data.displayName,
            ...data,
            color: data.members.some(m => m.isReal) ? '#22c55e' : '#f472b6',
            size: 1.0 + Math.sqrt(data.count) * 0.5,
            altitude: 0.02 + (data.count * 0.003)
        }));
    }, [teachers]);

    return (
        <Globe
            ref={globeRef}
            key="cluster-globe-final"
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

            // Clusters logic
            pointsData={clusters}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointRadius="size"
            pointAltitude="altitude"
            pointResolution={32}

            // Labels logic (for clusters)
            labelsData={clusters}
            labelLat="lat"
            labelLng="lng"
            labelText={(d: any) => `${d.name} (${d.count})`}
            labelSize={1.2}
            labelDotRadius={0.3}
            labelColor={() => '#ffffff'}
            labelResolution={3}
            labelAltitude={(d: any) => d.altitude + 0.01}

            atmosphereColor="#4f46e5"
            atmosphereAltitude={0.15}

            onPointClick={(cluster: any) => {
                if (cluster.members.length > 0) {
                    onPointClick(cluster.members[0]);
                }
            }}
        />
    );
}
