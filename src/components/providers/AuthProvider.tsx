"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  verifySession: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifySession = useCallback(async (): Promise<User | null> => {
    const savedToken = localStorage.getItem('accessToken');
    if (!savedToken) {
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
    
    try {
      const response = await authService.getMe();
      const currentUser = response.data;
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
      return currentUser;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('accessToken');
      if (savedToken) {
        await verifySession();
      } else {
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    };
    initializeAuth();
  }, [verifySession]);

  const login = useCallback(async (credentials: { email: string; password?: string }) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const { accessToken, user: loggedInUser } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch {
      console.error('Logout request failed');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifySession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
