"use client";

import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

type NewVideo = {
  filename: string;
  url: string;
  caption: string;
  tags: string[];
};

type VideoResponse = {
  id: string;
  filename: string;
  url: string;
  caption: string;
  tags: string[];
  createdAt: string;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  // Video description
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const mutation = useMutation<VideoResponse, Error, NewVideo>({
    mutationFn: (newVideo) =>
      fetch("http://localhost:8080/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newVideo),
      }).then((res) => res.json()),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(`uploads/${crypto.randomUUID()}-${file.name}`, file);

    if (error) {
      console.error("Upload failed:", error.message);
      return;
    }

    const plainDescription = description.replace(hashtagRegex, "").trim();

    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(data.path);

    mutation.mutate({
      filename: file.name,
      url: urlData.publicUrl,
      caption: plainDescription,
      tags: hashtags,
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const video = acceptedFiles[0];

    if (video) {
      setFile(video);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <Layout>
      <div className="p-5 w-full flex flex-col items-center ">
        <div className="w-full max-w-4xl">
          {/* Dropzone */}
          {!file && (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center h-64  justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
              }`}
            >
              <input {...getInputProps()} />

              <p className="text-gray-500">
                {isDragActive
                  ? "Drop the video here..."
                  : "Drag & drop a video, or click to select"}
              </p>
            </div>
          )}

          {/* Video preview */}
          {file && (
            <div className="mt-4 flex w-full  justify-between ">
              <div className="w-full space-y-3">
                <h3 className="text-xl mb-3">Details</h3>
                <div className="flex space-x-9">
                  <p className="text-gray-400">Filename: {file.name}</p>
                  <p className="text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <DescriptionInput
                  description={description}
                  setDescription={setDescription}
                  setHashtags={setHashtags}
                />
                {hashtags.length > 0 && (
                  <div className="flex space-x-2">
                    <p className="font-medium">Hashtags:</p>
                    {hashtags.map((tag) => (
                      <p key={tag} className="text-gray-400">
                        {tag}
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpload}
                    className="mt-2 bg-pink-700 px-3 w-full py-1.5 rounded-lg"
                  >
                    Post
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-2 border border-t-gray-400 px-3 py-1.5 w-full rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <VideoPreview file={file} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const hashtagRegex = /#(\w+)/g;

const DescriptionInput = ({
  description,
  setDescription,
  setHashtags,
}: {
  description: string;
  setDescription: (value: string) => void;
  setHashtags: (tags: string[]) => void;
}) => {
  // Regex to match hashtags: words starting with # followed by letters/numbers/underscore
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Keep full text in textarea
    setDescription(value);

    // Extract hashtags
    const matches = [...value.matchAll(hashtagRegex)].map((m) => m[1]);
    setHashtags([...new Set(matches)]);
  };

  return (
    <div>
      <h4>Description</h4>
      <textarea
        name="description"
        id="description"
        placeholder="Share more about your video here..."
        className="w-full p-2 mt-1 border outline-none border-neutral-900 bg-gray-700/10 rounded-md"
        value={description}
        onChange={handleChange}
      ></textarea>
    </div>
  );
};

const VideoPreview = React.memo(({ file }: { file: File }) => {
  // create URL once and memoize
  const videoURL = useMemo(() => URL.createObjectURL(file), [file]);

  // revoke when component unmounts or file changes
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(videoURL);
    };
  }, [videoURL]);
  return (
    <div className="flex justify-end">
      <video src={videoURL} controls className="w-1/2 rounded-xl shadow" />
    </div>
  );
});

VideoPreview.displayName = "VideoPreview";
