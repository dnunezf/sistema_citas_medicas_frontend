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
    // ✅ Primero intentamos extraerlo desde el objeto usuario
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (usuario?.token) {
        return usuario.token;
    }

    // ✅ Si no está ahí, lo sacamos de una clave separada (forma actual)
    return sessionStorage.getItem("token");
}

