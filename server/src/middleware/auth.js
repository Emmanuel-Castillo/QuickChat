import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Remove password from db
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, error: error.message });
  }
};
