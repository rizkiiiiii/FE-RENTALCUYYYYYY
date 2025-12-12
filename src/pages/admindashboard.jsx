// import React from 'react'; // <--- TAMBAHKAN INI
import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("rentals"); // Default tab

    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg text-white">
            <h1 className="text-4xl font-black text-neon mb-8 tracking-tighter">ADMIN <span className="text-white">CONTROL</span></h1>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4 overflow-x-auto">
                {["rentals", "cars", "brands"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full font-bold transition uppercase ${
                            activeTab === tab 
                            ? "bg-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]" 
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-cardbg p-6 rounded-xl border border-gray-800 min-h-[500px]">
                {activeTab === "rentals" && <ManageRentals />}
                {activeTab === "cars" && <ManageCars />}
                {activeTab === "brands" && <ManageBrands />}
            </div>
        </div>
    );
}

// --- SUB COMPONENTS (Satukan di file ini biar gampang copas) ---

function ManageBrands() {
    const [name, setName] = useState("");
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = () => api.get('/brands').then(res => setBrands(res.data));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/brands', { name });
            setName("");
            fetchBrands(); // Refresh list
            alert("Merek berhasil ditambah!");
        } catch (err) {
            alert("Gagal nambah merek!");
        }
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4 text-neon">Add New Brand</h3>
            <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
                <input 
                    className="bg-black/50 border border-gray-700 p-3 rounded text-white w-full max-w-md focus:border-neon outline-none"
                    placeholder="Contoh: Tesla, Hyundai..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="bg-white text-black font-bold px-6 rounded hover:bg-neon transition">ADD</button>
            </form>

            <h3 className="text-xl font-bold mb-4">Existing Brands</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {brands.map(b => (
                    <div key={b.id} className="bg-gray-800 p-3 rounded text-center border border-gray-700">
                        {b.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ManageCars() {
    const [brands, setBrands] = useState([]);
    const [form, setForm] = useState({
        name: "", brand_id: "", price_per_day: "", capacity: "", image: null
    });

    useEffect(() => {
        api.get('/brands').then(res => setBrands(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach(key => data.append(key, form[key]));

        try {
            await api.post('/cars', data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Mobil berhasil ditambahkan!");
            // Reset form
            setForm({ name: "", brand_id: "", price_per_day: "", capacity: "", image: null });
        } catch (err) {
            console.error(err);
            alert("Gagal upload mobil. Cek console.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <h3 className="text-2xl font-bold mb-6 text-neon">Add New Car</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <select 
                    className="bg-black/50 border border-gray-700 p-3 rounded text-white"
                    onChange={(e) => setForm({...form, brand_id: e.target.value})}
                >
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>

                <input 
                    className="bg-black/50 border border-gray-700 p-3 rounded text-white"
                    placeholder="Car Name (e.g. Avanza Veloz)"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="number" className="bg-black/50 border border-gray-700 p-3 rounded text-white"
                    placeholder="Price per Day"
                    value={form.price_per_day}
                    onChange={(e) => setForm({...form, price_per_day: e.target.value})}
                />
                <input 
                    type="number" className="bg-black/50 border border-gray-700 p-3 rounded text-white"
                    placeholder="Capacity (Seats)"
                    value={form.capacity}
                    onChange={(e) => setForm({...form, capacity: e.target.value})}
                />
            </div>

            <input 
                type="file" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-neon hover:file:text-black transition"
                onChange={(e) => setForm({...form, image: e.target.files[0]})}
            />

            <button className="bg-neon text-black font-bold w-full py-3 rounded shadow-lg hover:bg-white transition">
                PUBLISH CAR
            </button>
        </form>
    );
}

function ManageRentals() {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = () => api.get('/admin/rentals').then(res => setRentals(res.data));

    const updateStatus = async (id, newStatus) => {
        if(!confirm(`Ubah status jadi ${newStatus}?`)) return;
        try {
            await api.put(`/rentals/${id}`, { status: newStatus });
            loadRentals();
        } catch(err) {
            alert("Gagal update status");
        }
    };

    return (
        <div className="overflow-x-auto">
            <h3 className="text-2xl font-bold mb-6 text-neon">Transaction History</h3>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                        <th className="p-3">ID</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Car</th>
                        <th className="p-3">Dates</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map(r => (
                        <tr key={r.id} className="border-b border-gray-800 hover:bg-white/5 transition">
                            <td className="p-3">#{r.id}</td>
                            <td className="p-3 text-neon font-bold">{r.user?.name}</td>
                            <td className="p-3">{r.car?.name}</td>
                            <td className="p-3 text-sm text-gray-400">{r.start_date} <br/>to {r.end_date}</td>
                            <td className="p-3 font-mono">Rp {parseInt(r.total_price).toLocaleString()}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                                    ${r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                                      r.status === 'active' ? 'bg-blue-500/20 text-blue-500' :
                                      r.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                                      'bg-red-500/20 text-red-500'}`}>
                                    {r.status}
                                </span>
                            </td>
                            <td className="p-3">
                                <select 
                                    className="bg-black border border-gray-700 rounded p-1 text-xs"
                                    onChange={(e) => updateStatus(r.id, e.target.value)}
                                    value="" // Selalu reset biar kelihatan actionnya
                                >
                                    <option value="" disabled>Update...</option>
                                    <option value="paid">Paid</option>
                                    <option value="active">Active (Diambil)</option>
                                    <option value="completed">Completed (Selesai)</option>
                                    <option value="cancelled">Cancel</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}