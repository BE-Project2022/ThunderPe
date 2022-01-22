import express from "express";

import { signup, login, getUser } from "../controllers/user.js";

import auth from "../middleware/auth.js";

const router = express.Router();

//get methods
router.get("/getallusers", getUser);

//post methods
router.post("/signup", signup);
router.post("/login", login);

export default router;
