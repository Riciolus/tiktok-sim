import { usePlayer } from "@/context/PlayerContext";
import { Comment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

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
    <div className="min-w-[2vw] max-w-[17vw] w-full flex-1  bg-neutral-800 h-screen ">
      <div className="p-3 flex flex-col space-y-5">
        <h4 className="font-semibold">
          Comments ({comments ? comments.length : 0})
        </h4>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex flex-col space-y-2">
                  <Skeleton className="w-28 h-5" />
                  <Skeleton className="w-48 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment: Comment) => (
            <div key={comment.id} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-red-200 shrink-0" />
              <div>
                <span className="font-semibold">{comment.author.username}</span>
                <p>{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <h3>Be the first to comment!</h3>
            <ShowPanel />
          </>
        )}
      </div>
    </div>
  );
};

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-Xpulse bg-neutral-700 rounded ${className}`} />
  );
}

export default CommentPanel;

const ShowPanel = () => {
  return <div>tess</div>;
};
