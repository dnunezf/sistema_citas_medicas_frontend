export function getRutaInicioPorRol(rol, id, perfilCompleto, estadoAprobacion) {
    if (rol === 'MEDICO') {
        const estado = (estadoAprobacion || '').toLowerCase();
        if (estado !== 'aprobado') {
            return `/medico/perfil/${id}`;
        }

        return perfilCompleto
            ? `/medico/${id}/gestion-citas`
            : `/medico/perfil/${id}`;
    }

    if (rol === 'ADMINISTRADOR') {
        return '/admin/medicos';
    }

    if (rol === 'PACIENTE') {
        return '/';
    }

    return '/';
}
