import React, { useEffect, useState } from "react";
import api from "../api/axios";

// =========================================
// 👇 CSS TAMBAHAN BUAT EFEK GLITCH "PECAH" 👇
// =========================================
const customStyles = `
  /* Animasi Getar/Glitch */
  @keyframes glitch-anim-1 {
    0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, -2px); }
    20% { clip-path: inset(60% 0 20% 0); transform: translate(2px, 2px); }
    40% { clip-path: inset(40% 0 60% 0); transform: translate(-2px, 2px); }
    60% { clip-path: inset(80% 0 20% 0); transform: translate(2px, -2px); }
    80% { clip-path: inset(10% 0 90% 0); transform: translate(-2px, 0); }
    100% { clip-path: inset(30% 0 70% 0); transform: translate(0, 2px); }
  }
  @keyframes glitch-anim-2 {
    0% { clip-path: inset(10% 0 90% 0); transform: translate(2px, 2px); }
    20% { clip-path: inset(30% 0 70% 0); transform: translate(-2px, -2px); }
    40% { clip-path: inset(70% 0 30% 0); transform: translate(2px, -2px); }
    60% { clip-path: inset(50% 0 50% 0); transform: translate(-2px, 2px); }
    80% { clip-path: inset(90% 0 10% 0); transform: translate(2px, 0); }
    100% { clip-path: inset(20% 0 80% 0); transform: translate(0, -2px); }
  }

  /* Styling Tombol Glitch */
  .cyber-glitch-btn {
    position: relative;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 2px solid #ef4444; /* Red-500 */
    color: #ef4444;
    background: transparent;
    overflow: hidden;
    transition: all 0.2s;
  }

  /* Efek pas Hover */
  .cyber-glitch-btn:hover {
    background: #ef4444;
    color: white;
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.8); /* Glow merah kenceng */
    text-shadow: 2px 2px #00ffff, -2px -2px #ff00ff; /* Efek RGB split statis */
  }

  /* Layer Glitch Biru (Muncul pas hover) */
  .cyber-glitch-btn::before {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: transparent;
    color: #00ffff; /* Cyan */
    display: flex; justify-content: center; items-center: center;
    opacity: 0;
    z-index: -1;
  }
  .cyber-glitch-btn:hover::before {
    opacity: 1;
    animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
  }

  /* Layer Glitch Merah/Pink (Muncul pas hover) */
  .cyber-glitch-btn::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: transparent;
    color: #ff00ff; /* Magenta */
    display: flex; justify-content: center; items-center: center;
    opacity: 0;
    z-index: -2;
  }
  .cyber-glitch-btn:hover::after {
    opacity: 1;
    animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
  }
`;
// =========================================


export default function MyBookings() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl ? apiUrl.replace('/api', '') : 'http://127.0.0.1:8000';

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        api.get('/rentals')
            .then(res => {
                setRentals(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleCancel = async (id) => {
        // Efek suara "klik" (opsional, hapus kalo gak suka)
        // new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3').play(); 

        if (!window.confirm("⚠️ SYSTEM WARNING: Yakin mau menghancurkan pesanan ini?")) return;

        try {
            await api.delete(`/rentals/${id}`);
            setRentals(rentals.filter(rental => rental.id !== id));
        } catch (error) {
            console.error(error);
            alert("SYSTEM ERROR: Gagal membatalkan.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
            case 'active': return 'bg-green-500/20 text-green-500 border-green-500/50';
            case 'completed': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
            case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    if (loading) return <div className="text-center text-white mt-20 animate-pulse text-xl font-mono">INITIALIZING DATA...</div>;

    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg text-white relative overflow-hidden">
             {/* Inject CSS Glitch tadi ke dalam halaman ini */}
            <style>{customStyles}</style>

            {/* Background Grid Effect biar makin cyber */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <h1 className="text-4xl font-black mb-8 uppercase border-b-2 border-gray-800 pb-4 tracking-widest">
                    Command <span className="text-neon drop-shadow-[0_0_15px_rgba(204,255,0,0.8)] animate-pulse">Center</span>
                </h1>

                {rentals.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20 p-12 border-2 border-dashed border-gray-700 rounded-2xl bg-black/30 backdrop-blur">
                        <p className="text-2xl mb-6 font-bold text-gray-400">NO ACTIVE MISSIONS</p>
                        <a href="/cars" className="inline-block bg-neon text-black font-black px-8 py-3 rounded hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(204,255,0,0.5)]">
                            DEPLOY NEW UNIT ➔
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6 pb-10">
                        {rentals.map(rental => (
                            <div key={rental.id} className="bg-cardbg/80 backdrop-blur border-2 border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-2xl hover:border-neon/50 transition-all duration-500 group relative overflow-hidden">
                                {/* Scanline effect pas hover card */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none"></div>

                                <div className="w-full md:w-40 h-28 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-gray-700 group-hover:border-neon transition shadow-inner relative">
                                    <div className="absolute inset-0 bg-neon/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition"></div>
                                    <img 
                                        src={`${baseUrl}/storage/${rental.car?.image}`} 
                                        alt="Car" 
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150x100?text=No+Image"; }}
                                    />
                                </div>

                                <div className="flex-1 w-full text-center md:text-left z-10">
                                    <h3 className="text-2xl font-black italic tracking-tighter text-white group-hover:text-neon transition">{rental.car?.name}</h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3 text-xs font-mono uppercase">
                                        <span className="bg-black/50 px-3 py-1 rounded border border-gray-700 text-gray-300">
                                            START: {rental.start_date}
                                        </span>
                                        <span className="text-neon font-bold animate-pulse">⟫</span>
                                        <span className="bg-black/50 px-3 py-1 rounded border border-gray-700 text-gray-300">
                                            END: {rental.end_date}
                                        </span>
                                    </div>
                                    <p className="text-white/80 text-lg font-bold mt-3 font-mono">
                                        TOTAL: <span className="text-neon">Rp {parseInt(rental.total_price).toLocaleString()}</span>
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-4 min-w-[160px] z-10">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(rental.status)}`}>
                                        ● {rental.status}
                                    </span>

                                    {/* 👇👇👇 TOMBOL GLITCH PECAH ADA DI SINI 👇👇👇 */}
                                    {rental.status === 'pending' && (
                                        <button 
                                            onClick={() => handleCancel(rental.id)}
                                            // Pakai class custom 'cyber-glitch-btn' dan data-text untuk efek bayangan
                                            className="cyber-glitch-btn px-6 py-3 rounded-sm w-full md:w-auto text-sm"
                                            data-text="CANCEL ORDER"
                                        >
                                            CANCEL ORDER
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}