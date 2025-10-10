// Get all users except the logged in user

import cloudinary from "../lib/cloudinary.js";
import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";
import Message from "../models/Message.js";
import { io, userSocketMap } from "../server.js";

// Fetch all joined groups + unseen messages count
export const getGroupsForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const joinedGroups = await Group.find({members: {$in: [userId]}});

    // Count number of messsages not seen
    const unseenMessages = {};
    const promises = joinedGroups.map(async (group) => {
      const messages = await GroupMessage.find({
        receiverId: group._id,
        seen: {$nin: [userId]},
      });
      if (messages.length > 0) {
        unseenMessages[group._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, groups: joinedGroups, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all messages for selected group
export const getGroupMessages = async (req, res) => {
  try {
    const { id: selectedGroupId } = req.params;
    const myId = req.user._id;

    const messages = await GroupMessage.find({
      receiverId: selectedGroupId
    });

    // Mark messages as read
    await GroupMessage.updateMany(
      { receiverId: selectedGroupId },
      { $push: {seenMemberIds: myId} }
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to mark message as seen using message id
export const markGroupMessageAsSeen = async (req, res) => {
  try {
    const myId = req.user._id
    const { id } = req.params;
    await GroupMessage.findByIdAndUpdate(id, { $push: {seenMemberIds: myId} });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send message to selected group
export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      const uploadReponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadReponse.secure_url;
    }

    const newMessage = await GroupMessage.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      seenMemberIds: [senderId]
    });

    // Emit the new group message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newGroupMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
