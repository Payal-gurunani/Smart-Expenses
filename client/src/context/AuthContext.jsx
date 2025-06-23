// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../config/apiRequest";
import { endpoints } from "../config/endPoints";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token with backend on first load
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await apiRequest({
          method: endpoints.CheckAuth.method,
          url: endpoints.CheckAuth.url,
        });
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // ✅ CORRECT
