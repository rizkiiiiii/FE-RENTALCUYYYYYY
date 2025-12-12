import React from 'react'; // <--- TAMBAHKAN INI
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    // Jika tidak ada user, redirect ke login
    if (!user) return <Navigate to="/login" replace />;

    // Jika ada role spesifik (misal admin) tapi user bukan admin
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}