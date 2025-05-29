import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithInterceptor } from '../Utils/FetchInterceptor.js'; // <-- importa aquí
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
        console.log("PacientePerfil montado");
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        console.log("Usuario en sessionStorage:", usuario);

        if (!usuario || usuario.rol !== "PACIENTE") {
            console.log("Usuario no válido o no es paciente. Redirigiendo a login.");
            navigate('/login');
            return;
        }

        const cargarPerfil = async () => {
            try {
                console.log("Solicitando datos del paciente con ID:", usuario.id);
                const res = await fetchWithInterceptor(`/api/pacientes/${usuario.id}`);
                console.log("Respuesta del fetch:", res);

                if (!res.ok) {
                    throw new Error(`Error HTTP ${res.status}`);
                }

                const data = await res.json();
                console.log("Datos recibidos:", data);

                setForm({
                    id: data.id,
                    nombre: data.nombre,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    fechaNacimiento: data.fechaNacimiento
                });
                setError('');
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                setError("❌ No se pudo cargar el perfil.");
            }
        };

        cargarPerfil();
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMensaje('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{8,15}$/.test(form.telefono)) {
            setError("⚠️ El teléfono debe contener entre 8 y 15 dígitos.");
            return;
        }

        try {
            console.log("Enviando datos actualizados:", form);
            const res = await fetchWithInterceptor(`/api/pacientes/${form.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            console.log("Respuesta de actualización:", res);

            if (res.ok) {
                setMensaje("✅ Perfil actualizado correctamente.");
                const usuario = JSON.parse(sessionStorage.getItem("usuario"));
                usuario.nombre = form.nombre;
                sessionStorage.setItem("usuario", JSON.stringify(usuario));
                setError('');
            } else {
                setError("❌ No se pudo actualizar el perfil.");
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            setError("❌ Error al conectar con el servidor.");
        }
    };

    return (
        <div className="perfil-paciente-container">
            <h2><i className="fas fa-user-circle"></i> Mi Perfil</h2>

            {(mensaje || error) && (
                <div className={mensaje ? 'alert-success' : 'alert-error'}>
                    {mensaje || error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="perfil-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Nombre completo"
                    />
                </div>

                <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        required
                        placeholder="Ej. 88881234"
                    />
                </div>

                <div className="form-group">
                    <label>Dirección:</label>
                    <input
                        type="text"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        required
                        placeholder="Dirección exacta"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default PacientePerfil;
