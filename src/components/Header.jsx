import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/fragments.css';

const Header = () => {
    const { usuario, setUsuario } = useContext(UserContext);
    const navigate = useNavigate();

    const isPaciente = usuario?.rol === 'PACIENTE';
    const isMedico = usuario?.rol === 'MEDICO';
    const isAdmin = usuario?.rol === 'ADMINISTRADOR';

    const handleLogout = () => {
        sessionStorage.removeItem("usuario");
        setUsuario(null);
        navigate("/login");
    };

    const handlePerfil = () => {
        if (isPaciente) {
            navigate('/paciente/perfil');
        } else if (isMedico) {
            navigate(`/medico/perfil/${usuario.id}`);
        }
    };

    const handleCrearHorario = () => {
        if (isMedico) {
            navigate(`/horarios/medico/${usuario.id}`);
        }
    };

    const handleCitas = () => {
        if (isPaciente) {
            navigate('/paciente/historico');
        } else if (isAdmin) {
            navigate('/admin/medicos');
        } else {
            navigate('/login');
        }
    };

    return (
        <header>
            <div className="top-bar">
                <div className="logo">
                    <a href="/"><img src="/images/logo.png" alt="Logo" /></a>
                    <span className="brand-title">Citas Médicas</span>
                </div>
                <div className="contact-info">
                    <span>📞 +506 5467 0937</span>
                </div>
            </div>

            <nav className="main-nav">
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><button onClick={handleCitas}>Citas</button></li>

                    {!usuario ? (
                        <li><a href="/login" className="login-button">Iniciar Sesión</a></li>
                    ) : (
                        <li className="dropdown">
                            <button className="login-button">{usuario.nombre}</button>
                            <ul className="dropdown-content">
                                <li><button onClick={handlePerfil}>Perfil</button></li>
                                {isMedico && (
                                    <li><button onClick={handleCrearHorario}>Crear Horarios</button></li>
                                )}
                                {isAdmin && (
                                    <li><button onClick={() => navigate('/admin/medicos')}>Gestión Médicos</button></li>
                                )}
                                <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
                            </ul>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
