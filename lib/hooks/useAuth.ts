'use client';

import { useEffect, useState } from 'react';

const AUTH_KEY = 'bluelagoon-auth-token';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    if (username === 'johann' && password === 'valur') {
      localStorage.setItem(AUTH_KEY, 'authenticated');
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, isLoading, login, logout };
}
