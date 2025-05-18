import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth/paciente_perfil.css';

const PacientePerfil = () => {
    const [form, setForm] = useState({
        id: '',
        nombre: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: ''
    });
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario || usuario.rol !== "PACIENTE") {
            navigate('/login');
            return;
        }

        fetch(`http://localhost:8080/api/pacientes/${usuario.id}`)
            .then(res => res.json())
            .then(data => {
                setForm({
                    id: data.id,
                    nombre: data.nombre,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    fechaNacimiento: data.fechaNacimiento
                });
            })
            .catch(() => setError("No se pudo cargar el perfil."));
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMensaje('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id: form.id,
            nombre: form.nombre,
            telefono: form.telefono,
            direccion: form.direccion,
            fechaNacimiento: form.fechaNacimiento
            // ❌ NO se incluye 'clave' para no sobrescribirla con null
        };

        try {
            const res = await fetch(`http://localhost:8080/api/pacientes/${form.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMensaje("✅ Perfil actualizado correctamente.");
                const usuario = JSON.parse(sessionStorage.getItem("usuario"));
                usuario.nombre = form.nombre;
                sessionStorage.setItem("usuario", JSON.stringify(usuario));
            } else {
                setError("❌ No se pudo actualizar el perfil.");
            }
        } catch (err) {
            setError("❌ Error al conectar con el servidor.");
        }
    };

    return (
        <div className="perfil-paciente-container">
            <h2>Mi Perfil</h2>

            {(mensaje || error) && (
                <div className={mensaje ? 'alert-success' : 'alert-error'}>
                    {mensaje || error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="perfil-form">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

                <label>Teléfono:</label>
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required />

                <label>Dirección:</label>
                <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required />

                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />

                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default PacientePerfil;
