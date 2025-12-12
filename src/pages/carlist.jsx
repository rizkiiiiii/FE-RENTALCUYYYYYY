import React from 'react'; // <--- TAMBAHKAN INI
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function CarList() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        api.get('/cars').then(res => setCars(res.data));
    }, []);

    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg">
            <h2 className="text-4xl font-bold mb-8 text-center">Available <span className="text-neon">Fleet</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cars.map(car => (
                    <div key={car.id} className="bg-cardbg rounded-xl overflow-hidden border border-gray-800 hover:border-neon transition group">
                        <div className="h-48 bg-gray-700 overflow-hidden">
                            {/* Gunakan storage URL yang benar nanti */}
                            <img src={`http://127.0.0.1:8000/storage/${car.image}`} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-bold">{car.name}</h3>
                            <p className="text-gray-400 text-sm mb-2">{car.brand.name} | {car.capacity} Seats</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-neon font-bold">Rp {parseInt(car.price_per_day).toLocaleString()}/day</span>
                                <Link to={`/cars/${car.id}`} className="bg-white text-black px-4 py-1 rounded text-sm font-bold">Rent</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}