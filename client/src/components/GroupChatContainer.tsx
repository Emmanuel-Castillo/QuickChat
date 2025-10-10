import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GroupChatContainer = () => {
  const scrollEnd = useRef<HTMLDivElement>(null);
  const {
    selectedChat,
    setSelectedChat,
    messages,
    sendGroupMessage,
    getGroupMessages,
    setViewRightSidebarMobile,
  } = useChat();
  const { authUser } = useAuth();

  const [input, setInput] = useState("");

  // Handle sending a message
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendGroupMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending an image
  const handleSendImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendGroupMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

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
      <>
        {/* header */}
        <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
          <img
            src={selectedChat.profilePic || assets.avatar_icon}
            alt=""
            className="w-8 rounded-full"
          />
          <p className="flex-1 text-lg text-white flex items-center gap-2">
            {selectedChat.name}
          </p>

          {/* Only show back arrow when screen is less than md size. Sets selected user to null, making the App only render the Sidebar */}
          <img
            onClick={() => setSelectedChat(null)}
            src={assets.arrow_icon}
            alt=""
            className="lg:hidden max-w-7"
          />

          {/* Only show back arrow when screen is less than md size. Sets selected user to null, making the App only render the RightSidebar */}
          <img
            onClick={() => setViewRightSidebarMobile(true)}
            src={assets.help_icon}
            alt=""
            className="lg:hidden max-w-5"
          />
        </div>
        {/* chat area */}
        <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 justify-end ${
                msg.senderId !== authUser._id && "flex-row-reverse"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-log mb-8 break-all bg-violet-500/30 text-white ${
                    msg.senderId === authUser._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedChat?.profilePic || assets.avatar_icon // LOGICAL ERROR (SHOULD REFERENCE SENDER, BUT MESSAGE ONLY INCLUDES ID)
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollEnd}></div>
        </div>

        {/* bottom area */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
          <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
            <input
              type="text"
              placeholder="Send a message"
              className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) =>
                e.key === "Enter" ? handleSendMessage(e) : null
              }
            />
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              hidden
            />
            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                alt=""
                className="w-5 mr-2 cursor-pointer"
              />
            </label>
          </div>
          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            alt=""
            className="w-7 cursor-pointer"
          />
        </div>
      </>
    )
  );
};

export default GroupChatContainer;
