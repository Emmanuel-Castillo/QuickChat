import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  addFriend,
  deleteFriendRequest,
  getFriendRequests,
  removeFriend,
  sendFriendRequest,
} from "../controllers/FriendController.js";

const friendRouter = express.Router();

friendRouter.get("/requests", protectRoute, getFriendRequests);
friendRouter.post("/send-request/:userId", protectRoute, sendFriendRequest);
friendRouter.delete("/remove-request/:id", protectRoute, deleteFriendRequest)
friendRouter.post("/add/:userId", protectRoute, addFriend);
friendRouter.delete("/remove/:userId", protectRoute, removeFriend);

export default friendRouter;
