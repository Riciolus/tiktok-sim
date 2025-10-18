import { useAuth } from "@/context/AuthContext";
import { useComment } from "@/context/CommentContext";
import { useSign } from "@/context/SignContext";
import { Video } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Bookmark, Share } from "lucide-react";
import { useState } from "react";

type EventType =
  | "like"
  | "comment"
  | "share"
  | "bookmark"
  | "views"
  | "remove_bookmark"
  | "unlike";

const buttonClass = `
  cursor-pointer flex flex-col items-center 
`;

async function createEvent(
  userId: string,
  vidId: string,
  eventType: string,
  accessToken: string
) {
  const res = await fetch("http://localhost:8080/api/events", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      video_id: vidId,
      event_type: eventType,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error("Failed to Create Event");
  const json = await res.json();
  return json;
}

export default function VideoActions({ vid }: { vid: Video }) {
  const { user, accessToken } = useAuth();
  const { setIsLoginOpen } = useSign();
  const { setIsCommentActive } = useComment();
  const [liked, setLiked] = useState(vid.user_action.liked);
  const [bookmarked, setBookmarked] = useState(vid.user_action.bookmarked);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (eventType: string) => {
      if (!user) throw new Error("Not authenticated");
      return createEvent(user.id, vid.id, eventType, accessToken!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const sendEvent = (eventType: EventType) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    if (eventType === "unlike" || eventType === "like") setLiked(!liked);
    if (eventType === "bookmark" || eventType === "remove_bookmark")
      setBookmarked(!bookmarked);

    mutation.mutate(eventType);
  };

  const toggleCommentSection = () => {
    setIsCommentActive((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center space-y-5 md:mb-6">
      {/* Profile placeholder */}
      <button className="cursor-pointer">
        <div className="w-12 h-12 bg-neutral-500 rounded-full"></div>
      </button>

      {/* Like */}
      <button
        className={buttonClass}
        onClick={() => sendEvent(liked ? "unlike" : "like")}
      >
        <Heart
          className={cn(
            "w-6 h-6 fill-neutral-200",
            liked && "fill-red-500 stroke-red-500"
          )}
        />
        <span>{vid.stats.likes}</span>
      </button>

      {/* Comment */}
      <button
        className={buttonClass}
        onClick={() => toggleCommentSection(vid.id)}
      >
        <MessageCircle className="w-6 h-6 fill-neutral-200" />
        <span>{vid.stats.comments}</span>
      </button>

      {/* Bookmark */}
      <button
        className={buttonClass}
        onClick={() => sendEvent(bookmarked ? "remove_bookmark" : "bookmark")}
      >
        <Bookmark
          className={cn(
            "w-6 h-6 fill-neutral-200",
            bookmarked && "fill-yellow-500 stroke-yellow-500"
          )}
        />
      </button>

      {/* Share */}
      <button className={buttonClass} onClick={() => sendEvent("share")}>
        <Share className="w-6 h-6 " />
        <span>{vid.stats.shares}</span>
      </button>
    </div>
  );
}
