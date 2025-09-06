// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; username: string; avatar?: string } | null;

const AuthContext = createContext<{
  user: User;
  setUser: (u: User) => void;
  setAccessToken: (t: string) => void
  accessToken: string | null
}>({
  user: null,
  setUser: () => {},
  setAccessToken: () => {},
  accessToken: null
});



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function refreshAccessToken() {
  const res = await fetch("http://localhost:8080/api/auth/refresh", {
    method: "POST",
    credentials: "include", // include the cookie
  });

  if (!res.ok) return null;

  const data = await res.json();
  setAccessToken(data.access_token);
  return data.access_token;
}


  useEffect(() => {
    refreshAccessToken().then( async (token) => {
    if (token) {
      // fetch user profile
      await fetch("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    }
  });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
