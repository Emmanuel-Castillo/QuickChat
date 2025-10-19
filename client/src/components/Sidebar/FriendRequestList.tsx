import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import CircleCheck from "../Shared/CircleCheck";
import CircleCross from "../Shared/CircleCross";
import UserBar from "../Shared/UserBar";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../../context/ChatContext";
import ActionButton from "../Shared/ActionButton";

const FriendRequestList = () => {
  const { onlineUsers, axios } = useAuth();
  const { friendRequests, setFriendRequests, setFriends } = useChat();
  const navigate = useNavigate();

  const denyFriendRequest = async (frId: string) => {
    const toastId = toast.loading("Denying friend request...");
    try {
      const { data } = await axios.delete(
        `/api/friends/remove-request/${frId}`
      );
      if (data.success) {
        toast.success("Friend request denied.", { id: toastId });
        setFriendRequests((prevFRs) => prevFRs.filter((p) => p._id != frId));
      } else {
        toast.error(data.error, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const acceptFriendRequest = async (fr: any) => {
    console.log;
    const toastId = toast.loading("Accepting friend request...");
    try {
      const { data } = await axios.post(`/api/friends/add/${fr.senderId._id}`);
      if (data.success) {
        toast.success("Accepted friend request!", { id: toastId });
        setFriendRequests((prevFRs) => prevFRs.filter((p) => p._id != fr._id));
        setFriends((prevFriends) => [...prevFriends, fr.senderId]);
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex-1 flex flex-col border-2 border-[#282142]/50 rounded-b-xl">
        {friendRequests.length > 0 ? (
          friendRequests.map((f, index) => (
            <div className="flex items-center justify-between">
              <UserBar
                key={index}
                user={f.senderId}
                isOnlineUser={onlineUsers.includes(f._id)}
                onClickUser={() => {}}
              />
              <div className="flex gap-2 pr-2">
                <CircleCross onClickButton={() => denyFriendRequest(f._id)} />
                <CircleCheck onClickButton={() => acceptFriendRequest(f)} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center p-2">
            <p className="text-white">No friend requests atm.</p>
          </div>
        )}
      </div>
      <ActionButton
        buttonText="Add Friend"
        onClickButton={() => navigate("/add-friend")}
      />
    </div>
  );
};

export default FriendRequestList;
