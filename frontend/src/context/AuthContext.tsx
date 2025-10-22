// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; username: string; avatar?: string } | null;

const AuthContext = createContext<{
  user: User;
  setUser: (u: User) => void;
  setAccessToken: (t: string) => void;
  accessToken: string | null;
}>({
  user: null,
  setUser: () => {},
  setAccessToken: () => {},
  accessToken: null,
});

async function refreshAccessToken() {
  const res = await fetch("http://localhost:8080/api/auth/refresh", {
    method: "POST",
    credentials: "include", // include the cookie
  });

  if (res.status === 204) return null;

  const data = await res.json();
  return data.access_token;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    refreshAccessToken().then((token) => {
      if (token) {
        setAccessToken(token);
        // fetch user profile
        fetch("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => setUser(data.user));
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, accessToken, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
