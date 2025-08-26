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
import { useRef, useState } from "react";

const dummyVideos = [
  // {
  //   id: "vid_1",
  //   filename: "supernayrdf.mp4",
  //   url: "/videos/supernayrdf.mp4", // where frontend fetches the file
  //   caption: "Super Nayr dance challenge 🔥",
  //   uploader: {
  //     id: "user_1",
  //     username: "nayr",
  //     avatar: "/avatars/nayr.png",
  //   },
  //   stats: {
  //     likes: 120,
  //     comments: 15,
  //     shares: 8,
  //     views: 800,
  //   },
  //   tags: ["dance", "challenge", "fun"],
  //   createdAt: "2025-08-26T14:00:00Z",
  // },
  // {
  //   id: "vid_2",
  //   filename: "hungrydogeatingbacon.mp4",
  //   url: "/videos/hungrydogeatingbacon.mp4",
  //   caption: "POV: Dog discovers bacon 🐶🥓",
  //   uploader: {
  //     id: "user_2",
  //     username: "doglover",
  //     avatar: "/avatars/doglover.png",
  //   },
  //   stats: {
  //     likes: 500,
  //     comments: 42,
  //     shares: 19,
  //     views: 2400,
  //   },
  //   tags: ["dog", "food", "cute"],
  //   createdAt: "2025-08-25T09:30:00Z",
  // },
  // {
  //   id: "vid_3",
  //   filename: "oline.mp4",
  //   url: "/videos/oline.mp4",
  //   caption: "Oline’s singing cover 🎤✨",
  //   uploader: {
  //     id: "user_3",
  //     username: "oline",
  //     avatar: "/avatars/oline.png",
  //   },
  //   stats: {
  //     likes: 310,
  //     comments: 27,
  //     shares: 12,
  //     views: 1500,
  //   },
  //   tags: ["music", "cover", "singing"],
  //   createdAt: "2025-08-20T20:15:00Z",
  // },
  // {
  //   id: "vid_4",
  //   filename: "ribka.mp4",
  //   url: "/videos/ribka.mp4",
  //   caption: "Ribka kocak singing cover 🎤✨",
  //   uploader: {
  //     id: "user_4",
  //     username: "ribka",
  //     avatar: "/avatars/oline.png",
  //   },
  //   stats: {
  //     likes: 310,
  //     comments: 27,
  //     shares: 12,
  //     views: 1500,
  //   },
  //   tags: ["music", "cover", "singing"],
  //   createdAt: "2025-08-20T20:15:00Z",
  // },
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
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(50);
  const [showVolume, setShowVolume] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const togglePlay = (e: string) => {
    const newVolume = Number(e);
    setVolume(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };
  return (
    <div className="flex flex-col items-center h-screen py-1.5">
      {dummyVideos.map((vid) => (
        <div
          className="relative  min-w-xl w-fit h-screen min-h-screen  rounded-xl py-1.5"
          key={vid.id}
        >
          <div className="absolute inset-0 w-full h-full flex justify-center items-center">
            {!playing && <Play className="w-22 h-22" />}
          </div>

          <video
            ref={videoRef}
            src={vid.url}
            autoPlay
            loop
            playsInline
            onClick={handlePlayPause}
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
                  onChange={(e) => togglePlay(e.target.value)}
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
