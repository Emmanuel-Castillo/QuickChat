import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface ChatContextProps {
  // Shared
  messages: any[];
  viewRightSidebarMobile: boolean;
  setViewRightSidebarMobile: React.Dispatch<React.SetStateAction<boolean>>;
  selectedChat: any | null;
  setSelectedChat: React.Dispatch<any>;

  // Single messaging user states
  users: any[];
  getUsers: () => void;
  getMessages: (userId: number) => void;
  sendMessage: (messageData: any) => void;
  unseenMessages: any;
  setUnseenMessages: React.Dispatch<React.SetStateAction<{}>>;
  
  // Group states
  groups: any[];
  getGroups: () => void;
  getGroupMessages: (groupId: number) => void;
  sendGroupMessage: (messageData: any) => void;
  unseenGroupMessages: any;
  setUnseenGroupMessages : React.Dispatch<React.SetStateAction<{}>>
}
export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [viewRightSidebarMobile, setViewRightSidebarMobile] = useState(false);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [unseenGroupMessages, setUnseenGroupMessages] = useState({});

  const { socket, axios } = useAuth();

  // Function to get all joined groups for sidebar + set unseenGroupMessages
  const getGroups = async () => {
    try {
      const { data } = await axios.get("/api/messages/groups");
      if (data.success) {
        setGroups(data.groups);
        setUnseenGroupMessages(data.unseenMessages)

        // Socket joins each room
        socket && data.groups.map((g: any )=> {
           socket.emit("joinRoom", g.name)
        })
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to get all users for sidebar + set unseenMessages
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to get messages for selectedUser
  const getMessages = async (userId: number) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to get messages for selectedGroup
  const getGroupMessages = async (groupId: number) => {
    try {
      const { data } = await axios.get(`/api/group-messages/${groupId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  // Function to send message to selected user
  const sendMessage = async (messageData: any) => {
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

  // Function to send group message to selected group
  const sendGroupMessage = async (messageData: any) => {
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
  }

  // Function to subscribe to user messages
  // Get messages in real-time
  const subscribeToMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage: any) => {
      // If in chat container with selected user, and receive a message from them
      // Set newMessage into messages, and make it read
      if (selectedChat && newMessage.senderId === selectedChat._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Let backend know newMessage is already seen when received
        axios.put(`/api/messages/mark/${newMessage._id}`);
      }

      // If not in chat container, or receiving a new message from a different user !=== selectedUser
      // Add newMessage to unseenMessages
      else {
        setUnseenMessages((prevUnseenMessages: any) => ({
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
          [newMessage.receiverId]: prevUnseenGroupMessages[newMessage.receiverId]
            ? prevUnseenGroupMessages[newMessage.receiverId] + 1
            : 1,
        }));
      }
    });
  };

  // Function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };
  const unsubscribeFromGroupMessages = () => {
    if (socket) socket.off("newGroupMessage");
  };

  // Un/Subscribe to messages when socket is connected/disconnected, or when user/group is selected
  useEffect(() => {
    if (!socket || !selectedChat) return
    if (selectedChat.type == 'user'){
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
    else if (selectedChat.type == 'group') {
      subscribeToGroupMessages()
      return () => unsubscribeFromGroupMessages();
    }
  }, [socket, selectedChat]);

  const value = {
    // Shared
    messages,
    viewRightSidebarMobile,
    setViewRightSidebarMobile,
    selectedChat,
   setSelectedChat,

    // Single messaging user states
    users,
    getUsers,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
    getMessages,

    // Group messaging states
    groups,
    getGroups,
    getGroupMessages,
    sendGroupMessage,
    setUnseenGroupMessages,
    unseenGroupMessages
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
