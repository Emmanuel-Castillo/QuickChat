import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { markMessageAsSeen, sendMessage } from "../controllers/MessageController.js"
import { getGroupMessages, markGroupMessageAsSeen, sendGroupMessage } from "../controllers/GroupMessageController.js"

const groupMsgRouter = express.Router()

groupMsgRouter.get("/:id", protectRoute, getGroupMessages)
groupMsgRouter.put("/mark/:id", protectRoute, markGroupMessageAsSeen)
groupMsgRouter.post("/send/:id", protectRoute, sendGroupMessage)

export default groupMsgRouter