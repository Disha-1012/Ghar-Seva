import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedRole = await AsyncStorage.getItem("role");

        if (savedToken && savedRole) {
          setToken(savedToken);
          setRole(savedRole);
        } else {
          setToken(null);
          setRole(null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (token, role) => {
    if (!token || !role) {
      console.log("❌ Missing token or role");
      return;
    }

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("role", role);

    setToken(token);
    setRole(role);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};