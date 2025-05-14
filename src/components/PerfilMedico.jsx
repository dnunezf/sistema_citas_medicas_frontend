import React, { useEffect, useState } from 'react';
import '../styles/auth/PerfilMedico.css';

function PerfilMedico() {
    const [perfil, setPerfil] = useState({
        nombre: '',
        especialidad: '',
        costoConsulta: '',
        localidad: '',
        frecuenciaCitas: '',
        presentacion: '',
        rutaFotoPerfil: ''
    });

    const [mensaje, setMensaje] = useState('');
    const medicoId = 1; // 🔁 ID del médico logueado (más adelante se usará dinámico)

    useEffect(() => {
        fetch(`/api/medicos/${medicoId}`)
            .then(res => res.json())
            .then(data => setPerfil(data))
            .catch(() => setMensaje('No se pudo cargar el perfil.'));
    }, [medicoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfil(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/medicos/${medicoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(perfil)
        })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error();
            })
            .then(() => setMensaje('Perfil actualizado correctamente.'))
            .catch(() => setMensaje('Error al actualizar el perfil.'));
    };

    return (
        <div className="perfil-medico">
            <h2>Mi Perfil Médico</h2>
            {mensaje && <p>{mensaje}</p>}

            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" value={perfil.nombre} onChange={handleChange} placeholder="Nombre completo" required />
                <input type="text" name="especialidad" value={perfil.especialidad} onChange={handleChange} placeholder="Especialidad" required />
                <input type="number" step="0.01" name="costoConsulta" value={perfil.costoConsulta} onChange={handleChange} placeholder="Costo consulta" required />
                <input type="text" name="localidad" value={perfil.localidad} onChange={handleChange} placeholder="Localidad" required />
                <input type="number" name="frecuenciaCitas" value={perfil.frecuenciaCitas} onChange={handleChange} placeholder="Frecuencia en minutos" required />
                <textarea name="presentacion" value={perfil.presentacion} onChange={handleChange} placeholder="Presentación o reseña" rows="4" />
                <input type="text" name="rutaFotoPerfil" value={perfil.rutaFotoPerfil} onChange={handleChange} placeholder="URL de la foto de perfil" />

                <button type="submit">Guardar Cambios</button>
            </form>

            {perfil.rutaFotoPerfil && (
                <div style={{ marginTop: '1rem' }}>
                    <img src={perfil.rutaFotoPerfil} alt="Foto del médico" width={200} />
                </div>
            )}
        </div>
    );
}

export default PerfilMedico;
