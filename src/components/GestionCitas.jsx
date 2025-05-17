import React, { useEffect, useState } from 'react';
import '../styles/auth/gestion_citas.css';

const GestionCitas = ({ idMedico }) => {
    const [citas, setCitas] = useState([]);
    const [estado, setEstado] = useState('ALL');
    const [nombrePaciente, setNombrePaciente] = useState('');
    const [medicoNombre, setMedicoNombre] = useState('');

    const cargarCitas = async () => {
        let url = `http://localhost:8080/api/citas/medico/${idMedico}`;

        const params = new URLSearchParams();
        if (estado !== 'ALL') params.append('estado', estado);
        if (nombrePaciente.trim()) params.append('nombrePaciente', nombrePaciente);
        if ([...params].length > 0) url += `/filtrar?${params.toString()}`;

        try {
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setCitas(data);
                if (data.length > 0) {
                    setMedicoNombre(data[0].nombreMedico);
                }
            } else {
                console.error("Error al cargar citas.");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    useEffect(() => {
        cargarCitas();
    }, [estado, nombrePaciente]);

    const handleEstadoChange = (e) => setEstado(e.target.value);
    const handleNombreChange = (e) => setNombrePaciente(e.target.value);

    const actualizarCita = async (idCita, nuevoEstado, notas) => {
        try {
            const res = await fetch(`http://localhost:8080/api/citas/${idCita}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado, notas })
            });

            if (res.ok) {
                cargarCitas();
            } else {
                alert("Error al actualizar la cita");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <main className="gestion-citas-container">
            <h2>
                Doctor - <span className="doctor-name">{medicoNombre}</span> - Citas
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
                            <span className={`status ${cita.estado === 'pendiente' ? 'pending' :
                                cita.estado === 'completada' ? 'attended' : 'default'}`}>
                                {cita.estado}
                            </span>
                        </div>

                        <div className="actions">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target;
                                const nuevoEstado = form.estado.value;
                                const notas = form.notas.value;
                                actualizarCita(cita.id, nuevoEstado, notas);
                            }}>
                                <select name="estado" defaultValue={cita.estado}>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmada">Confirmada</option>
                                    <option value="cancelada">Cancelada</option>
                                    <option value="completada">Completada</option>
                                </select>
                                <input type="text" name="notas" placeholder="Añadir notas..." defaultValue={cita.notas || ''} />
                                <button type="submit">Actualizar</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default GestionCitas;
