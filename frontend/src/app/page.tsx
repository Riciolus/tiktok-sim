"use client";

import FeedSection from "@/components/FeedSection";
import { Plus } from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  { name: "For You", url: "/" },
  { name: "Explore", url: "/explore" },
  { name: "Following", url: "/following" },
];

export default function Feed() {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex flex-1 justify-center">
        <FeedSection />
      </div>
      <UploadButton />
    </div>
  );
}

const Sidebar = () => {
  return (
    <div className="p-5">
      <h1 className="py-3 text-xl">TOKTOK</h1>
      <div className="flex flex-col space-y-3">
        {sidebarItems.map((item, i) => (
          <Link href={item.url} key={i}>
            {item.name}
          </Link>
        ))}
        <span>Profile</span>
      </div>
    </div>
  );
};

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
