import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import SingleChatMessages from "./chatcontainer-ui/SingleChatMessages";
import GroupChatMessages from "./chatcontainer-ui/GroupChatMessages";
import Header from "./chatcontainer-ui/Header";
import { UserInput } from "./chatcontainer-ui/UserInput";

const ChatContainer = () => {
  const {
    loadingMessages,
    selectedChat,
    setSelectedChat,
    viewRightSidebarMobile,
    setViewRightSidebarMobile,
  } = useChat();

  return selectedChat ? (
    <div
      className={`h-full overflow-scroll relative backdrop-blur-lg ${
        viewRightSidebarMobile ? "max-lg:hidden" : "block"
      }`}
    >
      <Header
        chatImage={selectedChat.profilePic || assets.avatar_icon}
        chatName={selectedChat.fullName || selectedChat.name}
        leaveChat={() => setSelectedChat(null)}
        viewChatInfo={() => setViewRightSidebarMobile(true)}
      />
      {selectedChat.type === "user" && <SingleChatMessages />}
      {selectedChat.type === "group" && <GroupChatMessages />}

      <UserInput disabled={loadingMessages} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
