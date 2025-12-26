"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // 데모: 아무 이메일/비밀번호나 입력하면 로그인됨
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser({
      id: "demo-user",
      name: email.split("@")[0],
      email,
    });
    return true;
  };

  const signup = async (name: string, email: string, password: string) => {
    // 데모: 회원가입 후 자동 로그인
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser({
      id: "demo-user",
      name,
      email,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
