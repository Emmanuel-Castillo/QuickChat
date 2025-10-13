import React, { useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import RightSidebarHeader from "./rightsidebar-ui/RightSidebarHeader";
import UserBar from "./sidebar-ui/UserBar";
import FilterButton from "./sidebar-ui/FilterButton";

const RightSidebar = () => {
  const { selectedChat, messages } = useChat();
  const { setViewRightSidebarMobile, viewRightSidebarMobile } = useChat();
  const { logout, onlineUsers } = useAuth();

  const [msgImages, setMsgImages] = useState<any[]>([]);
  const [showContent, setShowContent] = useState<"media" | "members">(
    "members"
  );

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

        <div className="flex-1 flex flex-col border-2 border-[#282142]/50 rounded-b-xl">
          <div className="flex gap-2">
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
          {showContent === "media" && (
            <div className="px-5 text-xs">
              <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
                {msgImages.map((url, index) => (
                  <div
                    key={index}
                    onClick={() => window.open(url)}
                    className="cursor-pointer rounded"
                  >
                    <img src={url} alt="" className="h-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {showContent === "members" && selectedChat?.members && (
            <div className="overflow-y-scroll">
              {selectedChat.members.map((m: any, index: number) => (
                <UserBar
                  user={m}
                  isSelectedUser={false}
                  isOnlineUser={false}
                  unseenMsgCount={0}
                  index={index}
                  onClickUser={() => {}}
                />
              ))}
            </div>
          )}
        </div>

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
