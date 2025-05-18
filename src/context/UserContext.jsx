// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("usuario");
        if (storedUser) {
            setUsuario(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        sessionStorage.setItem("usuario", JSON.stringify(userData));
        setUsuario(userData);
    };

    const logout = () => {
        sessionStorage.removeItem("usuario");
        setUsuario(null);
    };

    return (
        <UserContext.Provider value={{ usuario, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
