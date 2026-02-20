import { faker } from '@faker-js/faker';
import { LocationPoint, APP_CONFIG } from './constants';

const LAND_NODES = [
    { lat: -12.046374, lng: -77.042793, city: 'Lima', country: 'Peru' },
    { lat: 40.712776, lng: -74.005974, city: 'New York', country: 'USA' },
    { lat: 48.856614, lng: 2.352222, city: 'Paris', country: 'France' },
    { lat: 35.689487, lng: 139.691706, city: 'Tokyo', country: 'Japan' },
    { lat: -33.86882, lng: 151.209296, city: 'Sydney', country: 'Australia' },
    { lat: 51.507351, lng: -0.127758, city: 'London', country: 'UK' },
    { lat: -23.55052, lng: -46.633309, city: 'Sao Paulo', country: 'Brazil' },
    { lat: 55.755826, lng: 37.617299, city: 'Moscow', country: 'Russia' },
    { lat: 31.230416, lng: 121.473701, city: 'Shanghai', country: 'China' },
    { lat: 19.432608, lng: -99.133208, city: 'Mexico City', country: 'Mexico' },
    { lat: 30.044419, lng: 31.235712, city: 'Cairo', country: 'Egypt' },
    { lat: 28.613939, lng: 77.209021, city: 'New Delhi', country: 'India' },
    { lat: -34.603684, lng: -58.381559, city: 'Buenos Aires', country: 'Argentina' },
    { lat: 41.902783, lng: 12.496366, city: 'Rome', country: 'Italy' },
    { lat: 52.520007, lng: 13.404954, city: 'Berlin', country: 'Germany' },
    { lat: 1.352083, lng: 103.819836, city: 'Singapore', country: 'Singapore' },
    { lat: 37.774929, lng: -122.419416, city: 'San Francisco', country: 'USA' },
    { lat: 34.052235, lng: -118.243683, city: 'Los Angeles', country: 'USA' },
    { lat: 43.653226, lng: -79.383184, city: 'Toronto', country: 'Canada' },
    { lat: -26.204103, lng: 28.047305, city: 'Johannesburg', country: 'South Africa' }
];

const ACADEMIC_PROFILES = [
    "Especialista en Inteligencia Artificial aplicada a la educación superior, con enfoque en sistemas adaptativos de aprendizaje.",
    "Investigador en sostenibilidad urbana y modelado de ciudades inteligentes, enfocado en la reducción de huella de carbono.",
    "Docente de neurociencia cognitiva con más de 15 años de experiencia en el estudio del aprendizaje en entornos digitales.",
    "Experto en biotecnología molecular y desarrollo de soluciones agrícolas sostenibles para comunidades en desarrollo.",
    "Investigadora en sociología digital, analizando el impacto de las redes sociales en la formación de la identidad juvenil.",
    "Catedrático de economía internacional enfocado en modelos de comercio justo y globalización en mercados emergentes.",
    "Especialista en ciberseguridad y protección de datos en entornos de colaboración académica transfronteriza.",
    "Investigadora en energías renovables, centrada en la eficiencia de paneles solares de nueva generación.",
    "Doctor en ingeniería de software con enfoque en arquitecturas micro-frontends y escalabilidad de aplicaciones web.",
    "Especialista en pedagogía crítica y el uso de tecnologías georreferenciadas para la enseñanza de las ciencias sociales."
];

const SPECIALTIES = [
    "IA y Educación",
    "Energías Renovables",
    "Biología Molecular",
    "Economía Global",
    "Ciberseguridad",
    "Neurociencia",
    "Sociología Digital",
    "Arquitectura de Software",
    "Urbanismo Sostenible",
    "Pedagogía Digital"
];

const FAKE_TEACHERS = (() => {
    const teachers: LocationPoint[] = [];
    const nodesCount = LAND_NODES.length;

    for (let i = 0; i < 50; i++) {
        const nodeIndex = i % nodesCount;
        const node = LAND_NODES[nodeIndex];
        const teachersInThisNode = Math.floor(i / nodesCount);

        const profileIndex = Math.floor(Math.random() * ACADEMIC_PROFILES.length);

        const angle = (teachersInThisNode * 137.5) * (Math.PI / 180);
        const radius = 0.5 + (teachersInThisNode * 0.3); // Reduced radius for tighter clustering

        const lat = node.lat + (radius * Math.cos(angle) * 0.3);
        const lng = node.lng + (radius * Math.sin(angle) * 0.3);

        teachers.push({
            id: `fake-${i + 1}`,
            lat,
            lng,
            city: node.city,
            country: node.country,
            nombre: faker.person.fullName(),
            perfil: ACADEMIC_PROFILES[profileIndex],
            especialidad: SPECIALTIES[profileIndex],
            idioma: faker.helpers.arrayElement(['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán']),
            linkedin: `https://linkedin.com/in/${faker.person.firstName().toLowerCase()}`,
            email: faker.internet.email(),
            isReal: false,
            isActive: true
        });
    }
    return teachers;
})();

export const getTeachers = (includeInactive = false): LocationPoint[] => {
    if (typeof window === 'undefined') return FAKE_TEACHERS;
    const stored = localStorage.getItem(APP_CONFIG.storageKey);
    const realTeachers: LocationPoint[] = stored ? JSON.parse(stored) : [];

    const filteredReal = includeInactive ? realTeachers : realTeachers.filter(t => t.isActive);
    return [...filteredReal.map(t => ({ ...t, isReal: true })), ...FAKE_TEACHERS];
};

export const addTeacher = (teacher: Omit<LocationPoint, 'id' | 'isReal' | 'isActive'>) => {
    const stored = localStorage.getItem(APP_CONFIG.storageKey);
    const realTeachers: LocationPoint[] = stored ? JSON.parse(stored) : [];

    const newTeacher: LocationPoint = {
        ...teacher,
        id: Date.now(),
        isReal: true,
        isActive: false
    };

    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify([newTeacher, ...realTeachers]));
};

export const updateTeacherStatus = (id: string | number, isActive: boolean) => {
    const stored = localStorage.getItem(APP_CONFIG.storageKey);
    if (!stored) return;
    const realTeachers: LocationPoint[] = JSON.parse(stored);
    const updated = realTeachers.map(t => t.id === id ? { ...t, isActive } : t);
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(updated));
};

export const deleteTeacher = (id: string | number) => {
    const stored = localStorage.getItem(APP_CONFIG.storageKey);
    if (!stored) return;
    const realTeachers: LocationPoint[] = JSON.parse(stored);
    const updated = realTeachers.filter(t => t.id !== id);
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(updated));
};
