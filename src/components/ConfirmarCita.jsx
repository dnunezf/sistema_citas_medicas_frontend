import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/auth/confirmar_cita.css';

function ConfirmarCita() {
    const [medico, setMedico] = useState(null);
    const [fechaHora, setFechaHora] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const idMedico = params.get("idMedico");
        const fecha = params.get("fechaHora");

        const usuario = JSON.parse(sessionStorage.getItem("usuario"));

        // Validar rol paciente para acceso
        if (!usuario || usuario.rol !== "PACIENTE") {
            sessionStorage.setItem("urlPendiente", location.pathname + location.search);
            navigate("/login");
            return;
        }

        setFechaHora(fecha);

        fetch(`http://localhost:8080/api/medicos/${idMedico}`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar el médico.");
                return res.json();
            })
            .then(data => setMedico(data))
            .catch(() => setError("No se pudo cargar el médico."));
    }, [location, navigate]);

    const confirmar = () => {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario || usuario.rol !== "PACIENTE" || !medico || !fechaHora) {
            setError("Usuario no autorizado o datos incompletos.");
            return;
        }

        // Enviar la fecha tal cual viene del query (ISO 8601), o convertirla si fuera necesario
        // Aquí asumo que fechaHora ya está en formato ISO 8601 válido
        fetch(`http://localhost:8080/api/medico/citas/confirmar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idMedico: medico.id,
                idPaciente: usuario.id,
                fechaHora: fechaHora
            })
        })
            .then(async res => {
                if (res.ok) {
                    setMensaje("🎉 ¡Tu cita ha sido confirmada exitosamente!");
                    setError('');
                    setTimeout(() => navigate("/paciente/historico"), 2500);
                } else {
                    const textoRespuesta = await res.text();
                    throw new Error(textoRespuesta || "Error desconocido");
                }
            })
            .catch(e => {
                setMensaje('');
                setError("❌ Error al confirmar la cita: " + e.message);
            });
    };

    const cancelar = () => {
        navigate("/");
    };

    return (
        <div className="confirmar-container">
            <h2>Confirmar Cita</h2>

            {error && <div className="error-message">{error}</div>}
            {mensaje && <div className="success-message">{mensaje}</div>}

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
