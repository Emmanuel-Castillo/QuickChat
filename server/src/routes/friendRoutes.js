import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  addFriend,
  getFriendRequests,
  removeFriend,
  sendFriendRequest,
} from "../controllers/FriendController.js";

const friendRouter = express.Router();

friendRouter.get("/requests", protectRoute, getFriendRequests);
friendRouter.post("/send-request/:userId", protectRoute, sendFriendRequest);
friendRouter.post("/add/:userId", protectRoute, addFriend);
friendRouter.delete("/remove/:userId", protectRoute, removeFriend);

export default friendRouter;
