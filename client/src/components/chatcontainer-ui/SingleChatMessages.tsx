import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../../assets/assets";
import { formatMessageTime } from "../../lib/utils";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";
import MessageRow from "./MessageRow";

const SingleChatMessages = () => {
  const scrollEnd = useRef<HTMLDivElement>(null);
  const { selectedChat, messages, getMessages, loadingMessages } = useChat();
  const { authUser } = useAuth();

  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat._id);
    }
  }, [selectedChat]);

  // Scroll down for new message
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    selectedChat &&
    (loadingMessages ? (
      <div>Loading messages...</div>
    ) : (
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <MessageRow
            key={index}
            isAuthUserMsg={msg.senderId === authUser._id}
            createdAt={msg.createdAt}
            senderProfilePic={
              msg.senderId === authUser._id
                ? authUser?.profilePic || assets.avatar_icon
                : selectedChat?.profilePic || assets.avatar_icon
            }
            image={msg.image}
            text={msg.text}
          />
        ))}
        <div ref={scrollEnd}></div>
      </div>
    ))
  );
};

export default SingleChatMessages;
