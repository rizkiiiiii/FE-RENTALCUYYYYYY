import React from 'react'; // <--- TAMBAHKAN INI
import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek user saat load jika ada token
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/user')
               .then(res => setUser(res.data))
               .catch(() => {
                   localStorage.removeItem('token');
                   setUser(null);
               })
               .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        api.post('/logout').then(() => {
            localStorage.removeItem('token');
            setUser(null);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};