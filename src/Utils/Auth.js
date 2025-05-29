// src/utils/auth.js

export function logout() {
    // Limpia la sesión
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');

    // Opcional: si usas contexto, llama setUsuario(null) dentro del componente que llama logout

    // Redirige a login para resetear estado global
    window.location.href = '/login';
}

export function getToken() {
    // Función para obtener el token de sesión si necesitas usarla en algún lado
    return sessionStorage.getItem('token');
}

