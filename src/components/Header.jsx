import React from 'react';
import '../styles/fragments.css';

const Header = () => {
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
                    <li><a href="/citas">Citas</a></li>
                    <li><a href="/perfil">Perfil</a></li>
                    <li><a href="/login" className="login-button">Iniciar Sesión</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;