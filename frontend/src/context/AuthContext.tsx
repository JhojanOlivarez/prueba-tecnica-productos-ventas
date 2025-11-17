import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
import type { AuthResponse } from "../types";

interface AuthState {
  token: string | null;
  email: string | null;
  fullName: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    email: null,
    fullName: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    if (token) setState({ token, email, fullName });
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("fullName", data.fullName);

    setState({
      token: data.token,
      email: data.email,
      fullName: data.fullName,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    setState({ token: null, email: null, fullName: null });
  };

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: !!state.token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
