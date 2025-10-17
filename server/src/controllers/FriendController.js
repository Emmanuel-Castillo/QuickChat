import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// CREATED 10/15/2025
export const addFriend = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    await User.findByIdAndUpdate(myId, { $addToSet: { friends: [userId] } });
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: [myId] } });

    // Remove FRs
    await FriendRequest.deleteMany({
      $or: [
        { $and: [{ receiverId: myId }, { senderId: userId }] },
        { $and: [{ senderId: myId }, { receiverId: userId }] },
      ],
    });

    res.json({ success: true, message: "New friend added!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

// CREATED 10/15/2025
export const removeFriend = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    await User.findByIdAndUpdate(myId, { $pull: { friends: [userId] } });
    await User.findByIdAndUpdate(userId, { $pull: { friends: [myId] } });

    res.json({ success: true, message: "Friend removed." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

// CREATED 10/15/2025
export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    // Check if already sent friend request to user
    const existingFR = await FriendRequest.find({
      senderId: myId,
      receiverId: userId,
    });
    if (existingFR.length > 0) throw new Error("Already sent friend request.");

    const newFriendRequest = await FriendRequest.create({
      senderId: myId,
      receiverId: userId,
    });

    newFriendRequest.save();
    await newFriendRequest.populate("senderId", "-password");
    await newFriendRequest.populate("receiverId", "-password");
    const populatedRequest = newFriendRequest;

    const receiverSocketId = userSocketMap[userId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", populatedRequest);
    }

    res.json({ success: true, message: "Sent friend request!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

export const deleteFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await FriendRequest.findByIdAndDelete(id);
    res.json({ success: true, message: "Friend request removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

// CREATED 10/15/2025
export const getFriendRequests = async (req, res) => {
  try {
    const myId = req.user._id;

    const friendRequests = await FriendRequest.find({ receiverId: myId })
      .populate("senderId", "-password")
      .populate("receiverId", "-password");

    res.json({
      success: true,
      message: "Retrieved friend requests",
      friendRequests,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};
