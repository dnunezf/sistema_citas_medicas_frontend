// src/utils/routing.js
export function getRutaInicioPorRol(rol, id, perfilCompleto) {
    if (rol === 'MEDICO') {
        return perfilCompleto ? `/citas/medico/${id}` : `/medico/perfil/${id}`;
    } else if (rol === 'ADMINISTRADOR') {
        return '/admin/medicos';
    } else if (rol === 'PACIENTE') {
        return '/';
    }
    return '/login';
}
