import React, { useState } from 'react';
import '../styles/auth/registro_usuario.css';

const RegistroUsuario = () => {
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        clave: '',
        confirmarClave: '',
        rol: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [errorClave, setErrorClave] = useState('');

    const rolesDisponibles = ['PACIENTE', 'MEDICO', 'ADMINISTRADOR'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setMensaje('');
        setErrorClave('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de ID numérico
        if (!/^\d{9,15}$/.test(formData.id)) {
            setError('El ID debe tener entre 9 y 15 dígitos numéricos.');
            return;
        }

        if (!formData.nombre.trim()) {
            setError('El nombre no puede estar vacío.');
            return;
        }

        if (formData.clave !== formData.confirmarClave) {
            setErrorClave('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.id,
                    nombre: formData.nombre,
                    clave: formData.clave,
                    rol: formData.rol
                })
            });

            const responseText = await response.text();

            if (response.status === 201) {
                setMensaje(responseText);
                setFormData({
                    id: '',
                    nombre: '',
                    clave: '',
                    confirmarClave: '',
                    rol: ''
                });
            } else {
                setError(responseText);
            }
        } catch (err) {
            setError('Error al registrar usuario: ' + err.message);
        }
    };

    return (
        <main className="main-wrapper">
            <div className="form-container">
                <img src="/images/user.jpg" alt="User Icon" className="user-icon" />
                <h2>Registro</h2>

                {error && <div className="alert-error">{error}</div>}
                {mensaje && <div className="alert-success">{mensaje}</div>}
                {errorClave && <div className="error-text">{errorClave}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="ID de usuario"
                            required
                            title="Debe tener entre 9 y 15 dígitos numéricos"
                        />
                    </div>

                    <div className="input-container">
                        <i className="fas fa-user-edit"></i>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                            required
                            pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                            title="Solo letras y espacios"
                        />
                    </div>

                    <div className="input-container">
                        <i className="fas fa-key"></i>
                        <input
                            type="password"
                            name="clave"
                            value={formData.clave}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                            minLength={8}
                            maxLength={100}
                        />
                    </div>

                    <div className="input-container">
                        <i className="fas fa-key"></i>
                        <input
                            type="password"
                            name="confirmarClave"
                            value={formData.confirmarClave}
                            onChange={handleChange}
                            placeholder="Confirmar contraseña"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="input-container">
                        <i className="fas fa-user-tag"></i>
                        <select name="rol" value={formData.rol} onChange={handleChange} required>
                            <option value="">Seleccione un rol</option>
                            {rolesDisponibles.map((rol) => (
                                <option key={rol} value={rol}>{rol}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" disabled={
                        !formData.id || !formData.nombre || !formData.clave || !formData.confirmarClave || !formData.rol
                    }>
                        Registrar
                    </button>
                </form>
            </div>
        </main>
    );
};

export default RegistroUsuario;
