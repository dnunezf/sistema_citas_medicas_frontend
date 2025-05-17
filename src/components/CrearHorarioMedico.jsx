import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/auth/horarios_medico.css';

function HorariosMedicoExtendido() {
    const { id } = useParams();
    const idMedico = parseInt(id);

    const [horarios, setHorarios] = useState([]);
    const [nuevoHorario, setNuevoHorario] = useState({
        dia: '',
        horaInicio: '',
        horaFin: '',
        intervalo: 30
    });

    const cargarHorarios = () => {
        fetch(`http://localhost:8080/api/horarios/medico/${idMedico}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setHorarios(data);
                } else {
                    console.warn("Se esperaba un arreglo pero se recibió:", data);
                    setHorarios([]);
                }
            })
            .catch(err => {
                console.error("Error al cargar horarios:", err);
                setHorarios([]);
            });
    };

    useEffect(() => {
        if (idMedico) {
            cargarHorarios();
        }
    }, [idMedico]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoHorario(prev => ({ ...prev, [name]: value }));
    };

    const guardarHorario = () => {
        const { dia, horaInicio, horaFin, intervalo } = nuevoHorario;

        if (!idMedico || !dia || !horaInicio || !horaFin || intervalo <= 0) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        fetch(`http://localhost:8080/api/horarios/medico/${idMedico}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                diaSemana: dia,
                horaInicio: horaInicio,
                horaFin: horaFin,
                tiempoCita: intervalo
            })
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al guardar el horario.");
                return res.text();
            })
            .then(() => {
                alert("Horario creado correctamente.");
                setNuevoHorario({ dia: '', horaInicio: '', horaFin: '', intervalo: 30 });
                cargarHorarios();
            })
            .catch(err => {
                console.error(err);
                alert("No se pudo guardar el horario.");
            });
    };

    const eliminarHorario = (idHorario) => {
        fetch(`http://localhost:8080/api/horarios/${idHorario}`, {
            method: "DELETE"
        })
            .then(() => cargarHorarios());
    };

    return (
        <div className="horarios-container">
            <h2>Gestión de Horarios del Médico</h2>

            <div>
                <h4>Agregar horario</h4>
                <label>Día:
                    <select name="dia" value={nuevoHorario.dia} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="LUNES">Lunes</option>
                        <option value="MARTES">Martes</option>
                        <option value="MIERCOLES">Miércoles</option>
                        <option value="JUEVES">Jueves</option>
                        <option value="VIERNES">Viernes</option>
                        <option value="SABADO">Sábado</option>
                        <option value="DOMINGO">Domingo</option>
                    </select>
                </label>
                <label>Hora inicio:
                    <input type="time" name="horaInicio" value={nuevoHorario.horaInicio} onChange={handleChange} />
                </label>
                <label>Hora fin:
                    <input type="time" name="horaFin" value={nuevoHorario.horaFin} onChange={handleChange} />
                </label>
                <label>Duración de la cita (min):
                    <input type="number" name="intervalo" value={nuevoHorario.intervalo} onChange={handleChange} />
                </label>
                <button onClick={guardarHorario}>Guardar Horario</button>
            </div>

            <hr />

            <h4>Horarios actuales</h4>
            <ul className="horarios-lista">
                {Array.isArray(horarios) && horarios.length > 0 ? (
                    horarios.map(h => (
                        <li key={h.id}>
                            {h.diaSemana}: {h.horaInicio} - {h.horaFin}
                            <button onClick={() => eliminarHorario(h.id)}>Eliminar</button>
                        </li>
                    ))
                ) : (
                    <li>No hay horarios registrados.</li>
                )}
            </ul>
        </div>
    );
}

export default HorariosMedicoExtendido;
