import React, { useEffect, useState } from 'react';
import { fetchWithInterceptor } from '../Utils/FetchInterceptor.js';
import '../styles/auth/gestion_citas.css';

const GestionCitas = ({ idMedico }) => {
    const [citas, setCitas] = useState([]);
    const [estado, setEstado] = useState('ALL');
    const [nombrePaciente, setNombrePaciente] = useState('');
    const [medicoNombre, setMedicoNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [actualizandoId, setActualizandoId] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const cargarNombreMedico = async () => {
        try {
            const res = await fetchWithInterceptor(`/api/medicos/${idMedico}`);
            if (res.ok) {
                const medico = await res.json();
                setMedicoNombre(medico.nombre || 'N/D');
            }
        } catch (err) {
            console.error("Error al cargar el nombre del médico:", err);
        }
    };

    const cargarCitas = async () => {
        let url = `/api/medico/citas/${idMedico}`;
        const params = new URLSearchParams();
        if (estado !== 'ALL') params.append('estado', estado);
        if (nombrePaciente.trim()) params.append('nombre', nombrePaciente);
        if (params.toString()) {
            url = `/api/medico/citas/${idMedico}/buscar?${params.toString()}`;
        }

        setLoading(true);
        setError('');
        setMensaje('');
        try {
            const res = await fetchWithInterceptor(url);
            if (res.ok) {
                const data = await res.json();
                setCitas(data);
            } else {
                setError("Error al cargar citas.");
                setCitas([]);
            }
        } catch {
            setError("Error de red al cargar citas.");
            setCitas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarNombreMedico();
        cargarCitas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estado, nombrePaciente]);

    const handleEstadoChange = (e) => setEstado(e.target.value);
    const handleNombreChange = (e) => setNombrePaciente(e.target.value);

    const actualizarCita = async (idCita, nuevoEstado, notas) => {
        setActualizandoId(idCita);
        setMensaje('');
        setError('');
        try {
            const url = `/api/medico/citas/${idCita}?estado=${nuevoEstado}&notas=${encodeURIComponent(notas)}`;
            const res = await fetchWithInterceptor(url, { method: 'PUT' });

            if (res.ok) {
                setMensaje('Cita actualizada correctamente.');
                cargarCitas();
            } else {
                setError("Error al actualizar la cita");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Error de red al actualizar la cita");
        } finally {
            setActualizandoId(null);
            setTimeout(() => {
                setMensaje('');
                setError('');
            }, 4000);
        }
    };

    return (
        <main className="gestion-citas-container">
            <h2>
                Doctor - <span className="doctor-name">{medicoNombre || "N/D"}</span> - Citas
            </h2>

            <div className="filters">
                <label htmlFor="estado">Estado:</label>
                <select id="estado" value={estado} onChange={handleEstadoChange}>
                    <option value="ALL">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="completada">Completada</option>
                </select>

                <label htmlFor="nombrePaciente">Paciente:</label>
                <input
                    type="text"
                    id="nombrePaciente"
                    value={nombrePaciente}
                    onChange={handleNombreChange}
                    placeholder="Nombre del paciente"
                />
            </div>

            {loading && <p>Cargando citas...</p>}
            {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && citas.length === 0 && !error && <p className="no-citas">No hay citas para mostrar.</p>}

            {!loading && citas.length > 0 && (
                <div className="appointments">
                    {citas.map((cita) => (
                        <div key={cita.id} className="appointment">
                            <div className="patient-info">
                                <img src="/images/avatar.png" alt="Paciente" />
                                <span>{cita.nombrePaciente}</span>
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
                                <span
                                    className={`status ${
                                        cita.estado === 'pendiente'
                                            ? 'pending'
                                            : cita.estado === 'completada'
                                                ? 'attended'
                                                : 'default'
                                    }`}
                                >
                                    {cita.estado}
                                </span>
                                <p className="notas">
                                    <strong>Notas:</strong> {cita.notas || '---'}
                                </p>
                            </div>

                            <div className="actions">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.target;
                                        const nuevoEstado = form.estado.value;
                                        const notas = form.notas.value;
                                        actualizarCita(cita.id, nuevoEstado, notas);
                                    }}
                                >
                                    <select name="estado" defaultValue={cita.estado} disabled={actualizandoId === cita.id}>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="confirmada">Confirmada</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="completada">Completada</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="notas"
                                        placeholder="Añadir notas..."
                                        defaultValue={cita.notas || ''}
                                        disabled={actualizandoId === cita.id}
                                    />
                                    <button type="submit" disabled={actualizandoId === cita.id}>Actualizar</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default GestionCitas;
