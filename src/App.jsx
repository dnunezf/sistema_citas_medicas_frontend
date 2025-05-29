import React from 'react';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

import GestionMedicos from './components/GestionMedicos';
import GestionCitasWrapper from "./auth/GestionCitasWrapper.jsx";
import CrearHorarioMedico from './components/CrearHorarioMedico.jsx';
import HorarioMedicoExtendido from './components/HorarioMedicoExtendido';
import ConfirmarCita from './components/ConfirmarCita';
import HistoricoCitas from './components/HistoricoCitas';
import PacientePerfil from './components/PacientePerfil';
import DetalleCita from "./components/DetalleCita.jsx";
import RegistroUsuario from './components/RegistroUsuario';
import PerfilMedico from './components/PerfilMedico';
import Login from './components/Login';
import BuscarCita from './components/BuscarCita';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <UserProvider>
            <Header />

            <Routes>
                {/* Rutas públicas */}
                <Route path="/registro" element={<RegistroUsuario />} />
                <Route path="/medico/perfil/:id" element={<PerfilMedico />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<BuscarCita />} />

                {/* Rutas protegidas */}
                <Route
                    path="/admin/medicos"
                    element={
                        <PrivateRoute>
                            <GestionMedicos />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/medico/:id/gestion-citas"
                    element={
                        <PrivateRoute>
                            <GestionCitasWrapper />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/horarios/medico/:id"
                    element={
                        <PrivateRoute>
                            <CrearHorarioMedico />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/citas/horarios/:id"
                    element={
                        <PrivateRoute>
                            <HorarioMedicoExtendido />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/citas/confirmar"
                    element={
                        <PrivateRoute>
                            <ConfirmarCita />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/paciente/historico"
                    element={
                        <PrivateRoute>
                            <HistoricoCitas />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/paciente/perfil"
                    element={
                        <PrivateRoute>
                            <PacientePerfil />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/citas/paciente/detalle/:id"
                    element={
                        <PrivateRoute>
                            <DetalleCita />
                        </PrivateRoute>
                    }
                />
            </Routes>

            <Footer />
        </UserProvider>
    );
}

export default App;
