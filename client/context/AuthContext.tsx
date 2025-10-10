import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosStatic } from "axios";
import toast from "react-hot-toast";
import { Socket, io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

interface AuthContextType {
  axios: AxiosStatic;
  authUser: any | null;
  onlineUsers: number[];
  socket: Socket | null;
  login: (state: "signup" | "login", credentials: Object) => void;
  logout: () => void;
  updateProfile: (body: any) => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Login function to handle user authentication and socket connection
  const login = async (state: "signup" | "login", credentials: any) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        console.log(data)
        setAuthUser(data.userData);
        connectSocket(data.userData);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Logout function to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    socket?.disconnect();
  };

  // Update profile function to handle user profile updates
  const updateProfile = async (body: any) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Connect socket function to handle socket connection and online users updates
  const connectSocket = (userData: any) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    // Receiving online users from backend
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};
