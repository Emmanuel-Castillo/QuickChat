import assets from "../../assets/assets";

type UserBarProps = {
  user: any;
  onClickUser: () => void;
  
  // Sidebar props
  unseenMsgCount?: number;
  isSelectedUser?: boolean;
  isOnlineUser?: boolean;

  // AddFriend props
  alreadyFriends?: boolean;
};
const UserBar = ({
  user,
  isSelectedUser,
  isOnlineUser,
  unseenMsgCount,
  onClickUser,
  alreadyFriends
}: UserBarProps) => {
  console.log(unseenMsgCount)
  return (
    <div
      onClick={onClickUser}
      className={`relative flex items-center gap-2 p-3 rounded cursor-pointer max-sm:text-sm ${
        isSelectedUser && "bg-[#282142]/50"
      } hover:bg-[#282142]/50`}
    >
      <img
        src={user?.profilePic || assets.avatar_icon}
        alt=""
        className="w-[35px] aspect-[1/1] rounded-full"
      />
      <div className="flex flex-col leading-5 truncate">
        <p>{user.fullName}</p>
        {isOnlineUser ? (
          <span className="text-green-400 text-xs">Online</span>
        ) : (
          <span className="text-neutal-400 text-xs">Offline</span>
        )}
      </div>
      {Number(unseenMsgCount) > 0 && (
        <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
          {unseenMsgCount}
        </p>
      )}
      {alreadyFriends && <p className="ml-auto">Friend</p>}
    </div>
  );
};

export default UserBar;
