import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function CarList() {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // State fitur Search & Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");

    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl ? apiUrl.replace('/api', '') : 'http://127.0.0.1:8000';

    // 👇 FUNGSI PENTING: Penyelamat Error "Objects are not valid"
    const getBrandName = (car) => {
        // Kalau brand-nya berupa Object (Data lengkap dari database), ambil 'name'-nya aja
        if (car.brand && typeof car.brand === 'object') {
            return car.brand.name; 
        }
        // Kalau cuma tulisan biasa, langsung balikin
        return car.brand || 'Unknown';
    };

    useEffect(() => {
        api.get('/cars')
            .then(res => {
                setCars(res.data);
                setFilteredCars(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let result = [...cars];

        // 1. Filter Search (Pakai helper getBrandName biar aman)
        if (searchTerm) {
            result = result.filter(car => 
                car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                getBrandName(car).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Sorting
        if (sortBy === 'cheap') {
            result.sort((a, b) => parseFloat(a.price_per_day) - parseFloat(b.price_per_day));
        } else if (sortBy === 'expensive') {
            result.sort((a, b) => parseFloat(b.price_per_day) - parseFloat(a.price_per_day));
        } else {
            result.sort((a, b) => b.id - a.id);
        }

        setFilteredCars(result);
    }, [searchTerm, sortBy, cars]);

    if (loading) return <div className="text-center text-white mt-20 animate-pulse">Scanning Garage...</div>;

    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg text-white">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase">
                            Available <span className="text-neon drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">Units</span>
                        </h1>
                        <p className="text-gray-400 mt-2">Select your vehicle and start the engine.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search car name..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black/50 border border-gray-600 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-neon transition w-full md:w-64"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>

                        <div className="relative">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-black/50 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-neon transition appearance-none pr-8 cursor-pointer"
                            >
                                <option value="latest">Latest Arrival</option>
                                <option value="cheap">Price: Low to High</option>
                                <option value="expensive">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredCars.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-500">SYSTEM ALERT: No Units Found</h2>
                        <button onClick={() => {setSearchTerm(''); setSortBy('latest');}} className="mt-4 text-neon hover:underline">Reset Filter</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {filteredCars.map(car => (
                            <div key={car.id} className="bg-cardbg border border-gray-800 rounded-xl overflow-hidden hover:border-neon transition-all duration-300 group">
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10"></div>
                                    <img 
                                        src={`${baseUrl}/storage/${car.image}`} 
                                        alt={car.name} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                                    />
                                    {/* 👇 PANGGIL FUNGSI getBrandName DI SINI 👇 */}
                                    <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded border border-gray-600 z-20">
                                        {getBrandName(car)}
                                    </span>
                                </div>
                                
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold italic mb-1">{car.name}</h2>
                                    <p className="text-neon text-lg font-bold mb-4">
                                        Rp {parseInt(car.price_per_day).toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ day</span>
                                    </p>
                                    
                                    <Link to={`/cars/${car.id}`} className="block text-center bg-white text-black font-bold py-2 rounded hover:bg-neon hover:shadow-[0_0_15px_rgba(204,255,0,0.6)] transition-all">
                                        RENT NOW ➔
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}