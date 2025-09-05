// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; username: string } | null;

const AuthContext = createContext<{ user: User; loading: boolean }>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: fetch session from your API
    fetch("http://localhost:8080/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
