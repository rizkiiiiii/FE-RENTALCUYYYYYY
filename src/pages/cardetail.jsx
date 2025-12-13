import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function CarDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);

    // --- LOGIC BARU: BIKIN URL GAMBAR DINAMIS ---
    // 1. Ambil URL API dari file .env (misal: http://127.0.0.1:8000/api)
    const apiUrl = import.meta.env.VITE_API_URL;
    // 2. Hapus tulisan "/api" di belakangnya biar jadi Base URL murni (http://127.0.0.1:8000)
    const baseUrl = apiUrl ? apiUrl.replace('/api', '') : 'http://127.0.0.1:8000';

    useEffect(() => {
        api.get(`/cars/${id}`)
           .then(res => {
               console.log("[CarDetail] fetched car:", res.data);
               setCar(res.data);
               setLoading(false);
           })
           .catch((err) => {
               console.error("[CarDetail] fetch error:", err);
               setLoading(false);
           });
    }, [id]);

    useEffect(() => {
        if (startDate && endDate && car) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays > 0) setTotalPrice(diffDays * car.price_per_day);
            else setTotalPrice(0);
        }
    }, [startDate, endDate, car]);

    const handleRent = async (e) => {
        e.preventDefault();
        if (!user) return alert("Login dulu bang!");
        if (totalPrice <= 0) return alert("Tanggal tidak valid");

        try {
            await api.post('/rentals', {
                car_id: car.id,
                start_date: startDate,
                end_date: endDate
            });
            alert("✅ Booking Berhasil!");
            navigate('/cars');
        } catch (err) {
            alert("❌ Gagal: " + (err.response?.data?.message || "Cek tanggal lagi"));
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (!car) return <div className="text-white text-center mt-20">Mobil tidak ditemukan</div>;

    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg text-white flex justify-center pb-10">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* --- FOTO & INFO MOBIL --- */}
                <div>
                    <div className="bg-gray-800 rounded-xl overflow-hidden mb-6 border border-gray-700 shadow-2xl relative group">
                        {/* GUNAKAN LOGIC BASEURL DI SINI */}
                        <img 
                            src={car.image ? `${baseUrl}/storage/${car.image}` : "https://via.placeholder.com/600x400?text=No+Image"} 
                            alt={car.name} 
                            className="w-full h-72 object-cover transition transform group-hover:scale-105 duration-500"
                            onError={(e) => {
                                console.error("[CarDetail] image failed to load:", e.target.src);
                                e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image";
                            }}
                            onLoad={() => console.log("[CarDetail] image loaded:", car.image ? `${baseUrl}/storage/${car.image}` : 'placeholder')}
                        />
                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-4 py-1 rounded-full text-sm font-bold border border-neon/50">
                            {car.brand?.name}
                        </div>
                    </div>

                    <h1 className="text-4xl font-black italic uppercase mb-2 tracking-tighter">{car.name}</h1>
                    <p className="text-neon text-2xl font-bold mb-6">
                        Rp {parseInt(car.price_per_day).toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ day</span>
                    </p>
                    
                    <div className="flex gap-4 text-sm text-gray-300">
                        <span className="bg-gray-800 px-3 py-1 rounded border border-gray-700">Capacity: {car.capacity} Seats</span>
                    </div>
                </div>

                {/* --- FORM BOOKING --- */}
                <div className="bg-cardbg p-8 rounded-2xl border border-gray-800 h-fit shadow-xl relative z-10">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Booking Form</h2>
                    
                    <form onSubmit={handleRent} className="space-y-5">
                        <div className="relative">
                            <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Start Date</label>
                            <input 
                                type="date" 
                                className="w-full bg-black/50 border border-gray-600 rounded-lg p-3 text-white focus:border-neon outline-none"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Return Date</label>
                            <input 
                                type="date" 
                                className="w-full bg-black/50 border border-gray-600 rounded-lg p-3 text-white focus:border-neon outline-none"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className={`p-4 rounded-lg text-center border ${totalPrice > 0 ? 'bg-neon/10 border-neon' : 'bg-gray-800/50 border-gray-700'}`}>
                            <span className="text-gray-400 text-[10px] uppercase tracking-widest block mb-1">Total Estimated</span>
                            <div className={`text-3xl font-black ${totalPrice > 0 ? 'text-neon' : 'text-gray-500'}`}>
                                Rp {totalPrice.toLocaleString()}
                            </div>
                        </div>

                        <button className="w-full bg-neon text-black font-black py-4 rounded-lg hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                            CONFIRM RENTAL
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}