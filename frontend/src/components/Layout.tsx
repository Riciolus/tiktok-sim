// components/Layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AuthModal from "@/components/AuthModal";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {!isMobile && <Sidebar onLoginClick={() => setIsLoginOpen(true)} />}
      {/* Main content */}
      <div className="flex-1">{children}</div>

      {isMobile && <BottomNavbar />}
      {/* Login popup */}
      {isLoginOpen && <AuthModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
}

const BottomNavbar = () => {
  return (
    <div className="fixed z-50 bottom-0 left-0 w-full border-neutral-700 bg-background border-t shadow-md md:hidden">
      <div className="flex justify-around">
        <button className="p-4">Home</button>
        <button className="p-4">Search</button>
        <button className="p-4">Profile</button>
      </div>
    </div>
  );
};
