// components/Layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AuthModal from "@/components/AuthModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar onLoginClick={() => setIsLoginOpen(true)} />

      {/* Main content */}
      <div className="flex-1">{children}</div>

      {/* Login popup */}
      {isLoginOpen && <AuthModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
}
