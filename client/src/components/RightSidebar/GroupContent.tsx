import React, { useState } from "react";
import FilterButton from "../Sidebar/FilterButton";
import MediaContent from "./MediaContent";
import GroupMembersContent from "./GroupMembersContent";

type RightSidebarGroupContentProps = {
  selectedChat: any;
  msgImages: any[];
};
const RightSidebarGroupContent = ({
  selectedChat,
  msgImages,
}: RightSidebarGroupContentProps) => {
  const [showContent, setShowContent] = useState<"media" | "members">(
    "members"
  );
  return (
    <div className="flex-1 flex flex-col border-2 border-[#282142]/50 rounded-b-xl">
      <div className="grid grid-cols-1 xl:grid-cols-2">
        <FilterButton
          buttonText="Media"
          isSelected={showContent === "media"}
          onClickButton={() => {
            setShowContent("media");
          }}
        />
        <FilterButton
          buttonText="Members"
          isSelected={showContent === "members"}
          onClickButton={() => {
            setShowContent("members");
          }}
        />
      </div>

      {/* Image messages */}
      {showContent === "media" && <MediaContent msgImages={msgImages} />}

      {showContent === "members" && selectedChat?.members && (
        <GroupMembersContent members={selectedChat.members} />
      )}
    </div>
  );
};

export default RightSidebarGroupContent;
