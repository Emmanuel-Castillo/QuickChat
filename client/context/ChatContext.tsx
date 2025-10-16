import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface ChatContextProps {
  // Shared
  messages: any[];
  loadingMessages: boolean;
  viewRightSidebarMobile: boolean;
  setViewRightSidebarMobile: React.Dispatch<React.SetStateAction<boolean>>;
  selectedChat: any | null;
  setSelectedChat: React.Dispatch<any>;

  // Single messaging user states
  friends: any[];
  getFriends: () => void;
  getFriendMessages: (userId: number) => void;
  sendMessageToFriend: (messageData: any) => void;
  unseenFriendMessages: any;
  setUnseenFriendMessages: React.Dispatch<React.SetStateAction<{}>>;

  // Group states
  joinedGroups: any[];
  getJoinedGroups: () => void;
  getGroupMessages: (groupId: number) => void;
  leaveGroup: (groupId: number) => void;
  sendMessageToGroup: (messageData: any) => void;
  unseenGroupMessages: any;
  setUnseenGroupMessages: React.Dispatch<React.SetStateAction<{}>>;
}
export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  // SHARED STATES
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [viewRightSidebarMobile, setViewRightSidebarMobile] = useState(false);

  // FRIEND STATES
  const [friends, setFriends] = useState<any[]>([]);
  const [unseenFriendMessages, setUnseenFriendMessages] = useState({});

  // GROUP STATES
  const [joinedGroups, setJoinedGroups] = useState<any[]>([]);
  const [unseenGroupMessages, setUnseenGroupMessages] = useState({});

  const { socket, axios } = useAuth();

  const leaveGroup = async (groupId: number) => {
    try {
      const { data } = await axios.delete(`/api/groups/leave/${groupId}`);
      if (data.success) {
        setSelectedChat(null);
        setJoinedGroups((prev) => prev.filter((p) => p._id !== groupId));
        socket && socket.emit("leaveRoom", groupId);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to get all joined groups for sidebar + set unseenGroupMessages
  const getJoinedGroups = async () => {
    try {
      const { data } = await axios.get("/api/group-messages/");
      if (data.success) {
        setJoinedGroups(data.groups);
        setUnseenGroupMessages(data.unseenMessages);

        // Socket joins each room
        socket &&
          data.groups.map((g: any) => {
            socket.emit("joinRoom", g._id);
          });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to get all friends for sidebar + set unseenMessages
  const getFriends = async () => {
    try {
      const { data } = await axios.get("/api/friend-messages");
      if (data.success) {
        setFriends(data.users);
        setUnseenFriendMessages(data.unseenMessages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to get messages from selected friend
  const getFriendMessages = async (userId: number) => {
    try {
      setLoadingMessages(true);
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Function to get messages from selected joined group
  const getGroupMessages = async (groupId: number) => {
    try {
      setLoadingMessages(true);
      const { data } = await axios.get(`/api/group-messages/${groupId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Function to send message to selected friend
  const sendMessageToFriend = async (messageData: any) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedChat._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to send group message to selected joined group
  const sendMessageToGroup = async (messageData: any) => {
    try {
      const { data } = await axios.post(
        `/api/group-messages/send/${selectedChat._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to subscribe to friend messages
  // Get messages in real-time
  const subscribeToFriendMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage: any) => {
      // If in chat container with selected friend, and received a message from them
      // Set newMessage into messages, and make it read
      if (selectedChat && newMessage.senderId === selectedChat._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Let backend know newMessage is already seen when received
        axios.put(`/api/messages/mark/${newMessage._id}`);
      }

      // If not in chat container, or receiving a new message from a different friend !=== selected friend
      // Add newMessage to unseenMessages
      else {
        setUnseenFriendMessages((prevUnseenMessages: any) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // Function to subscribe to group messages
  // Get group messages in real-time
  const subscribeToGroupMessages = async () => {
    if (!socket) return;
    socket.on("newGroupMessage", (newMessage: any) => {
      // If in chat container with selected group, and receive a message from them
      // Set newMessage into messages, and make it read
      if (selectedChat && newMessage.receiverId === selectedChat._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Let backend know newMessage is already seen when received
        axios.put(`/api/group-messages/mark/${newMessage._id}`);
      }

      // If not in chat container, or receiving a new message from a different user/group
      // Add newMessage to unseenGroupMessages
      else {
        setUnseenGroupMessages((prevUnseenGroupMessages: any) => ({
          ...prevUnseenGroupMessages,
          [newMessage.receiverId]: prevUnseenGroupMessages[
            newMessage.receiverId
          ]
            ? prevUnseenGroupMessages[newMessage.receiverId] + 1
            : 1,
        }));
      }
    });
  };

  // Function to unsubscribe from messages
  const unsubscribeFromFriendMessages = () => {
    if (socket) socket.off("newMessage");
  };
  const unsubscribeFromGroupMessages = () => {
    if (socket) socket.off("newGroupMessage");
  };

  // Un/Subscribe to messages when socket is connected/disconnected, or when user/group is selected
  useEffect(() => {
    if (!socket || !selectedChat) return;
    subscribeToFriendMessages();
    subscribeToGroupMessages();
    return () => {
      unsubscribeFromFriendMessages();
      unsubscribeFromGroupMessages();
    };
  }, [socket, selectedChat]);

  const value = {
    // Shared
    messages,
    loadingMessages,
    viewRightSidebarMobile,
    setViewRightSidebarMobile,
    selectedChat,
    setSelectedChat,

    // Single messaging user states
    friends,
    getFriends,
    getFriendMessages,
    sendMessageToFriend,
    unseenFriendMessages,
    setUnseenFriendMessages,

    // Group messaging states
    joinedGroups,
    getJoinedGroups,
    getGroupMessages,
    sendMessageToGroup,
    unseenGroupMessages,
    setUnseenGroupMessages,
    leaveGroup,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a ChatContextProvider");
  }
  return context;
};
