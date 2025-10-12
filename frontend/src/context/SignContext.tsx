"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SignContextType = {
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
};

// Default value (optional)
const SignContext = createContext<SignContextType | undefined>(undefined);

export function SignProvider({ children }: { children: ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <SignContext.Provider value={{ isLoginOpen, setIsLoginOpen }}>
      {children}
    </SignContext.Provider>
  );
}

// Custom hook for easier use
export function useSign() {
  const context = useContext(SignContext);
  if (!context) {
    throw new Error("useSign must be used within a SignProvider");
  }
  return context;
}
