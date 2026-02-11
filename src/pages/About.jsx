import React from 'react';

export default function About() {
    return (
        <div className="pt-24 px-6 min-h-screen bg-darkbg text-white">
            <div className="max-w-4xl mx-auto text-center">

                {/* HEADER */}
                <h1 className="text-4xl font-black mb-6 uppercase">
                    About <span className="text-neon drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">RentalCoy</span>
                </h1>
                <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
                    We provide the fastest and most furious cars in town.
                    Visit our headquarters to see the beasts yourself.
                </p>

                {/* 🗺️ MAP CONTAINER CYBERPUNK STYLE */}
                <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-gray-800 hover:border-neon transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] group">

                    {/* IFRAME GOOGLE MAPS */}
                    <iframe
                        title="Rental Location"
                        // 👇 Ganti link ini sama lokasi asli lu kalau mau (Ambil dari Google Maps -> Share -> Embed)
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.833989932066!2d107.6074783143171!3d-6.910452369550719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung!5e0!3m2!1sen!2sid!4v1647832626509!5m2!1sen!2sid"
                        width="100%"
                        height="100%"
                        // 👇 TRIK RAHASIA: Bikin Map jadi Dark Mode & Neon!
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                        allowFullScreen=""
                        loading="lazy"
                        className="w-full h-full opacity-80 group-hover:opacity-100 transition duration-500"
                    ></iframe>

                    {/* LABEL LOKASI KEREN */}
                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded border border-neon text-neon font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
                        <span className="animate-pulse">🔴</span> LIVE LOCATION: BANDUNG HQ
                    </div>
                </div>

                {/* INFO TAMBAHAN */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-cardbg p-6 rounded-xl border border-gray-800">
                        <h3 className="text-neon font-bold text-xl">24/7</h3>
                        <p className="text-gray-500 text-sm">Service Available</p>
                    </div>
                    <div className="bg-cardbg p-6 rounded-xl border border-gray-800">
                        <h3 className="text-neon font-bold text-xl">50+</h3>
                        <p className="text-gray-500 text-sm">Super Cars Ready</p>
                    </div>
                    <div className="bg-cardbg p-6 rounded-xl border border-gray-800">
                        <h3 className="text-neon font-bold text-xl">100%</h3>
                        <p className="text-gray-500 text-sm">Satisfaction Rate</p>
                    </div>
                </div>

            </div>
        </div>
    );
}