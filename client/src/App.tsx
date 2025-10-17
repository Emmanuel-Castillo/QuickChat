import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { AuthContext, useAuth } from "../context/AuthContext";
import JoinGroupPage from "./pages/JoinGroupPage";
import AddFriendPage from "./pages/AddFriendPage";

const App = () => {
  const { authUser } = useAuth();
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/join-group"
          element={authUser? <JoinGroupPage/>: <Navigate to={"/login"}/>}
        />
        <Route
          path="/add-friend"
          element={authUser? <AddFriendPage/>: <Navigate to={"/login"}/>}
        />
      </Routes>
    </div>
  );
};

export default App;
