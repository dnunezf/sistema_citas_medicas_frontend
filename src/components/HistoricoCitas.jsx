import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithInterceptor } from '../utils/fetchInterceptor'; // Importa tu interceptor
import '../styles/auth/historico_citas.css';

const HistoricoCitas = () => {
    const [citas, setCitas] = useState([]);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [medicoFiltro, setMedicoFiltro] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [infoMedicos, setInfoMedicos] = useState({});
    const [loading, setLoading] = useState(false);

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    useEffect(() => {
        if (!usuario || usuario.rol !== "PACIENTE") return;
        cargarCitas();
    }, [estadoFiltro, medicoFiltro]);

    const cargarCitas = async () => {
        if (!usuario) return;
        setLoading(true);
        setMensaje('');
        try {
            let url = `http://localhost:8080/api/paciente/citas/${usuario.id}`;
            const params = [];

            if (estadoFiltro) params.push(`estado=${estadoFiltro}`);
            if (medicoFiltro.trim()) params.push(`nombreMedico=${encodeURIComponent(medicoFiltro)}`);

            if (params.length > 0) {
                url += `/buscar?` + params.join("&");
            }

            const res = await fetchWithInterceptor(url);
            if (!res.ok) throw new Error('Error al cargar citas');
            const data = await res.json();
            setCitas(data);
            setMensaje(data.length === 0 ? "No hay citas que coincidan con los filtros." : '');

            const nuevosMedicos = {};
            await Promise.all(data.map(async cita => {
                if (!infoMedicos[cita.idMedico]) {
                    const resMed = await fetchWithInterceptor(`http://localhost:8080/api/medicos/${cita.idMedico}`);
                    if (resMed.ok) {
                        const medico = await resMed.json();
                        nuevosMedicos[cita.idMedico] = medico;
                    }
                }
            }));
            setInfoMedicos(prev => ({ ...prev, ...nuevosMedicos }));
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar las citas.");
            setCitas([]);
        } finally {
            setLoading(false);
        }
    };

    const claseEstado = (estado) => {
        switch (estado) {
            case 'pendiente': return 'pending';
            case 'completada': return 'attended';
            case 'confirmada': return 'default';
            case 'cancelada': return 'cancelled';
            default: return '';
        }
    };

    return (
        <div className="historico-container">
            <h2>
                Paciente - <span className="doctor-name">{usuario?.nombre}</span> - Historial de Citas
            </h2>

            <div className="filters">
                <form>
                    <label htmlFor="estado">Estado:</label>
                    <select
                        id="estado"
                        name="estado"
                        value={estadoFiltro}
                        onChange={e => setEstadoFiltro(e.target.value)}
                    >
                        <option value="">-- Todos los estados --</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="completada">Completada</option>
                    </select>

                    <label htmlFor="nombreMedico">Doctor:</label>
                    <input
                        type="text"
                        id="nombreMedico"
                        name="nombreMedico"
                        placeholder="Nombre del médico"
                        value={medicoFiltro}
                        onChange={e => setMedicoFiltro(e.target.value)}
                    />
                </form>
            </div>

            {mensaje && <div className="mensaje">{mensaje}</div>}
            {loading && <p>Cargando citas...</p>}

            <div className="appointments">
                {citas.map(cita => {
                    const medico = infoMedicos[cita.idMedico];
                    return (
                        <div key={cita.id} className="appointment">
                            <div className="patient-info">
                                <img
                                    className="foto-doctor"
                                    src={medico?.rutaFotoPerfil ? `http://localhost:8080${medico.rutaFotoPerfil}` : '/images/noPhoto.png'}
                                    alt="Foto del médico"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/noPhoto.png';
                                    }}
                                />
                                <div>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{cita.nombreMedico}</span><br />
                                    <span>{medico?.especialidad || '-'}</span><br />
                                    <span>Precio de consulta: ${medico?.costoConsulta?.toLocaleString('en-US') || '-'}</span><br />
                                    <span>{medico?.localidad || '-'}</span>
                                </div>
                            </div>

                            <div className="appointment-details">
                                <span className="date-time">
                                    {new Date(cita.fechaHora).toLocaleString('es-CR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                <span className={`status ${claseEstado(cita.estado)}`}>
                                    {cita.estado}
                                </span>
                            </div>

                            <div className="actions">
                                <Link to={`/citas/paciente/detalle/${cita.id}`} title="Ver notas de la cita">
                                    <img src="/images/binoculares.png" alt="Ver notas" className="icono-ver" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HistoricoCitas;
