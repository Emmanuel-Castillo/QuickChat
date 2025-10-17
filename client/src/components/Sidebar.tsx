import React, { useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import FilterButton from "./sidebar-ui/FilterButton";
import OptionsBox from "./shared-ui/OptionsBox";
import FriendsList from "./sidebar-ui/FriendsList";
import JoinedGroupsList from "./sidebar-ui/JoinedGroupsList";
import UserBar from "./sidebar-ui/UserBar";
import FriendRequestList from "./sidebar-ui/FriendRequestList";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers } = useAuth();
  const {
    getFriends,
    friends,
    selectedChat,
    joinedGroups,
    getJoinedGroups,
    friendRequests,
    setFriendRequests,
    retrieveFriendRequests,
  } = useChat();

  const [input, setInput] = useState<string>("");
  const [filter, setFilter] = useState<"friend" | "group" | "requests">(
    "friend"
  );

  // When onlineUsers (list of online User ids) retrieved from AuthContext, request Users and Groups
  useEffect(() => {
    getFriends();
  }, [onlineUsers]);

  useEffect(() => {
    getJoinedGroups();
    retrieveFriendRequests();
  }, []);

  return (
    <div
      className={`bg-[#8185B2]/10 flex flex-col gap-y-4 h-full p-5 rounded-l-2xl overflow-y-scroll text-white ${
        selectedChat ? "max-lg:hidden" : "block"
      }`}
    >
      {/* HEADER */}
      <div>
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <img
            src={assets.logo}
            alt="logo"
            className="max-w-50 object-scale-down"
          />

          {/* EDIT PROFILE AND LOGOUT BUTTONS */}
          <OptionsBox
            actions={[
              {
                text: "Edit Profile",
                onClickAction: () => navigate("/profile"),
              },
              { text: "Logout", onClickAction: () => logout() },
            ]}
          />
        </div>

        {/* SEARCH INPUT */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 flex flex-col ">
        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap">
          <FilterButton
            buttonText="Friends"
            isSelected={filter === "friend"}
            onClickButton={() => setFilter("friend")}
          />
          <FilterButton
            buttonText="Groups"
            isSelected={filter === "group"}
            onClickButton={() => setFilter("group")}
          />
          <FilterButton
            buttonText="Requests"
            isSelected={filter === "requests"}
            onClickButton={() => setFilter("requests")}
          />
        </div>

        {/* USER/GROUP LIST + ACTIONS BUTTONS */}
        {filter === "friend" && <FriendsList friends={friends} input={input} />}
        {filter === "group" && (
          <JoinedGroupsList groups={joinedGroups} input={input} />
        )}
        {filter === "requests" && (
          <FriendRequestList/>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
