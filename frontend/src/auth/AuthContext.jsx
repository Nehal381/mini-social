import React, { createContext, useContext, useEffect, useState } from "react";

/* Authentication Context */
const AuthContext = createContext();

/* AuthProvider Component */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, username, token }

  /* Load user from localStorage on first render */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem("user"); // prevent corrupt data
    }
  }, []);

  /* Login: Save user data and token */
  const login = ({ id, username, token }) => {
    const userData = { id, username, token };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /* Logout: Clear user data */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /* Provide user and auth methods globally */
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* Custom hook for consuming auth context */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
