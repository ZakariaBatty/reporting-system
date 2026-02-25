"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, users as allUsers } from "@/lib/data/users";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("transithub_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("transithub_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = allUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete (userWithoutPassword as any).password;

      setUser(userWithoutPassword as User);
      localStorage.setItem(
        "transithub_user",
        JSON.stringify(userWithoutPassword),
      );
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("transithub_user");
  };

  const resetPassword = (email: string, newPassword: string): boolean => {
    // This is just for demo - in real app, would call API
    const foundUser = allUsers.find((u) => u.email === email);
    if (foundUser) {
      foundUser.password = newPassword;
      if (user?.email === email) {
        const updatedUser = { ...user };
        setUser(updatedUser);
        localStorage.setItem("transithub_user", JSON.stringify(updatedUser));
      }
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        resetPassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
