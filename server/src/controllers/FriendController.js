import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// CREATED 10/15/2025
export const addFriend = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    await User.findByIdAndUpdate(myId, { $addToSet: { friends: [userId] } });
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: [myId] } });

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

    const newFriendRequest = await FriendRequest.create({
      senderId: myId,
      receiverId: userId,
    });

    const populatedRequest = await newFriendRequest.populate("senderId");

    const receiverSocketId = userSocketMap[userId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedRequest);
    }

    res.json({ success: true, message: "Sent friend request!" });
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
      .populate("senderId")
      .select("-password");

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
