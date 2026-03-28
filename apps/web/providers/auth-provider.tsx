"use client";

import { createContext, useEffect, useMemo, useState } from "react";

import type { AuthResponse, AuthUser } from "../lib/types";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isReady: boolean;
  login: (payload: AuthResponse) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  isReady: false,
  login: () => undefined,
  logout: () => undefined,
});

const STORAGE_KEY = "movie-tracker-auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as AuthResponse;
      setToken(parsed.token);
      setUser(parsed.user);
    }

    setIsReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isReady,
      login: (payload) => {
        setToken(payload.token);
        setUser(payload.user);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [isReady, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
