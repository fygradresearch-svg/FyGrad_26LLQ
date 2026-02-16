export interface LocationPoint {
    id: number;
    lat: number;
    lng: number;
    nombre: string;
    perfil: string;
    especialidad: string;
    whatsapp: string;
}

export const POINTS: LocationPoint[] = [
    {
        id: 1,
        lat: 40.7128,
        lng: -74.006,
        nombre: "Dr. James Wilson",
        perfil: "Especialista en Inteligencia Artificial y Educación Adaptativa. Investigador senior en MIT.",
        especialidad: "IA aplicada",
        whatsapp: "+1 555-010-9988"
    },
    {
        id: 2,
        lat: 48.8566,
        lng: 2.3522,
        nombre: "Dra. Marie Laurent",
        perfil: "Experta en Pedagogía Digital y entornos virtuales de aprendizaje colaborativo.",
        especialidad: "Pedagogía Digital",
        whatsapp: "+33 6 12 34 56 78"
    },
    {
        id: 3,
        lat: 35.6762,
        lng: 139.6503,
        nombre: "Prof. Kenji Tanaka",
        perfil: "Investigador en Gamificación para la enseñanza de ciencias exactas a nivel superior.",
        especialidad: "Gamificación",
        whatsapp: "+81 90-1234-5678"
    },
    {
        id: 4,
        lat: -33.8688,
        lng: 151.2093,
        nombre: "Dra. Sarah O'Connor",
        perfil: "Líder en proyectos de Interconexión Docente Global mediante tecnologías Blockchain.",
        especialidad: "Tecnologías Distribuidas",
        whatsapp: "+61 412 345 678"
    },
    {
        id: 5,
        lat: -23.5505,
        lng: -46.6333,
        nombre: "Prof. Roberto Silva",
        perfil: "Especialista en Georreferenciación Educativa y movilidad docente en Latinoamérica.",
        especialidad: "Geomática Educativa",
        whatsapp: "+55 11 98765-4321"
    },
];
