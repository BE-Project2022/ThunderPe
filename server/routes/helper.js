import express from "express";

import { signup, login } from "../controllers/user.js";

import auth from "../middleware/auth.js";

const router = express.Router();

//get methods

//post methods
router.post("/signup", signup);
router.post("/login", login);

export default router;
