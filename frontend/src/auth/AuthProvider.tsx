import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.ok) {
        await fetchMe();
        return true;
      }
      return false;
    } catch (err) {
      console.error("login error", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("logout error", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
