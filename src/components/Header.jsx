import React, { useContext, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../Utils/Auth.js';
import '../styles/fragments.css';

const Header = () => {
    const { usuario, setUsuario } = useContext(UserContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const timeoutRef = useRef(null);

    const handleLogout = () => {
        logout();
        setUsuario(null);
        sessionStorage.setItem("logoutMensaje", "Sesión cerrada con éxito.");
        navigate("/");
    };

    const handlePerfil = () => {
        if (usuario?.rol === 'PACIENTE') navigate('/paciente/perfil');
        if (usuario?.rol === 'MEDICO') navigate(`/medico/perfil/${usuario.id}`);
    };

    const handleCrearHorario = () => {
        if (usuario?.rol === 'MEDICO') navigate(`/horarios/medico/${usuario.id}`);
    };

    const handleCitas = () => {
        if (!usuario) {
            navigate('/login');
        } else if (usuario.rol === 'PACIENTE') {
            navigate('/paciente/historico');
        } else if (usuario.rol === 'MEDICO') {
            navigate(`/medico/${usuario.id}/gestion-citas`);
        }
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setDropdownOpen(false), 300);
    };

    return (
        <header role="banner">
            <div className="top-bar">
                <div className="logo">
                    <Link to="/" aria-label="Inicio">
                        <img src="/images/logo.png" alt="Logo Citas Médicas" />
                    </Link>
                    <span className="brand-title">Citas Médicas</span>
                </div>
                <div className="contact-info">
                    <span>📞 +506 5467 0937</span>
                </div>
            </div>

            <nav className="main-nav" role="navigation">
                <ul>
                    {/* Mostrar "Inicio" solo si es PACIENTE o no ha iniciado sesión */}
                    {(!usuario || usuario.rol === 'PACIENTE') && (
                        <li><Link to="/">Inicio</Link></li>
                    )}

                    {/* Mostrar "Citas" solo si es PACIENTE o MÉDICO */}
                    {usuario?.rol === 'PACIENTE' || usuario?.rol === 'MEDICO' ? (
                        <li><button type="button" onClick={handleCitas}>Citas</button></li>
                    ) : null}

                    {/* Mostrar Login si no hay usuario */}
                    {!usuario ? (
                        <li><Link to="/login" className="login-button">Iniciar Sesión</Link></li>
                    ) : (
                        <li className="dropdown">
                            <div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button type="button" className="login-button">{usuario.nombre}</button>
                                {dropdownOpen && (
                                    <ul className="dropdown-content">
                                        {/* Perfil para PACIENTE y MÉDICO */}
                                        {usuario.rol === 'PACIENTE' && (
                                            <li><button onClick={handlePerfil}>Perfil</button></li>
                                        )}
                                        {usuario.rol === 'MEDICO' && (
                                            <>
                                                <li><button onClick={handlePerfil}>Perfil</button></li>
                                                <li><button onClick={handleCrearHorario}>Crear Horarios</button></li>
                                            </>
                                        )}
                                        {/* Solo cierre de sesión para ADMIN */}
                                        <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
                                    </ul>
                                )}
                            </div>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
