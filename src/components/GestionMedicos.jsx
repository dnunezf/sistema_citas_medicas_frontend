import React, { useEffect, useState } from 'react';
import { fetchWithInterceptor } from '../utils/fetchInterceptor'; // Importa tu interceptor
import '../styles/auth/gestion_medicos.css';

const GestionMedicos = () => {
    const [medicos, setMedicos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const cargarMedicos = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetchWithInterceptor('http://localhost:8080/api/admin/medicos');
            if (res.ok) {
                const data = await res.json();
                setMedicos(data);
            } else {
                setError('Error al cargar médicos.');
                setMedicos([]);
            }
        } catch {
            setError('No se pudieron cargar los médicos.');
            setMedicos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMedicos();
    }, []);

    const actualizarEstado = async (id, nuevoEstado) => {
        setMensaje('');
        setError('');
        try {
            const res = await fetchWithInterceptor(
                `http://localhost:8080/api/admin/medicos/${id}/estado`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estadoAprobacion: nuevoEstado }),
                }
            );
            if (!res.ok) throw new Error();
            const msg = await res.text();
            setMensaje(msg);
            cargarMedicos();
        } catch {
            setError('Error al actualizar el estado.');
        }
    };

    return (
        <div className="container">
            <h2 className="title">Gestión de Médicos</h2>

            {loading && <p>Cargando médicos...</p>}
            {mensaje && <div className="message success">{mensaje}</div>}
            {error && <div className="message error">{error}</div>}

            {!loading && (
                <table className="medicos-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Costo</th>
                        <th>Localidad</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {medicos.map((medico) => (
                        <tr key={medico.id}>
                            <td>{medico.id}</td>
                            <td>{medico.nombre}</td>
                            <td>{medico.especialidad}</td>
                            <td>{medico.costoConsulta}</td>
                            <td>{medico.localidad}</td>
                            <td>
                                <select
                                    value={medico.estadoAprobacion}
                                    onChange={(e) => actualizarEstado(medico.id, e.target.value)}
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="aprobado">Aprobado</option>
                                    <option value="rechazado">Rechazado</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GestionMedicos;
