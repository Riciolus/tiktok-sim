import { usePlayer } from "@/context/PlayerContext";
import { Comment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

async function getComments(vidId: string) {
  const res = await fetch(`http://localhost:8080/api/videos/${vidId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  const json = await res.json();
  return json.comments;
}

const CommentPanel = () => {
  const { playingId } = usePlayer();
  if (!playingId) throw new Error("videoId not found");

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getComments(playingId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading comments</p>;

  return (
    <div className="min-w-[2vw] max-w-[17vw] w-full flex-1  bg-neutral-800 h-screen ">
      <div className="p-3 flex flex-col space-y-5">
        <h4 className="font-semibold">Comments ({comments.length})</h4>

        <div>
          {comments.map((comment: Comment) => (
            <div key={comment.id} className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-red-200 shrink-0"></div>
              <div>
                <span className="font-semibold">{comment.user_id}</span>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentPanel;
