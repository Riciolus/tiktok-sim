import { usePlayer } from "@/context/PlayerContext";
import { useQuery } from "@tanstack/react-query";
import { Comment } from "@/lib/types";
import Image from "next/image";
import Skeleton from "./Skeleton";
import PostComment from "./PostComment";

async function getComments(vidId: string | null) {
  const res = await fetch(
    `http://localhost:8080/api/videos/${vidId || " "}/comments`,
  );
  if (!res.ok) throw new Error("Failed to fetch comments");
  const json = await res.json();
  return json;
}

const CommentPanel = () => {
  const { playingId } = usePlayer();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", playingId],
    queryFn: () => getComments(playingId),
  });

  if (error) return <p>Error loading comments</p>;

  return (
    <div className="p-3 flex flex-col justify-between h-full space-y-5">
      <h4 className="font-semibold">
        Comments ({comments ? comments.length : 0})
      </h4>

      {/* the comments */}
      <div className="h-full">
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonCommentList />
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment: Comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="w-full flex justify-center items-center h-28">
            <h3 className="text-neutral-300">Be the first to comment!</h3>
          </div>
        )}
      </div>

      <PostComment />
    </div>
  );
};

const CommentCard = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-8 h-8 rounded-full bg-neutral-500 ">
        <Image
          src={comment.author.avatar_url || "/avatar-default.svg"}
          alt=""
          fill
        />
      </div>
      <div>
        <span>{comment.author.username}</span>
        <p className="text-neutral-200">{comment.content}</p>
      </div>
    </div>
  );
};

const SkeletonCommentList = () => {
  return [...Array(3)].map((_, i) => (
    <div key={i} className="flex items-center space-x-2">
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-48 h-3" />
      </div>
    </div>
  ));
};

export default CommentPanel;
