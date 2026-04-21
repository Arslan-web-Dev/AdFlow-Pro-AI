'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'moderator' | 'admin';
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const checkAuthRunOnce = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      // First check if user is in localStorage from recent login
      const storedUser = localStorage.getItem('adflow_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // Then verify with server
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('adflow_user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('adflow_user');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('adflow_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only run once per component mount
    if (!checkAuthRunOnce.current) {
      checkAuthRunOnce.current = true;
      checkAuth();
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('adflow_user', JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('adflow_user');
    router.push('/login');
  };

  const isAuthenticated = !!user;
  const isClient = user?.role === 'client';
  const isModerator = user?.role === 'moderator';
  const isAdmin = user?.role === 'admin';

  return {
    user,
    isLoading,
    isAuthenticated,
    isClient,
    isModerator,
    isAdmin,
    login,
    logout,
    refresh: checkAuth,
  };
}

export function useRequireAuth(allowedRoles?: ('client' | 'moderator' | 'admin')[]) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Only run once after loading is complete
    if (isLoading || redirectedRef.current) {
      return;
    }

    if (!isAuthenticated) {
      redirectedRef.current = true;
      router.push('/login');
      return;
    }

    if (isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard
        const dashboardRoutes: Record<string, string> = {
          client: '/dashboard/client',
          moderator: '/dashboard/moderator',
          admin: '/dashboard/admin',
        };
        redirectedRef.current = true;
        router.push(dashboardRoutes[user.role]);
      }
    }
  }, [isLoading, isAuthenticated, allowedRoles, user?.role, router]);

  return { user, isLoading };
}

// Hook for optional auth - doesn't redirect, just provides auth state
export function useOptionalAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const checkAuthRunOnce = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      // First check if user is in localStorage from recent login
      const storedUser = localStorage.getItem('adflow_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // Then verify with server
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('adflow_user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('adflow_user');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('adflow_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only run once per component mount
    if (!checkAuthRunOnce.current) {
      checkAuthRunOnce.current = true;
      checkAuth();
    }
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('adflow_user');
    router.push('/login');
  };

  const isAuthenticated = !!user;
  const isClient = user?.role === 'client';
  const isModerator = user?.role === 'moderator';
  const isAdmin = user?.role === 'admin';

  return {
    user,
    isLoading,
    isAuthenticated,
    isClient,
    isModerator,
    isAdmin,
    logout,
    refresh: checkAuth,
  };
}

