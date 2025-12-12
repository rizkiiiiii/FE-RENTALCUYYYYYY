import React from 'react'; // <--- TAMBAHKAN INI
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="flex justify-between items-center p-6 bg-transparent absolute top-0 w-full z-10">
            <h1 className="text-2xl font-bold text-neon tracking-tighter">RENTAL<span className="text-white">COY</span></h1>
            <div className="space-x-4">
                <Link to="/" className="hover:text-neon transition">Home</Link>
                <Link to="/cars" className="hover:text-neon transition">Cars</Link>
                {user ? (
                    <>
                        <span className="text-gray-400">Hi, {user.name}</span>
                        {user.role === 'admin' && <Link to="/admin" className="text-neon">Dashboard</Link>}
                        <button onClick={logout} className="bg-red-600 px-4 py-1 rounded">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="bg-neon text-black px-6 py-2 rounded-full font-bold hover:bg-white transition">Login</Link>
                )}
            </div>
        </nav>
    );
}