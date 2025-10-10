import React, { useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import UserBar from "./sidebar-ui/UserBar";
import GroupBar from "./sidebar-ui/GroupBar";
import FilterButton from "./sidebar-ui/FilterButton";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers } = useAuth();
  const {
    getUsers,
    users,
    selectedChat,
    setSelectedChat,
    unseenMessages,
    setUnseenMessages,
    groups,
    getGroups,
    unseenGroupMessages,
    setUnseenGroupMessages,
  } = useChat();

  const [input, setInput] = useState<string>();
  const [filter, setFilter] = useState<"user" | "group">("user");
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;
  const filteredGroups = input
    ? groups.filter((group) =>
        group.name.toLowerCase().includes(input.toLowerCase())
      )
    : groups;

  // When onlineUsers (list of online User ids) retrieved from AuthContext, request Users and Groups
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div
      className={`bg-[#8185B2]/10 flex flex-col gap-y-4 h-full p-5 rounded-l-2xl overflow-y-scroll text-white ${
        selectedChat  ? "max-lg:hidden" : "block"
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
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
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
        <div>
          <FilterButton
            isSelected={filter === "user"}
            onClickButton={() => setFilter("user")}
          />
          <FilterButton
            isSelected={filter === "group"}
            onClickButton={() => setFilter("group")}
          />
        </div>

        {/* USER/GROUP LIST */}
        <div className="flex-1 flex flex-col border-2 border-[#282142]/50 rounded-b-xl">
          {filter === "user" &&
            filteredUsers.map((user, index) => (
              <UserBar
                index={index}
                user={user}
                isSelectedUser={selectedChat?._id === user._id}
                isOnlineUser={onlineUsers.includes(user._id)}
                unseenMsgCount={unseenMessages[user._id]}
                onClickUser={() => {
                  setSelectedChat({...user, type: 'user'});
                  setUnseenMessages((prev) => ({
                    ...prev,
                    [user._id]: 0,
                  }));
                }}
              />
            ))}
          {filter === "group" &&
            filteredGroups.map((group, index) => (
              <GroupBar
                group={group}
                index={index}
                isSelectedGroup={selectedChat?._id === group._id}
                onClickGroup={() => {
                  setSelectedChat({...group, type: 'group'});
                  setUnseenGroupMessages((prev) => ({
                    ...prev,
                    [group._id]: 0,
                  }));
                }}
              />
            ))}
        </div>

        {/* JOIN GROUP BUTTON */}
        {filter === "group" && (
          <button className="bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light p-2 px-15 rounded-full cursor-pointer mt-4">
            Join Group
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
