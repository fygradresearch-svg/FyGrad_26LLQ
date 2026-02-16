export interface LocationPoint {
    id: string | number;
    lat: number;
    lng: number;
    nombre: string;
    perfil: string;
    especialidad: string;
    whatsapp: string;
    city: string;
    country: string;
    isReal?: boolean;
    isActive?: boolean; // New field for admin validation
}

export const APP_CONFIG = {
    title: "Modelo digital para la conexión internacional de profesores",
    version: "1.4.0-scientific",
    storageKey: 'scientific-teachers-v1'
};
