import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import GestionMedicos from './components/GestionMedicos';
import GestionCitasWrapper from './auth/GestionCitasWrapper.jsx';
import CrearHorarioMedico from './components/CrearHorarioMedico.jsx';
import HorarioMedicoExtendido from './components/HorarioMedicoExtendido';
import ConfirmarCita from './components/ConfirmarCita';
import HistoricoCitas from './components/HistoricoCitas';
import PacientePerfil from './components/PacientePerfil';
import DetalleCita from './components/DetalleCita.jsx';
import RegistroUsuario from './components/RegistroUsuario';
import PerfilMedico from './components/PerfilMedico';
import Login from './components/Login';
import BuscarCita from './components/BuscarCita';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const location = useLocation();

    // Rutas donde NO se debe mostrar el Header
    const rutasSinHeader = ['/login', '/registro', '/citas/confirmar'];
    const mostrarHeader = !rutasSinHeader.includes(location.pathname);

    return (
        <>
            {mostrarHeader && <Header />}

            <Routes>
                {/* Rutas públicas */}
                <Route path="/registro" element={<RegistroUsuario />} />
                <Route path="/medico/perfil/:id" element={<PerfilMedico />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<BuscarCita />} />
                <Route path="/citas/confirmar" element={<ConfirmarCita />} /> {/* ESTA ES LA CLAVE */}

                {/* Rutas protegidas anidadas dentro de PrivateRoute */}
                <Route element={<PrivateRoute />}>
                    <Route path="/admin/medicos" element={<GestionMedicos />} />
                    <Route path="/medico/:id/gestion-citas" element={<GestionCitasWrapper />} />
                    <Route path="/horarios/medico/:id" element={<CrearHorarioMedico />} />
                    <Route path="/citas/horarios/:id" element={<HorarioMedicoExtendido />} />
                    <Route path="/paciente/historico" element={<HistoricoCitas />} />
                    <Route path="/paciente/perfil" element={<PacientePerfil />} />
                    <Route path="/citas/paciente/detalle/:id" element={<DetalleCita />} />
                </Route>
            </Routes>

            <Footer />
        </>
    );
}

export default App;
