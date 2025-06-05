import { getToken, logout } from './Auth.js';

export async function fetchWithInterceptor(url, options = {}) {
    const token = getToken();
    const esRutaPublica = url.includes('/api/uploads/') || url.includes('/images/');

    const headers = new Headers(options.headers || {});

    if (token && !esRutaPublica) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (
        options.method &&
        options.method.toUpperCase() !== 'GET' &&
        !(options.body instanceof FormData)
    ) {
        headers.set('Content-Type', 'application/json');
    }

    const newOptions = { ...options, headers };

    // 🧪 LOGS DE DEPURACIÓN
    console.log('🧪 Interceptando fetch →', {
        url,
        tokenUsado: token,
        metodo: options.method || 'GET',
        headers: Object.fromEntries(headers.entries())
    });

    try {
        const response = await fetch(url, newOptions);

        if (response.status === 401) {
            logout();
            return Promise.reject(new Error('No autorizado - token expirado'));
        }

        return response;
    } catch (error) {
        console.error('❌ Error en fetch interceptado:', error);
        throw error;
    }
}
