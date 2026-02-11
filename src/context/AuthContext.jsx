import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api
        .get("/user")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login gagal";

      throw new Error(message);
    }
  };

  const logout = () => {
    api.post("/logout").finally(() => {
      localStorage.removeItem("token");
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
