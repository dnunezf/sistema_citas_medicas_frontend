import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/auth/horarios_medico.css';
import { fetchWithInterceptor } from '../utils/fetchInterceptor'; // importa tu interceptor

function HorariosMedicoExtendido() {
    const { id } = useParams();
    const idMedico = parseInt(id);

    const [horarios, setHorarios] = useState([]);
    const [nuevoHorario, setNuevoHorario] = useState({
        id: null, // <-- para editar
        dia: '',
        horaInicio: '',
        horaFin: '',
        intervalo: 30
    });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // tipo: 'error' | 'exito'

    const cargarHorarios = () => {
        fetchWithInterceptor(`http://localhost:8080/api/horarios/medico/${idMedico}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setHorarios(data);
                } else {
                    setHorarios([]);
                    setMensaje({ texto: 'Error al cargar horarios.', tipo: 'error' });
                }
            })
            .catch(err => {
                console.error("Error al cargar horarios:", err);
                setHorarios([]);
                setMensaje({ texto: 'Error al cargar horarios.', tipo: 'error' });
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

    const limpiarFormulario = () => {
        setNuevoHorario({
            id: null,
            dia: '',
            horaInicio: '',
            horaFin: '',
            intervalo: 30
        });
        setMensaje({ texto: '', tipo: '' });
    };

    const guardarHorario = () => {
        const { id: idHorario, dia, horaInicio, horaFin, intervalo } = nuevoHorario;

        if (!idMedico || !dia || !horaInicio || !horaFin || intervalo <= 0) {
            setMensaje({ texto: "Todos los campos son obligatorios.", tipo: "error" });
            return;
        }

        if (!idHorario) {
            const existeHorarioDia = horarios.some(h => h.diaSemana.toLowerCase() === dia.toLowerCase());
            if (existeHorarioDia) {
                setMensaje({ texto: `Ya existe un horario registrado para el día ${dia}. Edita el existente.`, tipo: "error" });
                return;
            }
        }

        const metodo = idHorario ? 'PUT' : 'POST';
        const url = idHorario
            ? `http://localhost:8080/api/horarios/${idHorario}`
            : `http://localhost:8080/api/horarios/medico/${idMedico}`;

        fetchWithInterceptor(url, {
            method: metodo,
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
                setMensaje({ texto: idHorario ? "Horario actualizado correctamente." : "Horario creado correctamente.", tipo: "exito" });
                limpiarFormulario();
                cargarHorarios();
            })
            .catch(err => {
                console.error(err);
                setMensaje({ texto: "No se pudo guardar el horario.", tipo: "error" });
            });
    };

    const eliminarHorario = (idHorario) => {
        fetchWithInterceptor(`http://localhost:8080/api/horarios/${idHorario}`, {
            method: "DELETE"
        })
            .then(() => {
                setMensaje({ texto: "Horario eliminado correctamente.", tipo: "exito" });
                cargarHorarios();
            })
            .catch(() => {
                setMensaje({ texto: "Error al eliminar horario.", tipo: "error" });
            });
    };

    const editarHorario = (horario) => {
        setNuevoHorario({
            id: horario.id,
            dia: horario.diaSemana,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            intervalo: horario.tiempoCita
        });
        setMensaje({ texto: '', tipo: '' });
    };

    return (
        <div className="horarios-container">
            <h2>Gestión de Horarios del Médico</h2>

            <div>
                <h4>{nuevoHorario.id ? "Editar horario" : "Agregar horario"}</h4>

                {mensaje.texto && (
                    <div className={`mensaje ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                <label>Día:
                    <select name="dia" value={nuevoHorario.dia} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="lunes">Lunes</option>
                        <option value="martes">Martes</option>
                        <option value="miercoles">Miércoles</option>
                        <option value="jueves">Jueves</option>
                        <option value="viernes">Viernes</option>
                        <option value="sabado">Sábado</option>
                        <option value="domingo">Domingo</option>
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

                <div className="botones-accion">
                    <button className="btn-guardar" onClick={guardarHorario}>
                        {nuevoHorario.id ? "Actualizar" : "Guardar"}
                    </button>
                    {nuevoHorario.id && (
                        <button className="btn-cancelar" onClick={limpiarFormulario}>
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            <hr />

            <h4>Horarios actuales</h4>
            <ul className="horarios-lista">
                {Array.isArray(horarios) && horarios.length > 0 ? (
                    horarios.map(h => (
                        <li key={h.id}>
                            {h.diaSemana}: {h.horaInicio} - {h.horaFin}
                            <button className="btn-editar" onClick={() => editarHorario(h)}>Editar</button>
                            <button className="btn-eliminar" onClick={() => eliminarHorario(h.id)}>Eliminar</button>
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
