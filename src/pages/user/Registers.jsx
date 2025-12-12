import React, { useState, useContext } from "react";
import api from "../../api/axios"
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Registers() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Kita pakai context biar kalau sukses register, bisa auto-login (opsional) 
    // atau sekadar redirect ke login
    const { login } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 1. Kirim data ke Backend
            const res = await api.post('/register', {
                name,
                email,
                password
            });

            // 2. Kalau sukses, simpan token (Auto Login)
            // Backend kita mengembalikan token saat register, jadi bisa langsung set
            localStorage.setItem('token', res.data.token);
            
            // 3. Update state user di context (reload halaman atau set manual)
            // Cara paling gampang: refresh halaman biar AuthContext nge-cek ulang token
            window.location.href = "/cars"; 

        } catch (err) {
            setLoading(false);
            // Tangkap pesan error validasi dari Laravel
            const responseError = err.response?.data?.message || "Registration Failed";
            const validationErrors = err.response?.data?.errors;
            
            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0][0];
                setError(firstError);
            } else {
                setError(responseError);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-darkbg px-4 pt-20 pb-10">
            <div className="bg-cardbg p-8 rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.1)] border border-gray-800 w-full max-w-md relative overflow-hidden">
                
                {/* Hiasan Background Neon */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-neon to-transparent opacity-50"></div>

                <h2 className="text-4xl font-black text-center mb-2 text-white tracking-tighter">
                    JOIN <span className="text-neon">NEO</span>
                </h2>
                <p className="text-gray-500 text-center mb-8">Start your engine today.</p>

                {error && (
                    <div className="bg-red-500/10 text-red-500 p-3 rounded mb-6 text-sm font-bold text-center border border-red-500/20 animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Input Nama */}
                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition"
                            placeholder="Jhon Doe"
                            required
                        />
                    </div>

                    {/* Input Email */}
                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition"
                            placeholder="user@example.com"
                            required
                        />
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition"
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-neon text-black font-black py-4 rounded-lg hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(204,255,0,0.3)] mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-neon hover:underline font-bold">Login Here</Link>
                </div>
            </div>
        </div>
    );
}

export default Registers;