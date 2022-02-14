import express from "express";

import {
  signup,
  login,
  getUser,
  forgotPassword,
  getVerification,
  verifyOTP,
  changePassword,
} from "../controllers/user.js";
import { UserData } from "../controllers/profileData.js";

import auth from "../middleware/auth.js";

const router = express.Router();

//get methods
router.get("/getallusers", getUser);
router.get("/getallotp", getVerification);

//post methods
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/changePassword", changePassword);
router.post("/userdata", auth, UserData);

export default router;
