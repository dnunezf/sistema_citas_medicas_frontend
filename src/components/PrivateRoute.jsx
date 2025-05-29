import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = () => {
    const { usuario } = useContext(UserContext);

    // Si no hay usuario logueado, redirige a login
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderiza los componentes hijos
    return <Outlet />;
};

export default PrivateRoute;
