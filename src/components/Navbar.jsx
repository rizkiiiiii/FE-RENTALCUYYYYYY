import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-transparent absolute top-0 w-full z-10">
      <h1 className="text-2xl font-bold text-neon tracking-tighter">
        RENTAL<span className="text-white">COY</span>
      </h1>

      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-neon transition">Home</Link>
        <Link to="/cars" className="hover:text-neon transition">Cars</Link>

        {user ? (
          <>
            {/* 👇 INI UDAH BERSIH TANPA FOTO, CUMA LINK KE PROFILE 👇 */}
            <Link to="/profile" className="text-gray-300 hover:text-white transition font-bold">
              Hi, {user.name}
            </Link>

            <Link to="/my-bookings" className="text-white hover:text-neon text-sm font-bold transition">
                MY BOOKINGS
            </Link>

            {user.role === "admin" && (
              <Link to="/admin" className="text-neon">Dashboard</Link>
            )}

            <button onClick={handleLogout} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-neon text-black px-6 py-2 rounded-full font-bold hover:bg-white transition">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}