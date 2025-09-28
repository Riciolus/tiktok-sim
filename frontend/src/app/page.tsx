"use client";

import FeedSection from "@/components/FeedSection";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Feed() {
  return (
    <Layout>
      <div className="w-full flex ">
        <div className="flex-1">
          <FeedSection />
        </div>

        <UploadButton />
      </div>
    </Layout>
  );
}

const UploadButton = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-5">
      <Link
        href="/upload"
        className="flex cursor-pointer space-x-1.5 justify-center items-center bg-neutral-800 px-3 py-2 rounded-3xl"
      >
        <Plus />
        <span>Upload Video</span>
      </Link>
    </div>
  );
};
