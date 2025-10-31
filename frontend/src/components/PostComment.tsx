import { useAuth } from "@/context/AuthContext";
import { usePlayer } from "@/context/PlayerContext";
import { useSign } from "@/context/SignContext";
import { Comment, Video } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function PostComment() {
  const { accessToken } = useAuth();
  const { setIsLoginOpen } = useSign();
  const { playingId } = usePlayer();
  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState<string>("");

  const mutation = useMutation<Comment, Error, { content: string }>({
    mutationFn: async (newComment: { content: string }) => {
      return fetch(`http://localhost:8080/api/videos/${playingId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newComment),
      }).then((res) => res.json());
    },

    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(
        ["comments", playingId],
        (old: Comment[] = []) => [...old, newComment],
      );

      // Update only this video's comment count in the videos cache
      queryClient.setQueryData(["videos"], (old: Video[] = []) =>
        old.map((video) =>
          video.id === playingId
            ? {
                ...video,
                stats: {
                  ...video.stats,
                  comments: video.stats.comments + 1,
                },
              }
            : video,
        ),
      );

      setCommentInput("");
    },
  });

  const handlePostComment = () => {
    if (!accessToken) return setIsLoginOpen(true);
    if (!commentInput) return;

    mutation.mutate({ content: commentInput });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlePostComment();
      }}
    >
      <div className="flex space-x-3">
        <input
          placeholder="Add comment!"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="p-3 bg-neutral-900/50 rounded-lg w-full outline-none"
        />

        <button
          type="submit"
          className="bg-pink-700 hover:bg-pink-800 px-3 rounded-lg my-2"
        >
          Post
        </button>
      </div>
    </form>
  );
}
