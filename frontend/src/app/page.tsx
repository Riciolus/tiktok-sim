"use client";

import FeedSection from "@/components/FeedSection";
import Layout from "@/components/Layout";
// import UploadButton from "@/components/UploadButton";

export default function Feed() {
  return (
    <Layout>
      <div className="w-full flex max-h-20">
        <div className="flex-1">
          <FeedSection />
        </div>

        {/*ignore this {!isMobile && <UploadButton />} */}
      </div>
    </Layout>
  );
}
