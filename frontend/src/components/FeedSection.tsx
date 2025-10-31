"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer from "./VideoPlayer";
import VideoActions from "./VideoActions";
import { Video } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";

async function getVideos() {
  const res = await fetch("http://localhost:8080/api/videos");
  if (!res.ok) throw new Error("Failed to fetch videos");
  const json = await res.json();
  return json.videos;
}

const FeedSection = () => {
  const { playingId, setPlayingId } = usePlayer();
  const [pause, setPause] = useState(true);
  const [volume, setVolume] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
    refetchOnWindowFocus: false,
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
            setPause(false);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.7] },
    );

    Object.values(videoRefs.current).forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [videos, setPlayingId]);

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (!pause) {
      video.pause();
      setPause(true);
    } else {
      // pause all others
      Object.entries(videoRefs.current).forEach(([vidId, el]) => {
        if (el && vidId !== id) el.pause();
      });
      video.play();
      setPause(false);
    }
  };

  // Keep actual DOM volume synced
  useEffect(() => {
    if (playingId && videoRefs.current[playingId]) {
      videoRefs.current[playingId]!.volume = volume / 100;
    }
  }, [volume, playingId]);

  if (isLoading) return null;
  if (error) return <p>Error loading videos</p>;

  return (
    <section
      className="flex flex-col items-center h-[calc(100vh-7rem)] md:h-screen  overflow-y-scroll
      snap-y snap-mandatory scroll-smooth hide-scrollbar w-full "
    >
      {videos.map((vid: Video) => (
        <div
          key={vid.id}
          className="relative flex items-end space-x-3   md:max-h-screen  max-w-screen md:w-fit"
        >
          <VideoPlayer
            vid={vid}
            isPaused={pause}
            playingId={playingId}
            setPlayingId={setPlayingId}
            volume={volume}
            setVolume={setVolume}
            showVolume={showVolume}
            setShowVolume={setShowVolume}
            videoRef={(el) => (videoRefs.current[vid.id] = el)}
            onTogglePlay={togglePlay}
          />

          <div className="absolute z-10 md:static right-3 flex flex-col items-center justify-center">
            <VideoActions vid={vid} />
          </div>
        </div>
      ))}
    </section>
  );
};
// max-h-[calc(100vh-4rem)]
export default FeedSection;
