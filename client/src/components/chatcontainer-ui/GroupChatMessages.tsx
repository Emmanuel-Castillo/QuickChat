import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../../assets/assets";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";
import MessageRow from "./MessageRow";

const GroupChatMessages = () => {
  const scrollEnd = useRef<HTMLDivElement>(null);
  const { selectedChat, messages, getGroupMessages, loadingMessages } = useChat();
  const { authUser } = useAuth();

  useEffect(() => {
    if (selectedChat) {
      getGroupMessages(selectedChat._id);
    }
  }, [selectedChat]);

  // Scroll down for new message
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    selectedChat && (
     (loadingMessages ? <div>Loading messages...</div> : <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <MessageRow
            index={index}
            isAuthUserMsg={msg.senderId._id === authUser._id}
            senderName={msg.senderId.fullName}
            senderProfilePic={
              msg.senderId._id === authUser._id
                ? authUser?.profilePic || assets.avatar_icon
                : msg.senderId?.profilePic || assets.avatar_icon
            }
            createdAt={msg.createdAt}
            image={msg.image}
            text={msg.text}
          />
        ))}
        <div ref={scrollEnd}></div>
      </div>)
    )
  );
};

export default GroupChatMessages;
