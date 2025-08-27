"use client";

import {
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Share,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const dummyVideos = [
  {
    id: "vid_1",
    filename: "supernayrdf.mp4",
    url: "/videos/supernayrdf.mp4",
    caption: "Super Nayr dance challenge 🔥",
    uploader: {
      id: "user_1",
      username: "nayr",
      avatar: "/avatars/nayr.png",
    },
    stats: {
      likes: 120,
      comments: 15,
      shares: 8,
      views: 800,
    },
    tags: ["dance", "challenge", "fun"],
    createdAt: "2025-08-26T14:00:00Z",
  },
  {
    id: "vid_2",
    filename: "hungrydogeatingbacon.mp4",
    url: "/videos/hungrydogeatingbacon.mp4",
    caption: "POV: Dog discovers bacon 🐶🥓",
    uploader: {
      id: "user_2",
      username: "doglover",
      avatar: "/avatars/doglover.png",
    },
    stats: {
      likes: 500,
      comments: 42,
      shares: 19,
      views: 2400,
    },
    tags: ["dog", "food", "cute"],
    createdAt: "2025-08-25T09:30:00Z",
  },
  {
    id: "vid_3",
    filename: "oline.mp4",
    url: "/videos/oline.mp4",
    caption: "Oline’s singing cover 🎤✨",
    uploader: {
      id: "user_3",
      username: "oline",
      avatar: "/avatars/oline.png",
    },
    stats: {
      likes: 310,
      comments: 27,
      shares: 12,
      views: 1500,
    },
    tags: ["music", "cover", "singing"],
    createdAt: "2025-08-20T20:15:00Z",
  },
  {
    id: "vid_4",
    filename: "ribka.mp4",
    url: "/videos/ribka.mp4",
    caption: "Ribka kocak singing cover 🎤✨",
    uploader: {
      id: "user_4",
      username: "ribka",
      avatar: "/avatars/oline.png",
    },
    stats: {
      likes: 310,
      comments: 27,
      shares: 12,
      views: 1500,
    },
    tags: ["music", "cover", "singing"],
    createdAt: "2025-08-20T20:15:00Z",
  },
  {
    id: "vid_5",
    filename: "ella2.mp4",
    url: "/videos/ella2.mp4",
    caption: "Ella cantikk 🎤✨",
    uploader: {
      id: "user_5",
      username: "ella",
      avatar: "/avatars/ella.png",
    },
    stats: {
      likes: 2817,
      comments: 127,
      shares: 89,
      views: 30000,
    },
    tags: ["JKT48", "cover", "singing"],
    createdAt: "2025-08-20T20:15:00Z",
  },
];

export default function Feed() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState(10);
  const [showVolume, setShowVolume] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Detect visible video on viewport and play it, and pause else
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            // Play the visible one
            video.play();
            setPlayingId(video.dataset.id!);
          } else {
            // Pause when not in view
            video.pause();
          }
        });
      },
      { threshold: [0.7] } // at least 70% visible
    );

    // Observe all videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

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
    <div
      className="flex flex-col items-center h-screen py-1.5 overflow-y-scroll
        snap-y snap-mandatory
        scroll-smooth"
    >
      {dummyVideos.map((vid, i) => (
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
            <button>
              <div className="w-12 h-12 bg-neutral-500 rounded-full"></div>
            </button>

            <button>
              <Heart className="w-8 h-8" />
              <span>{vid.stats.likes}</span>
            </button>
            <button>
              <MessageCircle className="w-8 h-8" />
              <span>{vid.stats.comments}</span>
            </button>
            <button>
              <Bookmark className="w-8 h-8" />
            </button>
            <button>
              <Share className="w-8 h-8" />
              <span>{vid.stats.shares}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
