import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ CUKUP SATU AJA

// Import Halaman
import Home from "./pages/home";
import Login from "./pages/login";
import CarList from "./pages/carlist";
import AdminDashboard from "./pages/admindashboard";
import CarDetail from "./pages/CarDetail";
import Register from "./pages/Register"; // ✅ Import dari lokasi baru
import MyBookings from "./pages/MyBookings"; // ✅ Sudah benar (di luar folder user)
import Profile from "./pages/Profile";
import About from "./pages/About";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-darkbg min-h-screen text-white">
          <Navbar />

          <Routes>
            {/* Route Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/about" element={<About />} />

            {/* Route User (Protected) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            {/* Route Khusus Admin */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;