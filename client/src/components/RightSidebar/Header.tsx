import React from "react";

type RightSidebarProps = {
  headerImage: string;
  chatName: string;
  chatInformation: string;

  // Single user chat
  isOnlineUser?: boolean;
};
const RightSidebarHeader = ({
  headerImage,
  chatName,
  chatInformation,
  isOnlineUser,
}: RightSidebarProps) => {
  return (
    <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
      <img
        src={headerImage}
        alt=""
        className="w-20 aspect-[1/1] rounded-full"
      />
      <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
        {isOnlineUser && <p className="w-2 h-2 rounded-full bg-green-500"></p>}
        {chatName}
      </h1>
      <p className="px-10 mx-auto">{chatInformation}</p>
    </div>
  );
};

export default RightSidebarHeader;
