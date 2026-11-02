"use client";

import { createContext, useContext, type ReactNode } from "react";

import { loginUser, loginWithGoogle as authenticateWithGoogle, registerUser } from "@/lib/api";
import {
  decodeToken,
  setToken,
  useToken,
  type AuthUser,
} from "@/lib/auth-store";

interface AuthValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useToken();
  const user = token ? decodeToken(token) : null;

  const value: AuthValue = {
    user,
    token,
    async login(email, password) {
      const session = await loginUser(email, password);
      setToken(session.token);
    },
    async register(name, email, password) {
      const session = await registerUser(name, email, password);
      setToken(session.token);
    },
    async loginWithGoogle(credential) {
      const session = await authenticateWithGoogle(credential);
      setToken(session.token);
    },
    logout() {
      setToken(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
