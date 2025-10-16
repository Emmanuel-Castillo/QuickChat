import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getGroupMessages,
  getJoinedGroupsPlusUnseenMessages,
  markGroupMessageAsSeen,
  sendGroupMessage,
} from "../controllers/GroupMessageController.js";

const groupMsgRouter = express.Router();

groupMsgRouter.get(
  "/",
  protectRoute,
  getJoinedGroupsPlusUnseenMessages
);
groupMsgRouter.get("/:id", protectRoute, getGroupMessages);
groupMsgRouter.put("/mark/:id", protectRoute, markGroupMessageAsSeen);
groupMsgRouter.post("/send/:id", protectRoute, sendGroupMessage);

export default groupMsgRouter;
