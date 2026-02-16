import { faker } from '@faker-js/faker';
import { LocationPoint, APP_CONFIG } from './constants';

const generateTeacher = (id: number): LocationPoint => {
    return {
        id: `fake-${id}`,
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        nombre: faker.person.fullName(),
        perfil: faker.lorem.paragraph(),
        especialidad: faker.person.jobTitle(),
        whatsapp: faker.phone.number({ style: 'international' }),
        isReal: false
    };
};

const FAKE_TEACHERS = Array.from({ length: 50 }, (_, i) => generateTeacher(i + 1));

export const getTeachers = (): LocationPoint[] => {
    if (typeof window === 'undefined') return FAKE_TEACHERS;

    const stored = localStorage.getItem(APP_CONFIG.storageKey);
    const realTeachers: LocationPoint[] = stored ? JSON.parse(stored) : [];

    return [...realTeachers.map(t => ({ ...t, isReal: true })), ...FAKE_TEACHERS];
};

export const addTeacher = (teacher: Omit<LocationPoint, 'id' | 'isReal'>) => {
    const stored = localStorage.getItem(APP_CONFIG.storageKey);
    const realTeachers: LocationPoint[] = stored ? JSON.parse(stored) : [];

    const newTeacher: LocationPoint = {
        ...teacher,
        id: Date.now(),
        isReal: true
    };

    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify([newTeacher, ...realTeachers]));
};
