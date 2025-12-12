import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function CarDetail() {
    const { id } = useParams(); // Ambil ID dari URL (misal: 3)
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State Form Rental
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        api.get(`/cars/${id}`)
           .then(res => {
               setCar(res.data);
               setLoading(false);
           })
           .catch(() => setLoading(false));
    }, [id]);

    // Hitung total harga real-time
    useEffect(() => {
        if (startDate && endDate && car) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays > 0) {
                setTotalPrice(diffDays * car.price_per_day);
            } else {
                setTotalPrice(0);
            }
        }
    }, [startDate, endDate, car]);

    const handleRent = async (e) => {
        e.preventDefault();
        if (!user) return alert("Login dulu bang!");

        try {
            await api.post('/rentals', {
                car_id: car.id,
                start_date: startDate,
                end_date: endDate
            });
            alert("Booking Berhasil! Silakan bayar di kasir.");
            navigate('/cars');
        } catch (err) {
            alert("Gagal booking: " + (err.response?.data?.message || "Cek tanggalnya"));
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
    if (!car) return <div className="text-white text-center mt-10">Mobil tidak ditemukan</div>;

    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg text-white flex justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Kolom Kiri: Foto & Info */}
                <div>
                    <div className="bg-gray-800 rounded-xl overflow-hidden mb-6 border border-gray-700">
                        <img 
                            src={`http://127.0.0.1:8000/storage/${car.image}`} 
                            alt={car.name} 
                            className="w-full h-64 object-cover"
                        />
                    </div>
                    <h1 className="text-4xl font-black italic uppercase mb-2">{car.name}</h1>
                    <p className="text-neon text-xl font-bold mb-4">
                        Rp {parseInt(car.price_per_day).toLocaleString()} / day
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-gray-400 text-sm">
                        <div className="bg-cardbg p-3 rounded border border-gray-800">
                            Brand: <span className="text-white">{car.brand?.name}</span>
                        </div>
                        <div className="bg-cardbg p-3 rounded border border-gray-800">
                            Capacity: <span className="text-white">{car.capacity} Seats</span>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Form Sewa */}
                <div className="bg-cardbg p-6 rounded-xl border border-gray-800 h-fit">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Booking Form</h2>
                    
                    <form onSubmit={handleRent} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Start Date</label>
                            <input 
                                type="date" 
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Return Date</label>
                            <input 
                                type="date" 
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>

                        {/* Kalkulasi Harga */}
                        <div className="bg-neon/10 border border-neon/30 p-4 rounded text-center my-6">
                            <span className="text-gray-400 text-xs uppercase tracking-widest">Total Estimated</span>
                            <div className="text-3xl font-black text-neon mt-1">
                                Rp {totalPrice.toLocaleString()}
                            </div>
                            <span className="text-xs text-gray-500">
                                {(startDate && endDate) ? "Duration calculated" : "Select dates first"}
                            </span>
                        </div>

                        {user ? (
                            <button className="w-full bg-neon text-black font-bold py-3 rounded hover:bg-white transition shadow-[0_0_15px_rgba(204,255,0,0.4)]">
                                CONFIRM RENTAL
                            </button>
                        ) : (
                            <button disabled className="w-full bg-gray-700 text-gray-400 font-bold py-3 rounded cursor-not-allowed">
                                LOGIN TO RENT
                            </button>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
}