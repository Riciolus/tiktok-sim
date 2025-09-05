import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Bookmark, Share } from "lucide-react";
import { useState } from "react";

type EventType = "like" | "comment" | "share" | "bookmark" | "views";

type Props = {
  vid: {
    id: string;
    stats: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
  userId: string;
};

async function createEvent(userId: string, vidId: string, eventType: string) {
  const res = await fetch("http://localhost:8080/api/events", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      video_id: vidId,
      event_type: eventType,
    }),
  });

  if (!res.ok) throw new Error("Failed to Create Event");
  const json = await res.json();
  return json;
}

export default function VideoActions({ vid, userId }: Props) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (eventType: string) => createEvent(userId, vid.id, eventType),
    onSuccess: () => {
      // ✅ optimistically refresh stats
      queryClient.invalidateQueries({ queryKey: ["videos", vid.id] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const sendEvent = (eventType: EventType) => {
    mutation.mutate(eventType);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Profile placeholder */}
      <button className="cursor-pointer">
        <div className="w-12 h-12 bg-neutral-500 rounded-full"></div>
      </button>

      {/* Like */}
      <button
        className="cursor-pointer flex flex-col items-center"
        onClick={() => sendEvent("like")}
      >
        <Heart className="w-8 h-8" />
        <span>{vid.stats.likes}</span>
      </button>

      {/* Comment */}
      <button
        className="cursor-pointer flex flex-col items-center"
        onClick={() => sendEvent("comment")}
      >
        <MessageCircle className="w-8 h-8" />
        <span>{vid.stats.comments}</span>
      </button>

      {/* Bookmark */}
      <button
        className="cursor-pointer flex flex-col items-center"
        onClick={() => sendEvent("bookmark")}
      >
        <Bookmark className="w-8 h-8" />
      </button>

      {/* Share */}
      <button
        className="cursor-pointer flex flex-col items-center"
        onClick={() => sendEvent("share")}
      >
        <Share className="w-8 h-8" />
        <span>{vid.stats.shares}</span>
      </button>
    </div>
  );
}
