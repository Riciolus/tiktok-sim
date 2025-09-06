// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; username: string; avatar?: string } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  setUser: (u: User) => void;
}>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check session on mount
    fetch("http://localhost:8080/api/auth/me", {
      credentials: "include", // <--- important for cookies
    })
      .then((res) => {
        if (!res.ok) throw new Error("not authenticated");
        return res.json();
      })
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
