import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { createGroup, getGroup, getGroups, joinGroup } from "../controllers/GroupController.js"

const groupRouter = express.Router()

groupRouter.get("/all", protectRoute, getGroups)
groupRouter.get("/:id", protectRoute, getGroup)
groupRouter.post("/create", protectRoute, createGroup)
groupRouter.post("/join/:groupId", protectRoute, joinGroup)

export default groupRouter