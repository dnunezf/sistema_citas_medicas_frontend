import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/auth/PerfilMedico.css';

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

    useEffect(() => {
        fetch(`/api/medicos/${id}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => setPerfil(data))
            .catch(() => setMensaje('No se pudo cargar el perfil.'));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfil(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFotoPerfil(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in perfil) {
            formData.append(key, perfil[key]);
        }
        if (fotoPerfil) {
            formData.append('fotoPerfil', fotoPerfil);
        }

        fetch(`/api/medicos/${id}`, {
            method: 'PUT',
            body: formData
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                setPerfil(data);
                setMensaje('Perfil actualizado correctamente.');
            })
            .catch(() => setMensaje('Error al actualizar el perfil.'));
    };

    return (
        <div className="perfil-medico">
            <h2 className="title">Actualizar Información del Médico</h2>
            {mensaje && <p className="message">{mensaje}</p>}

            <div className="foto-circular">
                <img
                    src={perfil.rutaFotoPerfil || '/images/no_photo.png'}
                    alt="Foto del médico"
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
                    <label>Presentación</label>
                    <textarea name="presentacion" value={perfil.presentacion} onChange={handleChange} rows="4" required />
                </div>

                <div className="form-group">
                    <label>Subir Nueva Foto de Perfil</label>
                    <input type="file" name="fotoPerfil" onChange={handleFileChange} accept="image/*" />
                </div>

                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
}

export default PerfilMedico;
