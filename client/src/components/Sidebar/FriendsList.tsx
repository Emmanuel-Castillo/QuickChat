import React from "react";
import { useNavigate } from "react-router-dom";
import UserBar from "../Shared/UserBar";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";
import ActionButton from "../Shared/ActionButton";

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
    <div className="flex-1 flex flex-col gap-4">
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
      <ActionButton
        buttonText="Add Friend"
        onClickButton={() => navigate("/add-friend")}
      />
    </div>
  );
};

export default FriendsList;
