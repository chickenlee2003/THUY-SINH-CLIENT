'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth-service';
import { IUser } from '../types/backend';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const role = localStorage.getItem('role');
        const avatar = localStorage.getItem('avatar');
        const fullName = localStorage.getItem('fullName');

        if (token && id) {
          setUser({
            userId: parseInt(id),
            role: role as "ROLE_USER" | "ROLE_ADMIN" ,
            avatar: avatar || null,
            fullName: fullName || '',
            email: '', // These fields will be populated when needed
            phoneNumber: null,
            isActive: true
          });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {

      const response = await authService.login({ email, password });
      setUser({
        userId: response.id,
        role: response.role as "ROLE_USER" | "ROLE_ADMIN" ,
        avatar: response.avatar || null,
        fullName: response.fullName || '',
        email: email,
        phoneNumber: null,
        isActive: true
      });

      console.log('Login successful:', response);
      console.log('User:', user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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