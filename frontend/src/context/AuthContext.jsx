import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");

  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
    setRefreshToken(res.data.refreshToken);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }

  async function register(email, password, fullName) {
    const res = await api.post("/auth/register", { email, password, fullName });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
    setRefreshToken(res.data.refreshToken);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }

  async function refreshAccess() {
    const rt = localStorage.getItem("refreshToken");
    if (!rt) return;
    const res = await api.post("/auth/refresh", { refreshToken: rt });
    setAccessToken(res.data.accessToken);
    localStorage.setItem("accessToken", res.data.accessToken);
  }

  function logout() {
    setUser(null);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthToken("");
  }

  const value = { user, accessToken, refreshToken, login, register, logout, refreshAccess };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
