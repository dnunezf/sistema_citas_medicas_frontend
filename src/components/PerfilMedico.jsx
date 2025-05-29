import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithInterceptor } from '../utils/fetchInterceptor'; // Importar el interceptor
import '../styles/auth/perfil_medico.css';

function PerfilMedico() {
    const { id } = useParams();
    const [perfil, setPerfil] = useState({
        nombre: '',
        especialidad: '',
        costoConsulta: '',
        localidad: '',
        frecuenciaCitas: '',
        presentacion: '',
        rutaFotoPerfil: ''
    });
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const res = await fetchWithInterceptor(`/api/medicos/${id}`);
                if (!res.ok) throw new Error("No se pudo cargar el perfil.");
                const data = await res.json();
                setPerfil(data);
            } catch {
                setError('❌ No se pudo cargar el perfil.');
            }
        };
        cargarPerfil();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfil(prev => ({ ...prev, [name]: value }));
        setMensaje('');
        setError('');
    };

    const handleFileChange = (e) => {
        setFotoPerfil(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(perfil).forEach(([key, value]) => formData.append(key, value));
        if (fotoPerfil) formData.append('fotoPerfil', fotoPerfil);

        try {
            const res = await fetchWithInterceptor(`/api/medicos/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setPerfil(data);
                setMensaje('✅ Perfil actualizado correctamente.');
            } else {
                throw new Error();
            }
        } catch {
            setError('❌ Error al actualizar el perfil.');
        }
    };

    return (
        <main className="perfil-wrapper">
            <section className="perfil-container">
                <h2 className="perfil-title">Editar Perfil Médico</h2>

                {(mensaje || error) && (
                    <div className={mensaje ? 'alert-success' : 'alert-error'}>
                        {mensaje || error}
                    </div>
                )}

                <div className="foto-circular">
                    <img
                        src={perfil.rutaFotoPerfil ? `/api${perfil.rutaFotoPerfil}` : '/images/noPhoto.png'}
                        alt="Foto del médico"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/noPhoto.png'; }}
                    />
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" name="nombre" value={perfil.nombre} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Especialidad</label>
                        <input type="text" name="especialidad" value={perfil.especialidad} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Costo de Consulta (USD)</label>
                        <input type="number" name="costoConsulta" value={perfil.costoConsulta} onChange={handleChange} min="1" step="0.01" required />
                    </div>

                    <div className="form-group">
                        <label>Localidad</label>
                        <input type="text" name="localidad" value={perfil.localidad} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Frecuencia de Citas (minutos)</label>
                        <input type="number" name="frecuenciaCitas" value={perfil.frecuenciaCitas} onChange={handleChange} min="10" max="120" required />
                    </div>

                    <div className="form-group">
                        <label>Presentación Profesional</label>
                        <textarea name="presentacion" value={perfil.presentacion} onChange={handleChange} rows="4" required />
                    </div>

                    <div className="form-group">
                        <label>Foto de Perfil</label>
                        <input type="file" name="fotoPerfil" onChange={handleFileChange} accept="image/*" />
                    </div>

                    <button type="submit">Guardar Cambios</button>
                </form>
            </section>
        </main>
    );
}

export default PerfilMedico;
