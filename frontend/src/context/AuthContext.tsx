import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'customer' | 'chemist' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  chemistId: string | null;
}

interface AuthContextValue {
  user: User | null;
  userRole: UserRole;
  chemistId: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, role: UserRole, fullName?: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for JWT and user details
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Login failed' };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { error: null };
    } catch (err) {
      return { error: 'Network error. Make sure backend is running.' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    role: UserRole,
    fullName?: string
  ): Promise<{ error: string | null }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, fullName })
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Registration failed' };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { error: null };
    } catch (err) {
      return { error: 'Network error. Make sure backend is running.' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const userRole: UserRole = user?.role ?? 'customer';
  const chemistId = user?.chemistId ?? null;
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      chemistId,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
