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

    const isPaciente = usuario?.rol === 'PACIENTE';
    const isMedico = usuario?.rol === 'MEDICO';
    const isAdmin = usuario?.rol === 'ADMINISTRADOR';

    const handleLogout = () => {
        logout();           // Limpia sessionStorage y redirige a login
        setUsuario(null);   // Limpia contexto para refrescar UI
    };

    const handlePerfil = () => {
        if (isPaciente) navigate('/paciente/perfil');
        else if (isMedico) navigate(`/medico/perfil/${usuario.id}`);
    };

    const handleCrearHorario = () => {
        if (isMedico) navigate(`/horarios/medico/${usuario.id}`);
    };

    const handleCitas = () => {
        if (isPaciente) navigate('/paciente/historico');
        else if (isAdmin) navigate('/admin/medicos');
        else navigate('/login');
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownOpen(false);
        }, 300);
    };

    return (
        <header>
            <div className="top-bar">
                <div className="logo">
                    <Link to="/">
                        <img src="/images/logo.png" alt="Logo" />
                    </Link>
                    <span className="brand-title">Citas Médicas</span>
                </div>
                <div className="contact-info">
                    <span>📞 +506 5467 0937</span>
                </div>
            </div>

            <nav className="main-nav">
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li>
                        <button type="button" onClick={handleCitas}>Citas</button>
                    </li>

                    {!usuario ? (
                        <li><Link to="/login" className="login-button">Iniciar Sesión</Link></li>
                    ) : (
                        <li className="dropdown" style={{ position: 'relative' }}>
                            <div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                style={{ display: 'inline-block' }}
                            >
                                <button type="button" className="login-button">{usuario.nombre}</button>
                                {dropdownOpen && (
                                    <ul className="dropdown-content">
                                        <li><button type="button" onClick={handlePerfil}>Perfil</button></li>
                                        {isMedico && <li><button type="button" onClick={handleCrearHorario}>Crear Horarios</button></li>}
                                        {isAdmin && <li><button type="button" onClick={() => navigate('/admin/medicos')}>Gestión Médicos</button></li>}
                                        <li><button type="button" onClick={handleLogout}>Cerrar Sesión</button></li>
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
