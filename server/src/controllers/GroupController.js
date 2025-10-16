import Group from "../models/Group.js";
import User from "../models/User.js";

// EDITED: 10/15/2025
// Controller to requests all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});

    res.json({ success: true, groups: groups });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// REVIEWED: 10/15/2025
// Controller to request specific group
export const getGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      const errMsg = "Group not found!";
      throw new Error(errMsg);
    }

    res.json({ success: true, group: group });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// EDITED: 10/15/2025
// Controller to create new group
export const createGroup = async (req, res) => {
  try {
    const myId = req.user._id;
    const { groupName, groupDescription } = req.body;

    const groupWithSameName = await Group.findOne({ name: groupName });
    if (groupWithSameName) {
      const errMsg = `Group exists with same name: ${groupWithSameName.name}`;
      throw new Error(errMsg);
    }

    const newGroup = await Group.create({
      name: groupName,
      founder: myId,
      description: groupDescription,
      members: [myId],
    });
    await User.findByIdAndUpdate(myId, { $push: { groups: newGroup._id } });

    res.json({ success: true, message: "Group created!" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// EDITED: 10/15/2025
// Controller to join a group
export const joinGroup = async (req, res) => {
  try {
    const myId = req.user._id;
    const { groupId } = req.params;

    const user = await User.findById(myId);
    const group = await Group.findById(groupId);
    if (!user || !group) {
      const errMsg = "User or Group not found.";
      throw new Error(errMsg);
    }

    if (user.groups.includes(groupId) && group.members.includes(user._id)) {
      const errMsg = "User has already joined this group";
      throw new Error(errMsg);
    }

    user.groups.push(groupId);
    await user.save();
    group.members.push(myId);
    await group.save();

    res.json({ success: true, message: "Successfully joined group!" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// REVIEWED: 10/15/2025
// Controller to leave a group
export const leaveGroup = async (req, res) => {
  try {
    const myId = req.user._id;
    const { groupId } = req.params;

    await Group.findByIdAndUpdate(groupId, { $pull: { members: myId } });
    await User.findByIdAndUpdate(myId, { $pull: { groups: groupId } });

    res.json({ success: true, message: "Left group!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};
