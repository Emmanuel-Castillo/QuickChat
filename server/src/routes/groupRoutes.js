import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { createGroup, getGroup, getAllGroups, joinGroup, leaveGroup } from "../controllers/GroupController.js"

const groupRouter = express.Router()

groupRouter.get("/all", protectRoute, getAllGroups)
groupRouter.get("/:id", protectRoute, getGroup)
groupRouter.post("/create", protectRoute, createGroup)
groupRouter.post("/join/:groupId", protectRoute, joinGroup)
groupRouter.delete("/leave/:groupId", protectRoute, leaveGroup)

export default groupRouter