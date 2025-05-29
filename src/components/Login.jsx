import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/auth/login.css';

const Login = () => {
    const [formData, setFormData] = useState({ id: '', clave: '' });
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const { setUsuario } = useContext(UserContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setMensaje('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id.trim() || !formData.clave.trim()) {
            setError('Por favor ingrese ID y contraseña.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const usuario = await response.json();

                // Guarda token si viene incluido (ajusta si tu backend envía token aparte)
                if (usuario.token) {
                    sessionStorage.setItem("token", usuario.token);
                }

                sessionStorage.setItem("usuario", JSON.stringify(usuario.usuario || usuario)); // Guarda usuario
                setUsuario(usuario.usuario || usuario);  // Actualiza contexto para refrescar UI
                setMensaje(`Bienvenido, ${usuario.usuario?.nombre || usuario.nombre}`);
                setError('');

                const urlPendiente = sessionStorage.getItem("urlPendiente");
                if (urlPendiente) {
                    sessionStorage.removeItem("urlPendiente");
                    navigate(urlPendiente);
                    return;
                }

                const rol = usuario.usuario?.rol || usuario.rol;

                if (rol === 'MEDICO') {
                    if (usuario.perfilCompleto) {
                        navigate(`/citas/medico/${usuario.usuario?.id || usuario.id}`);
                    } else {
                        navigate(`/medico/perfil/${usuario.usuario?.id || usuario.id}`);
                    }
                } else if (rol === 'ADMINISTRADOR') {
                    navigate('/admin/medicos');
                } else if (rol === 'PACIENTE') {
                    navigate('/');
                } else {
                    setError('Rol no reconocido.');
                }
            } else if (response.status === 401 || response.status === 403) {
                try {
                    const errorData = await response.json();
                    setError(errorData.mensaje || 'Credenciales inválidas. Intenta de nuevo.');
                } catch {
                    setError('Credenciales inválidas. Intenta de nuevo.');
                }
                setMensaje('');
            } else {
                setError('Error inesperado. Intenta más tarde.');
                setMensaje('');
            }
        } catch (err) {
            setError('Error al conectar con el servidor: ' + err.message);
            setMensaje('');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-header">
                    <img src="/images/login.jpg" alt="Login Icon" className="login-image" />
                    <h2>Bienvenido</h2>
                    <p>Inicie sesión para acceder a su cuenta</p>
                </div>

                {(error || mensaje) && (
                    <div className={error ? 'error-message' : 'alert-success'}>
                        {error || mensaje}
                    </div>
                )}

                <div className="input-group">
                    <span className="icon"><i className="fas fa-id-card"></i></span>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="ID de Usuario"
                        required
                        pattern="\d{9,15}"
                        title="El ID debe contener entre 9 y 15 dígitos numéricos"
                        maxLength={15}
                    />
                </div>

                <div className="input-group">
                    <span className="icon"><i className="fas fa-lock"></i></span>
                    <input
                        type="password"
                        name="clave"
                        value={formData.clave}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        required
                        minLength={8}
                    />
                </div>

                <button type="submit" className="btn-login" disabled={!formData.id || !formData.clave}>
                    Iniciar Sesión
                </button>

                <div className="register-container">
                    <span>¿No tienes una cuenta?</span>
                    <a href="/registro" className="btn-register">
                        Regístrate aquí
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Login;
