import React, { useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import RightSidebarHeader from "./rightsidebar-ui/RightSidebarHeader";
import UserBar from "./sidebar-ui/UserBar";
import FilterButton from "./sidebar-ui/FilterButton";
import MediaContent from "./rightsidebar-ui/MediaContent";
import GroupMembersContent from "./rightsidebar-ui/GroupMembersContent";
import RightSidebarGroupContent from "./rightsidebar-ui/RightSidebarGroupContent";

const RightSidebar = () => {
  const { selectedChat, messages } = useChat();
  const { setViewRightSidebarMobile, viewRightSidebarMobile } = useChat();
  const { logout, onlineUsers } = useAuth();

  const [msgImages, setMsgImages] = useState<any[]>([]);

  // Get all the images from the messagese and set them to state
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedChat && (
      <div
        className={`p-5 bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll flex flex-col gap-4 flex-1 ${
          !viewRightSidebarMobile ? "max-lg:hidden" : "block"
        }`}
      >
        <img
          onClick={() => setViewRightSidebarMobile(false)}
          src={assets.arrow_icon}
          alt=""
          className="lg:hidden max-w-7 absolute top-4 left-4"
        />

        {/* Header */}
        <RightSidebarHeader
          headerImage={
            selectedChat.profilePic ||
            selectedChat.groupPic ||
            assets.avatar_icon
          }
          chatName={selectedChat.fullName || selectedChat.name}
          chatInformation={selectedChat.bio || selectedChat.description}
        />

        <hr className="border-[#ffffff50]" />

        {selectedChat.type === "group" && (
          <RightSidebarGroupContent
            msgImages={msgImages}
            selectedChat={selectedChat}
          />
        )}
        {selectedChat.type === "user" && (
          <div className="flex-1">
            <p className="text-white">Media</p>
            <MediaContent msgImages={msgImages} />
          </div>
        )}

        <button
          onClick={logout}
          className=" bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light p-2 px-15 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
