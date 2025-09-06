"use client";

import FeedSection from "@/components/FeedSection";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Feed() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex h-screen ">
      <Sidebar onLoginClick={() => setIsLoginOpen(true)} />
      <div className="flex flex-1 justify-center">
        <FeedSection />
      </div>
      <UploadButton />

      {/* login popup */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
}

const UploadButton = () => {
  return (
    <div className="p-5">
      <div className="flex cursor-pointer space-x-1.5 justify-center items-center bg-neutral-800 px-3 py-2 rounded-3xl">
        <Plus />
        <span>Upload Video</span>
      </div>
    </div>
  );
};
