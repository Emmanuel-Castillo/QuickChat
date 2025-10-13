import React from "react";
import assets from "../../assets/assets";

type HeaderProps = {
  chatImage: string;
  chatName: string;
  leaveChat: () => void;
  viewChatInfo: () => void;

  isOnlineUser?: boolean
};
const Header = ({
  chatImage,
  chatName,
  leaveChat,
  viewChatInfo,
  isOnlineUser
}: HeaderProps) => {
  return (
    <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
      <img src={chatImage} alt="" className="w-8 rounded-full" />
      <p className="flex-1 text-lg text-white flex items-center gap-2">
            {chatName}
            {isOnlineUser && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
          </p>

      {/* Only show back arrow when screen is less than md size. Sets selected user to null, making the App only render the Sidebar */}
      <img
        onClick={leaveChat}
        src={assets.arrow_icon}
        alt=""
        className="lg:hidden max-w-7"
      />

      {/* Only show back arrow when screen is less than md size. Sets selected user to null, making the App only render the RightSidebar */}
      <img
        onClick={viewChatInfo}
        src={assets.help_icon}
        alt=""
        className="lg:hidden max-w-5"
      />
    </div>
  );
};

export default Header;
