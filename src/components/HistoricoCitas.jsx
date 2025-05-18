import React, { useEffect, useState } from 'react';
import '../styles/auth/historico_citas.css';

const HistoricoCitas = () => {
    const [citas, setCitas] = useState([]);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [medicoFiltro, setMedicoFiltro] = useState('');
    const [mensaje, setMensaje] = useState('');

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    useEffect(() => {
        if (!usuario || usuario.rol !== "PACIENTE") return;

        cargarCitas();
    }, []);

    const cargarCitas = () => {
        let url = `http://localhost:8080/api/paciente/citas/${usuario.id}`;
        const params = [];

        if (estadoFiltro) params.push(`estado=${estadoFiltro}`);
        if (medicoFiltro.trim()) params.push(`nombreMedico=${encodeURIComponent(medicoFiltro)}`);

        if (params.length > 0) {
            url += `/buscar?` + params.join("&");
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setCitas(data);
                if (data.length === 0) {
                    setMensaje("No hay citas que coincidan con los filtros.");
                } else {
                    setMensaje('');
                }
            })
            .catch(() => setMensaje("Error al cargar las citas."));
    };

    const manejarSubmit = (e) => {
        e.preventDefault();
        cargarCitas();
    };

    return (
        <div className="historico-container">
            <h2>Historial de Citas</h2>

            <form className="form-filtros" onSubmit={manejarSubmit}>
                <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                    <option value="">-- Todos los estados --</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                </select>

                <input
                    type="text"
                    placeholder="Buscar por nombre del médico"
                    value={medicoFiltro}
                    onChange={(e) => setMedicoFiltro(e.target.value)}
                />

                <button type="submit">Filtrar</button>
            </form>

            {mensaje && <div className="mensaje">{mensaje}</div>}

            <table className="tabla-citas">
                <thead>
                <tr>
                    <th>Fecha y Hora</th>
                    <th>Médico</th>
                    <th>Especialidad</th>
                    <th>Estado</th>
                    <th>Notas</th>
                </tr>
                </thead>
                <tbody>
                {citas.map((cita) => (
                    <tr key={cita.id}>
                        <td>{new Date(cita.fechaHora).toLocaleString()}</td>
                        <td>{cita.nombreMedico}</td>
                        <td>{cita.especialidad || '-'}</td>
                        <td>{cita.estado}</td>
                        <td>{cita.notas || '---'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoricoCitas;
