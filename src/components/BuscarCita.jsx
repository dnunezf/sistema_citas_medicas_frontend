import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth/dashboard.css';

// fetchWithInterceptor que agrega token Authorization automáticamente
async function fetchWithInterceptor(url, options = {}) {
    const token = sessionStorage.getItem("token");
    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const newOptions = { ...options, headers };
    return fetch(url, newOptions);
}

const BuscarCita = () => {
    const [especialidad, setEspecialidad] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [especialidades, setEspecialidades] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [espaciosAgrupados, setEspaciosAgrupados] = useState({});
    const [horasOcupadas, setHorasOcupadas] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleClickHora = (medicoId, hora, clase) => {
        if (clase === "hora") {
            const usuario = JSON.parse(sessionStorage.getItem("usuario"));
            const destino = `/citas/confirmar?idMedico=${medicoId}&fechaHora=${hora}`;

            if (!usuario || usuario.rol !== "PACIENTE") {
                sessionStorage.setItem("urlPendiente", destino);
                navigate("/login");
            } else {
                navigate(destino);
            }
        }
    };

    const fetchDashboard = async () => {
        try {
            let url = '/api/dashboard';
            const params = [];

            if (especialidad) params.push(`especialidad=${encodeURIComponent(especialidad)}`);
            if (localidad) params.push(`localidad=${encodeURIComponent(localidad)}`);

            if (params.length > 0) url += '?' + params.join('&');

            const res = await fetchWithInterceptor(url);
            if (!res.ok) throw new Error("Error al cargar datos del dashboard");

            const data = await res.json();
            setMedicos(data.medicos);
            setEspaciosAgrupados(data.espaciosAgrupados);
            setHorasOcupadas(data.horasOcupadas);
            setEspecialidades(data.especialidades);
            setError('');
        } catch (e) {
            console.error(e);
            setError("Error al cargar los datos. Intenta recargar la página.");
        }
    };

    useEffect(() => {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (usuario) {
            if (usuario.rol === 'MEDICO') {
                navigate(`/medico/${usuario.id}/gestion-citas`);
                return;
            } else if (usuario.rol === 'ADMINISTRADOR') {
                navigate('/admin/medicos');
                return;
            }
        }

        // Solo pacientes o usuarios anónimos acceden al dashboard
        fetchDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchDashboard();
    };

    const esHoraOcupada = (idMedico, fechaHora) => {
        return horasOcupadas[idMedico]?.includes(fechaHora);
    };

    const obtenerFechaMasProxima = (espacios) => {
        const fechas = Object.keys(espacios);
        if (fechas.length === 0) return null;
        return fechas.sort((a, b) => new Date(a) - new Date(b))[0];
    };

    const formatearFechaCR = (fechaISO) => {
        const date = new Date(fechaISO + 'T00:00:00-06:00');
        return date.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatearHora = (horaISO) => {
        const date = new Date(horaISO);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <main className="dashboard-container">
            <h2 className="dashboard-title">Buscar Médicos</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form-busqueda">
                <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}>
                    <option value="">-- Todas las especialidades --</option>
                    {especialidades.map((esp, i) => (
                        <option key={i} value={esp}>{esp}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Ciudad o zona"
                    value={localidad}
                    onChange={(e) => setLocalidad(e.target.value)}
                />

                <button type="submit">Buscar</button>
            </form>

            {medicos.map((medico) => {
                const espacios = espaciosAgrupados[medico.id] || {};
                const fechaProxima = obtenerFechaMasProxima(espacios);
                const horas = fechaProxima ? espacios[fechaProxima] : [];

                return (
                    <div key={medico.id} className="doctor-card">
                        <div className="doctor-info">
                            <img
                                className="foto-doctor"
                                src={medico.rutaFotoPerfil ? medico.rutaFotoPerfil : '/images/noPhoto.png'}
                                alt="Foto del médico"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/noPhoto.png'; }}
                            />
                            <div className="doctor-text">
                                <strong>{medico.nombre}</strong>
                                <div className="especialidad">{medico.especialidad}</div>
                                <div className="costoConsulta">Precio de consulta: ${medico.costoConsulta}</div>
                                <div className="ubicacion">{medico.localidad}</div>
                            </div>
                        </div>

                        <div className="horarios">
                            {Object.keys(espacios).length > 0 ? (
                                Object.entries(espacios).map(([fecha, horas]) => (
                                    <div key={fecha}>
                                        <div className="fecha">{formatearFechaCR(fecha)}</div>
                                        <div className="horas">
                                            {horas.map((hora) => {
                                                const clase = esHoraOcupada(medico.id, hora) ? "hora ocupada" : "hora";
                                                return (
                                                    <span
                                                        key={hora}
                                                        className={clase}
                                                        style={{ cursor: clase === "hora" ? "pointer" : "default" }}
                                                        onClick={() => handleClickHora(medico.id, hora, clase)}
                                                    >
                                                        {formatearHora(hora)}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay horarios disponibles próximamente.</p>
                            )}
                        </div>

                        <div className="schedule-button">
                            <Link to={`/citas/horarios/${medico.id}`}>Horario Extendido →</Link>
                        </div>
                    </div>
                );
            })}
        </main>
    );
};

export default BuscarCita;
