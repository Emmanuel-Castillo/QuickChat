import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import SingleChatContainer from "./SingleChatContainer";
import GroupChatContainer from "./GroupChatContainer";

const ChatContainer = () => {
  const { selectedChat, viewRightSidebarMobile } =
    useChat();

    console.log("selectedUser", selectedChat)

  return selectedChat  ?  (
    <div className={`h-full overflow-scroll relative backdrop-blur-lg ${
        viewRightSidebarMobile ? "max-lg:hidden" : "block"
      }`}>
      {selectedChat.type === 'user' && <SingleChatContainer/>}
      {selectedChat.type === 'group' &&  <GroupChatContainer/>}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
