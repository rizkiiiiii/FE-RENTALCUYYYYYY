import React, { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null); // New: Avatar State
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Gunakan FormData untuk upload file
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (avatar) {
                formData.append('avatar', avatar);
            }

            // 1. Register ke backend
            const res = await api.post("/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const token = res.data.token;

            // 2. Simpan token ke localStorage
            localStorage.setItem("token", token);

            // 3. Auto-login (Update Context)
            // Kita panggil endpoint /user lagi atau manfaatkan data dari response register
            // tapi method login() di context butuh validasi ulang standar, 
            // jadi paling aman kita set manual atau redirect login. 
            // Namun karena AuthContext.jsx method login() minta email/pass, kita bisa bypass 
            // dengan mereload window atau memodifikasi context.
            // Sederhananya, kita pakai login() biasa kalau backend support.

            // Opsi: Langsung redirect ke login page atau paksa reload
            // Tapi UX yang bagus adalah langsung masuk.
            // Karena AuthContext.login() melakukan POST login ulang, kita bisa skip itu 
            // dan langsung reload halaman agar Context mengambil token dari localStorage.

            window.location.href = '/cars';

        } catch (err) {
            setLoading(false);
            console.error(err);
            const msg = err.response?.data?.message || "Registration Failed";
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-darkbg px-4 pt-20 pb-10">
            <div className="bg-cardbg p-8 rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.1)] border border-gray-800 w-full max-w-md relative overflow-hidden">

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
                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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

                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Profile Picture (Optional)</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-800 file:text-neon hover:file:bg-gray-700"
                            accept="image/*"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-neon text-black font-black py-4 rounded-lg hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(204,255,0,0.3)] mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-neon hover:underline font-bold">
                        Login Here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
