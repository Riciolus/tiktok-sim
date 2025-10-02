"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer from "./VideoPlayer";
import VideoActions from "./VideoActions";
import { Video } from "@/lib/types";

async function getVideos() {
  const res = await fetch("http://localhost:8080/api/videos");
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.videos;
}

const FeedSection = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState(10);
  const [showVolume, setShowVolume] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  });

  // Detect visible video
  useEffect(() => {
    if (!videos) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            video.play();
            setPlayingId(video.dataset.id!);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.7] }
    );

    Object.values(videoRefs.current).forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [videos]);

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // pause all others
      Object.entries(videoRefs.current).forEach(([vidId, el]) => {
        if (el && vidId !== id) el.pause();
      });
      video.play();
      setPlayingId(id);
    }
  };

  // Keep actual DOM volume synced
  useEffect(() => {
    if (playingId && videoRefs.current[playingId]) {
      videoRefs.current[playingId]!.volume = volume / 100;
    }
  }, [volume, playingId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <p>Error loading videos</p>;

  return (
    <section
      className="flex flex-col items-center h-screen py-1.5 overflow-y-scroll
      snap-y snap-mandatory scroll-smooth hide-scrollbar w-full"
    >
      {videos.map((vid: Video) => (
        <div key={vid.id} className="min-h-full flex items-center my-1.5">
          <VideoPlayer
            vid={vid}
            isActive={playingId === vid.id}
            playingId={playingId}
            setPlayingId={setPlayingId}
            volume={volume}
            setVolume={setVolume}
            showVolume={showVolume}
            setShowVolume={setShowVolume}
            videoRef={(el) => (videoRefs.current[vid.id] = el)}
            onTogglePlay={togglePlay}
          />

          <div className="absolute bottom-10 right-0 flex flex-col items-center justify-center space-y-9 mr-5">
            <VideoActions
              userId="8e3f360e-e1a1-46a5-ad05-87e452e68f36"
              vid={vid}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeedSection;
