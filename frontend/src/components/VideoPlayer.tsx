"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { Video } from "@/lib/types";

type VideoPlayerProps = {
  vid: Video;
  isActive: boolean; // whether this video is currently playing
  playingId: string | null;
  setPlayingId: (id: string | null) => void;
  volume: number;
  setVolume: (v: number) => void;
  showVolume: boolean;
  setShowVolume: (s: boolean) => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  onTogglePlay: (id: string) => void;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  vid,
  isActive,
  volume,
  setVolume,
  showVolume,
  setShowVolume,
  videoRef,
  onTogglePlay,
}) => {
  return (
    <div className="relative min-w-xl max-w-5xl w-fit snap-start rounded-xl ">
      {/* Play Icon Overlay */}
      <div className="absolute inset-0 w-full h-full flex justify-center items-center">
        {!isActive && <Play className="w-22 h-22 fill-white stroke-white" />}
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        data-id={vid.id}
        src={vid.url}
        loop
        muted
        playsInline
        onClick={() => onTogglePlay(vid.id)}
        className="rounded-xl w-full object-fit h-full"
      />

      {/* Volume Control */}
      <div
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        className="flex space-x-3 absolute top-4.5 left-3"
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
              onChange={(e) => setVolume(Number(e.target.value))}
              className="
                w-full h-1 rounded-lg appearance-none cursor-pointer 
                bg-neutral-400 accent-neutral-600
              "
            />
          </div>
        )}
      </div>

      {/* Caption & Tags */}
      <div className="absolute bottom-0 h-28 bg-gradient-to-t from-80% from-neutral-900/50 to-transparent inset-x-0 px-3 py-6">
        <span>{vid.caption}</span>
        <div>
          {vid.tags.map((tag, i) => (
            <span key={i} className="text-blue-300">
              #{tag}{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
