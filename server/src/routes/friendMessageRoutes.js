import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getFriendMessages,
  getFriendsPlusUnseenMessages,
  markFriendMessageAsSeen,
  sendMessageToFriend,
} from "../controllers/FriendMessageController.js";

const friendMsgRouter = express.Router();

friendMsgRouter.get("/", protectRoute, getFriendsPlusUnseenMessages);
friendMsgRouter.get("/:id", protectRoute, getFriendMessages);
friendMsgRouter.put("/mark/:id", protectRoute, markFriendMessageAsSeen);
friendMsgRouter.post("/send/:id", protectRoute, sendMessageToFriend);

export default friendMsgRouter;
