import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/MessageController.js"
import { getGroupsForSidebar } from "../controllers/GroupMessageController.js"

const messageRouter = express.Router()

messageRouter.get("/users", protectRoute, getUsersForSidebar)
messageRouter.get("/groups", protectRoute, getGroupsForSidebar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen)
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter