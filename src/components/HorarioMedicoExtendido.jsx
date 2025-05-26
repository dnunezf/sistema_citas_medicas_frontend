import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/auth/dashboard.css';

function HorarioMedicoExtendido() {
    const { id } = useParams();
    const [medico, setMedico] = useState(null);
    const [espacios, setEspacios] = useState([]);
    const [ocupados, setOcupados] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/medicos/${id}`)
            .then(res => res.json())
            .then(setMedico);

        fetch(`http://localhost:8080/api/dashboard`)
            .then(res => res.json())
            .then(data => {
                setEspacios(data.espaciosAgrupados[id] || {});
                setOcupados(data.horasOcupadas[id] || []);
            });
    }, [id]);

    const esHoraOcupada = (fechaHora) => {
        return ocupados.includes(fechaHora);
    };


    return (
        <main className="dashboard-container">
            <h2 className="dashboard-title">Horario Extendido</h2>

            <div style={{ marginBottom: '20px' }}>
                <a href="/" className="btn-volver">← Volver al Dashboard</a>
            </div>

            {medico && (
                <div className="doctor-card">
                    <div className="doctor-info">
                        <img
                            src={medico.rutaFotoPerfil || "/images/avatar.png"}
                            alt="Foto del Doctor"
                            className="foto-doctor"
                            onError={(e) => (e.target.src = "/images/avatar.png")}
                        />
                        <div className="doctor-text">
                            <strong>{medico.nombre}</strong>
                            <div className="especialidad">{medico.especialidad}</div>
                            <div className="costoConsulta">Precio de consulta: ${medico.costoConsulta}</div>
                            <div className="ubicacion">{medico.localidad}</div>
                        </div>
                    </div>

                    <div className="horarios">
                        {Object.entries(espacios)
                            .map(([fecha, horas]) => (
                                <div key={fecha}>
                                    <div className="fecha">
                                        {new Date(fecha).toLocaleDateString()}
                                    </div>
                                    <div className="horas">
                                        {horas.map((hora) => {
                                            const horaFormateada = new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            const clase = esHoraOcupada(hora) ? "hora ocupada" : "hora";
                                            const link = `/citas/confirmar?idMedico=${id}&fechaHora=${hora}`;
                                            return (
                                                <a key={hora} href={clase === "hora" ? link : undefined} className={clase}>
                                                    {horaFormateada}
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
