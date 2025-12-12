import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate("/cars");
      console.log("Login successful");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkbg px-4">
      <div className="bg-cardbg p-8 rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.1)] border border-gray-800 w-full max-w-md">
        <h2 className="text-4xl font-black text-center mb-2 text-white tracking-tighter">
          RENTALCOY<span className="text-neon">ACCESS</span>
        </h2>
        <p className="text-gray-500 text-center mb-8">Masuk Ke Sistem</p>

        {error && (
          <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm font-bold text-center border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon transition"
              placeholder="boss@neorental.com"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neon text-black font-bold py-3 rounded-lg hover:bg-white hover:scale-[1.02] transition-all transform shadow-lg shadow-neon/20"
          >
            LOGIN
          </button>

          <div className="mt-6 text-center text-sm text-gray-400">
            <a href="/register" className="text-neon hover:underline">
              Don't have an account? Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
