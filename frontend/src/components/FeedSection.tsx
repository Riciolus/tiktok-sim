"use client";

import { Video } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import VideoActions from "./VideoActions";

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

  // Detect visible video on viewport and play it, and pause else
  useEffect(() => {
    if (!videos) return; // only run when videos are fetched
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

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]); // rerun when videos are fetched

  if (isLoading) return <div></div>;
  if (error) return <p>Error loading videos</p>;

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      Object.entries(videoRefs.current).forEach(([vidId, vidEl]) => {
        if (vidEl && vidId !== id) {
          vidEl.pause();
        }
      });
      video.play();
      setPlayingId(id);
    }
  };

  const handleVolume = (value: string) => {
    const newVolume = Number(value);
    setVolume(newVolume);

    if (playingId && videoRefs.current[playingId]) {
      videoRefs.current[playingId]!.volume = newVolume / 100;
    }
  };

  return (
    <section
      className="flex flex-col items-center h-screen py-1.5 overflow-y-scroll
        snap-y snap-mandatory
        scroll-smooth hide-scrollbar"
    >
      {videos.map((vid: Video, i: number) => (
        <div
          className="relative  min-w-xl w-fit h-screen min-h-screen snap-start  rounded-xl py-1.5"
          key={vid.id}
        >
          <div className="absolute inset-0 w-full h-full flex justify-center items-center">
            {playingId !== vid.id && <Play className="w-22 h-22" />}
          </div>

          <video
            ref={(el) => {
              videoRefs.current[vid.id] = el;
            }}
            data-id={vid.id}
            src={vid.url}
            autoPlay={i === 0}
            loop
            muted
            playsInline
            onClick={() => togglePlay(vid.id)}
            className="rounded-xl w-full object-fit h-full"
          />

          <div
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
            className="flex space-x-3  absolute top-4.5 left-3"
          >
            <button>
              {volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            {showVolume && (
              <div className="flex justify-center items-center space-x-1 bg-neutral-800/35 px-3 rounded-xl">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolume(e.target.value)}
                  className="
          w-full h-1 rounded-lg appearance-none cursor-pointer 
          bg-neutral-400 accent-neutral-600
        "
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-0 h-28 bg-gradient-to-t from-80% from-neutral-900/50 to-transparent inset-x-0 px-3 py-6">
            <span>{vid.caption}</span>
            <div>
              {vid.tags.map((tag, index) => (
                <span className="text-blue-300" key={index}>
                  #{tag}{" "}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-10 right-0 flex flex-col items-center justify-center space-y-9  mr-5">
            <VideoActions userId="8e3f360e-e1a1-46a5-ad05-87e452e68f36" vid={vid} />
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeedSection;
