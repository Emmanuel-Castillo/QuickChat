import React from "react";

const MediaContent = ({ msgImages }: { msgImages: any[] }) => {
  return (
    <div className="p-2 text-xs">
      <div
        className={`overflow-y-scroll ${
          msgImages.length === 0
            ? "flex items-center justify-center"
            : "grid grid-cols-2 gap-4"
        } opacity-80`}
      >
        {msgImages.length === 0 ? (
          <p>No images in this chat...</p>
        ) : (
          msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >
              <img src={url} alt="" className="h-full rounded-md" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MediaContent;
