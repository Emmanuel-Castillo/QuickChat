import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface ChatContextProps {
  messages: any[];
  users: any[];
  selectedUser: any | null;
  getUsers: () => void;
  sendMessage: (messageData: any) => void;
  setSelectedUser: React.Dispatch<any>;
  unseenMessages: any;
  setUnseenMessages: React.Dispatch<React.SetStateAction<{}>>;
  getMessages: (userId: number) => void;

  viewRightSidebarMobile: boolean;
  setViewRightSidebarMobile: React.Dispatch<React.SetStateAction<boolean>>
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
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [viewRightSidebarMobile, setViewRightSidebarMobile] = useState(false)
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useAuth();

  // Function to get all users for sidebar
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

  // Function to send message to selected user
  const sendMessage = async (messageData: any) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.erro);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to subscribe to messages for selected user
  // Get messages in real-time
  const subscribeToMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage: any) => {
      // If in chat container with selected user, and receive a message from them
      // Set newMessage into messages, and make it read
      if (selectedUser && newMessage.senderId === selectedUser._id) {
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

  // Function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  // Subscribe to messages when socket is connected/disconnected, or when user is selected
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
    viewRightSidebarMobile,
    setViewRightSidebarMobile
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
