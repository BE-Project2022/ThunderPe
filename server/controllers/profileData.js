import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {} from "dotenv/config";
import ThunderUser from "../models/userSchema.js";

const router = express.Router();

export const UserData = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }
  const user = await ThunderUser.findOne({
    mobile: req.userId.mobile,
  }).exec();
  try {
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
