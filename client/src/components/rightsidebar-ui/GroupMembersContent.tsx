import React from "react";
import UserBar from "../sidebar-ui/UserBar";

const GroupMembersContent = ({ members }: { members: any[] }) => {
  return (
    <div className="overflow-y-scroll">
      {members.map((m: any, index: number) => (
        <UserBar
          user={m}
          isSelectedUser={false}
          isOnlineUser={false}
          unseenMsgCount={0}
          key={index}
          onClickUser={() => {}}
        />
      ))}
    </div>
  );
};

export default GroupMembersContent;
