// Get all users except the logged in user

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// EDITED: 10/15/2025
export const getFriendsPlusUnseenMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const friends = await User.find({ friends: { $in: [userId] } }).select(
      "-password"
    );

    // Count number of messsages not seen
    const unseenMessages = {};
    const promises = friends.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, users: friends, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// EDITED: 10/15/2025
// Get all messages for selected user
export const getFriendMessages = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: friendId, receiverId: myId },
        { senderId: myId, receiverId: friendId },
      ],
    });

    // Mark messages as read
    await Message.updateMany(
      { senderId: friendId, receiverId: myId },
      { seen: true }
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// EDITED: 10/15/2025
// api to mark message as seen using message id
export const markFriendMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// EDITED: 10/15/2025
// Send message to selected user
export const sendMessageToFriend = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      const uploadReponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadReponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};
