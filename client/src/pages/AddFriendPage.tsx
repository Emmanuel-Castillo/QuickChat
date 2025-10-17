import React, { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import GroupBar from "../components/sidebar-ui/GroupBar";
import assets from "../assets/assets";
import ActionButton from "../components/shared-ui/ActionButton";
import { filterGroups } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../components/joingrouppage-ui/CreateGroupModal";
import ConfirmationModal from "../components/joingrouppage-ui/ConfirmationModal";
import SendRequestConfirmationModal from "../components/addfriendpage-ui/SendRequestConfirmationModal";
import UserBar from "../components/sidebar-ui/UserBar";

const AddFriendPage = () => {
  const { authUser, axios, onlineUsers } = useAuth();
  const { friends } = useChat();
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredUsers: any[] = filterGroups(input, users);

  const sendFriendRequest = async (userId: string) => {
    const toastId = toast.loading("Sending friend request...");
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/friends/send-request/${userId}`);
      if (data.success) {
        toast.success(data.message, { id: toastId });
        navigate(-1);
      } else {
        toast.error(data.error, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/auth/all-users");
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      {selectedUser && (
        <SendRequestConfirmationModal
          user={selectedUser}
          onClickYes={() => {
            sendFriendRequest(selectedUser._id);
          }}
          onClickNo={() => {
            setSelectedUser(null);
          }}
        />
      )}
      <div className=" flex  flex-col gap-2 h-[500px] w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 rounded-lg overflow-y-scroll p-4">
        <h2 className="text-2xl">Add Friend</h2>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            disabled={loading}
          />
        </div>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-white">Loading all users...</p>
          </div>
        ) : (
          filteredUsers.map((u, index) => (
            <UserBar
              user={u}
              isOnlineUser={onlineUsers.includes(u._id)}
              onClickUser={() => {
                if (!friends.find((f) => f._id === u._id)) setSelectedUser(u);
              }}
              alreadyFriends={friends.find((f) => f._id === u._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AddFriendPage;
