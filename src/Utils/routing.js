// src/utils/routing.js
export function getRutaInicioPorRol(rol, id, perfilCompleto, estadoAprobacion) {
    if (rol === 'MEDICO') {
        // Si aún no está aprobado, siempre va al perfil (aunque lo tenga completo)
        if (estadoAprobacion !== 'aprobado') {
            return `/medico/perfil/${id}`;
        }

        return perfilCompleto
            ? `/citas/medico/${id}`
            : `/medico/perfil/${id}`;
    }

    if (rol === 'ADMINISTRADOR') {
        return '/admin/medicos';
    }

    if (rol === 'PACIENTE') {
        return '/';
    }

    return '/login'; // ruta por defecto si no se reconoce el rol
}
