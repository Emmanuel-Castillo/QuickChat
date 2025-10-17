import React from "react";
import { useNavigate } from "react-router-dom";
import GroupBar from "./GroupBar";
import { useChat } from "../../../context/ChatContext";

type JoinedGroupsListProps = {
  groups: any[];
  input: string;
};
const JoinedGroupsList = ({ input, groups }: JoinedGroupsListProps) => {
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat, setUnseenGroupMessages } = useChat();
  const filteredGroups = input
    ? groups.filter((group) =>
        group.name.toLowerCase().includes(input.toLowerCase())
      )
    : groups;
  return (
    <div  className="flex-1 flex flex-col ">
      <div className="flex-1 flex flex-col border-2 border-[#282142]/50 rounded-b-xl">
        {filteredGroups.map((group, index) => (
          <GroupBar
            group={group}
            key={index}
            isSelectedGroup={selectedChat?._id === group._id}
            onClickGroup={() => {
              if (selectedChat?._id !== group._id) {
                setSelectedChat({ ...group, type: "group" });
                setUnseenGroupMessages((prev) => ({
                  ...prev,
                  [group._id]: 0,
                }));
              }
            }}
          />
        ))}
      </div>
      <button
        className="bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light p-2 px-15 rounded-full cursor-pointer mt-4"
        onClick={() => navigate("/join-group")}
      >
        Join Group
      </button>
    </div>
  );
};

export default JoinedGroupsList;
