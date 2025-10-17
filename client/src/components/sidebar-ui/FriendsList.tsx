import React from "react";
import { useNavigate } from "react-router-dom";
import UserBar from "./UserBar";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";

type FriendsListProps = {
  input: string;
  friends: any[];
};
const FriendsList = ({ input, friends }: FriendsListProps) => {
  const { onlineUsers } = useAuth();
  const {
    selectedChat,
    setSelectedChat,
    unseenFriendMessages,
    setUnseenFriendMessages,
  } = useChat();
  const navigate = useNavigate();
  const filteredFriends = input
    ? friends.filter((friend) =>
        friend.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : friends;
  return (
    <div className="flex-1 flex flex-col ">
      <div className="flex-1 flex flex-col border-2 border-[#282142]/50 rounded-b-xl">
        {filteredFriends.map((friend, index) => (
          <UserBar
            key={index}
            user={friend}
            isSelectedUser={selectedChat?._id === friend._id}
            isOnlineUser={onlineUsers.includes(friend._id)}
            unseenMsgCount={unseenFriendMessages[friend._id]}
            onClickUser={() => {
              if (selectedChat?._id !== friend._id) {
                setSelectedChat({ ...friend, type: "user" });
                setUnseenFriendMessages((prev) => ({
                  ...prev,
                  [friend._id]: 0,
                }));
              }
            }}
          />
        ))}
      </div>
      <button
        className="bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light p-2 px-15 rounded-full cursor-pointer mt-4"
        onClick={() => navigate("/add-friend")}
      >
        Add Friend
      </button>
    </div>
  );
};

export default FriendsList;
