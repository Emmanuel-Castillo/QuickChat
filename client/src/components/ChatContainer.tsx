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
import { Action } from "./shared-ui/OptionsBox";

const ChatContainer = () => {
  const {
    leaveGroup,
    loadingMessages,
    selectedChat,
    setSelectedChat,
    viewRightSidebarMobile,
    setViewRightSidebarMobile,
  } = useChat();

  const optionBoxActions: Action[] =
    selectedChat && selectedChat.type === "group"
      ? [{ text: "Leave Group", onClickAction: () => leaveGroup(selectedChat._id) }]
      : [{text: "Remove Friend", onClickAction: () => {}}];

  return selectedChat ? (
    <div
      className={`h-full overflow-scroll relative backdrop-blur-lg ${
        viewRightSidebarMobile ? "max-lg:hidden" : "block"
      }`}
    >
      <Header
        chatImage={
          selectedChat.profilePic || selectedChat.groupPic || assets.avatar_icon
        }
        chatName={selectedChat.fullName || selectedChat.name}
        leaveChat={() => setSelectedChat(null)}
        viewChatInfo={() => setViewRightSidebarMobile(true)}
        actions={optionBoxActions}
      />
      {selectedChat.type === "user" && <SingleChatMessages />}
      {selectedChat.type === "group" && <GroupChatMessages />}

      <UserInput disabled={loadingMessages} chatType={selectedChat.type} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
