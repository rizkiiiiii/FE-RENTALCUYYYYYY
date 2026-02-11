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
    const [bookingLoading, setBookingLoading] = useState(false); // New: Loading state for button
    const [message, setMessage] = useState(null); // New: UI Feedback

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);

    // --- LOGIC BARU: BIKIN URL GAMBAR DINAMIS ---
    // 1. Ambil URL API dari file .env (misal: http://127.0.0.1:8000/api)
    const apiUrl = import.meta.env.VITE_API_URL;
    // 2. Hapus tulisan "/api" di belakangnya biar jadi Base URL    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = (apiUrl && apiUrl.trim() !== "") ? apiUrl.replace('/api', '') : 'http://127.0.0.1:8000';

    useEffect(() => {
        api.get(`/cars/${id}`)
            .then(res => {
                setCar(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (startDate && endDate && car) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end - start;
            // Ditambah 1 karena sewa 1 hari pun dihitung
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            if (diffDays > 0) setTotalPrice(diffDays * car.price_per_day);
            else setTotalPrice(0);
        }
    }, [startDate, endDate, car]);

    const handleRent = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!user) {
            if (window.confirm("Anda harus login untuk menyewa mobil. Login sekarang?")) {
                navigate('/login');
            }
            return;
        }

        if (totalPrice <= 0) {
            setMessage({ type: 'error', text: 'Tanggal tidak valid.' });
            return;
        }

        setBookingLoading(true);

        try {
            await api.post('/rentals', {
                car_id: car.id,
                start_date: startDate,
                end_date: endDate
            });

            setMessage({ type: 'success', text: '✅ Booking Berhasil! Mengalihkan...' });

            setTimeout(() => {
                navigate('/my-bookings');
            }, 2000);

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Booking Gagal. Cek ketersediaan tanggal.";
            setMessage({ type: 'error', text: `❌ ${errorMsg}` });
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="text-white text-center mt-20 animate-pulse">Loading car details...</div>;
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
                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
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

                    {message && (
                        <div className={`p-3 rounded mb-4 text-sm font-bold text-center border ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

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

                        <button
                            disabled={bookingLoading}
                            className={`w-full bg-neon text-black font-black py-4 rounded-lg hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(204,255,0,0.4)] ${bookingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {bookingLoading ? "PROCESSING..." : "CONFIRM RENTAL"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}