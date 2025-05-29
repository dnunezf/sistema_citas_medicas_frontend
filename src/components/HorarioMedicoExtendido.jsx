import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchWithInterceptor } from '../utils/fetchInterceptor'; // Importa tu interceptor
import '../styles/auth/dashboard.css';

function HorarioMedicoExtendido() {
    const { id } = useParams();
    const [medico, setMedico] = useState(null);
    const [espacios, setEspacios] = useState({});
    const [ocupados, setOcupados] = useState([]);

    // Función para mostrar la fecha correctamente con zona de Costa Rica
    const formatearFechaCR = (fechaISO) => {
        const date = new Date(fechaISO + 'T00:00:00-06:00'); // Zona horaria CR
        return date.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatearHoraCR = (fechaHora) => {
        const date = new Date(fechaHora);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resMedico = await fetchWithInterceptor(`/api/medicos/${id}`);
                if (!resMedico.ok) throw new Error('Error al cargar médico');
                const medicoData = await resMedico.json();
                setMedico(medicoData);

                const resEspacios = await fetchWithInterceptor(`/api/horarios/extendido/${id}`);
                if (!resEspacios.ok) throw new Error('Error al cargar horarios');
                const espaciosData = await resEspacios.json();
                setEspacios(espaciosData || {});

                const resDashboard = await fetchWithInterceptor(`/api/dashboard`);
                if (!resDashboard.ok) throw new Error('Error al cargar dashboard');
                const dashboardData = await resDashboard.json();
                setOcupados(dashboardData.horasOcupadas[id] || []);
            } catch (error) {
                console.error(error);
                // Opcional: puedes agregar un estado para mostrar mensaje de error en UI
            }
        };

        cargarDatos();
    }, [id]);

    const esHoraOcupada = (fechaHora) => {
        return ocupados.includes(fechaHora);
    };

    return (
        <main className="dashboard-container">
            <h2 className="dashboard-title">Horario Extendido</h2>

            <div style={{ marginBottom: '20px' }}>
                <Link to="/" className="btn-volver">← Volver al Dashboard</Link>
            </div>

            {medico && (
                <div className="doctor-card">
                    <div className="doctor-info">
                        <img
                            className="foto-doctor"
                            src={medico.rutaFotoPerfil ? `http://localhost:8080${medico.rutaFotoPerfil}` : '/images/noPhoto.png'}
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
                        {Object.entries(espacios).map(([fecha, horas]) => (
                            <div key={fecha}>
                                <div className="fecha">{formatearFechaCR(fecha)}</div>
                                <div className="horas">
                                    {horas.map((hora) => {
                                        const clase = esHoraOcupada(hora) ? "hora ocupada" : "hora";
                                        const link = `/citas/confirmar?idMedico=${id}&fechaHora=${hora}`;
                                        return (
                                            <a
                                                key={hora}
                                                href={clase === "hora" ? link : undefined}
                                                className={clase}
                                                style={{ cursor: clase === "hora" ? 'pointer' : 'default' }}
                                            >
                                                {formatearHoraCR(hora)}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}

export default HorarioMedicoExtendido;
