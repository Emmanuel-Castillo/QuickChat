import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { useChat } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedChat } = useChat();
  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden
        h-[100%] grid grid-cols-1 relative ${
          selectedChat ? "lg:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-[1fr_2fr]" // Only renders Sidebar and ChatContainer
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
