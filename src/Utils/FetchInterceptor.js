// src/utils/fetchInterceptor.js
import { getToken, logout } from './auth';

export async function fetchWithInterceptor(url, options = {}) {
    // Obtener token desde sessionStorage (o desde contexto si lo tienes)
    const token = getToken();

    const newOptions = {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json', // si tu backend espera json
        },
    };

    try {
        const response = await fetch(url, newOptions);

        if (response.status === 401) {
            // Token inválido o expirado
            logout();
            // Evitar continuar con la petición
            return Promise.reject(new Error('No autorizado - token expirado'));
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
