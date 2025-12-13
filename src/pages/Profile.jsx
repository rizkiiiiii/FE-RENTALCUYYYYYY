import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // 👇 KITA HAPUS FORM DATA, PAKE JSON BIASA AJA (ANTI ERROR)
        try {
            const res = await api.post("/profile", {
                name: name,
                email: email,
                // Gak usah kirim avatar
            });
            
            setUser(res.data.user);
            setMessage("✅ Profile updated successfully!");
            setLoading(false);
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to update profile.");
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg text-white flex justify-center">
            <div className="w-full max-w-lg">
                <h1 className="text-3xl font-black mb-8 uppercase text-center">
                    Edit <span className="text-neon">Profile</span>
                </h1>

                <div className="bg-cardbg border border-gray-800 rounded-xl p-8 shadow-2xl">
                    {message && (
                        <div className={`mb-4 p-3 rounded text-center font-bold ${message.includes('✅') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* BAGIAN FOTO UDAH DIHAPUS, BERSIH! */}
                        
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-neon focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-neon focus:outline-none transition"
                            />
                        </div>

                        {/* <button 
                            disabled={loading}
                            className="w-full bg-neon text-black font-black py-3 rounded hover:bg-white hover:scale-105 transition transform"
                        >
                            {loading ? "SAVING..." : "SAVE CHANGES"}
                        </button> */}
                    </form>
                </div>
            </div>
        </div>
    );
}