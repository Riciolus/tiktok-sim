// components/Layout.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import AuthModal from "@/components/AuthModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSign } from "@/context/SignContext";
import CommentPanel from "./CommentPanel";
import { useComment } from "@/context/CommentContext";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  const { isCommentActive } = useComment();
  const { isLoginOpen, setIsLoginOpen } = useSign();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-x-hidden">
      {!isMobile && <Sidebar onLoginClick={() => setIsLoginOpen(true)} />}
      {/* Main content */}
      <div className="flex-1">{children}</div>

      {isMobile && <BottomNavbar />}
      {/* Login popup */}
      {isLoginOpen && <AuthModal onClose={() => setIsLoginOpen(false)} />}

      <div
        className={cn(
          "   bg-neutral-800 h-screen transition-all ",
          isCommentActive ? "max-w-[17vw] w-md" : "w-0",
        )}
      >
        {isCommentActive && <CommentPanel />}
      </div>
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
