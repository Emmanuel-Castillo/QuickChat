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

const JoinGroupPage = () => {
  const { authUser, axios } = useAuth();
  const { joinedGroups } = useChat();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>();
  const [createGroup, setCreateGroup] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredGroups: any[] = filterGroups(input, groups);

  const createNewGroup = async (name: string, description: string) => {
    try {
      setLoading(true);
      if (!authUser) return;
      if (name.length === 0) throw new Error("Group name must be defined!");
      const body = {
        groupName: name,
        groupDescription: description,
      };
      toast.loading("Creating new group...")
      const { data } = await axios.post("/api/groups/create", body);
      if (data.success) {
        toast.success(data.message)
        navigate(-1);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      setLoading(true);
      toast.loading("Joining group...")
      const { data } = await axios.post(`/api/groups/join/${groupId}`);
      if (data.success) {
        toast.success(data.message)
        navigate(-1);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/groups/all");
        if (data.success) {
          setGroups(data.groups);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      {createGroup && (
        <CreateGroupModal
          onClickCancel={() => setCreateGroup(false)}
          onClickCreate={createNewGroup}
          loading={loading}
        />
      )}
      {selectedGroup && (
        <ConfirmationModal
          group={selectedGroup}
          onClickNo={() => {
            setSelectedGroup(null);
          }}
          onClickYes={() => joinGroup(selectedGroup._id)}
        />
      )}
      <div className=" flex  flex-col gap-2 h-[500px] w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 rounded-lg overflow-y-scroll p-4">
        <h2 className="text-2xl">Join Group</h2>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search group"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            disabled={loading}
          />
        </div>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-white">Loading all groups...</p>
          </div>
        ) : (
          filteredGroups.map((g, index) => (
            <GroupBar
              group={g}
              key={index}
              isSelectedGroup={selectedGroup && selectedGroup._id == g._id}
              onClickGroup={() => {
                if (!joinedGroups.find((f) => f._id == g._id)) {
                  setSelectedGroup(g);
                }
              }}
              alreadyJoined={joinedGroups.find((f) => f._id == g._id)}
            />
          ))
        )}

        <ActionButton
          buttonText="Create Group"
          onClickButton={() => {
            setCreateGroup(true);
          }}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default JoinGroupPage;
