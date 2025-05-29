import React, { createContext, useState, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';



export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        const savedUser = sessionStorage.getItem('usuario');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [logoutTimer, setLogoutTimer] = useState(null);

    const logout = useCallback(() => {
        setUsuario(null);
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('token');
        if (logoutTimer) clearTimeout(logoutTimer);
    }, [logoutTimer]);

    useEffect(() => {
        if (usuario && usuario.token) {
            const decoded = jwt_decode(usuario.token);
            const exp = decoded.exp * 1000; // pasar a ms
            const now = Date.now();
            const timeout = exp - now;

            if (timeout <= 0) {
                logout();
            } else {
                const timerId = setTimeout(() => {
                    logout();
                }, timeout);
                setLogoutTimer(timerId);
            }
        } else {
            if (logoutTimer) clearTimeout(logoutTimer);
        }
    }, [usuario, logout, logoutTimer]);

    // Sincroniza usuario en sessionStorage
    useEffect(() => {
        if (usuario) {
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
        } else {
            sessionStorage.removeItem('usuario');
        }
    }, [usuario]);

    return (
        <UserContext.Provider value={{ usuario, setUsuario, logout }}>
            {children}
        </UserContext.Provider>
    );
};
