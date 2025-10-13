import React from "react";
import { formatMessageTime } from "../../lib/utils";

type MessageRowProps = {
  index: number;
  isAuthUserMsg: boolean;
  senderProfilePic: string;
  senderName?: string;
  image?: string;
  text?: string;
  createdAt: string;
};
const MessageRow = ({
  index,
  isAuthUserMsg,
  senderProfilePic,
  senderName,
  createdAt,
  image,
  text,
}: MessageRowProps) => {
  return (
    <div
      key={index}
      className={`flex items-end gap-2 justify-end ${
        !isAuthUserMsg && "flex-row-reverse"
      }`}
    >
      <div className="flex flex-col">
        {senderName && <p className="text-white text-sm">{senderName}</p>}
        {image ? (
          <img
            src={image}
            alt=""
            className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
          />
        ) : (
          <p
            className={`p-2 max-w-[200px] md:text-sm font-light rounded-log mb-8 break-all bg-violet-500/30 text-white ${
              isAuthUserMsg ? "rounded-br-none" : "rounded-bl-none"
            }`}
          >
            {text}
          </p>
        )}
      </div>

      <div className="text-center text-xs">
        <img src={senderProfilePic} alt="" className="w-7 rounded-full" />
        <p className="text-gray-500">{formatMessageTime(createdAt)}</p>
      </div>
    </div>
  );
};

export default MessageRow;
