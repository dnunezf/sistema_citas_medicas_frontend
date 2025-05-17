import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/auth/confirmar_cita.css';

function ConfirmarCita() {
    const [medico, setMedico] = useState(null);
    const [fechaHora, setFechaHora] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const idMedico = params.get("idMedico");
        const fecha = params.get("fechaHora");

        // Verifica login
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario || usuario.rol !== "PACIENTE") {
            sessionStorage.setItem("urlPendiente", location.pathname + location.search);
            navigate("/login");
            return;
        }

        setFechaHora(fecha);

        fetch(`http://localhost:8080/api/medicos/${idMedico}`)
            .then(res => res.json())
            .then(data => setMedico(data))
            .catch(err => setError("No se pudo cargar el médico."));
    }, [location, navigate]);

    const confirmar = () => {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario) return;

        fetch(`http://localhost:8080/api/citas/confirmar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idMedico: medico.id,
                idPaciente: usuario.id,
                fechaHora: fechaHora
            })
        })
            .then(res => {
                if (res.ok) {
                    navigate("/paciente/historico");
                } else {
                    throw new Error("No se pudo confirmar la cita.");
                }
            })
            .catch(() => setError("Error al confirmar la cita."));
    };

    const cancelar = () => {
        navigate("/");
    };

    return (
        <div className="confirmar-container">
            <h2>Confirmar Cita</h2>

            {error && <div className="error-message">{error}</div>}

            {medico && (
                <div className="detalle-cita">
                    <p><strong>Médico:</strong> {medico.nombre}</p>
                    <p><strong>Especialidad:</strong> {medico.especialidad}</p>
                    <p><strong>Fecha y Hora:</strong> {new Date(fechaHora).toLocaleString()}</p>

                    <div className="acciones">
                        <button onClick={confirmar} className="btn-confirmar">Confirmar</button>
                        <button onClick={cancelar} className="btn-cancelar">Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConfirmarCita;
