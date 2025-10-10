import Group from "../models/Group.js";
import User from "../models/User.js";

// Controller to requests all groups
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({});

    res.json({ success: true, groups: groups });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// Controller to request specific group
export const getGroup = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Must include Group Id in the request params.");

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

// Controller to create new group
export const createGroup = async (req, res) => {
  try {
    const myId = req.user._id;
    const { groupName, groupDescription } = req.body;

    console.log(
      "groupName: ",
      groupName,
      ", groupDescription: ",
      groupDescription
    );

    const groupWithSameName = await Group.findOne({ name: groupName });
    if (groupWithSameName) {
      console.log(groupWithSameName);
      const errMsg = `Group exists with same name: ${groupWithSameName.name}`;
      throw new Error(errMsg);
    }

    const newGroup = await Group.create({
      name: groupName,
      description: groupDescription,
      members: myId,
    });
    await User.findByIdAndUpdate(myId, { $push: { groups: newGroup._id } });

    res.json({ success: true, message: "Group created!", group: newGroup });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};

// Controller to join a group
export const joinGroup = async (req, res) => {
  try {
    const myId = req.user._id;
    const { groupId } = req.params;

    const user = await User.findById(myId);
    const group = await Group.findById(groupId);
    if (!user || !group) {
      const errMsg = "User or Group not found."
      throw new Error(errMsg)
    }

    if (user.groups.includes(groupId) && group.members.includes(user._id)) {
      const errMsg = "User has already joined this group"
      throw new Error(errMsg)
    }

    user.groups.push(groupId);
    await user.save();
    group.members.push(myId);
    await group.save();

    res.json({ success: true, message: "User has now joined this group" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, error: error.message });
  }
};
