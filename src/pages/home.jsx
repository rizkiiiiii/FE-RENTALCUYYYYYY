import React from 'react';

export default function Home() {
    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000')] bg-cover bg-center opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-transparent to-black/80"></div>

            <div className="relative z-10 text-center px-4">
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 drop-shadow-2xl">
                    Drive The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-cyan-400">Future</span>
                </h1>
                <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
                    Sewa mobil impianmu dengan instan. Tanpa ribet. Full digital.
                </p>
                <a href="/cars" className="bg-neon text-black text-xl font-bold px-8 py-3 rounded-full hover:scale-105 transition transform shadow-[0_0_20px_rgba(204,255,0,0.6)]">
                    Explore Cars
                </a>
            </div>
        </div>
    );
}