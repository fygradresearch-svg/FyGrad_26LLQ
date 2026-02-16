export interface LocationPoint {
    id: string | number;
    lat: number;
    lng: number;
    nombre: string;
    perfil: string;
    especialidad: string;
    whatsapp: string;
    isReal?: boolean;
}

export const APP_CONFIG = {
    title: "Modelo digital para la conexión internacional de profesores",
    version: "1.3.0-scientific",
    storageKey: 'scientific-teachers-v1'
};
