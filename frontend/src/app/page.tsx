"use client";

import FeedSection from "@/components/FeedSection";
import Layout from "@/components/Layout";
import UploadButton from "@/components/UploadButton";

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
