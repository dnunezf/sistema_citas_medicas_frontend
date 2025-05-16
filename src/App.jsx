import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistroUsuario from './components/RegistroUsuario';
import PerfilMedico from './components/PerfilMedico.jsx';
import Login from './components/Login';

import './styles/global.css';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/registro" element={<RegistroUsuario />} />
                <Route path="/medico/perfil/:id" element={<PerfilMedico />} />
                <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
