import { useState, useCallback } from 'react';
import { authApi } from '../services/api';
import type { AuthUser } from '../types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    localStorage.setItem('admin_token', response.access_token);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
    setUser(response.user);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  }, []);

  const isAuthenticated = !!localStorage.getItem('admin_token');

  return { user, login, logout, isAuthenticated };
}
