import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistroUsuario from './components/RegistroUsuario';
import PerfilMedico from './components/PerfilMedico.jsx';
import Login from './components/Login';
import BuscarCita from './components/BuscarCita';
import GestionMedicos from './components/GestionMedicos';
import GestionCitasWrapper from "./auth/GestionCItasWrapper.jsx";
import CrearHorarioMedico from './components/CrearHorarioMedico.jsx';
import HorarioMedicoExtendido from './components/HorarioMedicoExtendido';
import ConfirmarCita from './components/ConfirmarCita';

import './styles/global.css';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/registro" element={<RegistroUsuario />} />
                <Route path="/medico/perfil/:id" element={<PerfilMedico />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<BuscarCita />} />
                <Route path="/admin/medicos" element={<GestionMedicos />} />
                <Route path="/medico/:id/gestion-citas" element={<GestionCitasWrapper />} />
                <Route path="/horarios/medico/:id" element={<CrearHorarioMedico />} />
                <Route path="/citas/horarios/:id" element={<HorarioMedicoExtendido />} />
                <Route path="/citas/confirmar" element={<ConfirmarCita />} />

            </Routes>

            <Footer />
        </Router>
    );
}

export default App;
