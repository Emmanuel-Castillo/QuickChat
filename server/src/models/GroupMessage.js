import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
  {
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true},
    text: {type: String},
    image: {type: String},
    seenMemberIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
  },
  { timestamps: true }
);

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

export default GroupMessage;
