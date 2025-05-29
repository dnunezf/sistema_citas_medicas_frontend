// src/utils/fetchInterceptor.js
import { getToken, logout } from './Auth.js';

export async function fetchWithInterceptor(url, options = {}) {
    const token = getToken();

    // No enviar token en URLs de imágenes públicas
    const esRutaPublica = url.includes('/api/uploads/') || url.includes('/images/');

    const headers = new Headers(options.headers || {});

    if (token && !esRutaPublica) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const newOptions = { ...options, headers };

    try {
        const response = await fetch(url, newOptions);

        if (response.status === 401) {
            logout();
            return Promise.reject(new Error('No autorizado - token expirado'));
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}


