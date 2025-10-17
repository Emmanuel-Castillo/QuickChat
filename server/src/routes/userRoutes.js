import express from "express";
import {
  checkAuth,
  getAllUsers,
  getUser,
  login,
  signUp,
  updateProfile,
} from "../controllers/UserController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.get("/user/:id", protectRoute, getUser);
userRouter.get("/all-users", protectRoute, getAllUsers);

export default userRouter;
