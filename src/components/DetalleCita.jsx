import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/auth/detalle_cita.css';
import { fetchWithInterceptor } from '../utils/fetchInterceptor';

const DetalleCita = () => {
    const { id } = useParams();
    const [cita, setCita] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setError("ID de cita no proporcionado.");
            setLoading(false);
            return;
        }

        fetchWithInterceptor(`http://localhost:8080/api/medico/citas/detalle/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                setCita(data);
                setError('');
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError('Error al cargar la cita. Por favor intente más tarde.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="detalle-cita-container"><p>Cargando detalles de la cita...</p></div>;
    if (error) return <div className="detalle-cita-container"><p className="mensaje-error">{error}</p><Link to="/paciente/historico">Volver al historial</Link></div>;

    return (
        <div className="detalle-cita-container">
            <h2>Detalles de la Cita</h2>
            <p><strong>Fecha y hora:</strong> {new Date(cita.fechaHora).toLocaleString('es-CR')}</p>
            <p><strong>Médico:</strong> {cita.nombreMedico}</p>
            <p><strong>Notas:</strong> {cita.notas || 'No hay notas disponibles.'}</p>
            <Link to="/paciente/historico">Volver al historial</Link>
        </div>
    );
};

export default DetalleCita;
