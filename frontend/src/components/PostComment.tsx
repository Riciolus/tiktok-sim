export default function PostComment() {
  return (
    <div className="flex space-x-3">
      <input
        placeholder="Add comment!"
        className="p-3 bg-neutral-900/50 rounded-lg w-full outline-none"
      />

      <button className="bg-pink-700 hover:bg-pink-800 px-3 rounded-lg my-2">
        Post
      </button>
    </div>
  );
}
