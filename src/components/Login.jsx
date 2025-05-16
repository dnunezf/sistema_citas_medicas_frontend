import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth/login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        id: '',
        clave: '',
    });

    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

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
                body: JSON.stringify({
                    id: formData.id,
                    clave: formData.clave,
                }),
            });

            if (response.ok) {
                const usuario = await response.json();
                setMensaje(`Bienvenido, ${usuario.nombre}`);
                setError('');
                // Redirigir a la página principal
                navigate('/');
            } else if (response.status === 401) {
                setError('Credenciales inválidas. Intenta de nuevo.');
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
                    <img
                        src="/images/login.jpg"
                        alt="Login Icon"
                        className="login-image"
                    />
                    <h2>Bienvenido</h2>
                    <p>Inicie sesión para acceder a su cuenta</p>
                </div>

                {(error || mensaje) && (
                    <div className={error ? 'error-message' : 'alert-success'}>
                        {error || mensaje}
                    </div>
                )}

                <div className="input-group">
                    <span className="icon">
                        <i className="fas fa-id-card"></i>
                    </span>
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
                    <span className="icon">
                        <i className="fas fa-lock"></i>
                    </span>
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
