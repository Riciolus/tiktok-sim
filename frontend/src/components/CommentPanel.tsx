const CommentPanel = () => {
  // fetch commenthere!!!!

  return (
    <div className="min-w-[2vw] max-w-[17vw] w-full flex-1  bg-neutral-800 h-screen ">
      <div className="p-3 flex flex-col space-y-5">
        <h4 className="font-semibold">Comments (0)</h4>

        <div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-200 shrink-0"></div>
            <div>
              <span className="font-semibold">Megalodon12</span>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Cupiditate expedita itaque consequatur?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPanel;
