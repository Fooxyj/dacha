// API Configuration
// In development: uses localhost
// In production: uses the same origin (Railway serves both frontend and backend)

export const API_URL = import.meta.env.VITE_API_URL || '';

export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
};
